package pacioli.types.ast;

import pacioli.Location;
import pacioli.ast.Node;
import pacioli.ast.Visitor;

public class TypePerNode extends AbstractTypeNode {

    public final TypeNode left;
    public final TypeNode right;

    public TypePerNode(Location location, TypeNode left, TypeNode right) {
        super(location);
        this.left = left;
        this.right = right;
    }

    public Node transform(TypeNode left, TypeNode right) {
        return new TypePerNode(getLocation(), left, right);
    }

    @Override
    public void accept(Visitor visitor) {
        visitor.visit(this);
    }
}
