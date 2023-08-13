package pacioli.ast.unit;

import pacioli.ast.AbstractNode;
import pacioli.compiler.Location;

public abstract class AbstractUnitNode extends AbstractNode implements UnitNode {

    public AbstractUnitNode(Location location) {
        super(location);
    }
}
