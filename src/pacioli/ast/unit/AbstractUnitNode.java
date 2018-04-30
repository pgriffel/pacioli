package pacioli.ast.unit;

import pacioli.Location;
import pacioli.ast.AbstractNode;
import pacioli.visitors.UnitEvaluator;
import uom.DimensionedNumber;

public abstract class AbstractUnitNode extends AbstractNode implements UnitNode {
    
    public AbstractUnitNode(Location location) {
    	super(location);
    }
    
    @Override
    public DimensionedNumber evalUnit() {
    	UnitEvaluator visitor = new UnitEvaluator();
		return visitor.unitAccept(this);
    }
}
