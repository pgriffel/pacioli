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
import pacioli.ast.IdentityTransformation;
import pacioli.ast.Node;
import pacioli.ast.ProgramNode;
import pacioli.ast.definition.Definition;
import pacioli.ast.expression.ApplicationNode;
import pacioli.ast.expression.BranchNode;
import pacioli.ast.expression.ExpressionNode;
import pacioli.ast.expression.IdentifierNode;
import pacioli.ast.expression.LambdaNode;
import pacioli.ast.expression.LetBindingNode;
import pacioli.ast.expression.LetNode;
import pacioli.ast.sugar.ComprehensionNode;
import pacioli.ast.sugar.ComprehensionNode.AssignmentClause;
import pacioli.ast.sugar.ComprehensionNode.Clause;
import pacioli.ast.sugar.ComprehensionNode.FilterClause;
import pacioli.ast.sugar.ComprehensionNode.GeneratorClause;
import pacioli.ast.sugar.ComprehensionNode.TupleAssignmentClause;
import pacioli.ast.sugar.ComprehensionNode.TupleGeneratorClause;
import pacioli.ast.sugar.ExponentNode;
import pacioli.ast.sugar.LetFunctionBindingNode;
import pacioli.ast.sugar.LetTupleBindingNode;
import pacioli.ast.sugar.RecordDefinition;
import pacioli.compiler.Location;
import pacioli.compiler.PacioliException;
import pacioli.compiler.PacioliFile;
import pacioli.symboltable.SymbolTable;
import pacioli.symboltable.info.ValueInfo;

/**
 * Simplifies the AST by loweromg several language constructs to other
 * primitives.
 * 
 * Similar to desugaring. The difference is that these constructs must be
 * resolved and typed, because lowering takes place after these steps.
 * 
 */
public class LoweringVisitor extends IdentityTransformation {

    // Global to capture newly introduced definitions
    private List<Definition> desugared = new ArrayList<>();

    @Override
    public void visit(ProgramNode node) {

        // Desugar the definitions.
        for (Definition def : node.definitions()) {
            Node desugaredNode = nodeAccept(def);
            assert (desugaredNode instanceof Definition);
            desugared.add((Definition) desugaredNode);
        }

        returnNode(new ProgramNode(node.location(), node.includes(), node.imports(), node.exports(), desugared));
    }

    // @Override
    // public void visit(LetNode node) {

    // ExpressionNode desugaredBody = (ExpressionNode) nodeAccept(node.body);

    // if (node.binding instanceof LetTupleBindingNode tup) {
    // ExpressionNode fun = new LambdaNode(freshUnderscores(idNames(tup.vars)),
    // desugaredBody, tup.location());

    // returnNode(new ApplicationNode(
    // new IdentifierNode("apply", tup.location().collapse()),
    // Arrays.asList(fun, expAccept(tup.value)),
    // tup.location()));

    // } else if (node.binding instanceof LetFunctionBindingNode nd) {
    // List<String> eArgs = freshUnderscores(idNames(nd.args)); // remove fresh
    // underscors
    // ExpressionNode eFun = new LambdaNode(eArgs, expAccept(nd.body),
    // nd.location());
    // LetBindingNode bind = new LetBindingNode(nd.location(), nd.name.name(),
    // eFun);

    // returnNode(new LetNode(bind, expAccept(node.body), node.location()));

    // } else if (node.binding instanceof LetBindingNode bind) {
    // LetBindingNode desugaredBinding = new LetBindingNode(
    // node.binding.location(),
    // bind.var,
    // expAccept(bind.value));

    // returnNode(new LetNode(desugaredBinding, desugaredBody, node.location()));

    // } else {
    // throw new RuntimeException("Unexpected binding");
    // }

    // }

    // // Copied from grammar.cup. TODO: solve this at one place
    // private static List<String> freshUnderscores(List<String> names) {
    // List<String> fresh = new ArrayList<String>();
    // for (String name : names) {
    // if (name.equals("_")) {
    // fresh.add(freshUnderscore());
    // } else {
    // fresh.add(name);
    // }
    // }
    // return fresh;
    // }

