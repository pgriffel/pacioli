package pacioli.ast.unit;

import java.util.Set;

import pacioli.Dictionary;
import pacioli.Location;
import pacioli.PacioliException;
import pacioli.Printable;
import pacioli.ast.definition.Definition;
import uom.Unit;

public interface UnitNode extends Printable {
	
	public Location getLocation();
	public String compileToJS();
	public Unit eval();
	public UnitNode resolved(Dictionary dictionary) throws PacioliException ;
	public Set<Definition> uses();
}
