package pacioli.ast.expression;

import java.io.PrintWriter;
import java.util.Map;
import java.util.Set;

import pacioli.CompilationSettings;
import pacioli.Dictionary;
import pacioli.Location;
import pacioli.PacioliException;
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
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	public ExpressionNode transformIds(IdMap map) {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	public ExpressionNode transformSequences(SequenceMap map) {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	public ExpressionNode resolved(Dictionary dictionary,
			ValueContext context) throws PacioliException {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	public Typing inferTyping(Map<String, PacioliType> context) throws PacioliException {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	public Set<IdentifierNode> locallyAssignedVariables() {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	public ExpressionNode equivalentFunctionalCode() {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	public Set<Definition> uses() {
		// TODO Auto-generated method stub
		return typeNode.uses();
	}

	@Override
	public String compileToMVM(CompilationSettings settings) {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	public String compileToJS() {
		// TODO Auto-generated method stub
		return null;
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
