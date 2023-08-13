package pacioli.types.ast;

import pacioli.ast.Node;
import pacioli.ast.Visitor;
import pacioli.compiler.Location;

public class TypeMultiplyNode extends AbstractTypeNode {

    public final TypeNode left;
    public final TypeNode right;

    public TypeMultiplyNode(Location location, TypeNode left, TypeNode right) {
        super(location);
        this.left = left;
        this.right = right;
    }

    public Node transform(TypeNode left, TypeNode right) {
        return new TypeMultiplyNode(location(), left, right);
    }

    @Override
    public void accept(Visitor visitor) {
        visitor.visit(this);
    }
}