    // private static String freshUnderscore() {
    // return "_" + counter++;
    // }

    // private static int counter = 0;

    // private static List<String> idNames(List<IdentifierNode> ids) {
    // List<String> names = new ArrayList<String>();
    // for (IdentifierNode id : ids) {
    // names.add(id.name());
    // }
    // return names;
    // }

    // @Override
    // public void visit(RecordDefinition node) {

    // for (RecordDefinition.FieldDefinition binding : node.fields) {

    // this.desugared.add(node.getterDocumentation(binding));
    // this.desugared.add(node.getterDeclaration(binding));
    // this.desugared.add(node.getterDefinition(binding));

    // this.desugared.add(node.setterDocumentation(binding));
    // this.desugared.add(node.setterDeclaration(binding));
    // this.desugared.add(node.setterDefinition(binding));
    // }

    // this.desugared.add(node.constructorDocumentation());
    // this.desugared.add(node.constructorDeclaration());
    // this.desugared.add(node.constructorDefinition());

    // returnNode(node.typeDefinition());

    // }

    @Override
    public void visit(ExponentNode node) {
        returnNode(node.asProducts());
    }

    @Override
    public void visit(ComprehensionNode node) {
        // returnNode(node.asLambdas().lower());
        var yo = desugarComprehension(node);
        returnNode(yo.lower());
    }

    private static int counter = 0;

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

    private static String freshName(String prefix) {
        return prefix + counter++;
    }

    private static IdentifierNode resolvedIdentifier(SymbolTable<ValueInfo> table, String name, Location location) {
        IdentifierNode id = new IdentifierNode(name, location);

        id.info = table.lookup(name);

        return id;
    }

    static private LambdaNode resolvedLambda(
            PacioliFile file,
            List<String> arguments,
            ExpressionNode body,
            Location location,
            SymbolTable<ValueInfo> table) {

        for (String argument : arguments) {

            ValueInfo info = ValueInfo.builder()
                    .name(argument)
                    .isGlobal(false)
                    .isMonomorphic(true)
                    .location(location)
                    .isPublic(false)
                    .build();

            table.put(argument, info);
        }

        LambdaNode lambda = new LambdaNode(arguments, body, location);

        lambda.table = table;

        return lambda;
    }

    static private SymbolTable<ValueInfo> lambdaTable(
            List<String> arguments,
            PacioliFile file,
            Location location,
            SymbolTable<ValueInfo> parent) {

        SymbolTable<ValueInfo> table = new SymbolTable<ValueInfo>(parent);

        for (String argument : arguments) {

            ValueInfo info = ValueInfo.builder()
                    .name(argument)
                    .isGlobal(false)
                    .isMonomorphic(true)
                    .location(location)
                    .isPublic(false)
                    .build();

            table.put(argument, info);
        }

        return table;
    }

