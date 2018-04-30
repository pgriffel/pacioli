package mvm.ast;

import java.io.PrintWriter;
import mvm.AbstractPrintable;
import mvm.Environment;
import mvm.MVMException;
import mvm.ast.shape.ShapeNode;
import mvm.values.PacioliValue;
import mvm.values.matrix.Matrix;

public class MatrixConstructor extends AbstractPrintable implements Expression {

    private String op;
	private ShapeNode shape;

    public MatrixConstructor(String op, ShapeNode shape) {
        this.op = op;
        this.shape = shape;
    }

    @Override
    public PacioliValue eval(Environment environment) throws MVMException {
    	Matrix matrix = new Matrix(shape.eval(environment.getMachine()));
		if (op.equals("ones")) {
			return matrix.ones();
		} else if (op.equals("conversion")) {
			matrix.createConversion();
			return matrix;
		} else if (op.equals("projection")) {
			matrix.createProjection();
			return matrix;
		} else {
			throw new MVMException("Matrix constructor '" + op + "' unknown");
		}
    }

    @Override
    public void printText(PrintWriter out) {
        
    }
}
