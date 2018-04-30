package mvm.ast.shape;

import java.io.PrintWriter;

import mvm.AbstractPrintable;
import mvm.MVMException;
import mvm.Machine;
import mvm.values.matrix.MatrixShape;
import uom.Fraction;

public class ShapeExpt extends AbstractPrintable implements ShapeNode {

	private ShapeNode shape;
	private Fraction power;
	
	public ShapeExpt(ShapeNode shape, Fraction power) {
		this.shape = shape;
		this.power = power;
	}
	
	@Override
	public void printText(PrintWriter out) {
		out.print("shape_expt(");
        shape.printText(out);
	    out.print(", ");
        out.print(power);
        out.print(")");
	}

	@Override
	public MatrixShape eval(Machine machine) throws MVMException {
		return shape.eval(machine).raise(power);	
	}


}
