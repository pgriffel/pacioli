package pacioli.ast.definition;

import java.io.PrintWriter;
import pacioli.Location;
import pacioli.Progam;
import pacioli.ast.Visitor;
import pacioli.ast.expression.ExpressionNode;
import pacioli.symboltable.GenericInfo;
import pacioli.types.PacioliType;


public class Toplevel extends AbstractDefinition {
	
	public ExpressionNode body;

	public Toplevel(Location location, ExpressionNode body) {
		super(location);
		this.body = body;
	}
	
	@Override
	public String localName() {
		return null;
	}

	@Override
	public void printText(PrintWriter out) {
		body.printText(out);
		out.print(";\n");
	}
	
	@Override
	public String compileToJS(boolean boxed) {
		//return resolvedBody.compileToJS(false);
		throw new RuntimeException("todo");
	}

	@Override
	public String compileToMATLAB() {
		throw new RuntimeException("todo");
	}

	@Override
	public void accept(Visitor visitor) {
		visitor.visit(this);
	}

	@Override
	public void addToProgr(Progam program, GenericInfo info) {
		program.addToplevel(this);
	}

}
