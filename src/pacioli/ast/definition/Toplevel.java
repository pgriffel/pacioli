package pacioli.ast.definition;

import java.io.PrintWriter;
import java.util.Map;
import java.util.Set;

import pacioli.CompilationSettings;
import pacioli.Dictionary;
import pacioli.Location;
import pacioli.Module;
import pacioli.Pacioli;
import pacioli.PacioliException;
import pacioli.Program;
import pacioli.Typing;
import pacioli.ValueContext;
import pacioli.ast.expression.ExpressionNode;
import pacioli.types.PacioliType;


public class Toplevel extends AbstractDefinition {
	
	private final ExpressionNode body;
	private ExpressionNode resolvedBody;
    private PacioliType type;

	public Toplevel(Location location, ExpressionNode body) {
		super(location);
		this.body = body;
	}

	@Override
	public void addToProgram(Program program, Module module) {
		setModule(module);
		program.addToplevel(this, module);
	}
	
	@Override
	public String globalName() {
		return null;
	}
	
	@Override
	public String localName() {
		return null;
	}

	public PacioliType getType() {
		assert(type != null);
		return type;
	}

	@Override
	public void printText(PrintWriter out) {
		body.printText(out);
	}
	
	@Override
	public void resolve(Dictionary dictionary) throws PacioliException {
		resolvedBody = body.resolved(dictionary, new ValueContext());
	}
	
	public PacioliType inferType(Dictionary dictionary, Map<String, PacioliType> context) throws PacioliException {
        Typing typing = resolvedBody.inferTyping(context);
        Pacioli.log3("\n%s", typing.toText());
        type = typing.solve().simplify();
        return type;
    }
	
	@Override
	public Set<Definition> uses() {
		assert resolvedBody != null;
		return resolvedBody.uses();
	}

	@Override
	public String compileToMVM(CompilationSettings settings) {
		return resolvedBody.compileToMVM(settings);
	}

	@Override
	public String compileToJS() {
		return resolvedBody.compileToJS();
	}

	@Override
	public String compileToMATLAB() {
		throw new RuntimeException("todo");
	}

}
