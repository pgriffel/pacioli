package mvm.ast.shape;

import java.io.PrintWriter;

import mvm.AbstractPrintable;
import mvm.MVMException;
import mvm.Machine;
import mvm.values.matrix.MatrixShape;

public class ShapeUnop extends AbstractPrintable implements ShapeNode {

	private String op;
	private ShapeNode arg;
	
	public ShapeUnop(String op, ShapeNode arg) {
		this.op = op;
		this.arg = arg;
	}
	
	@Override
	public void printText(PrintWriter out) {
		out.print("shape_unop(");
		out.format("\"%s\"", op);
	    out.print(", ");
        arg.printText(out);
        out.print(")");
	}

	@Override
	public MatrixShape eval(Machine machine) throws MVMException {
		MatrixShape shape = (MatrixShape) this.arg.eval(machine);
		if (op.equals("transpose")) {
			return shape.transpose();
		} else {
			throw new RuntimeException("Unary shape operator '" + op + "' unknown");
		}
	}
}
