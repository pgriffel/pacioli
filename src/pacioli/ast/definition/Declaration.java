package pacioli.ast.definition;

import java.io.PrintWriter;
import java.util.HashMap;
import java.util.Set;

import pacioli.CompilationSettings;
import pacioli.Dictionary;
import pacioli.Location;
import pacioli.PacioliFile;
import pacioli.PacioliException;
import pacioli.Program;
import pacioli.TypeContext;
import pacioli.ast.expression.IdentifierNode;
import pacioli.types.PacioliType;
import pacioli.types.ast.TypeNode;

public class Declaration extends AbstractDefinition {

	private final IdentifierNode id;
	private final TypeNode typeNode;
	private TypeNode resolvedTypeNode;
	private PacioliType type;

	public Declaration(Location location, IdentifierNode id, TypeNode typeNode) {
		super(location);
		this.id = id;
		this.typeNode = typeNode;
	}

	@Override
	public void addToProgram(Program program, PacioliFile module) {
		setModule(module);
		program.addDeclaration(this, module);
	}

	@Override
	public String localName() {
		return id.getName();
	}

	public PacioliType getType() {
		assert type != null;
		return type;
	}
	
	@Override
	public void resolve(Dictionary dictionary) throws PacioliException {
		resolvedTypeNode = typeNode.resolved(dictionary, new TypeContext());
		type = resolvedTypeNode.eval(false);
	}

	@Override
	public Set<Definition> uses() {
		return resolvedTypeNode.uses();
	}

	public void desugar() {
		//throw new RuntimeException("todo");
	}

	@Override
	public String compileToMVM(CompilationSettings settings) {
		throw new RuntimeException("todo");
	}

	@Override
	public String compileToJS() {
		
		// Test for type code
		
		return String.format("\n" 
        		+ "// via decl %s\n"
        		+ "\n"
      //  		+ "// u_%s = %s;\n"
        		+ "\n"
        		+ "u_%s = function () {\n"
        		+ "    var args = new Pacioli.Type('tuple', Array.prototype.slice.call(arguments));\n"
        		+ "    var type = %s;\n"
        		+ "    return Pacioli.subs(type.ran(), Pacioli.match(type.dom(), args));\n"
        		+ "}\n"
        		+ "\n"
        		+ "\n",
        		type.toText(),
        		globalName(),
        		//type.compileToJS(new HashSet<TypeVar>()),
                type.compileToJS());	
	}

	@Override
	public String compileToMATLAB() {
		throw new RuntimeException("todo");
	}

	@Override
	public void printText(PrintWriter out) {
		throw new RuntimeException("todo");
	}

}
