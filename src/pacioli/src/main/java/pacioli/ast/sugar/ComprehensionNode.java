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

package pacioli.ast.sugar;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import pacioli.ast.AbstractNode;
import pacioli.ast.Node;
import pacioli.ast.Visitor;
import pacioli.ast.expression.ApplicationNode;
import pacioli.ast.expression.BranchNode;
import pacioli.ast.expression.ExpressionNode;
import pacioli.ast.expression.IdentifierNode;
import pacioli.ast.expression.LambdaNode;
import pacioli.compiler.Location;
import pacioli.compiler.PacioliException;

public class ComprehensionNode extends AbstractNode implements ExpressionNode {

    public final IdentifierNode op; // maybe null
    public final ExpressionNode expression;
    public final List<Clause> clauses;

    public ComprehensionNode(ExpressionNode e, List<Clause> ps, Location location) {
        super(location);
        this.op = null;
        this.expression = e;
        this.clauses = ps;
    }

    public ComprehensionNode(IdentifierNode op, ExpressionNode e, List<Clause> ps, Location location) {
        super(location);
        this.op = op;
        this.expression = e;
        this.clauses = ps;
    }

    @Override
    public void accept(Visitor visitor) {
        visitor.visit(this);
    }

    public ExpressionNode asLambdas() {
        List<Clause> desugared = new ArrayList<>();
        for (Clause clause : this.clauses) {
            Node d = clause.desugar();
            assert (d instanceof Clause);
            desugared.add((Clause) d);
        }

        Node ex = this.expression.desugar();
        assert (ex instanceof ExpressionNode);

        if (this.op == null) {
            return desugarComprehension(this.location(), (ExpressionNode) ex, desugared);
        } else {
            return desugarFoldComprehension(this.location(), this.op, (ExpressionNode) ex, desugared);
        }
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

    public sealed interface Clause extends Node
            permits GeneratorClause, TupleGeneratorClause, FilterClause, AssignmentClause, TupleAssignmentClause {
    }

    public static final class GeneratorClause extends AbstractNode implements Clause {
        public final IdentifierNode id;
        public final ExpressionNode list;

        public GeneratorClause(IdentifierNode id, ExpressionNode list, Location loc) {
            super(loc);
            this.id = id;
            this.list = list;
        }

        @Override
        public void accept(Visitor visitor) {
            visitor.visit(this);
        }
    }

    public static final class FilterClause extends AbstractNode implements Clause {
        public final ExpressionNode list;

        public FilterClause(ExpressionNode list, Location loc) {
            super(loc);
            this.list = list;
        }

        @Override
        public void accept(Visitor visitor) {
            visitor.visit(this);
        }
    }

    public static final class TupleGeneratorClause extends AbstractNode implements Clause {
        public final List<IdentifierNode> ids;
        public final ExpressionNode list;

        public TupleGeneratorClause(List<IdentifierNode> ids, ExpressionNode list, Location loc) {
            super(loc);
            this.ids = ids;
            this.list = list;
        }

        public void accept(Visitor visitor) {
            visitor.visit(this);
        }
    }

    public static final class AssignmentClause extends AbstractNode implements Clause {
        public final IdentifierNode id;
        public final ExpressionNode value;

        public AssignmentClause(IdentifierNode id, ExpressionNode value, Location loc) {
            super(loc);
            this.id = id;
            this.value = value;
        }

        public void accept(Visitor visitor) {
            visitor.visit(this);
        }
    }

    public static final class TupleAssignmentClause extends AbstractNode implements Clause {
        public final List<IdentifierNode> ids;
        public final ExpressionNode value;

        public TupleAssignmentClause(List<IdentifierNode> ids, ExpressionNode value, Location loc) {
            super(loc);
            this.ids = ids;
            this.value = value;
        }

        public void accept(Visitor visitor) {
            visitor.visit(this);
        }
    }

    private static ExpressionNode desugarComprehension(pacioli.compiler.Location loc, ExpressionNode e,
            List<Clause> ps)
            throws PacioliException {

        String accuName = freshName("_c_accu");
        String tupName = freshName("_c_tup");

        pacioli.compiler.Location dummyLoc = loc.collapse();

        ExpressionNode addMut = new IdentifierNode("_add_mut", dummyLoc);
        ExpressionNode accu = new IdentifierNode(accuName, dummyLoc);
        ExpressionNode body = new ApplicationNode(addMut, Arrays.asList(accu, e), dummyLoc);

        for (int i = ps.size() - 1; 0 <= i; i--) {
            Object part = ps.get(i);
            if (part instanceof GeneratorClause) {
                GeneratorClause clause = (GeneratorClause) part;
                pacioli.compiler.Location loc2 = clause.list.location();
                body = new ApplicationNode(
                        new IdentifierNode("loop_list", dummyLoc),
                        Arrays.asList((ExpressionNode) new IdentifierNode(accuName, dummyLoc),
                                new LambdaNode(freshUnderscores(Arrays.asList(accuName, clause.id.name())), body, loc2),
                                clause.list),
                        loc2);
            } else if (part instanceof TupleGeneratorClause) {
                TupleGeneratorClause clause = (TupleGeneratorClause) part;
                pacioli.compiler.Location loc2 = clause.list.location();

                List<String> args = new ArrayList<String>();
                for (IdentifierNode var : clause.ids) {
                    args.add(var.name());
                }

                ExpressionNode apply = new IdentifierNode("apply", dummyLoc);
                ExpressionNode restLambda = new LambdaNode(freshUnderscores(args), body, loc2);
                ExpressionNode tup = new IdentifierNode(tupName, loc2);
                ExpressionNode loopList = new IdentifierNode("loop_list", dummyLoc);
                ExpressionNode accuId = new IdentifierNode(accuName, loc2);
                ExpressionNode restApp = new ApplicationNode(apply, Arrays.asList(restLambda, tup), loc2);
                ExpressionNode restAppLambda = new LambdaNode(Arrays.asList(accuName, tupName), restApp, loc2);

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
                body = new BranchNode(fc.list, body, new IdentifierNode(accuName, dummyLoc), loc);
            } else {
                throw new PacioliException(loc, "Unexpected clause %s", part);
            }
        }

        ExpressionNode lambda = new LambdaNode(Arrays.asList(accuName), body, loc);
        ExpressionNode emptyListId = new IdentifierNode("empty_list", dummyLoc);
        ExpressionNode emptyList = new ApplicationNode(emptyListId, new ArrayList<ExpressionNode>(), loc);

        return new ApplicationNode(lambda, Arrays.asList(emptyList), loc);
    }

    private static ExpressionNode desugarFoldComprehension(pacioli.compiler.Location loc, IdentifierNode op,
            ExpressionNode e, List<Clause> ps) throws PacioliException {
        pacioli.compiler.Location eLoc = e.location();
        pacioli.compiler.Location opLoc = op.location();
        pacioli.compiler.Location dummyLoc = op.location().collapse();
        ExpressionNode body = desugarComprehension(loc, e, ps);
        if (op.name().equals("sum")) {
            return new ApplicationNode((ExpressionNode) new IdentifierNode("_list_sum", dummyLoc), Arrays.asList(body),
                    opLoc);
        } else if (op.name().equals("count")) {
            return new ApplicationNode((ExpressionNode) new IdentifierNode("_list_count", dummyLoc),
                    Arrays.asList(body), opLoc);
        } else if (op.name().equals("all")) {
            return new ApplicationNode((ExpressionNode) new IdentifierNode("_list_all", dummyLoc), Arrays.asList(body),
                    opLoc);
        } else if (op.name().equals("some")) {
            return new ApplicationNode((ExpressionNode) new IdentifierNode("_list_some", dummyLoc), Arrays.asList(body),
                    opLoc);
        } else if (op.name().equals("gcd")) {
            return new ApplicationNode((ExpressionNode) new IdentifierNode("_list_gcd", dummyLoc), Arrays.asList(body),
                    opLoc);
        } else if (op.name().equals("concat")) {
            return new ApplicationNode((ExpressionNode) new IdentifierNode("_list_concat", dummyLoc),
                    Arrays.asList(body), opLoc);
        } else if (op.name().equals("min")) {
            return new ApplicationNode((ExpressionNode) new IdentifierNode("_list_min", dummyLoc), Arrays.asList(body),
                    opLoc);
        } else if (op.name().equals("max")) {
            return new ApplicationNode((ExpressionNode) new IdentifierNode("_list_max", dummyLoc), Arrays.asList(body),
                    opLoc);
        } else {
            throw new PacioliException(op.location(), "Comprehension operator '%s' unknown", op.name());
        }
    }
}
