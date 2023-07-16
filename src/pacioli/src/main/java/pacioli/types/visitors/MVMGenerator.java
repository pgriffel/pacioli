package pacioli.types.visitors;

import pacioli.CompilationSettings;
import pacioli.Printer;
import pacioli.types.FunctionType;
import pacioli.types.IndexSetVar;
import pacioli.types.OperatorConst;
import pacioli.types.OperatorVar;
import pacioli.types.TypeObject;
import pacioli.types.ParametricType;
import pacioli.types.ScalarUnitVar;
import pacioli.types.Schema;
import pacioli.types.TypeBase;
import pacioli.types.TypeVar;
import pacioli.types.TypeVisitor;
import pacioli.types.VectorUnitVar;
import pacioli.types.matrix.IndexList;
import pacioli.types.matrix.IndexType;
import pacioli.types.matrix.MatrixType;

public class MVMGenerator implements TypeVisitor {

    Printer out;
    private CompilationSettings settings;

    public MVMGenerator(Printer out, CompilationSettings settings) {
        this.out = out;
        this.settings = settings;
    }

    @Override
    public void visit(FunctionType type) {
        out.write("new Pacioli.FunctionType(");
        type.domain.accept(this);
        out.write(", ");
        type.range.accept(this);
        out.write(")");
    }

    @Override
    public void visit(Schema type) {
        type.type.accept(this);
    }

    @Override
    public void visit(IndexList type) {
        out.write("new Pacioli.IndexType([");
        String pre = "";
        for (int i = 0; i < type.getIndexSets().size(); i++) {
            out.write(pre);
            // out.write("Pacioli.fetchIndex('");
            out.write("'");
            out.write(type.getIndexSets().get(i).home);
            out.write("_");
            out.write(type.getIndexSets().get(i).name);
            // out.write("')");
            out.write("'");
            pre = ", ";
        }
        out.write("])");
    }

    @Override
    public void visit(IndexType type) {
        type.indexSet.accept(this);
    }

    @Override
    public void visit(MatrixType type) {

        // String row = TypeBase.compileUnitToMVM(type.rowUnit, settings);
        // String column = TypeBase.compileUnitToMVM(type.columnUnit, settings);

        // out.write("shape_binop(\"multiply\", ");

        // // node.left.accept(this);
        // // Write the factor
        // out.write(TypeBase.compileUnitToMVM(type.factor, settings));

        // out.write(", ");

        // // node.right.accept(this);
        // out.write("shape_binop(\"per\", ");

        // // node.left.accept(this);
        // // Write the row dimension
        // out.write(row);

        // out.write(", ");

        // // node.right.accept(this);
        // // Write the column dimension
        // out.write(column);

        // out.write(")");

        // out.write(")");

        String factorString = TypeBase.compileUnitToMVM(type.factor, settings);
        // String left = TypeBase.compileUnitToMVM(type.rowUnit, settings);
        // String right = TypeBase.compileUnitToMVM(type.columnUnit, settings);
        String left = type.asMVMDimensionUnitPair(type.rowDimension, type.rowUnit, settings);
        String right = type.asMVMDimensionUnitPair(type.columnDimension, type.columnUnit, settings);

        boolean hasFactor = !factorString.isEmpty();
        boolean hasLeft = !left.isEmpty();
        boolean hasRight = !right.isEmpty();

        if (hasFactor && hasLeft && hasRight) {
            out.format("shape_binop(\"multiply\", %s, shape_binop(\"per\", %s, %s))", factorString, left, right);
        } else if (hasFactor && hasLeft) {
            out.format("shape_binop(\"multiply\", %s, %s)", factorString, left);
        } else if (hasFactor && hasRight) {
            out.format("shape_binop(\"multiply\", %s, %s)", factorString, right);
        } else if (hasFactor) {
            out.format("%s", factorString);
        } else if (hasLeft && hasRight) {
            out.format("shape_binop(\"per\", %s, %s)", left, right);
        } else if (hasLeft) {
            out.format("%s", left);
        } else if (hasRight) {
            out.format("%s", right);
        } else {
            out.write("scalar_shape(unit(\"\"))");
        }

        // OLD

        // out.write("Pacioli.createMatrixType(");
        // out.write(TypeBase.compileUnitToMVM(type.factor, settings));
        // out.write(", ");
        // // out.write(type.rowDimension.compileToJS());
        // type.rowDimension.accept(this);
        // // if (!type.rowDimension.isVar()) out.write(".param");
        // out.write(", ");
        // if (type.rowDimension.isVar() || type.rowDimension.width() > 0) {
        // out.write(TypeBase.compileUnitToJS(type.rowUnit));
        // } else {
        // out.write("Pacioli.ONE");
        // }
        // out.write(", ");
        // // out.write(type.columnDimension.compileToJS());
        // type.columnDimension.accept(this);
        // // if (!type.columnDimension.isVar()) out.write(".param");
        // out.write(", ");
        // if (type.columnDimension.isVar() || type.columnDimension.width() > 0) {
        // out.write(TypeBase.compileUnitToJS(type.columnUnit));
        // } else {
        // out.write("Pacioli.ONE");
        // }
        // out.write(")");
    }

