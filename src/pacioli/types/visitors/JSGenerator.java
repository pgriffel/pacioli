package pacioli.types.visitors;

import pacioli.Printer;
import pacioli.types.FunctionType;
import pacioli.types.IndexSetVar;
import pacioli.types.PacioliType;
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

public class JSGenerator implements TypeVisitor {

    Printer out;
    
    public JSGenerator(Printer out) {
        this.out = out;
    }
    
    @Override
    public void visit(FunctionType type) {
        out.write("new Pacioli.Type('function', [");
        type.domain.accept(this);
        out.write(", ");
        type.range.accept(this);
        out.write("])");
    }

    @Override
    public void visit(Schema type) {
        type.type.accept(this);
    }

    @Override
    public void visit(IndexList type) {
        out.write("new Pacioli.Type('coordinates', [");
        String pre = "";
        for (int i = 0; i < type.getIndexSets().size(); i++) {
            out.write(pre);
            out.write("Pacioli.fetchIndex('");
            out.write(type.getIndexSets().get(i).home);
            out.write("_");
            out.write(type.getIndexSets().get(i).name);
            out.write("')");
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
        
        out.write("Pacioli.createMatrixType(");
        out.write(TypeBase.compileUnitToJS(type.factor));
        out.write(", ");
        //out.write(type.rowDimension.compileToJS());
        type.rowDimension.accept(this);
        if (!type.rowDimension.isVar())
            out.write(".param");
        out.write(", ");
        if (type.rowDimension.isVar() || type.rowDimension.width() > 0) {
            out.write(TypeBase.compileUnitToJS(type.rowUnit));
        } else {
            out.write("Pacioli.ONE");
        }
        out.write(", ");
        //out.write(type.columnDimension.compileToJS());
        type.columnDimension.accept(this);
        if (!type.columnDimension.isVar())
            out.write(".param");
        out.write(", ");
        if (type.columnDimension.isVar() || type.columnDimension.width() > 0) {
            out.write(TypeBase.compileUnitToJS(type.columnUnit));
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
        String name = type.name;
        if (name.equals("Boole")) {
            out.write("new Pacioli.Type('boole')");
        } else if (name.equals("String")) {
            out.write("new Pacioli.Type('string')");
        } else if (name.equals("Report")) {
            out.write("new Pacioli.Type('report')");
        } else if (name.equals("Void")) {
            out.write("null");
        } else if (name.equals("Index")) {
            out.write("new Pacioli.Type('coordinate', ");
            out.write("new Pacioli.Coordinates(null, [");
            String sep = "";
            for (PacioliType arg : type.args) {
                out.write(sep);
                //out.write(arg.compileToJS());
                arg.accept(this);
                sep = ", ";
            }
            out.write("]))");
        } else if (name.equals("List")) {

            out.write("new Pacioli.Type(");
            out.write("\"list\", ");
            String sep = "";
            for (PacioliType arg : type.args) {
                out.write(sep);
                //out.write(arg.compileToJS());
                arg.accept(this);
                sep = ", ";
            }
            out.write(")");
        } else if (name.equals("Ref")) {

            out.write("new Pacioli.Type(");
            out.write("\"reference\", ");
            String sep = "";
            for (PacioliType arg : type.args) {
                out.write(sep);
                //out.write(arg.compileToJS());
                arg.accept(this);
                sep = ", ";
            }
            out.write(")");
        } else if (name.equals("Tuple")) {
            out.write("new Pacioli.Type(");
            out.write("\"tuple\", [");
            String sep = "";
            for (PacioliType arg : type.args) {
                out.write(sep);
                //out.write(arg.compileToJS());
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
        out.write(type.compileToJS());
    }

    @Override
    public void visit(TypeVar type) {
        out.write(type.compileToJS());
    }

    @Override
    public void visit(VectorUnitVar type) {
        out.write(type.compileToJS());
    }
}
