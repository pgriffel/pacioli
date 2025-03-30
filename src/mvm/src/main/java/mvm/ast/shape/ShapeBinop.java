/*
 * Copyright (c) 2018 - 2025 Paul Griffioen
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of
 * this software and associated documentation files (the "Software"), to deal in
 * the Software without restriction, including without limitation the rights to
 * use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of
 * the Software, and to permit persons to whom the Software is furnished to do so,
 * subject to the following conditions:
 * 
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS
 * FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
 * COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER
 * IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
 * CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

package mvm.ast.shape;

import java.io.PrintWriter;

import mvm.MVMException;
import mvm.Machine;
import mvm.values.matrix.MatrixShape;

public class ShapeBinop implements ShapeNode {

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
