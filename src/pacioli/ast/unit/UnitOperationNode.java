package pacioli.ast.unit;

import java.io.PrintWriter;

import pacioli.Dictionary;
import pacioli.PacioliException;
import pacioli.TypeContext;
import pacioli.types.PacioliType;
import uom.Fraction;
import uom.Unit;

public class UnitOperationNode extends AbstractUnitNode {

	private final String operator;
	private final UnitNode left;
	private final UnitNode right;

	public UnitOperationNode(String operator, UnitNode left, UnitNode right) {
		this.operator = operator;
		this.left = left;
		this.right = right;
	}

	@Override
	public Unit eval() {
		Unit leftUnit = left.eval();
		Unit rightUnit = right.eval();
		if (operator == "*") {
			return leftUnit.multiply(rightUnit);
		} else if (operator == "/") {
			return leftUnit.multiply(rightUnit.reciprocal());
		} else if (operator == "^") {
			return leftUnit.raise(new Fraction(Integer.parseInt(((NumberUnitNode) right).toText())));
		} else {
			throw new RuntimeException("Unit operator unknown");
		}
	}

	@Override
	public void printText(PrintWriter out) {
		left.printText(out);
		out.print(operator);
		right.printText(out);
	}

	@Override
	public String compileToJS() {
		String leftJS = left.compileToJS();
		String rightJS = right.compileToJS();
		if (operator == "*") {
			return leftJS + ".mult(" + rightJS + ")";
		} else if (operator == "/") {
			return leftJS + ".div(" + rightJS + ")";
		} else if (operator == "^") {
			return leftJS + ".expt(" + rightJS + ")";
		} else {
			throw new RuntimeException("Unit operator unknown");
		}
	}

}
