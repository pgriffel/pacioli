package pacioli.ast.definition;

import java.io.PrintWriter;
import java.util.List;
import java.util.Set;

import pacioli.CompilationSettings;
import pacioli.Dictionary;
import pacioli.Location;
import pacioli.Pacioli;
import pacioli.PacioliException;
import pacioli.PacioliFile;
import pacioli.Program;
import pacioli.ast.expression.IdentifierNode;
import pacioli.types.ast.TypeNode;

public class MultiDeclaration implements Definition {

	private Location location;
	private List<IdentifierNode> ids;
	private TypeNode node;

	public MultiDeclaration(Location location, List<IdentifierNode> ids, TypeNode node) {
		this.location = location;
		this.ids = ids;
		this.node = node;
	}

	@Override
	public Location getLocation() {
		return location;
	}

	@Override
	public Set<Definition> uses() {
		throw new RuntimeException("Cannot do that on a multi declaration. Can only addToProgram");
	}

	@Override
	public String compileToMVM(CompilationSettings settings) {
		throw new RuntimeException("Cannot do that on a multi declaration. Can only addToProgram");
	}

	@Override
	public String compileToJS() {
		throw new RuntimeException("Cannot do that on a multi declaration. Can only addToProgram");
	}

	@Override
	public String compileToMATLAB() {
		throw new RuntimeException("Cannot do that on a multi declaration. Can only addToProgram");
	}

	@Override
	public String toText() {
		throw new RuntimeException("Cannot do that on a multi declaration. Can only addToProgram");
	}

	@Override
	public void printText(PrintWriter out) {
		throw new RuntimeException("Cannot do that on a multi declaration. Can only addToProgram");
	}

	@Override
	public String localName() {
		throw new RuntimeException("Cannot do that on a multi declaration. Can only addToProgram");
	}

	@Override
	public String globalName() {
		throw new RuntimeException("Cannot do that on a multi declaration. Can only addToProgram");
	}

	@Override
	public void setModule(PacioliFile module) {
		throw new RuntimeException("Cannot do that on a multi declaration. Can only addToProgram");
	}

	@Override
	public PacioliFile getModule() {
		throw new RuntimeException("Cannot do that on a multi declaration. Can only addToProgram");
	}

	@Override
	public void addToProgram(Program program, PacioliFile module) {
		for (IdentifierNode id: ids) {
			Declaration declaration = new Declaration(location, id, node);
			declaration.addToProgram(program, module);
		}

	}

	@Override
	public void resolve(Dictionary dictionary) throws PacioliException {
		throw new RuntimeException("Cannot do that on a multi declaration. Can only addToProgram");
	}

}
