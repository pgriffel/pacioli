package pacioli.ast.expression;

import java.io.PrintWriter;
import java.util.LinkedHashSet;
import java.util.Map;
import java.util.Set;

import pacioli.CompilationSettings;
import pacioli.Dictionary;
import pacioli.Location;
import pacioli.PacioliException;
import pacioli.TypeContext;
import pacioli.Typing;
import pacioli.ValueContext;
import pacioli.ast.definition.Definition;
import pacioli.types.PacioliType;
import pacioli.types.ast.TypeNode;

public class ProjectionNode extends AbstractExpressionNode {

	private final TypeNode typeNode;
	
	public ProjectionNode(Location location, TypeNode typeNode) {
		super(location);
		this.typeNode = typeNode;
	}

	@Override
	public ExpressionNode transformCalls(CallMap map) {
		return this;
	}

	@Override
	public ExpressionNode transformIds(IdMap map) {
		return this;
	}

	@Override
	public ExpressionNode transformSequences(SequenceMap map) {
		return this;
	}

	@Override
	public ExpressionNode resolved(Dictionary dictionary,
			ValueContext context) throws PacioliException {
		return new ProjectionNode(getLocation(), typeNode.resolved(dictionary, new TypeContext()));
	}

	@Override
	public Typing inferTyping(Map<String, PacioliType> context) throws PacioliException {
        return new Typing(typeNode.eval(false));
	}

	@Override
	public Set<IdentifierNode> locallyAssignedVariables() {
		return new LinkedHashSet<IdentifierNode>();
	}

	@Override
	public ExpressionNode desugar() {
		return this;
	}

	@Override
	public Set<Definition> uses() {
		return typeNode.uses();
	}

	@Override
	public String compileToMVM(CompilationSettings settings) {
		return String.format("matrix_constructor(\"projection\", %s)", typeNode.compileToMVM(settings));
	}

	@Override
	public String compileToJS() {
		return String.format("projectionMatrix(%s)", typeNode.compileToJS());
	}

	@Override
	public String compileToMATLAB() {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	public void printText(PrintWriter out) {
		out.print("<projection of type ");
		typeNode.printText(out);
		out.print(">");
	}
}
