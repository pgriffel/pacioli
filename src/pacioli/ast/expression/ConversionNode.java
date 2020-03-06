package pacioli.ast.expression;

import java.io.PrintWriter;
import pacioli.Location;
import pacioli.ast.Node;
import pacioli.ast.Visitor;
import pacioli.types.PacioliType;
import pacioli.types.ast.TypeNode;

public class ConversionNode extends AbstractExpressionNode {

    public final TypeNode typeNode;

    private MatrixTypeNode bang;
    public PacioliType type;

    public ConversionNode(Location location, TypeNode typeNode) {
        super(location);
        this.typeNode = typeNode;
    }

    public ConversionNode(ConversionNode old) {
        super(old.getLocation());
        this.typeNode = old.typeNode;
    }

    private ConversionNode(Location location, TypeNode typeNode, MatrixTypeNode bang, PacioliType type) {
        super(location);
        this.typeNode = typeNode;
        this.bang = bang;
        this.type = type;
    }

    public Node transform(TypeNode typeNode) {
        return new ConversionNode(getLocation(), typeNode, bang, type);
    }

    @Override
    public String compileToMATLAB() {
        throw new RuntimeException("Not implemented");
    }

    @Override
    public void printText(PrintWriter out) {
        out.print("<conversion of type ");
        typeNode.printText(out);
        out.print(">");
    }

    @Override
    public void accept(Visitor visitor) {
        visitor.visit(this);
    }
}
