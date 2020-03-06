package pacioli.ast.expression;

import pacioli.Location;
import pacioli.ast.Visitor;

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
    public String compileToMATLAB() {
        return toText();
    }

    @Override
    public void accept(Visitor visitor) {
        visitor.visit(this);
    }

}
