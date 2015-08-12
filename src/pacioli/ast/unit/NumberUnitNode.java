package pacioli.ast.unit;

import java.io.PrintWriter;
import java.math.BigDecimal;
import java.util.HashSet;
import java.util.Set;

import pacioli.Dictionary;
import pacioli.Location;
import pacioli.ast.definition.Definition;
import uom.DimensionedNumber;
import uom.Unit;

public class NumberUnitNode extends AbstractUnitNode {
    
	private final String number;

    public NumberUnitNode(String number, Location location) {
        super(location);
        this.number = number;
    }

	@Override
	public void printText(PrintWriter out) {
		out.print(number);
	}

	@Override
	public UnitNode resolved(Dictionary dictionary) {
		return this;
	}

	@Override
	public Set<Definition> uses() {
		return new HashSet<Definition>();
	}

	@Override
	public DimensionedNumber eval() {
		return Unit.ONE.multiply(new BigDecimal(number));
	}
}
