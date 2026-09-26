/*
 * Copyright 2026 Paul Griffioen
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

package pacioli.ast.visitors;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import pacioli.ast.Node;
import pacioli.ast.IdentityTransformation;
import pacioli.ast.ProgramNode;
import pacioli.ast.definition.Declaration;
import pacioli.ast.definition.Definition;
import pacioli.ast.definition.MultiDeclaration;
import pacioli.ast.expression.ApplicationNode;
import pacioli.ast.expression.BranchNode;
import pacioli.ast.expression.ExpressionNode;
import pacioli.ast.expression.IdListNode;
import pacioli.ast.expression.IdentifierNode;
import pacioli.ast.expression.LambdaNode;
import pacioli.ast.expression.LetBindingNode;
import pacioli.ast.expression.LetNode;
import pacioli.ast.sugar.ComprehensionNode;
import pacioli.ast.sugar.ComprehensionNode.AssignmentClause;
import pacioli.ast.sugar.ComprehensionNode.Clause;
import pacioli.ast.sugar.ComprehensionNode.FilterClause;
import pacioli.ast.sugar.ComprehensionNode.TupleAssignmentClause;
import pacioli.ast.sugar.ExponentNode;
import pacioli.ast.sugar.LetFunctionBindingNode;
import pacioli.ast.sugar.LetTupleBindingNode;
import pacioli.ast.sugar.RecordDefinition;
import pacioli.compiler.Location;
import pacioli.compiler.PacioliException;

/**
 * Syntactic desugaring. Desugaring that is immediately applied to the parsed
 * AST.
 * 
 * These desugarings should not result in unreadable code. For transpilation we
 * sometimes want to maintain the original code as much as possile.
 * 
 * See the LoweringVisitor for further simplifications later on.
 */
public class DesugarVisitor extends IdentityTransformation {

    // Global to capture newly introduced definitions
    List<Definition> desugared = new ArrayList<>();

    @Override
    public void visit(ProgramNode node) {

        // Create single declarations for the multideclarations
        List<Definition> noMultis = new ArrayList<Definition>();
        for (Definition def : node.definitions()) {
            if (def instanceof MultiDeclaration) {
                MultiDeclaration decl = (MultiDeclaration) def;
                for (IdentifierNode id : decl.ids) {
                    noMultis.add(new Declaration(decl.location(), id, decl.node));
                }
            } else {
                noMultis.add(def);
            }
        }

        // Desugar the definitions.
        for (Definition def : noMultis) {
            Node desugaredNode = nodeAccept(def);
            assert (desugaredNode instanceof Definition);
            desugared.add((Definition) desugaredNode);
        }

        returnNode(new ProgramNode(node.location(), node.includes(), node.imports(), node.exports(), desugared));
    }

    /**
     * Special syntax for parenthesis around an expression. See the grammar. This
     * construction is needed to resolve the ambiguity of singleton tuples.
     *
     */
    public void visit(IdListNode node) {
        if (node.ids.size() == 1 && node.ids.get(0) instanceof IdentifierNode) {
            returnNode(node.ids.get(0));
        } else {
            throw new RuntimeException("Visit error", new PacioliException(node.location(),
                    "Didn't expect tuple destructuring here. Did you mean tuple(...)? Destructuring a tuple is only possible in a let or comprehension, or by applying a function to the tuple."));
        }
    }

