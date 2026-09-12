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
import java.util.Optional;

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
import pacioli.symboltable.SymbolTable;
import pacioli.symboltable.info.ValueInfo;

public class ComprehensionNode extends AbstractNode implements ExpressionNode {

    public enum Kind {
        LIST, SET, ARRAY
    }

    public final Kind kind;
    public final Operator operator;
    public final ExpressionNode expression;
    public final List<Clause> clauses;

    // Set during resolving and used during lowering
    public SymbolTable<ValueInfo> table = null;

    public ComprehensionNode(Kind kind, Operator op, ExpressionNode e, List<Clause> ps, Location location) {
        super(location);
        this.kind = kind;
        this.operator = op;
        this.expression = e;
        this.clauses = ps;
    }

    public ComprehensionNode(Kind kind, ExpressionNode e, List<Clause> ps, Location location) {
        super(location);
        this.kind = kind;
        this.operator = Operator.none();
        this.expression = e;
        this.clauses = ps;
    }

    public ComprehensionNode(Kind kind, IdentifierNode id, ExpressionNode e, List<Clause> ps, Location location) {
        super(location);
        this.kind = kind;
        this.operator = Operator.fromId(id);
        this.expression = e;
        this.clauses = ps;
    }

    @Override
    public void accept(Visitor visitor) {
        visitor.visit(this);
    }

    // Obsolete. Is now done in the LoweringVisitor
    public ExpressionNode asLambdas() {
        List<Clause> desugared = new ArrayList<>();
        for (Clause clause : this.clauses) {
            Node d = clause.desugar();
            assert (d instanceof Clause);
            desugared.add((Clause) d);
        }

        Node ex = this.expression.desugar();
        assert (ex instanceof ExpressionNode);

        if (this.hasOperator()) {
            return desugarFoldComprehension(this.kind, this.location(), this.operator, (ExpressionNode) ex, desugared,
                    this.operatorFunction());
        } else {
            return desugarComprehension(this.kind, this.location(), (ExpressionNode) ex, desugared);
        }
    }

    public boolean hasOperator() {
        return this.operator.kind() != Operator.Kind.NONE;
    }

    public IdentifierNode operatorFunction() {
        String functionName = switch (this.kind) {
            case LIST -> this.operator.functionForLists();
            case SET -> this.operator.functionForSets();
            case ARRAY -> this.operator.functionForLists();
        };

        return new IdentifierNode(functionName, this.operator.op.location());
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

    /**
     * Operator
     */
    public static final class Operator {
        public enum Kind {
            SUM, COUNT, ALL, SOME, GCD, CONCAT, MIN, MAX, NONE
        }

        private final IdentifierNode op;
        private final Kind kind;

        public Operator(IdentifierNode op, Kind kind) {
            this.op = op;
            this.kind = kind;
        }

        public Kind kind() {
            return this.kind;
        }

        public Optional<IdentifierNode> id() {
            return Optional.ofNullable(this.op);
        }

        public static Operator none() {
            return new Operator(null, Kind.NONE);
        }

        public static Operator fromId(IdentifierNode id) {
            return new Operator(id, kindFromId(id));
        }

        public String functionForLists() {
            return switch (this.kind) {
                case SUM -> "_list_sum";
                case COUNT -> "_list_count";
                case ALL -> "_list_all";
                case SOME -> "_list_some";
                case GCD -> "_list_gcd";
                case CONCAT -> "_list_concat";
                case MIN -> "_list_min";
                case MAX -> "_list_max";
                case NONE -> "identity";
            };
        }

        public String functionForSets() {
            return switch (this.kind) {
                case SUM -> "_set_sum";
                case COUNT -> "_set_count";
                case ALL -> "_set_all";
                case SOME -> "_set_some";
                case GCD -> "_set_gcd";
                case CONCAT -> "_set_concat";
                case MIN -> "_set_min";
                case MAX -> "_set_max";
                case NONE -> "identity";
            };
        }
    }

    public static Operator.Kind kindFromId(IdentifierNode id) {
        return switch (id.name()) {
            case "sum" -> Operator.Kind.SUM;
            case "count" -> Operator.Kind.COUNT;
            case "all" -> Operator.Kind.ALL;
            case "some" -> Operator.Kind.SOME;
            case "gcd" -> Operator.Kind.GCD;
            case "concat" -> Operator.Kind.CONCAT;
            case "min" -> Operator.Kind.MIN;
            case "max" -> Operator.Kind.MAX;
            default -> throw new PacioliException(
                    id.location(),
                    "Unknown comprehension operator: %s. Valid operators are sum, count, all, some, gcd, concat, min or max.",
                    id.name());
        };
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
                        new IdentifierNode(loopName(clause.kind, "loop"), dummyLoc),
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
                ExpressionNode loopList = new IdentifierNode(loopName(kind, "loop"), dummyLoc);
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

    private static ExpressionNode desugarFoldComprehension(
            ComprehensionNode.Kind kind,
            Location loc,
            Operator op,
            ExpressionNode e,
            List<Clause> ps,
            IdentifierNode fun) throws PacioliException {

        pacioli.compiler.Location opLoc = op.id().get().location();

        ExpressionNode body = desugarComprehension(kind, loc, e, ps);

        return new ApplicationNode((ExpressionNode) fun, Arrays.asList(body), opLoc);

    }

    public static String loopName(ComprehensionNode.Kind kind, String op) {
        switch (kind) {
            case LIST:
                return "loop_list";
            case SET:
                return "loop_set";
            case ARRAY:
                return "loop_array";
            default:
                throw new RuntimeException("Unexpected kind for op: " + op);
        }
    }

    public static String opName(ComprehensionNode.Kind kind, String op) {
        if (kind.equals(Kind.LIST)) {
            switch (op) {
                case "empty":
                    return "empty_list";
                case "add":
                    return "_add_mut";
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
