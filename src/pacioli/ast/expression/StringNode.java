package pacioli.ast.expression;

import java.io.PrintWriter;
import java.io.StringWriter;
import java.util.HashSet;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;

import pacioli.CompilationSettings;
import pacioli.Dictionary;
import pacioli.Location;
import pacioli.PacioliException;
import pacioli.PacioliFile;
import pacioli.Typing;
import pacioli.ValueContext;
import pacioli.ast.definition.Definition;
import pacioli.ast.definition.ValueDefinition;
import pacioli.types.PacioliType;
import pacioli.types.ParametricType;

public class StringNode extends AbstractExpressionNode {

    private final String value;

    public StringNode(String value, Location location) {
        super(location);
        this.value = value;
    }

    public String valueString() {
        return value;
    }

    @Override
    public void printText(PrintWriter out) {
    	out.print("\"");
        out.print(value);
        out.print("\"");
    }

    @Override
    public ExpressionNode resolved(Dictionary dictionary, ValueContext context) {
        return this;
    }

    @Override
    public Typing inferTyping(Map<String, PacioliType> context) throws PacioliException {
    	return new Typing(new ParametricType("String"));
    }

    @Override
    public String compileToMVM(CompilationSettings settings) {
        return String.format("string(%s)", toText());
    }

    @Override
    public String compileToJS() {
    	StringWriter writer = new StringWriter();
    	writer.write("'");
    	String[] lines = value.split("\n");
    	for (String line: lines) {
    		writer.write(line);
    		writer.write("\\\n");
    	}
    	writer.write("'");
    	return writer.toString();
    }
    
    @Override
    public String compileToMATLAB() {
    	return toText();
    }

    @Override
    public Set<Definition> uses() {
        return new HashSet<Definition>();
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
	public ExpressionNode liftStatements(PacioliFile module,
			List<ValueDefinition> blocks) {
		// TODO Auto-generated method stub
		return null;
	}

}
