package pacioli.ast.unit;

import pacioli.ast.AbstractNode;
import pacioli.ast.Visitor;
import pacioli.compiler.Location;

public class NumberUnitNode extends AbstractNode implements UnitNode {

    public final String number;

    public NumberUnitNode(String number, Location location) {
        super(location);
        this.number = number;
    }

    @Override
    public void accept(Visitor visitor) {
        visitor.visit(this);
    }
}
