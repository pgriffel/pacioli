package pacioli.ast.unit;

import java.io.PrintWriter;
import java.util.HashSet;
import java.util.Set;

import pacioli.CompilationSettings;
import pacioli.Dictionary;
import pacioli.Location;
import pacioli.PacioliException;
import pacioli.ast.definition.Definition;
import uom.Fraction;
import uom.Unit;

public class UnitOperationNode extends AbstractUnitNode {

	private final String operator;
	private final UnitNode left;
	private final UnitNode right;

	public UnitOperationNode(Location location, String operator, UnitNode left, UnitNode right) {
		super(location);
		this.operator = operator;
		this.left = left;
		this.right = right;
	}

	@Override
	public void printText(PrintWriter out) {
		left.printText(out);
		out.print(operator);
		right.printText(out);
	}

	@Override
	public UnitNode resolved(Dictionary dictionary) throws PacioliException {
		return new UnitOperationNode(getLocation(), operator, left.resolved(dictionary), right.resolved(dictionary));
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

	@Override
	public Set<Definition> uses() {
		Set<Definition> set = new HashSet<Definition>();
		set.addAll(left.uses());
		set.addAll(right.uses());
		return set;
	}

	@Override
	public String compileToMVM(CompilationSettings settings) {
		String leftMVM = left.compileToMVM(settings);
		String rightMVM = right.compileToMVM(settings);
		if (operator == "*") {
			return "unit_mult(" + leftMVM + "," + rightMVM + ")";
		} else if (operator == "/") {
			return "unit_div(" + leftMVM + "," + rightMVM + ")";
		} else if (operator == "^") {
			return "unit_expt(" + leftMVM + "," + rightMVM + ")";
		} else {
			throw new RuntimeException("Unit operator unknown");
		}
	}

}
