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
import mvm.values.matrix.MatrixBase;
import mvm.values.matrix.MatrixDimension;
import mvm.values.matrix.MatrixShape;
import mvm.values.matrix.UnitVector;

public class BangShape implements ShapeNode {

    private String entity;
    private String unit;

    public BangShape(String entity, String unit) {
        this.entity = entity;
        this.unit = unit;
    }

    @Override
    public void printText(PrintWriter out) {
        out.format("bang_shape(%s, %s)", entity, unit);
    }

    @Override
    public MatrixShape eval(Machine machine) throws MVMException {
        MatrixShape shape;
        if (unit.isEmpty()) {
            if (!machine.indexSets.containsKey(entity)) {
                throw new MVMException("Index set '%s' unnown", entity);
            }
            shape = new MatrixShape(MatrixBase.ONE, new MatrixDimension(machine.indexSets.get(entity)), MatrixBase.ONE,
                    new MatrixDimension(), MatrixBase.ONE);
        } else {
            String name = unit;
            if (!machine.unitVectors.containsKey(name)) {
                throw new MVMException("Unit vector '%s' unnown", name);
            }
            UnitVector vector = machine.unitVectors.get(name);
            shape = new MatrixShape(MatrixBase.ONE, new MatrixDimension(vector.indexSet), new MatrixBase(vector, 0),
                    new MatrixDimension(), MatrixBase.ONE);
        }
        return shape;
    }
}
