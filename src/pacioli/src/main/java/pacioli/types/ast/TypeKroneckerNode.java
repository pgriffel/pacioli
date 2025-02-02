package pacioli.types.ast;

import pacioli.ast.Visitor;
import pacioli.compiler.Location;

public class TypeKroneckerNode extends AbstractTypeNode {

    public final TypeNode left;
    public final TypeNode right;

    public TypeKroneckerNode(Location location, TypeNode left, TypeNode right) {
        super(location);
        this.left = left;
        this.right = right;
    }

    public TypeKroneckerNode transform(TypeNode left, TypeNode right) {
        return new TypeKroneckerNode(location(), left, right);
    }

    @Override
    public void accept(Visitor visitor) {
        visitor.visit(this);
    }
}
