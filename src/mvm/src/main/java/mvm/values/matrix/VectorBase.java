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

package mvm.values.matrix;

import uom.PowerProduct;
import uom.Unit;
import uom.UnitMap;

public final class VectorBase implements MVMBase {

    public final static Unit<VectorBase> ONE = new PowerProduct<VectorBase>();

    private final UnitVector vector;
    public final int position;

    public VectorBase(UnitVector index, int position) {
        this.vector = index;
        this.position = position;
    }

    public Unit<ScalarBase> get(int position) {
        return vector.get(position);
    }

    @Override
    public int hashCode() {
        final int prime = 31;
        int result = 1;
        result = prime * result + ((vector == null) ? 0 : vector.hashCode());
        result = prime * result + position;
        return result;
    }

    @Override
    public boolean equals(Object obj) {
        if (this == obj)
            return true;
        if (obj == null)
            return false;
        if (getClass() != obj.getClass())
            return false;
        VectorBase other = (VectorBase) obj;
        if (vector == null) {
            if (other.vector != null)
                return false;
        } else if (!vector.equals(other.vector))
            return false;
        if (position != other.position)
            return false;
        return true;
    }

    @Override
    public String pretty() {
        return "Index(" + vector.toText() + ", " + Integer.toString(position) + ")";
    }

    public VectorBase shift(int offset) {
        return new VectorBase(vector, position + offset);
    }

    public static Unit<VectorBase> kroneckerNth(Unit<VectorBase> unit, final int index) {
        return unit.map(new UnitMap<VectorBase, VectorBase>() {
            public Unit<VectorBase> map(VectorBase base) {
                assert (base instanceof VectorBase);
                if (base.position == index) {
                    return new PowerProduct<>(base);
                } else {
                    return VectorBase.ONE;
                }
            }
        });
    }

    public static Unit<VectorBase> shiftUnit(Unit<VectorBase> unit, final int offset) {
        return unit.map(new UnitMap<VectorBase, VectorBase>() {
            public Unit<VectorBase> map(VectorBase base) {
                assert (base instanceof VectorBase);
                return new PowerProduct<VectorBase>(base.shift(offset));
            }
        });
    }
}