    @Override
    public void visit(IndexSetVar type) {
        out.write("'_" + type.pretty() + "_'");
    }

    @Override
    public void visit(ParametricType type) {
        String name = type.getName();
        if (name.equals("Boole")) {
            out.write("new Pacioli.GenericType('Boole', [])");
        } else if (name.equals("String")) {
            out.write("new Pacioli.GenericType('String', [])");
        } else if (name.equals("File")) {
            out.write("new Pacioli.GenericType('File', [])");
        } else if (name.equals("Report")) {
            out.write("new Pacioli.Type('report')");
        } else if (name.equals("Void")) {
            out.write("new Pacioli.GenericType('Void', [])");
        } else if (name.equals("Index")) {
            // out.write("new Pacioli.Type('coordinate', ");
            out.write("new Pacioli.GenericType('Coordinates', [");
            String sep = "";
            for (TypeObject arg : type.args) {
                out.write(sep);
                // out.write(arg.compileToJS());
                arg.accept(this);
                sep = ", ";
            }
            out.write("])");
        } else if (name.equals("List")) {

            out.write("new Pacioli.GenericType(");
            out.write("'List', [");
            String sep = "";
            for (TypeObject arg : type.args) {
                out.write(sep);
                // out.write(arg.compileToJS());
                arg.accept(this);
                sep = ", ";
            }
            out.write("])");
        } else if (name.equals("Array")) {

            out.write("new Pacioli.GenericType(");
            out.write("'Array', [");
            String sep = "";
            for (TypeObject arg : type.args) {
                out.write(sep);
                // out.write(arg.compileToJS());
                arg.accept(this);
                sep = ", ";
            }
            out.write("])");
        } else if (name.equals("Ref")) {

            out.write("new Pacioli.Type(");
            out.write("\"reference\", ");
            String sep = "";
            for (TypeObject arg : type.args) {
                out.write(sep);
                // out.write(arg.compileToJS());
                arg.accept(this);
                sep = ", ";
            }
            out.write(")");
        } else if (name.equals("Tuple")) {
            out.write("new Pacioli.GenericType(");
            out.write("\"Tuple\", [");
            String sep = "";
            for (TypeObject arg : type.args) {
                out.write(sep);
                // out.write(arg.compileToJS());
                arg.accept(this);
                sep = ", ";
            }
            out.write("])");
        } else {
            throw new RuntimeException("Parametric Type " + name + " unknown");
        }
    }

    @Override
    public void visit(ScalarUnitVar type) {
        throw new UnsupportedOperationException("Is this used");
        // out.write(type.asJS());
    }

    @Override
    public void visit(TypeVar type) {
        // out.write(type.asJS());
        out.write("Pacioli.typeFromVarName('_" + type.pretty() + "_')");
    }

    @Override
    public void visit(VectorUnitVar type) {
        throw new UnsupportedOperationException("Is this used");
        // out.write(type.asJS());
    }

    @Override
    public void visit(OperatorConst operatorConst) {
        // TODO Auto-generated method stub
        throw new UnsupportedOperationException("Unimplemented method 'visit'");
    }

    @Override
    public void visit(OperatorVar operatorVar) {
        // TODO Auto-generated method stub
        throw new UnsupportedOperationException("Unimplemented method 'visit'");
    }
}
