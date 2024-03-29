package pacioli.ast.expression;

import mvm.values.matrix.MatrixDimension;
import pacioli.ast.Node;
import pacioli.ast.Visitor;
import pacioli.compiler.Location;
import pacioli.compiler.PacioliException;
import pacioli.types.ast.TypeNode;
import pacioli.types.matrix.MatrixType;
import pacioli.types.type.TypeObject;

public class ConversionNode extends AbstractExpressionNode {

    // Set during contruction
    public final TypeNode typeNode;

    // Set during resolve. Needed to determine indices during code generation.
    public MatrixDimension rowDim;
    public MatrixDimension columnDim;

    // Is this used?
    private MatrixTypeNode bang;
    public TypeObject type;

    public ConversionNode(Location location, TypeNode typeNode) {
        super(location);
        this.typeNode = typeNode;
    }

    public ConversionNode(ConversionNode old) {
        super(old.location());
        this.typeNode = old.typeNode;
    }

    private ConversionNode(Location location, TypeNode typeNode, MatrixTypeNode bang, TypeObject type) {
        super(location);
        this.typeNode = typeNode;
        this.bang = bang;
        this.type = type;
    }

    public Node transform(TypeNode typeNode) {
        ConversionNode copy = new ConversionNode(location(), typeNode, bang, type);
        copy.rowDim = rowDim;
        copy.columnDim = columnDim;
        return copy;
    }

    public MatrixType evalType() throws PacioliException {
        TypeObject type = typeNode.evalType();
        if (type instanceof MatrixType) {
            return (MatrixType) type;
        } else {
            throw new PacioliException(typeNode.location(), "Expected a matrix type");
        }
    }

    @Override
    public void accept(Visitor visitor) {
        visitor.visit(this);
    }
}
