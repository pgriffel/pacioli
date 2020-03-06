package pacioli.types.ast;

import java.io.PrintWriter;
import pacioli.Location;
import pacioli.ast.Node;
import pacioli.ast.Visitor;

public class TypeKroneckerNode extends AbstractTypeNode {

    public final TypeNode left;
    public final TypeNode right;

    public TypeKroneckerNode(Location location, TypeNode left, TypeNode right) {
        super(location);
        this.left = left;
        this.right = right;
    }

    public Node transform(TypeNode left, TypeNode right) {
        return new TypeKroneckerNode(getLocation(), left, right);
    }

    @Override
    public void printText(PrintWriter out) {
        out.format("%s%s%s", left.toText(), "%", right.toText());
    }

    @Override
    public void accept(Visitor visitor) {
        visitor.visit(this);
    }
}
