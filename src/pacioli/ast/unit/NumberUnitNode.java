package pacioli.ast.unit;

import java.io.PrintWriter;
import pacioli.Location;
import pacioli.ast.Visitor;

public class NumberUnitNode extends AbstractUnitNode {
    
	public final String number;

    public NumberUnitNode(String number, Location location) {
        super(location);
        this.number = number;
    }

	@Override
	public void printText(PrintWriter out) {
		out.print(number);
	}

	@Override
	public void accept(Visitor visitor) {
		visitor.visit(this);
	}

	@Override
	public String compileToJS(boolean boxed) {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	public String compileToMATLAB() {
		// TODO Auto-generated method stub
		return null;
	}
}
