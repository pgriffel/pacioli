package pacioli.ast.definition;

import java.io.PrintWriter;
import java.util.Set;

import pacioli.CompilationSettings;
import pacioli.Dictionary;
import pacioli.Location;
import pacioli.PacioliFile;
import pacioli.PacioliException;
import pacioli.Program;
import pacioli.ast.expression.IdentifierNode;
import pacioli.ast.unit.UnitNode;

public class AliasDefinition extends AbstractDefinition {

	private final IdentifierNode id;
	private final UnitNode unit;
	private UnitNode resolvedUnit;

	public AliasDefinition(Location location, IdentifierNode id, UnitNode unit) {
		super(location);
		this.id = id;
		this.unit = unit;
	}

	@Override
	public void addToProgram(Program program, PacioliFile module) {
		setModule(module);
		program.addAliasDefinition(this, module);
	}
	
	@Override
	public String localName() {
		return id.getName();
	}

	public UnitNode getBody() {
		assert(resolvedUnit != null);
		return resolvedUnit;
	}

	@Override
	public void printText(PrintWriter out) {
		throw new RuntimeException("todo");
	}

	@Override
	public void resolve(Dictionary dictionary) throws PacioliException {
		resolvedUnit = unit.resolved(dictionary);
	}

	@Override
	public Set<Definition> uses() {
		assert resolvedUnit != null;
		return resolvedUnit.uses();
	}

	@Override
	public String compileToMVM(CompilationSettings settings) {
		throw new RuntimeException("todo");
	}

	@Override
	public String compileToJS() {
		throw new RuntimeException("todo");	
	}

	@Override
	public String compileToMATLAB() {
		throw new RuntimeException("todo");	
	}

}
