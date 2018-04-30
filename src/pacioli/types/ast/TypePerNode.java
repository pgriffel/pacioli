package pacioli.types.ast;

import java.io.PrintWriter;
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
    public void printText(PrintWriter out) {
        out.format("%s per %s", left.toText(), right.toText());
    }

    @Override
    public String compileToJS(boolean boxed) {
        String leftJS = left.compileToJS(false);
        String rightJS = right.compileToJS(false);
        return leftJS + ".per(" + rightJS + ")";
    }

    @Override
    public void accept(Visitor visitor) {
        visitor.visit(this);
    }
}
