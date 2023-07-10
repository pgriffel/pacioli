package pacioli.types.visitors;

import pacioli.Substitution;
import pacioli.types.IndexSetVar;
import pacioli.types.OperatorVar;
import pacioli.types.ParametricType;
import pacioli.types.ScalarUnitVar;
import pacioli.types.Schema;
import pacioli.types.TypeObject;
import pacioli.types.TypeVar;
import pacioli.types.VectorUnitVar;
import pacioli.types.matrix.IndexType;
import pacioli.types.matrix.MatrixType;

public class SubstituteVisitor extends TransformType {

    private Substitution substitution;

    public SubstituteVisitor(Substitution substitution) {
        this.substitution = substitution;
    }

    @Override
    public void visit(Schema type) {
        Substitution reduced = new Substitution(substitution);
        reduced.removeAll(type.variables);
        returnTypeNode(new Schema(type.variables, type.applySubstitution(reduced)));
    }

    @Override
    public void visit(MatrixType type) {
        returnTypeNode(
                new MatrixType(
                        substitution.apply(type.factor),
                        (IndexType) typeNodeAccept(type.rowDimension),
                        substitution.apply(type.rowUnit),
                        (IndexType) typeNodeAccept(type.columnDimension),
                        substitution.apply(type.columnUnit)));
    }

    @Override
    public void visit(IndexSetVar type) {
        returnTypeNode(substitution.apply((TypeObject) type));
    }

    @Override
    public void visit(TypeVar type) {
        returnTypeNode(substitution.apply((TypeObject) type));
    }

    @Override
    public void visit(OperatorVar type) {
        TypeObject substituted = substitution.apply((TypeObject) type);
        if (substituted instanceof ParametricType) {
            returnTypeNode(substitution.apply((TypeObject) type));
        } else {
            returnTypeNode(substituted);
        }
    }

    @Override
    public void visit(ScalarUnitVar type) {
        returnTypeNode(substitution.apply((TypeObject) type));
    }

    @Override
    public void visit(VectorUnitVar type) {
        returnTypeNode(substitution.apply((TypeObject) type));
    }

}
