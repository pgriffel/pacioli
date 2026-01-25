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

package pacioli.types.visitors;

import java.util.HashSet;
import java.util.Set;

import pacioli.types.matrix.IndexType;
import pacioli.types.matrix.MatrixType;
import pacioli.types.type.TypeBase;
import pacioli.types.type.TypeObject;
import pacioli.types.type.VectorUnitVar;
import uom.Unit;

public class VectorVarNames extends Collector<String> {

    public VectorVarNames() {
        super(new HashSet<>());

    }

    public Set<String> acceptTypeObject(TypeObject child) {
        return (Set<String>) super.acceptTypeObject(child);
    }

    @Override
    public void visit(MatrixType type) {
        for (String name : unitVecVarNames(type.rowDimension(), type.rowUnit())) {
            addItem(name);
        }
        for (String name : unitVecVarNames(type.columnDimension(), type.columnUnit())) {
            addItem(name);
        }
    }

    private Set<String> unitVecVarNames(IndexType dimension, Unit<TypeBase> unit) {
        Set<String> names = new HashSet<String>();
        if (dimension.isVar()) {
            for (TypeBase base : unit.bases()) {
                if (base instanceof VectorUnitVar vbase) {
                    names.add(dimension.varName() + "!" + vbase.unitPart());
                } else {
                    throw new RuntimeException("Expected a VectorUnitVar");
                }
            }
        }
        return names;
    }

}
