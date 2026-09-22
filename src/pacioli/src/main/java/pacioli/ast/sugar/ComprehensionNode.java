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
import java.util.List;
import java.util.Optional;

import pacioli.ast.AbstractNode;
import pacioli.ast.Node;
import pacioli.ast.Visitor;
import pacioli.ast.expression.ExpressionNode;
import pacioli.ast.expression.IdentifierNode;
import pacioli.compiler.Location;
import pacioli.compiler.PacioliException;
import pacioli.symboltable.PacioliTable;
import pacioli.symboltable.SymbolTable;
import pacioli.symboltable.info.ValueInfo;

public class ComprehensionNode extends AbstractNode implements ExpressionNode {

    /**
     * The comprehension kind. Corresponds with the '[' ... ']' and '{' ... '}'
     * syntax.
     */
    public enum Kind {
        LIST, SET
    }

    /**
     * A comprehension generator kind. Corresponds with the 'in list' (or '<-'), 'in
     * set' and 'in array' syntax.
     */
    public enum GeneratorKind {
        LIST, SET, ARRAY
    }

    public final Kind kind;
    public final Operator operator;
    public final ExpressionNode expression;
    public final List<Clause> clauses;

    // Set during resolving and used during lowering
    public PacioliTable table = null;

    /**
     * Complete constructor
     */
    public ComprehensionNode(Kind kind, Operator op, ExpressionNode e, List<Clause> ps, Location location) {
        super(location);
        this.kind = kind;
        this.operator = op;
        this.expression = e;
        this.clauses = ps;
    }

    /**
     * Constructor for a comprehension without an operator
     */
    public ComprehensionNode(Kind kind, ExpressionNode e, List<Clause> ps, Location location) {
        super(location);
        this.kind = kind;
        this.operator = Operator.none();
        this.expression = e;
        this.clauses = ps;
    }

    /**
     * Constructor for a comprehension with an operator. The operator is derived
     * from the operation identifier. Throws an error if the operator is not
     * valid.
     */
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

    public boolean hasOperator() {
        return this.operator.kind() != Operator.Kind.NONE;
    }

    public IdentifierNode operatorFunction() {
        String functionName = switch (this.kind) {
            case LIST -> this.operator.functionForLists();
            case SET -> this.operator.functionForSets();
        };

        return new IdentifierNode(functionName, this.operator.op.location());
    }

    public String collectFunction() {
        return collectFunction(this.kind);
    }

    public String emptyCollectionFunction() {
        return emptyCollectionFunction(this.kind);
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
            return ComprehensionNode.functionForLists(this.kind);
        }