    @Override
    public void visit(LetNode node) {

        ExpressionNode desugaredBody = (ExpressionNode) nodeAccept(node.body);

        if (node.binding instanceof LetTupleBindingNode tup) {
            ExpressionNode fun = new LambdaNode(freshUnderscores(idNames(tup.vars)), desugaredBody, tup.location());

            returnNode(new ApplicationNode(
                    new IdentifierNode("apply", tup.location().collapse()),
                    Arrays.asList(fun, expAccept(tup.value)),
                    tup.location()));

        } else if (node.binding instanceof LetFunctionBindingNode nd) {
            List<String> eArgs = freshUnderscores(idNames(nd.args)); // remove fresh underscors
            ExpressionNode eFun = new LambdaNode(eArgs, expAccept(nd.body), nd.location());
            LetBindingNode bind = new LetBindingNode(nd.location(), nd.name.name(), eFun);

            returnNode(new LetNode(bind, expAccept(node.body), node.location()));

        } else if (node.binding instanceof LetBindingNode bind) {
            LetBindingNode desugaredBinding = new LetBindingNode(
                    node.binding.location(),
                    bind.var,
                    expAccept(bind.value));

            returnNode(new LetNode(desugaredBinding, desugaredBody, node.location()));

        } else {
            throw new RuntimeException("Unexpected binding");
        }

    }

    // Copied from grammar.cup. TODO: solve this at one place
    private static List<String> freshUnderscores(List<String> names) {
        List<String> fresh = new ArrayList<String>();
        for (String name : names) {
            if (name.equals("_")) {
                fresh.add(freshUnderscore());
            } else {
                fresh.add(name);
            }
        }
        return fresh;
    }

    private static String freshUnderscore() {
        return "_" + counter++;
    }

    private static int counter = 0;

    private static List<String> idNames(List<IdentifierNode> ids) {
        List<String> names = new ArrayList<String>();
        for (IdentifierNode id : ids) {
            names.add(id.name());
        }
        return names;
    }

    @Override
    public void visit(RecordDefinition node) {

        for (RecordDefinition.FieldDefinition binding : node.fields) {

            this.desugared.add(node.getterDocumentation(binding));
            this.desugared.add(node.getterDeclaration(binding));
            this.desugared.add(node.getterDefinition(binding));

            this.desugared.add(node.setterDocumentation(binding));
            this.desugared.add(node.setterDeclaration(binding));
            this.desugared.add(node.setterDefinition(binding));
        }

        this.desugared.add(node.constructorDocumentation());
        this.desugared.add(node.constructorDeclaration());
        this.desugared.add(node.constructorDefinition());

        returnNode(node.typeDefinition());

    }

    @Override
    public void visit(ExponentNode node) {
        returnNode(node.asProducts());
    }

    @Override
    public void visit(ComprehensionNode.TupleGeneratorClause clause) {

        // Replace underscores
        List<IdentifierNode> ids = new ArrayList<>();

        for (IdentifierNode id : clause.ids) {
            ids.add(id.freshIfUnderscore());
        }

        ExpressionNode expression = expAccept(clause.expression);

        returnNode(clause.transform(ids, expression));
    }

    @Override
    public void visit(ComprehensionNode.TupleAssignmentClause clause) {

        // Replace underscores
        List<IdentifierNode> ids = new ArrayList<>();

        for (IdentifierNode id : clause.ids) {
            ids.add(id.freshIfUnderscore());
        }

        ExpressionNode value = expAccept(clause.value);

        returnNode(clause.transform(ids, value));
    }

    @Override
    public void visit(ComprehensionNode node) {
        if (node.hasOperator()) {
            // Remove the operator
            var withoutOp = new ComprehensionNode(node.kind, node.expression,
                    node.clauses, node.location());

            // Desugar the remainder
            var comp = (ComprehensionNode) withoutOp.desugar();

            // Don't forget a possible table
            comp.table = node.table;

            // Add a function call that does the equivalent of the operator
            returnNode(new ApplicationNode(node.operatorFunction(), Arrays.asList(comp),
                    node.location()));

        } else {
            super.visit(node);
        }
    }

    // Replace the code above by this to completely desugar comprehensions

    // @Override
    // public void visit(ComprehensionNode node) {
    // if (node.hasOperator()) {
    // // Remove the operator
    // var withoutOp = new ComprehensionNode(node.kind, node.expression,
    // node.clauses, node.location());

