package mvm.ast.expression;

import java.io.PrintWriter;
import java.util.List;

import mvm.AbstractPrintable;
import mvm.Environment;
import mvm.MVMException;
import mvm.ast.shape.ShapeNode;
import mvm.values.PacioliValue;
import mvm.values.matrix.Matrix;

public class LitMat extends AbstractPrintable implements Expression {

    private ShapeNode shape;
    private List<String> rows;
    private List<String> columns;
    private List<String> values;

    public LitMat(ShapeNode shape, List<String> rows, List<String> columns, List<String> values) {
        this.shape = shape;
        this.rows = rows;
        this.columns = columns;
        this.values = values;
    }

    @Override
    public PacioliValue eval(Environment environment) throws MVMException {
        Matrix matrix = new Matrix(shape.eval(environment.machine()));
        for (int i = 0; i < values.size(); i++) {
            Integer r = Integer.parseInt(rows.get(i));
            Integer c = Integer.parseInt(columns.get(i));
            Double value = Double.parseDouble(values.get(i));
            matrix.set(r, c, value);
        }
        return matrix;
    }

    @Override
    public void printText(PrintWriter out) {

    }
}
