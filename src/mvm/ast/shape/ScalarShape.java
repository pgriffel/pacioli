package mvm.ast.shape;

import java.io.PrintWriter;

import mvm.AbstractPrintable;
import mvm.MVMException;
import mvm.Machine;
import mvm.ast.unit.UnitNode;
import mvm.values.matrix.MatrixShape;

public class ScalarShape extends AbstractPrintable implements ShapeNode {

	private UnitNode unit;
	
	public ScalarShape(UnitNode u) {
		this.unit = u;
	}
	
	@Override
	public void printText(PrintWriter out) {
		out.format("scalar_shape(");
		out.format("TODO");
		out.format(")");
	}

	@Override
	public MatrixShape eval(Machine machine) throws MVMException {
		return new MatrixShape(unit.eval(machine));
	}
}
