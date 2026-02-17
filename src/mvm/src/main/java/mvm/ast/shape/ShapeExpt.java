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

package mvm.ast.shape;

import java.io.PrintWriter;

import mvm.MVMException;
import mvm.Machine;
import mvm.values.matrix.MatrixShape;
import uom.Fraction;

public class ShapeExpt implements ShapeNode {

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
