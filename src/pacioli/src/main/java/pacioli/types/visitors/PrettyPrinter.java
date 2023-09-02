package pacioli.types.visitors;

import pacioli.compiler.Printer;
import pacioli.types.TypeContext;
import pacioli.types.TypeVisitor;
import pacioli.types.matrix.IndexList;
import pacioli.types.matrix.IndexType;
import pacioli.types.matrix.MatrixType;
import pacioli.types.type.FunctionType;
import pacioli.types.type.IndexSetVar;
import pacioli.types.type.OperatorConst;
import pacioli.types.type.OperatorVar;
import pacioli.types.type.ParametricType;
import pacioli.types.type.Quant;
import pacioli.types.type.ScalarUnitVar;
import pacioli.types.type.Schema;
import pacioli.types.type.TypeBase;
import pacioli.types.type.TypeIdentifier;
import pacioli.types.type.TypeObject;
import pacioli.types.type.TypePredicate;
import pacioli.types.type.TypeVar;
import pacioli.types.type.VectorUnitVar;
import uom.Fraction;
import uom.UnitFold;

/**
 * WIP. Alternative for pretty printing via the devaluator.
 */
public class PrettyPrinter implements TypeVisitor {

    Printer out;

    public PrettyPrinter(Printer printer) {
        this.out = printer;
    }

    @Override
    public void visit(FunctionType type) {
        if (type.domain() instanceof ParametricType p && p.op().name().equals("Tuple")) {
            out.write("(");
            out.writeCommaSeparated(p.args(), x -> x.accept(this));
            out.write(")");
        } else {
            type.domain().accept(this);
        }
        out.write(" -> ");
        type.range().accept(this);
    }

    @Override
    public void visit(Schema type) {
        TypeContext tc = new TypeContext(type.variables());
        out.print(tc.pretty());
        type.type().accept(this);
        if (type.conditions().size() > 0) {
            out.print(" where ");
            String sep = "";
            for (TypePredicate cond : type.conditions()) {
                out.print(sep);
                sep = " and ";
                cond.accept(this);
            }
        }
    }

    @Override
    public void visit(IndexList type) {

        // This must be an parameric "Index" type, otherwise it would be handled
        // by the matrix type.

        out.print("[");
        String sep = "";
        for (TypeIdentifier id : type.indexSets()) {
            out.print(sep);
            out.print(id.name());
            sep = ", ";
        }
        out.print("]");
    }

    @Override
    public void visit(IndexType type) {

        // // This must be an parameric "Index" type, otherwise it would be handled
        // // by the matrix type.

        out.print("Index(");
        type.indexSet().accept(this);
        out.print(")");
    }

    @Override
    public void visit(MatrixType type) {

        // Empty string or something
        String left = type.prettyDimensionUnitPair(type.rowDimension(), type.rowUnit());
        String right = type.prettyDimensionUnitPair(type.columnDimension(), type.columnUnit());

        // 1 or something
        String factorString = type.factor().pretty();

        boolean hasFactor = !factorString.equals("1");
        boolean hasLeft = !left.isEmpty();
        boolean hasRight = !right.isEmpty();

        if (hasFactor && hasLeft && hasRight) {
            out.format("%s*%s per %s", factorString, left, right);
        } else if (hasFactor && hasLeft) {
            out.format("%s*%s", factorString, left);
        } else if (hasFactor && hasRight) {
            out.format("%s per %s", factorString, right);
        } else if (hasFactor) {
            out.format("%s", factorString);
        } else if (hasLeft && hasRight) {
            out.format("%s per %s", left, right);
        } else if (hasLeft) {
            out.format("%s", left);
        } else if (hasRight) {
            out.format("1 per %s", right);
        } else {
            out.write("1");
        }
    }

    @Override
    public void visit(ParametricType type) {
        type.op().accept(this);
        if (!type.args().isEmpty()) {
            out.write("(");
        }
        out.writeCommaSeparated(type.args(), arg -> arg.accept(this));
        if (!type.args().isEmpty()) {
            out.write(")");
        }
    }

    @Override
    public void visit(IndexSetVar type) {
        out.write(type.name());
    }

    @Override
    public void visit(ScalarUnitVar type) {
        out.write(type.name());
    }

    @Override
    public void visit(TypeVar type) {
        out.write(type.name());
    }

    @Override
    public void visit(VectorUnitVar type) {
        out.write(type.name());
    }

    @Override
    public void visit(OperatorConst type) {
        out.print(type.name());
    }

    @Override
    public void visit(OperatorVar type) {
        out.write(type.name());
    }

    // UNITTODO Not used. Replace pretty printing in UoM with this?
    static public class UnitPrinter implements UnitFold<TypeBase, String> {

        @Override
        public String map(TypeBase base) {
            return base.pretty();
        }

        @Override
        public String mult(String x, String y) {
            return String.format("unit_mult(%s, %s)", x, y);
        }

        @Override
        public String expt(String x, Fraction n) {
            return String.format("unit_expt(%s, %s)", x, n);
        }

        @Override
        public String one() {
            return "unit(\"\")";
        }
    }

    @Override
    public void visit(TypePredicate type) {
        out.print(type.id());
        out.print("(");
        String sep = "";
        for (TypeObject id : type.arguments()) {
            out.print(sep);
            id.accept(this);
            sep = ", ";
        }
        out.print(")");
    }

    @Override
    public void visit(Quant quant) {
        // TODO Auto-generated method stub
        throw new UnsupportedOperationException("Unimplemented method 'visit'");
    }

}
