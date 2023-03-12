package pacioli.types;

import pacioli.types.matrix.IndexList;
import pacioli.types.matrix.IndexType;
import pacioli.types.matrix.MatrixType;

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
}
