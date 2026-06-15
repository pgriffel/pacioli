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

    public enum Kind {
        LIST, SET
    }

    public final Kind kind;
    public final IdentifierNode op; // maybe null
    public final ExpressionNode expression;
    public final List<Clause> clauses;

    public ComprehensionNode(Kind kind, ExpressionNode e, List<Clause> ps, Location location) {
        super(location);
        this.kind = kind;
        this.op = null;
        this.expression = e;
        this.clauses = ps;
    }

    public ComprehensionNode(Kind kind, IdentifierNode op, ExpressionNode e, List<Clause> ps, Location location) {
        super(location);
        this.kind = kind;
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
            return desugarComprehension(this.kind, this.location(), (ExpressionNode) ex, desugared);
        } else {
            return desugarFoldComprehension(this.kind, this.location(), this.op, (ExpressionNode) ex, desugared);
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
        public final Kind kind;
        public final IdentifierNode id;
        public final ExpressionNode list;

        public GeneratorClause(Kind kind, IdentifierNode id, ExpressionNode list, Location loc) {
            super(loc);
            this.kind = kind;
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

    private static ExpressionNode desugarComprehension(ComprehensionNode.Kind kind, pacioli.compiler.Location loc,
            ExpressionNode e,
            List<Clause> ps)
            throws PacioliException {

        String accuName = freshName("_c_accu");
        String tupName = freshName("_c_tup");

        pacioli.compiler.Location dummyLoc = loc.collapse();

        ExpressionNode addMut = new IdentifierNode(opName(kind, "add"), dummyLoc);
        ExpressionNode accu = new IdentifierNode(accuName, dummyLoc);
        ExpressionNode body = new ApplicationNode(addMut, Arrays.asList(accu, e), dummyLoc);

        for (int i = ps.size() - 1; 0 <= i; i--) {
            Object part = ps.get(i);
            if (part instanceof GeneratorClause) {
                GeneratorClause clause = (GeneratorClause) part;
                pacioli.compiler.Location loc2 = clause.list.location();
                body = new ApplicationNode(
                        new IdentifierNode(opName(clause.kind, "loop"), dummyLoc),
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
                ExpressionNode tup = new IdentifierNode(tupName, dummyLoc);
                ExpressionNode loopList = new IdentifierNode(opName(kind, "loop"), dummyLoc);
                ExpressionNode accuId = new IdentifierNode(accuName, dummyLoc);
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
        ExpressionNode emptyListId = new IdentifierNode(opName(kind, "empty"), dummyLoc);
        ExpressionNode emptyList = new ApplicationNode(emptyListId, new ArrayList<ExpressionNode>(), loc);

        return new ApplicationNode(lambda, Arrays.asList(emptyList), loc);
    }

    private static ExpressionNode desugarFoldComprehension(ComprehensionNode.Kind kind, pacioli.compiler.Location loc,
            IdentifierNode op,
            ExpressionNode e, List<Clause> ps) throws PacioliException {
        pacioli.compiler.Location eLoc = e.location();
        pacioli.compiler.Location opLoc = op.location();
        pacioli.compiler.Location dummyLoc = op.location().collapse();
        ExpressionNode body = desugarComprehension(kind, loc, e, ps);
        if (op.name().equals("sum")) {
            return new ApplicationNode((ExpressionNode) new IdentifierNode(opName(kind, "sum"), dummyLoc),
                    Arrays.asList(body),
                    opLoc);
        } else if (op.name().equals("count")) {
            return new ApplicationNode((ExpressionNode) new IdentifierNode(opName(kind, "count"), dummyLoc),
                    Arrays.asList(body), opLoc);
        } else if (op.name().equals("all")) {
            return new ApplicationNode((ExpressionNode) new IdentifierNode(opName(kind, "all"), dummyLoc),
                    Arrays.asList(body),
                    opLoc);
        } else if (op.name().equals("some")) {
            return new ApplicationNode((ExpressionNode) new IdentifierNode(opName(kind, "some"), dummyLoc),
                    Arrays.asList(body),
                    opLoc);
        } else if (op.name().equals("gcd")) {
            return new ApplicationNode((ExpressionNode) new IdentifierNode(opName(kind, "gcd"), dummyLoc),
                    Arrays.asList(body),
                    opLoc);
        } else if (op.name().equals("concat")) {
            return new ApplicationNode((ExpressionNode) new IdentifierNode(opName(kind, "concat"), dummyLoc),
                    Arrays.asList(body), opLoc);
        } else if (op.name().equals("min")) {
            return new ApplicationNode((ExpressionNode) new IdentifierNode(opName(kind, "min"), dummyLoc),
                    Arrays.asList(body),
                    opLoc);
        } else if (op.name().equals("max")) {
            return new ApplicationNode((ExpressionNode) new IdentifierNode(opName(kind, "max"), dummyLoc),
                    Arrays.asList(body),
                    opLoc);
        } else {
            throw new PacioliException(op.location(), "Comprehension operator '%s' unknown", op.name());
        }
    }

    private static String opName(ComprehensionNode.Kind kind, String op) {
        if (kind.equals(Kind.LIST)) {
            switch (op) {
                case "empty":
                    return "empty_list";
                case "add":
                    return "_add_mut";
                case "loop":
                    return "loop_list";
                case "sum":
                    return "_list_sum";
                case "count":
                    return "_list_count";
                case "all":
                    return "_list_all";
                case "some":
                    return "_list_some";
                case "gcd":
                    return "_list_gcd";
                case "concat":
                    return "_list_concat";
                case "min":
                    return "_list_min";
                case "max":
                    return "_list_max";
                default:
                    throw new RuntimeException("unknown list comprehension op: " + op);
            }
        } else {
            switch (op) {
                case "empty":
                    return "empty_set";
                case "add":
                    return "_adjoin_mut";
                case "loop":
                    return "loop_set";
                case "sum":
                    return "_set_sum";
                case "count":
                    return "_set_count";
                case "all":
                    return "_set_all";
                case "some":
                    return "_set_some";
                case "gcd":
                    return "_set_gcd";
                case "concat":
                    return "_set_concat";
                case "min":
                    return "_set_min";
                case "max":
                    return "_set_max";
                default:
                    throw new RuntimeException("unknown set comprehension op: " + op);
            }
        }
    }
}
