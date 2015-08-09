package pacioli.ast.expression;

import java.io.PrintWriter;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;

import mvm.values.matrix.MatrixDimension;

import org.codehaus.jparsec.functors.Pair;

import pacioli.CompilationSettings;
import pacioli.Dictionary;
import pacioli.Location;
import pacioli.Pacioli;
import pacioli.PacioliFile;
import pacioli.PacioliException;
import pacioli.TypeContext;
import pacioli.Typing;
import pacioli.ValueContext;
import pacioli.ast.definition.Definition;
import pacioli.ast.definition.ValueDefinition;
import pacioli.types.PacioliType;
import pacioli.types.ast.TypeNode;

public class MatrixLiteralNode extends AbstractExpressionNode {

	private final TypeNode typeNode;
	private final List<Pair<List<String>, String>> pairs;
	
	private MatrixDimension rowDim;
	private MatrixDimension columnDim;

	private final List<Integer> rowIndices = new ArrayList<Integer>();
	private final List<Integer> columnIndices = new ArrayList<Integer>();
	private final List<String> values = new ArrayList<String>();

	public MatrixLiteralNode(Location location, TypeNode typeNode,
			List<Pair<List<String>, String>> pairs) {
		super(location);
		this.typeNode = typeNode;
		this.pairs = pairs;
		this.rowDim = null;
        this.columnDim = null;
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
		PacioliType type = typeNode.eval(true);
		assert (type != null);
		return new Typing(type);
	}

	@Override
	public Set<IdentifierNode> locallyAssignedVariables() {
		throw new RuntimeException("todo");	
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

		StringBuilder builder = new StringBuilder();
                for (int i=0; i < values.size(); i++) {
                	builder.append(rowIndices.get(i));
			builder.append(" ");
			builder.append(columnIndices.get(i));
			builder.append(" \"");
			builder.append(values.get(i));
			builder.append("\", ");
		}
		return String.format("literal_matrix(%s, %s)",
				typeNode.compileToMVM(settings),
				builder.toString());
//		
//		return String.format("initialMatrix(%s, [%s])", 
//				typeNode.compileToJS(),
//				builder.toString());
//        return String.format("\nstorelit \"%s\" %s %s;\n", globalName(), bangBody.compileToMVM(settings), outputStream.toString());
	}

	private void setIndices(Dictionary dictionary) throws PacioliException {

		rowDim = dictionary.compileTimeRowDimension(typeNode);
		columnDim = dictionary.compileTimeColumnDimension(typeNode);

                //Set<List<Integer>> check = new HashSet<List<Integer>>();
		Map<Integer, Set<Integer>> check = new HashMap<Integer, Set<Integer>>();
                
		// Translate the matrix data from string indexed to integer indexed.
		int rowWidth = rowDim.width();
		int width = rowWidth + columnDim.width();
                boolean locationReported = false;
		for (Pair<List<String>, String> pair : pairs) {

			int rowPos = rowDim.ElementPos(pair.a.subList(0, rowWidth));
			int columnPos = columnDim.ElementPos(pair.a.subList(rowWidth, width));

                        if (check.containsKey(rowPos)) {
                            if (check.get(rowPos).contains(columnPos)) {
                                if (!locationReported) {
                                    Pacioli.warn("In %s", getLocation().description());
                                    locationReported = true;
                                }
                                Pacioli.warn("Duplicate: %s %s", rowDim.ElementAt(rowPos), columnDim.ElementAt(columnPos));
                            } else {
                                check.get(rowPos).add(columnPos);
                            }
                        } else {
                            Set<Integer> set = new HashSet<Integer>();
                            set.add(columnPos);
                            check.put(rowPos, set);
                        }
		
                        
			rowIndices.add(rowPos);
			columnIndices.add(columnPos);
			values.add(pair.b);
		}

	}

	@Override
	public String compileToJS(boolean boxed) {

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
		if (boxed) {
                    throw new RuntimeException("matrix literal node ");
                }		
		return String.format("Pacioli.initialNumbers(%s, %s, [%s])", 
				rowDim.size(),
				columnDim.size(),
				builder.toString());
        
//		return String.format("Pacioli.initialMatrix(%s, [%s])", 
//				typeNode.compileToJS(),
//				builder.toString());

	}

	@Override
	public String compileToMATLAB() {
		throw new RuntimeException("todo");	
	}

	@Override
	public void printText(PrintWriter out) {
		//throw new RuntimeException("todo");	
                out.print("todo: matrix literal");
	}

	@Override
	public ExpressionNode liftStatements(PacioliFile module,
			List<ValueDefinition> blocks) {
		// TODO Auto-generated method stub
		return null;
	}

}
