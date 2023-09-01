package pacioli.types.visitors;

import pacioli.compiler.Printer;
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
import pacioli.types.type.TypeObject;
import pacioli.types.type.TypePredicate;
import pacioli.types.type.TypeVar;
import pacioli.types.type.VectorUnitVar;

public class JSGenerator implements TypeVisitor {

    Printer out;

    public JSGenerator(Printer out) {
        this.out = out;
    }

    @Override
    public void visit(FunctionType type) {
        out.write("new Pacioli.FunctionType(");
        type.domain().accept(this);
        out.write(", ");
        type.range().accept(this);
        out.write(")");
    }

    @Override
    public void visit(Schema type) {
        type.type().accept(this);
    }

    @Override
    public void visit(IndexList type) {
        out.write("new Pacioli.IndexType([");
        String pre = "";
        for (int i = 0; i < type.indexSets().size(); i++) {
            out.write(pre);
            // out.write("Pacioli.fetchIndex('");
            out.write("'");
            out.write(type.indexSets().get(i).home());
            out.write("_");
            out.write(type.indexSets().get(i).name());
            // out.write("')");
            out.write("'");
            pre = ", ";
        }
        out.write("])");
    }

    @Override
    public void visit(IndexType type) {
        type.indexSet().accept(this);
    }

    @Override
    public void visit(MatrixType type) {

        out.write("Pacioli.createMatrixType(");
        out.write(TypeBase.compileUnitToJS(type.factor()));
        out.write(", ");
        // out.write(type.rowDimension.compileToJS());
        type.rowDimension().accept(this);
        // if (!type.rowDimension.isVar()) out.write(".param");
        out.write(", ");
        if (type.rowDimension().isVar() || type.rowDimension().width() > 0) {
            out.write(TypeBase.compileUnitToJS(type.rowUnit()));
        } else {
            out.write("Pacioli.ONE");
        }
        out.write(", ");
        // out.write(type.columnDimension.compileToJS());
        type.columnDimension().accept(this);
        // if (!type.columnDimension.isVar()) out.write(".param");
        out.write(", ");
        if (type.columnDimension().isVar() || type.columnDimension().width() > 0) {
            out.write(TypeBase.compileUnitToJS(type.columnUnit()));
        } else {
            out.write("Pacioli.ONE");
        }
        out.write(")");
    }

    @Override
    public void visit(IndexSetVar type) {
        out.write("'_" + type.pretty() + "_'");
    }

    @Override
    public void visit(ParametricType type) {
        String name = type.name();
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
            for (TypeObject arg : type.args()) {
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
            for (TypeObject arg : type.args()) {
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
            for (TypeObject arg : type.args()) {
                out.write(sep);
                // out.write(arg.compileToJS());
                arg.accept(this);
                sep = ", ";
            }
            out.write("])");
        } else if (name.equals("Maybe")) {

            out.write("new Pacioli.GenericType(");
            out.write("'Maybe', [");
            String sep = "";
            for (TypeObject arg : type.args()) {
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
            for (TypeObject arg : type.args()) {
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
            for (TypeObject arg : type.args()) {
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
        out.write(type.asJS());
    }

    @Override
    public void visit(TypeVar type) {
        // out.write(type.asJS());
        out.write("Pacioli.typeFromVarName('_" + type.pretty() + "_')");
    }

    @Override
    public void visit(VectorUnitVar type) {
        out.write(type.asJS());
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

    @Override
    public void visit(TypePredicate typePredicate) {
        // TODO Auto-generated method stub
        throw new UnsupportedOperationException("Unimplemented method 'visit'");
    }

    @Override
    public void visit(Quant quant) {
        // TODO Auto-generated method stub
        throw new UnsupportedOperationException("Unimplemented method 'visit'");
    }
}
