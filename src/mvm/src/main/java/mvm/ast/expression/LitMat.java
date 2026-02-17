/*
 * Copyright 2026 Paul Griffioen
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

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
