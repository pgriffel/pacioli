package mvm.ast.shape;

import java.io.PrintWriter;

import mvm.AbstractPrintable;
import mvm.MVMException;
import mvm.Machine;
import mvm.values.matrix.MatrixShape;

public class ShapeBinop extends AbstractPrintable implements ShapeNode {

	private String op;
	private ShapeNode left;
	private ShapeNode right;
	
	public ShapeBinop(String op, ShapeNode left, ShapeNode right) {
		this.op = op;
		this.left = left;
		this.right = right;
	}
	
	@Override
	public void printText(PrintWriter out) {
		out.print("shape_binop(");
		out.format("\"%s\"", op);
	    out.print(", ");
        left.printText(out);
	    out.print(", ");
        right.printText(out);
        out.print(")");
	}

	@Override
	public MatrixShape eval(Machine machine) throws MVMException {
		MatrixShape le = (MatrixShape) this.left.eval(machine);
		MatrixShape ri = (MatrixShape) this.right.eval(machine);
		if (op.equals("dot")) {
			return le.join(ri);
		} else if (op.equals("per")) {
			return le.join(ri.transpose().reciprocal());
		} else if (op.equals("multiply")) {
			if (le.singleton()) {
				return le.scale(ri);
			}
			if (ri.singleton()) {
				return ri.scale(le);
			}
			return le.multiply(ri);
		} else if (op.equals("divide")) {
			if (le.singleton()) {
				return le.scale(ri.reciprocal());
			}
			if (ri.singleton()) {
				return ri.reciprocal().scale(le);
			}
			return le.multiply(ri.reciprocal());
		} else if (op.equals("kronecker")) {
			return le.kronecker(ri);
		} else {
			throw new RuntimeException("Binary shape operator '" + op + "' unknown");
		}
	}


}
