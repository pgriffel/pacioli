package pacioli.types.visitors;

import pacioli.types.Substitution;
import pacioli.types.matrix.IndexType;
import pacioli.types.matrix.MatrixType;
import pacioli.types.type.IndexSetVar;
import pacioli.types.type.OperatorVar;
import pacioli.types.type.ParametricType;
import pacioli.types.type.ScalarUnitVar;
import pacioli.types.type.Schema;
import pacioli.types.type.TypeObject;
import pacioli.types.type.TypeVar;
import pacioli.types.type.VectorUnitVar;

public class SubstituteVisitor extends TransformType {

    private Substitution substitution;

    public SubstituteVisitor(Substitution substitution) {
        this.substitution = substitution;
    }

    @Override
    public void visit(Schema type) {
        Substitution reduced = new Substitution(substitution);
        reduced.removeAll(type.variables());
        returnTypeNode(new Schema(type.variables(), type.applySubstitution(reduced), type.conditions()));
    }

    @Override
    public void visit(MatrixType type) {
        returnTypeNode(
                new MatrixType(
                        substitution.apply(type.factor()),
                        (IndexType) typeNodeAccept(type.rowDimension()),
                        substitution.apply(type.rowUnit()),
                        (IndexType) typeNodeAccept(type.columnDimension()),
                        substitution.apply(type.columnUnit())));
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
