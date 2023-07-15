package pacioli.ast.unit;

import pacioli.Location;
import pacioli.ast.AbstractNode;

public abstract class AbstractUnitNode extends AbstractNode implements UnitNode {

    public AbstractUnitNode(Location location) {
        super(location);
    }
}
