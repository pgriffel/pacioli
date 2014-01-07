package pacioli.ast.expression;

import java.io.PrintWriter;
import java.util.HashSet;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;

import mvm.values.matrix.Matrix;
import pacioli.CompilationSettings;
import pacioli.Dictionary;
import pacioli.Location;
import pacioli.Module;
import pacioli.PacioliException;
import pacioli.TypeContext;
import pacioli.Typing;
import pacioli.ValueContext;
import pacioli.ast.definition.Definition;
import pacioli.ast.definition.ValueDefinition;
import pacioli.types.PacioliType;
import pacioli.types.ast.TypeNode;

public class ConversionNode extends AbstractExpressionNode {

	private final TypeNode typeNode;

	private MatrixTypeNode bang;
    private PacioliType type;
    private Matrix matrix;
    private String jsConverted;
    private String matlabConverted;
    
	public ConversionNode(Location location, TypeNode typeNode) {
		super(location);
		this.typeNode = typeNode;
	}

	@Override
	public ExpressionNode resolved(Dictionary dictionary,
			ValueContext context) throws PacioliException {
		TypeNode resolvedTypeNode = typeNode.resolved(dictionary, new TypeContext());
		bang = new MatrixTypeNode(resolvedTypeNode.getLocation(), typeNode);
		type = resolvedTypeNode.eval(true);
		ExpressionNode resolved = bang.resolved(dictionary, new ValueContext());
		assert (resolved instanceof MatrixTypeNode); 
        ConversionNode node = new ConversionNode(getLocation(), resolvedTypeNode);
        node.bang = (MatrixTypeNode) resolved;
        node.type = type;
        return node;
        
	}

	@Override
	public Typing inferTyping(Map<String, PacioliType> context) throws PacioliException {
		assert (type != null);
        return new Typing(type);
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
//		assert (bang != null);
//        ExpressionNode body = ApplicationNode.newCall(bang.getLocation(), "", "conversion", bang);
//        return body.compileToMVM(settings);
        return String.format("matrix_constructor(\"conversion\", %s)", typeNode.compileToMVM(settings));
	}

	@Override
	public String compileToJS() {
		return String.format("conversionMatrix(%s)", typeNode.compileToJS());
	}

	@Override
	public String compileToMATLAB() {
		throw new RuntimeException("Not implemented");
	}

	@Override
	public void printText(PrintWriter out) {
		out.print("<conversion of type ");
		typeNode.printText(out);
		out.print(">");
	}

	@Override
	public ExpressionNode liftStatements(Module module,
			List<ValueDefinition> blocks) {
		// TODO Auto-generated method stub
		return null;
	}
}
