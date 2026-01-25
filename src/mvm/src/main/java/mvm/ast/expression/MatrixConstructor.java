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
import mvm.Environment;
import mvm.MVMException;
import mvm.ast.shape.ShapeNode;
import mvm.values.PacioliValue;
import mvm.values.matrix.Matrix;

public class MatrixConstructor implements Expression {

    private String op;
    private ShapeNode shape;

    public MatrixConstructor(String op, ShapeNode shape) {
        this.op = op;
        this.shape = shape;
    }

    @Override
    public PacioliValue eval(Environment environment) throws MVMException {
        Matrix matrix = new Matrix(shape.eval(environment.machine()));
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