    private static ExpressionNode desugarComprehension(ComprehensionNode node) throws PacioliException {

        PacioliFile file = node.location().file();

        ComprehensionNode.Kind kind = node.kind;
        Location loc = node.location();
        ExpressionNode e = node.expression;
        List<Clause> ps = node.clauses;

        ValueInfo loopInfo = node.table.lookup("loop_list");
        ValueInfo appInfo = node.table.lookup("apply");
        ValueInfo emptyInfo = node.table.lookup("empty_list");

        String addMutName = ComprehensionNode.opName(kind, "add");
        String accuName = freshName("_c_accu");
        String tupName = freshName("_c_tup");

        // var inf = ValueInfo.builder()
        // .name(accuName)
        // .file(node.file)
        // .isGlobal(false)
        // .isMonomorphic(false)
        // .location(node.location())
        // .isPublic(false)
        // .build();

        pacioli.compiler.Location dummyLoc = loc.collapse();

        SymbolTable<ValueInfo> table = lambdaTable(Arrays.asList(accuName), file, dummyLoc, node.table);
        // SymbolTable<ValueInfo> table = new SymbolTable<ValueInfo>(node.table);

        // table.put(accuName, inf);

        ExpressionNode addMut = resolvedIdentifier(node.table, addMutName, dummyLoc);
        ExpressionNode accu = resolvedIdentifier(table, accuName, dummyLoc);

        ExpressionNode body = new ApplicationNode(addMut, Arrays.asList(accu, e), dummyLoc);

        for (int i = ps.size() - 1; 0 <= i; i--) {
            Object part = ps.get(i);
            if (part instanceof GeneratorClause clause) {

                pacioli.compiler.Location loc2 = clause.list.location();
                String loopName = ComprehensionNode.loopName(clause.kind, "loop");
                IdentifierNode loopId = new IdentifierNode(loopName, dummyLoc);

                loopId.info = node.table.lookup(loopName);

                SymbolTable<ValueInfo> gtable = new SymbolTable<ValueInfo>(node.table);

                body = new ApplicationNode(
                        loopId,
                        Arrays.asList(accu,
                                // new LambdaNode(freshUnderscores(Arrays.asList(accuName, clause.id.name())),
                                // body, loc2),
                                resolvedLambda(file, freshUnderscores(Arrays.asList(accuName, clause.id.name())),
                                        body, loc2, gtable),
                                clause.list),
                        loc2);
            } else if (part instanceof TupleGeneratorClause clause) {
                pacioli.compiler.Location loc2 = clause.list.location();

                List<String> args = new ArrayList<String>();
                for (IdentifierNode var : clause.ids) {
                    args.add(var.name());
                }

                var restTable = lambdaTable(freshUnderscores(args), file, loc2, table);
                var restAppTable = lambdaTable(Arrays.asList(accuName, tupName), file, loc2, table);

                // ExpressionNode apply = new IdentifierNode("apply", dummyLoc);
                ExpressionNode apply = resolvedIdentifier(node.table, "apply", dummyLoc);
                ExpressionNode restLambda = new LambdaNode(freshUnderscores(args), body, loc2).withTable(restTable);
                ExpressionNode tup = resolvedIdentifier(restAppTable, tupName, dummyLoc);
                ExpressionNode loopList = resolvedIdentifier(node.table, ComprehensionNode.loopName(kind, "loop"),
                        dummyLoc);
                ExpressionNode accuId = accu; // new IdentifierNode(accuName, dummyLoc);
                ExpressionNode restApp = new ApplicationNode(apply, Arrays.asList(restLambda, tup), loc2);
                ExpressionNode restAppLambda = new LambdaNode(Arrays.asList(accuName, tupName), restApp, loc2)
                        .withTable(restAppTable);

                body = new ApplicationNode(loopList, Arrays.asList(accuId, restAppLambda, clause.list), loc2);
            } else if (part instanceof AssignmentClause) {
                AssignmentClause clause = (AssignmentClause) part;

                body = new ApplicationNode(
                        new LambdaNode(freshUnderscores(Arrays.asList(clause.id.name())), body, body.location()),
                        Arrays.asList(clause.value), clause.value.location());
            } else if (part instanceof TupleAssignmentClause) {

                TupleAssignmentClause clause = (TupleAssignmentClause) part;

                List<String> args = new ArrayList<String>();
                for (IdentifierNode var : clause.ids) {
                    args.add(var.name());
                }

                ExpressionNode apply = new IdentifierNode("apply", dummyLoc);
                ExpressionNode restLambda = new LambdaNode(freshUnderscores(args), body, loc);

                body = new ApplicationNode(apply, Arrays.asList(restLambda, clause.value), clause.value.location());
            } else if (part instanceof FilterClause fc) {
                body = new BranchNode(fc.list, body, accu, loc);
            } else {
                throw new PacioliException(loc, "Unexpected clause %s", part);
            }
        }

        ExpressionNode lambda = resolvedLambda(file, Arrays.asList(accuName), body, loc, table);

        // ExpressionNode lambda = new LambdaNode(Arrays.asList(accuName), body, loc);
        ExpressionNode emptyListId = resolvedIdentifier(node.table, ComprehensionNode.opName(kind, "empty"), dummyLoc);
        ExpressionNode emptyList = new ApplicationNode(emptyListId, new ArrayList<ExpressionNode>(), loc);

        return new ApplicationNode(lambda, Arrays.asList(emptyList), loc);
    }
}
