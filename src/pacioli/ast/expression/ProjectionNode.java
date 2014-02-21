package pacioli.ast.expression;

import java.io.PrintWriter;
import java.util.ArrayList;
import java.util.Collections;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;

import pacioli.CompilationSettings;
import pacioli.Dictionary;
import pacioli.Location;
import pacioli.PacioliFile;
import pacioli.PacioliException;
import pacioli.Typing;
import pacioli.Utils;
import pacioli.ValueContext;
import pacioli.ast.definition.Definition;
import pacioli.ast.definition.ValueDefinition;
import pacioli.types.FunctionType;
import pacioli.types.PacioliType;
import pacioli.types.ParametricType;
import pacioli.types.matrix.MatrixType;

public class ProjectionNode extends AbstractExpressionNode {

    public final List<ConstNode> columns;
    public final ExpressionNode body;
    private MatrixType type;

    public ProjectionNode(List<ConstNode> columns, ExpressionNode body, Location location) {
        super(location);
        this.columns = columns;
        this.body = body;
        this.type = null;
    }
    
    public ProjectionNode(List<ConstNode> columns, ExpressionNode body, MatrixType type, Location location) {
        super(location);
        this.columns = columns;
        this.body = body;
        this.type = type;
    }

    @Override
    public void printText(PrintWriter out) {
        out.print("project ");
        out.print(numString());
        out.print(" from ");
        body.printText(out);
        out.print(" end");
    }

    @Override
    public ExpressionNode resolved(Dictionary dictionary, ValueContext context) throws PacioliException {
        ExpressionNode resolvedExpression = body.resolved(dictionary, context);
        return new ProjectionNode(columns, resolvedExpression, type, getLocation());
    }

    @Override
    public Typing inferTyping(Map<String, PacioliType> context) throws PacioliException {
        Typing bodyTyping = body.inferTyping(context);
        PacioliType type = bodyTyping.getType();
        if (!(type instanceof MatrixType)) {
        	throw new PacioliException(getLocation(), "projection type must be a matrix type. Found %s", type.toText());
        }
        MatrixType matrixType = (MatrixType) type;
        List<Integer> nums = new ArrayList<Integer>();
        for (ConstNode node: columns) {
        	nums.add(Integer.parseInt(node.valueString()));
        }
        Typing typing = new Typing(matrixType.project(nums));
        typing.addConstraints(bodyTyping);
        
        this.type = matrixType;
        
        return typing;
    }

    @Override
    public Set<Definition> uses() {
        return body.uses();
    }

    @Override
    public Set<IdentifierNode> locallyAssignedVariables() {
        return new LinkedHashSet<IdentifierNode>();
    }

    @Override
    public ExpressionNode desugar() {
        return new ProjectionNode(columns, body.desugar(), type, getLocation());
    }

    @Override
    public String compileToMVM(CompilationSettings settings) {
    	String cols = "application(var(\"global_List_empty_list\"))";
    	for (int i = this.columns.size()-1; i >= 0; i--) {
            cols = "application(var(\"global_List_cons\"), " + this.columns.get(i).compileToMVM(settings) + ", " + cols + ")";
        }        
        return String.format("application(var(\"global_Matrix_project\"), %s, %s)", cols, body.compileToMVM(settings));
    }
    
    @Override
    public String compileToJS() {
    	assert(type != null);
        return String.format("Pacioli.projectNumbers(%s, %s.param, [%s])", body.compileToJS(), type.compileToJS(), numString());
    }
    
    public String numString() {
        List<String> columns = new ArrayList<String>();
        for (ConstNode node : this.columns) {
            columns.add(node.valueString());
        }
        return Utils.intercalate(",", columns);
    }

    @Override
    public String compileToMATLAB() {
        return String.format("(@(%s) %s)", numString(), body.compileToMATLAB());
    }

	@Override
	public ExpressionNode liftStatements(PacioliFile module,
			List<ValueDefinition> blocks) {
		// TODO Auto-generated method stub
		return null;
	}

}

