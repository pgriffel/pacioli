package pacioli.ast.unit;

import pacioli.Location;
import pacioli.Printable;
import uom.Unit;

public interface UnitNode extends Printable {
	
	public Location getLocation();
	public String compileToJS();
	public Unit eval();
	
}
