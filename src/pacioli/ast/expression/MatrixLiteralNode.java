package pacioli.ast.expression;

import java.io.PrintWriter;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Set;

import mvm.values.matrix.MatrixDimension;

import org.codehaus.jparsec.functors.Pair;

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

public class MatrixLiteralNode extends AbstractExpressionNode {

	private final TypeNode typeNode;
	private final List<Pair<List<String>, ConstNode>> pairs;

	private final List<Integer> rowIndices = new ArrayList<Integer>();
	private final List<Integer> columnIndices = new ArrayList<Integer>();
	private final List<String> values = new ArrayList<String>();

	public MatrixLiteralNode(Location location, TypeNode typeNode,
			List<Pair<List<String>, ConstNode>> pairs) {
		super(location);
		this.typeNode = typeNode;
		this.pairs = pairs;
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
		MatrixLiteralNode node = new MatrixLiteralNode(getLocation(), 
				typeNode.resolved(dictionary, new TypeContext()), pairs);
		node.setIndices(dictionary);
		return node;
	}

	@Override
	public Typing inferTyping(Map<String, PacioliType> context) throws PacioliException {
		PacioliType type = typeNode.eval(false);
		assert (type != null);
		return new Typing(type);
	}

	@Override
	public Set<IdentifierNode> locallyAssignedVariables() {
		throw new RuntimeException("todo");	
	}

	@Override
	public ExpressionNode equivalentFunctionalCode() {
		throw new RuntimeException("todo");	
	}

	@Override
	public Set<Definition> uses() {
		return typeNode.uses();
	}

	@Override
	public String compileToMVM(CompilationSettings settings) {
		throw new RuntimeException("todo");	
	}

	private void setIndices(Dictionary dictionary) throws PacioliException {

		MatrixDimension rowDim = dictionary.compileTimeRowDimension(typeNode);
		MatrixDimension columnDim = dictionary.compileTimeColumnDimension(typeNode);

		// Translate the matrix data from string indexed to integer indexed.
		int rowWidth = rowDim.width();
		int width = rowWidth + columnDim.width();
		for (Pair<List<String>, ConstNode> pair : pairs) {

			int rowPos = rowDim.ElementPos(pair.a.subList(0, rowWidth));
			int columnPos = columnDim.ElementPos(pair.a.subList(rowWidth, width));

			rowIndices.add(rowPos);
			columnIndices.add(columnPos);
			values.add(pair.b.valueString());
		}

	}

	@Override
	public String compileToJS() {

		StringBuilder builder = new StringBuilder();
		String sep = "";
		for (int i=0; i < values.size(); i++) {
			builder.append(sep);
			builder.append("[");
			builder.append(rowIndices.get(i));
			builder.append(",");
			builder.append(columnIndices.get(i));
			builder.append(",");
			builder.append(values.get(i));
			builder.append("]");
			sep = ",";
		}

		return String.format("initialMatrix(%s, [%s])", 
				typeNode.compileToJS(),
				builder.toString());

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
