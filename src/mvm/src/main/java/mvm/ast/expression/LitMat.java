package mvm.ast.expression;

import java.io.PrintWriter;
import java.util.ArrayList;
import java.util.List;

import mvm.Environment;
import mvm.MVMException;
import mvm.ast.shape.ShapeNode;
import mvm.values.PacioliValue;
import mvm.values.matrix.Matrix;

public class LitMat implements Expression {

    private ShapeNode shape;
    private List<Integer> rows;
    private List<Integer> columns;
    private List<Double> values;

    public LitMat(ShapeNode shape, List<String> rows, List<String> columns, List<String> values) {
        this.shape = shape;
        this.rows = new ArrayList<>();
        this.columns = new ArrayList<>();
        this.values = new ArrayList<>();
        for (int i = 0; i < values.size(); i++) {
            this.rows.add(Integer.parseInt(rows.get(i)));
            this.columns.add(Integer.parseInt(columns.get(i)));
            this.values.add(Double.parseDouble(values.get(i)));
        }
    }

    @Override
    public PacioliValue eval(Environment environment) throws MVMException {
        Matrix matrix = new Matrix(shape.eval(environment.machine()));
        for (int i = 0; i < values.size(); i++) {
            Integer r = rows.get(i);
            Integer c = columns.get(i);
            Double value = values.get(i);
            matrix.set(r, c, value);
        }
        return matrix;
    }

    @Override
    public void printText(PrintWriter out) {

    }
}
