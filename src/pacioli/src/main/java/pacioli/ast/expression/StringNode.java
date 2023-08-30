package pacioli.ast.expression;

import pacioli.ast.Visitor;
import pacioli.compiler.Location;

public class StringNode extends AbstractExpressionNode {

    private final String value;

    public StringNode(String value, Location location) {
        super(location);
        this.value = value;
    }

    public String valueString() {
        return value;
    }

    @Override
    public void accept(Visitor visitor) {
        visitor.visit(this);
    }

}
