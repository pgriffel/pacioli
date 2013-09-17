/*
 * Copyright (c) 2013 Paul Griffioen
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

package pacioli.types.matrix;

import uom.Base;
import uom.BaseUnit;
import uom.PowerProduct;
import uom.Unit;
import uom.UnitMap;

public class BangBase extends BaseUnit {

    public String indexSetName;
    public String unitName;
    public int position;

    public BangBase(String indexSetName, String unitName, int position) {
        this.indexSetName = indexSetName;
        this.unitName = unitName;
        this.position = position;
    }
    
    @Override
    public int hashCode() {
        return unitName.hashCode();
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
        if (!(real instanceof BangBase)) {
            return false;
        }
        BangBase otherBase = (BangBase) real;
        return indexSetName.equals(otherBase.indexSetName)
                && unitName.equals(otherBase.unitName)
                && position == otherBase.position;
    }

    @Override
    public String toString() {
        return String.format("%s{%s, %s, %s}", 
                super.toString(),
                indexSetName, unitName, position);
    }
    
    @Override
    public String toText() {
        return indexSetName + "!" + unitName;
    }
    
    public BangBase shift(int offset) {
        return new BangBase(indexSetName, unitName, position + offset);
    }
    
    public static Unit kroneckerNth(Unit unit, final int index) {
        return unit.map(new UnitMap() {
            public Unit map(Base base) {
                if (base instanceof BangBase) {
                    if (((BangBase) base).position == index) {
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
                if (base instanceof BangBase) {
                    return ((BangBase) base).shift(offset);
                } else {
                    return base;
                }
            }
        });
    }

}