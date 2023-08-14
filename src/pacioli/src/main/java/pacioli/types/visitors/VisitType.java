package pacioli.types.visitors;

import pacioli.types.TypeVisitor;
import pacioli.types.matrix.IndexList;
import pacioli.types.matrix.IndexType;
import pacioli.types.matrix.MatrixType;
import pacioli.types.type.FunctionType;
import pacioli.types.type.IndexSetVar;
import pacioli.types.type.OperatorConst;
import pacioli.types.type.OperatorVar;
import pacioli.types.type.ParametricType;
import pacioli.types.type.ScalarUnitVar;
import pacioli.types.type.Schema;
import pacioli.types.type.TypeObject;
import pacioli.types.type.TypeVar;
import pacioli.types.type.VectorUnitVar;

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
