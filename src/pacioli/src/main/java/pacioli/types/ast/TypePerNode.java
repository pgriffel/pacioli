package pacioli.types.ast;

import pacioli.ast.AbstractNode;
import pacioli.ast.Visitor;
import pacioli.compiler.Location;

public class TypePerNode extends AbstractNode implements TypeNode {

    public final TypeNode left;
    public final TypeNode right;

    public TypePerNode(Location location, TypeNode left, TypeNode right) {
        super(location);
        this.left = left;
        this.right = right;
    }

    public TypePerNode transform(TypeNode left, TypeNode right) {
        return new TypePerNode(location(), left, right);
    }

    @Override
    public void accept(Visitor visitor) {
        visitor.visit(this);
    }
}
