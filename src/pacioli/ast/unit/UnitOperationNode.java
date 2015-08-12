package pacioli.ast.unit;

import java.io.PrintWriter;
import java.util.HashSet;
import java.util.Set;

import pacioli.Dictionary;
import pacioli.Location;
import pacioli.PacioliException;
import pacioli.ast.definition.Definition;
import uom.DimensionedNumber;
import uom.Fraction;

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
	public DimensionedNumber eval() {
		DimensionedNumber leftUnit = left.eval();
		DimensionedNumber rightUnit = right.eval();
		if ("*".equals(operator)) {
                    return leftUnit.multiply(rightUnit);
		} else if ("/".equals(operator)) {
                    return leftUnit.multiply(rightUnit.reciprocal());
		} else if ("^".equals(operator)) {
                    return leftUnit.raise(new Fraction(Integer.parseInt(((NumberUnitNode) right).toText())));
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
}
