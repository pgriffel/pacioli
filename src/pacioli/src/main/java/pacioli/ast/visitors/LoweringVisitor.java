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
import pacioli.ast.sugar.ComprehensionNode;
import pacioli.ast.sugar.ComprehensionNode.AssignmentClause;
import pacioli.ast.sugar.ComprehensionNode.Clause;
import pacioli.ast.sugar.ComprehensionNode.FilterClause;
import pacioli.ast.sugar.ComprehensionNode.GeneratorClause;
import pacioli.ast.sugar.ComprehensionNode.TupleAssignmentClause;
import pacioli.ast.sugar.ComprehensionNode.TupleGeneratorClause;
import pacioli.ast.sugar.ExponentNode;
import pacioli.compiler.Location;
import pacioli.compiler.PacioliException;

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

    @Override
    public void visit(ExponentNode node) {
        returnNode(node.asProducts());
    }

    @Override
    public void visit(ComprehensionNode node) {
        returnNode(desugarComprehension(node).lower());
    }

    private static ExpressionNode desugarComprehension(ComprehensionNode node) throws PacioliException {

        Location loc = node.location();
        Location dummyLoc = loc.collapse();

        String accuName = freshName("_c_accu");

        // Build the initial body
        IdentifierNode addMut = new IdentifierNode(node.collectFunction(), dummyLoc);
        IdentifierNode accu = new IdentifierNode(accuName, dummyLoc);
        ExpressionNode body = new ApplicationNode(addMut, Arrays.asList(accu, node.expression), dummyLoc);

        // Build the rest of the body from the clauses in reverse order.
        for (int i = node.clauses.size() - 1; 0 <= i; i--) {

            Clause part = node.clauses.get(i);

            if (part instanceof GeneratorClause clause) {

                Location clauseLocaction = clause.expression.location();

                body = new ApplicationNode(
                        new IdentifierNode(clause.loopFunction(), dummyLoc),
                        Arrays.asList(
                                accu,
                                new LambdaNode(
                                        freshUnderscores(Arrays.asList(accuName, clause.varName())),
                                        body,
                                        clauseLocaction),
                                clause.expression),
                        clauseLocaction);

            } else if (part instanceof TupleGeneratorClause clause) {

                Location clauseLocation = clause.expression.location();

                String tupName = freshName("_c_tup");

                IdentifierNode apply = new IdentifierNode("apply", dummyLoc);
                IdentifierNode tup = new IdentifierNode(tupName, dummyLoc);
                IdentifierNode accuId = new IdentifierNode(accuName, dummyLoc);

                ExpressionNode restLambda = new LambdaNode(freshUnderscores(clause.varNames()), body, clauseLocation);

                ExpressionNode restAppLambda = new LambdaNode(
                        Arrays.asList(accuName, tupName),
                        new ApplicationNode(apply, Arrays.asList(restLambda, tup), clauseLocation),
                        clauseLocation);

                body = new ApplicationNode(
                        new IdentifierNode(clause.loopFunction(), dummyLoc),
                        Arrays.asList(accuId, restAppLambda, clause.expression),
                        clauseLocation);

            } else if (part instanceof AssignmentClause clause) {

                body = new ApplicationNode(
                        new LambdaNode(freshUnderscores(Arrays.asList(clause.varName())), body, body.location()),
                        Arrays.asList(clause.value), clause.value.location());

            } else if (part instanceof TupleAssignmentClause clause) {

                ExpressionNode restLambda = new LambdaNode(freshUnderscores(clause.varNames()), body, loc);

                body = new ApplicationNode(
                        new IdentifierNode("apply", dummyLoc),
                        Arrays.asList(restLambda, clause.value),
                        clause.value.location());

            } else if (part instanceof FilterClause fc) {

                body = new BranchNode(fc.expression, body, accu, loc);

            } else {
                throw new PacioliException(loc, "Unexpected clause %s", part);
            }
        }

        // Build the final code
        ExpressionNode emptyCollection = new ApplicationNode(
                new IdentifierNode(node.emptyCollectionFunction(), dummyLoc),
                new ArrayList<ExpressionNode>(),
                loc);

        var lowered = new ApplicationNode(
                new LambdaNode(Arrays.asList(accuName), body, loc),
                Arrays.asList(emptyCollection),
                loc);

        // Resolve the created code
        lowered.resolve(node.table);

        return lowered;
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
}
