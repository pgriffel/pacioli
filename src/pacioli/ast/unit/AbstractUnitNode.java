package pacioli.ast.unit;

import pacioli.AbstractPrintable;
import pacioli.Location;

public abstract class AbstractUnitNode extends AbstractPrintable implements UnitNode {
    
	private final Location location;

    public AbstractUnitNode(Location location) {
        this.location = location;
    }
    
    @Override
    public Location getLocation() {
        return location;
    }
}