    // // Desugar the remainder
    // var comp = (ExpressionNode) withoutOp.desugar();

    // // Add a function call that does the equivalent of the operator
    // returnNode(new ApplicationNode(node.operatorFunction(), Arrays.asList(comp),
    // node.location()));

    // } else {
    // returnNode(desugarComprehension(node).desugar());
    // }
    // }

    // private static ExpressionNode desugarComprehension(ComprehensionNode node)
    // throws PacioliException {

    // Location loc = node.location();
    // Location dummyLoc = loc.collapse();

    // String accuName = freshName("_c_accu");

    // // Build the initial body
    // IdentifierNode addMut = new IdentifierNode(node.collectFunction(), dummyLoc);
    // IdentifierNode accu = new IdentifierNode(accuName, dummyLoc);
    // ExpressionNode body = new ApplicationNode(addMut, Arrays.asList(accu,
    // node.expression), dummyLoc);

    // // Build the rest of the body from the clauses in reverse order.
    // for (int i = node.clauses.size() - 1; 0 <= i; i--) {

    // Clause part = node.clauses.get(i);

    // if (part instanceof ComprehensionNode.GeneratorClause clause) {

    // Location clauseLocaction = clause.expression.location();

    // body = new ApplicationNode(
    // new IdentifierNode(clause.loopFunction(), dummyLoc),
    // Arrays.asList(
    // accu,
    // new LambdaNode(
    // freshUnderscores(Arrays.asList(accuName, clause.varName())),
    // body,
    // clauseLocaction),
    // clause.expression),
    // clauseLocaction);

    // } else if (part instanceof ComprehensionNode.TupleGeneratorClause clause) {

    // Location clauseLocation = clause.expression.location();

    // String tupName = freshName("_c_tup");

    // IdentifierNode apply = new IdentifierNode("apply", dummyLoc);
    // IdentifierNode tup = new IdentifierNode(tupName, dummyLoc);
    // IdentifierNode accuId = new IdentifierNode(accuName, dummyLoc);

    // ExpressionNode restLambda = new
    // LambdaNode(freshUnderscores(clause.varNames()), body, clauseLocation);

    // ExpressionNode restAppLambda = new LambdaNode(
    // Arrays.asList(accuName, tupName),
    // new ApplicationNode(apply, Arrays.asList(restLambda, tup), clauseLocation),
    // clauseLocation);

    // body = new ApplicationNode(
    // new IdentifierNode(clause.loopFunction(), dummyLoc),
    // Arrays.asList(accuId, restAppLambda, clause.expression),
    // clauseLocation);

    // } else if (part instanceof AssignmentClause clause) {

    // body = new ApplicationNode(
    // new LambdaNode(freshUnderscores(Arrays.asList(clause.varName())), body,
    // body.location()),
    // Arrays.asList(clause.value), clause.value.location());

    // } else if (part instanceof TupleAssignmentClause clause) {

    // ExpressionNode restLambda = new
    // LambdaNode(freshUnderscores(clause.varNames()), body, loc);

    // body = new ApplicationNode(
    // new IdentifierNode("apply", dummyLoc),
    // Arrays.asList(restLambda, clause.value),
    // clause.value.location());

    // } else if (part instanceof FilterClause fc) {

    // body = new BranchNode(fc.expression, body, accu, loc);

    // } else {
    // throw new PacioliException(loc, "Unexpected clause %s", part);
    // }
    // }

    // // Build the final code
    // ExpressionNode emptyCollection = new ApplicationNode(
    // new IdentifierNode(node.emptyCollectionFunction(), dummyLoc),
    // new ArrayList<ExpressionNode>(),
    // loc);

    // var app = new ApplicationNode(
    // new LambdaNode(Arrays.asList(accuName), body, loc),
    // Arrays.asList(emptyCollection),
    // loc);

    // return app;
    // }

    // private static String freshName(String prefix) {
    // return prefix + counter++;
    // }
}