        public String functionForSets() {
            return ComprehensionNode.functionForSets(this.kind);
        }
    }

    /**
     * Clause
     */
    public sealed interface Clause extends Node permits
            GeneratorClause,
            TupleGeneratorClause,
            FilterClause,
            AssignmentClause,
            TupleAssignmentClause {
    }

    /**
     * GeneratorClause
     */
    public static final class GeneratorClause extends AbstractNode implements Clause {

        public final GeneratorKind kind;
        public final IdentifierNode id;
        public final ExpressionNode expression;

        public SymbolTable<ValueInfo> table;

        public GeneratorClause(
                GeneratorKind kind,
                IdentifierNode id,
                ExpressionNode expression,
                Location loc) {
            super(loc);
            this.kind = kind;
            this.id = id;
            this.expression = expression;
        }

        public GeneratorClause transform(IdentifierNode id, ExpressionNode value) {
            var clause = new GeneratorClause(this.kind, id, value, this.location());
            clause.table = this.table;
            return clause;
        }

        @Override
        public void accept(Visitor visitor) {
            visitor.visit(this);
        }

        public String varName() {
            return this.id.name();
        }

        public String loopFunction() {
            return ComprehensionNode.loopFunction(this.kind);
        }
    }

    /**
     * FilterClause
     */
    public static final class FilterClause extends AbstractNode implements Clause {

        public final ExpressionNode expression;

        public FilterClause(ExpressionNode expression, Location loc) {
            super(loc);
            this.expression = expression;
        }

        public FilterClause transform(ExpressionNode expression) {
            return new FilterClause(expression, this.location());
        }

        @Override
        public void accept(Visitor visitor) {
            visitor.visit(this);
        }
    }

    /**
     * TupleGeneratorClause
     */
    public static final class TupleGeneratorClause extends AbstractNode implements Clause {

        public final GeneratorKind kind;
        public final List<IdentifierNode> ids;
        public final ExpressionNode expression;

        public SymbolTable<ValueInfo> table;

        public TupleGeneratorClause(
                GeneratorKind kind,
                List<IdentifierNode> ids,
                ExpressionNode expression,
                Location loc) {
            super(loc);
            this.kind = kind;
            this.ids = ids;
            this.expression = expression;
        }

        public TupleGeneratorClause transform(List<IdentifierNode> ids, ExpressionNode expression) {
            var clause = new TupleGeneratorClause(this.kind, ids, expression, this.location());
            clause.table = this.table;
            return clause;
        }

        public void accept(Visitor visitor) {
            visitor.visit(this);
        }

        public List<String> varNames() {
            List<String> names = new ArrayList<String>();

            for (IdentifierNode var : this.ids) {
                names.add(var.name());
            }

            return names;
        }

        public String loopFunction() {
            return ComprehensionNode.loopFunction(this.kind);
        }
    }

    /**
     * AssignmentClause
     */
    public static final class AssignmentClause extends AbstractNode implements Clause {

        public final IdentifierNode id;
        public final ExpressionNode value;

        public SymbolTable<ValueInfo> table;

        public AssignmentClause(IdentifierNode id, ExpressionNode value, Location loc) {
            super(loc);
            this.id = id;
            this.value = value;
        }

        public AssignmentClause transform(IdentifierNode id, ExpressionNode value) {
            var clause = new AssignmentClause(id, value, this.location());
            clause.table = this.table;
            return clause;
        }

        public void accept(Visitor visitor) {
            visitor.visit(this);
        }

        public String varName() {
            return this.id.name();
        }
    }

    /**
     * TupleAssignmentClause
     */
    public static final class TupleAssignmentClause extends AbstractNode implements Clause {

        public final List<IdentifierNode> ids;
        public final ExpressionNode value;

        public SymbolTable<ValueInfo> table;

        public TupleAssignmentClause(List<IdentifierNode> ids, ExpressionNode value, Location loc) {
            super(loc);
            this.ids = ids;
            this.value = value;
        }

        public TupleAssignmentClause transform(List<IdentifierNode> ids, ExpressionNode value) {
            var clause = new TupleAssignmentClause(ids, value, this.location());
            clause.table = this.table;
            return clause;
        }

        public void accept(Visitor visitor) {
            visitor.visit(this);
        }

        public List<String> varNames() {
            List<String> names = new ArrayList<String>();

            for (IdentifierNode var : this.ids) {
                names.add(var.name());
            }

            return names;
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
                    "Comprehension operator '%s' unknown. Valid operators are sum, count, all, some, gcd, concat, min and max.",
                    id.name());
        };
    }

    private static String collectFunction(Kind kind) {
        return switch (kind) {
            case LIST -> "_add_mut";
            case SET -> "_adjoin_mut";
        };
    }

    private static String emptyCollectionFunction(Kind kind) {
        return switch (kind) {
            case LIST -> "empty_list";
            case SET -> "empty_set";
        };
    }

    private static String loopFunction(GeneratorKind kind) {
        return switch (kind) {
            case LIST -> "loop_list";
            case SET -> "loop_set";
            case ARRAY -> "loop_array";
        };
    }

    private static String functionForLists(Operator.Kind kind) {
        return switch (kind) {
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

    private static String functionForSets(Operator.Kind kind) {
        return switch (kind) {
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
