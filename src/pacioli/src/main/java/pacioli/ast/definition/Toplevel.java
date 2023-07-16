package pacioli.ast.definition;

import pacioli.Location;
import pacioli.ast.Visitor;
import pacioli.ast.expression.ExpressionNode;
import pacioli.types.TypeObject;

public class Toplevel extends AbstractDefinition {

    public ExpressionNode body;

    // Set during type inference
    public TypeObject type;

    public Toplevel(Location location, ExpressionNode body) {
        super(location);
        this.body = body;
    }

    @Override
    public String getName() {
        return null;
    }

    @Override
    public void accept(Visitor visitor) {
        visitor.visit(this);
    }
}
