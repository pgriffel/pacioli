/*
 * Copyright (c) 2013 - 2014 Paul Griffioen
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

package mvm.values.matrix;

import uom.Base;
import uom.BaseUnit;
import uom.PowerProduct;
import uom.Unit;
import uom.UnitMap;

public class MatrixBase extends BaseUnit {

    private final UnitVector vector;
    public final int position;

    public MatrixBase(UnitVector index, int position) {
        this.vector = index;
        this.position = position;
    }

    public Unit get(int position) {
        return vector.get(position);
    }

    @Override
    public int hashCode() {
        return vector.hashCode();
    }

    @Override
    public boolean equals(Object other) {
        if (other == this) {
            return true;
        }
        if (!(other instanceof Unit)) {
            return false;
        }
        Object real = PowerProduct.normal((Unit) other);
        if (real == this) {
            return true;
        }
        if (!(real instanceof MatrixBase)) {
            return false;
        }
        MatrixBase otherUnit = (MatrixBase) real;
        return vector.equals(otherUnit.vector) && position == otherUnit.position;
    }

    @Override
    public String toText() {
        return "Index(" + vector.toText() + ", " + Integer.toString(position) + ")";
    }

    public MatrixBase shift(int offset) {
        return new MatrixBase(vector, position + offset);
    }

    public static Unit kroneckerNth(Unit unit, final int index) {
        return unit.map(new UnitMap() {
            public Unit map(Base base) {
                if (base instanceof MatrixBase) {
                    if (((MatrixBase) base).position == index) {
                        return base;
                    } else {
                        return Unit.ONE;
                    }
                } else {
                    throw new RuntimeException("kroneckerNth is for row and column units only");
                }
            }
        });
    }

    public static Unit shiftUnit(Unit unit, final int offset) {
        return unit.map(new UnitMap() {
            public Unit map(Base base) {
                if (base instanceof MatrixBase) {
                    return ((MatrixBase) base).shift(offset);
                } else {
                    return base;
                }
            }
        });
    }
}