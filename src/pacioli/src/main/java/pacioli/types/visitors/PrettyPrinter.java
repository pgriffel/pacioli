package pacioli.types.visitors;

import pacioli.Location;
import pacioli.Printer;
import pacioli.types.FunctionType;
import pacioli.types.IndexSetVar;
import pacioli.types.OperatorConst;
import pacioli.types.OperatorVar;
import pacioli.types.ParametricType;
import pacioli.types.ScalarUnitVar;
import pacioli.types.Schema;
import pacioli.types.TypeBase;
import pacioli.types.TypeIdentifier;
import pacioli.types.TypeVar;
import pacioli.types.TypeVisitor;
import pacioli.types.VectorUnitVar;
import pacioli.types.ast.ContextNode;
import pacioli.types.ast.TypeNode;
import pacioli.types.matrix.IndexList;
import pacioli.types.matrix.IndexType;
import pacioli.types.matrix.MatrixType;
import pacioli.types.matrix.ScalarUnitDeval;
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
        // TypeNode dom = type.domain.deval();
        // TypeNode ran = type.range.deval();
        // returnTypeNode(new
        // FunctionTypeNode(dom.getLocation().join(ran.getLocation()), dom, ran));
        if (type.domain instanceof ParametricType p && p.op.getName().equals("Tuple")) {
            out.write("(");
            out.writeCommaSeparated(p.args, x -> x.accept(this));
            out.write(")");
        } else {
            type.domain.accept(this);
        }
        out.write(" -> ");
        type.range.accept(this);
    }

    @Override
    public void visit(Schema type) {
        String sep = "";
        for (ContextNode contextNode : type.contextNodes) {
            // contextNode.accept(this);
            // Call pretty on AST node instead of type
            out.print(contextNode.pretty());
            sep = ": ";
            out.print(sep);
            sep = ", ";
        }
        type.type.accept(this);
    }

    @Override
    public void visit(IndexList type) {

        // This must be an parameric "Index" type, otherwise it would be handled
        // by the deval of a matrix type.

        out.print("[");
        String sep = "";
        for (TypeIdentifier id : type.getIndexSets()) {
            out.print(sep);
            out.print(id.name);
            sep = ", ";
        }
        out.print("]");
    }

    @Override
    public void visit(IndexType type) {

        // throw new RuntimeException("deval of index list should be handled by the
        // matrix type");
        // // This must be an parameric "Index" type, otherwise it would be handled
        // // by the deval of a matrix type.

        out.print("Index(");
        type.indexSet.accept(this);
        out.print(")");
    }

    @Override
    public void visit(MatrixType type) {
        // throw new RuntimeException("todo: " + type.getClass());

        // Use a general rewriter to simplify. See deval van scalar and vector units
        TypeNode factorNode = type.factor.fold(new ScalarUnitDeval(new Location()));
        TypeNode left = type.devalDimensionUnitPair(type.rowDimension, type.rowUnit);
        TypeNode right = type.devalDimensionUnitPair(type.columnDimension, type.columnUnit);

        // return unit.fold(new UnitMVMCompiler());

        out.write(type.toString());

        // if (left == null && right == null) {
        // out.write(factorNode.toString());
        // } else if (left == null) {
        // TypeNode rightNode;
        // Location location;
        // if (type.factor.equals(TypeBase.ONE)) {
        // location = right.getLocation();
        // rightNode = right;
        // } else {
        // location = factorNode.getLocation().join(right.getLocation());
        // rightNode = new TypeMultiplyNode(location, factorNode, right);
        // }
        // returnTypeNode(new TypePerNode(location, new NumberTypeNode(location, "1"),
        // rightNode));
        // } else if (right == null) {
        // if (type.factor.equals(TypeBase.ONE)) {
        // returnTypeNode(left);
        // } else {
        // Location location = left.getLocation().join(factorNode.getLocation());
        // returnTypeNode(new TypeMultiplyNode(location, factorNode, left));
        // }
        // } else {
        // Location perLocation = left.getLocation().join(right.getLocation());
        // TypePerNode perNode = new TypePerNode(perLocation, left, right);
        // if (type.factor.equals(TypeBase.ONE)) {
        // returnTypeNode(perNode);
        // } else {
        // Location location = factorNode.getLocation().join(perLocation);
        // returnTypeNode(new TypeMultiplyNode(location, factorNode, perNode));
        // }
        // }
    }

    @Override
    public void visit(ParametricType type) {
        type.op.accept(this);
        if (!type.args.isEmpty()) {
            out.write("(");
        }
        out.writeCommaSeparated(type.args, arg -> arg.accept(this));
        if (!type.args.isEmpty()) {
            out.write(")");
        }
    }

    @Override
    public void visit(IndexSetVar type) {
        out.write(type.getName());
    }

    @Override
    public void visit(ScalarUnitVar type) {
        out.write(type.getName());
    }

    @Override
    public void visit(TypeVar type) {
        out.write(type.getName());
    }

    @Override
    public void visit(VectorUnitVar type) {
        out.write(type.getName());
    }

    @Override
    public void visit(OperatorConst type) {
        out.print(type.getName());
    }

    @Override
    public void visit(OperatorVar type) {
        out.write(type.name());
    }

    static class UnitPrinter implements UnitFold<TypeBase, String> {

        @Override
        public String map(TypeBase base) {
            return base.asMVM(null);
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

}
