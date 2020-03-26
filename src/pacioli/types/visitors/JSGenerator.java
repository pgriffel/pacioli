package pacioli.types.visitors;

import java.util.LinkedHashSet;
import java.util.Set;
import java.util.Stack;

import pacioli.Pacioli;
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
import pacioli.types.Var;
import pacioli.types.VectorUnitVar;
import pacioli.types.matrix.IndexList;
import pacioli.types.matrix.IndexType;
import pacioli.types.matrix.MatrixType;
import uom.Unit;

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
        out.write(type.rowDimension.compileToJS());
        if (!type.rowDimension.isVar())
            out.write(".param");
        out.write(", ");
        if (type.rowDimension.isVar() || type.rowDimension.width() > 0) {
            out.write(TypeBase.compileUnitToJS(type.rowUnit));
        } else {
            out.write("Pacioli.ONE");
        }
        out.write(", ");
        out.write(type.columnDimension.compileToJS());
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

    }

    @Override
    public void visit(ParametricType type) {

    }

    @Override
    public void visit(ScalarUnitVar type) {

    }

    @Override
    public void visit(TypeVar type) {

    }

    @Override
    public void visit(VectorUnitVar type) {

    }

}
