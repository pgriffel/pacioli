package pacioli.ast.unit;

import pacioli.ast.Node;
import uom.DimensionedNumber;

public interface UnitNode extends Node {
	
	public DimensionedNumber evalUnit();
	
}
