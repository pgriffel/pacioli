package pacioli.ast.expression;

import java.io.PrintWriter;
import java.io.StringWriter;
import pacioli.Location;
import pacioli.ast.Visitor;

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
    public String compileToJS(boolean boxed) {
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
	public void accept(Visitor visitor) {
		visitor.visit(this);
	}

}
