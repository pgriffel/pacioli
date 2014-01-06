package pacioli.ast.unit;

import java.util.Set;

import pacioli.CompilationSettings;
import pacioli.Dictionary;
import pacioli.Location;
import pacioli.PacioliException;
import pacioli.Printable;
import pacioli.ast.definition.Definition;
import uom.Unit;

public interface UnitNode extends Printable {
	
	public Location getLocation();

	public UnitNode resolved(Dictionary dictionary) throws PacioliException ;
	
	public Set<Definition> uses();
	
	public Unit eval();
	
	public String compileToJS();

	public String compileToMVM(CompilationSettings settings);
}
