package pacioli.types.visitors;

import pacioli.types.FunctionType;
import pacioli.types.IndexSetVar;
import pacioli.types.OperatorConst;
import pacioli.types.OperatorVar;
import pacioli.types.TypeObject;
import pacioli.types.ParametricType;
import pacioli.types.ScalarUnitVar;
import pacioli.types.Schema;
import pacioli.types.TypeVar;
import pacioli.types.TypeVisitor;
import pacioli.types.VectorUnitVar;
import pacioli.types.matrix.IndexList;
import pacioli.types.matrix.IndexType;
import pacioli.types.matrix.MatrixType;

public class VisitType implements TypeVisitor {

    public VisitType() {
    }

    @Override
    public void visit(FunctionType type) {
        type.domain().accept(this);
        type.range().accept(this);
    }

    @Override
    public void visit(Schema type) {
        type.type().accept(this);
    }

    @Override
    public void visit(IndexList type) {
    }

    @Override
    public void visit(IndexType type) {
        type.indexSet().accept(this);
    }

    @Override
    public void visit(MatrixType type) {
        // type.factor.accept(this);
        type.rowDimension().accept(this);
        // type.rowUnit.accept(this);
        type.columnDimension().accept(this);
        // type.columnUnit.accept(this);
    }

    @Override
    public void visit(IndexSetVar type) {
    }

    @Override
    public void visit(ParametricType type) {
        type.op().accept(this);
        for (TypeObject arg : type.args()) {
            arg.accept(this);
        }
    }

    @Override
    public void visit(TypeVar type) {
    }

    @Override
    public void visit(ScalarUnitVar type) {
    }

    @Override
    public void visit(VectorUnitVar type) {
    }

    @Override
    public void visit(OperatorConst operatorConst) {
    }

    @Override
    public void visit(OperatorVar operatorVar) {
    }

}
