package pacioli.ast.unit;

import java.io.PrintWriter;
import java.util.HashSet;
import java.util.Set;

import pacioli.CompilationSettings;
import pacioli.Dictionary;
import pacioli.Location;
import pacioli.PacioliException;
import pacioli.ast.definition.Definition;
import pacioli.types.matrix.StringBase;
import uom.Unit;

public class UnitIdentifierNode extends AbstractUnitNode {

	private final String name;
	private final String prefix;
	private final Definition definition;

	public UnitIdentifierNode(Location location, String name) {
		super(location);
		this.name = name;
		this.prefix = null;
		this.definition = null;
	}

	public UnitIdentifierNode(Location location, String prefix, String name) {
		super(location);
		this.prefix = prefix;
		this.name = name;
		this.definition = null;
	}

	private UnitIdentifierNode(Location location, String prefix, String name, Definition definition) {
		super(location);
		this.prefix = prefix;
		this.name = name;
		this.definition = definition;
	}

	@Override
	public void printText(PrintWriter out) {
		if (prefix == null) {
			out.print(name);
		} else {
			out.print(prefix);
			out.print(":");
			out.print(name);
		}
	}

	@Override
	public UnitNode resolved(Dictionary dictionary) throws PacioliException {
		if (dictionary.containsUnitDefinition(name)) {
			return new UnitIdentifierNode(getLocation(), prefix, name, dictionary.getUnitDefinition(name));
		} else {
			throw new PacioliException(getLocation(), "Unit '" + name + "' unknown");
		}
	}
	
	@Override
	public Unit eval() {
		if (prefix == null) {
			return new StringBase(name);
		} else {
			return new StringBase(prefix, name);
		}
	}

	@Override
	public String compileToJS() {
		if (prefix == null) {
			return "new PowerProduct('" + name + "')"; 
		} else {
			return "new PowerProduct('" + prefix + "$" + name + "')";
		}
	}

	@Override
	public Set<Definition> uses() {
		assert definition != null;
        Set<Definition> set = new HashSet<Definition>();
        set.add(definition);
        return set;
	}

	@Override
	public String compileToMVM(CompilationSettings settings) {
		if (prefix == null) {
			return "unit(\"" + name + "\")"; 
		} else {
			return "scaled_unit(\"" + prefix + "\", \"" + name + "\")";
		}
	}

}