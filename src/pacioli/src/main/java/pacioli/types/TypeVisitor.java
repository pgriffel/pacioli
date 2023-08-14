package pacioli.types;

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
import pacioli.types.type.TypeVar;
import pacioli.types.type.VectorUnitVar;

public interface TypeVisitor {

    void visit(FunctionType type);

    void visit(Schema type);

    void visit(IndexList type);

    void visit(IndexType type);

    void visit(MatrixType type);

    void visit(IndexSetVar type);

    void visit(ParametricType type);

    void visit(ScalarUnitVar type);

    void visit(TypeVar type);

    void visit(VectorUnitVar type);

    void visit(OperatorConst operatorConst);

    void visit(OperatorVar operatorVar);
}
