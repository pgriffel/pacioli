package pacioli.types.visitors;

import pacioli.types.matrix.MatrixType;

public class MatrixNormalizeVisitor extends TransformType {

    public MatrixNormalizeVisitor() {
    }

    @Override
    public void visit(MatrixType type) {
        returnTypeNode(type.properIndexSets());
    }

}
