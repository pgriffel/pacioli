package pacioli.ast.unit;

import pacioli.Location;
import pacioli.ast.Node;
import pacioli.ast.Visitor;

public class UnitPowerNode extends AbstractUnitNode {

    public final UnitNode base;
    public final NumberUnitNode power;

    public UnitPowerNode(Location location, UnitNode base, NumberUnitNode power) {
        super(location);
        this.base = base;
        this.power = power;
    }

    public Node transform(UnitNode base) {
        return new UnitPowerNode(getLocation(), base, power);
    }

    @Override
    public void accept(Visitor visitor) {
        visitor.visit(this);
    }
}
