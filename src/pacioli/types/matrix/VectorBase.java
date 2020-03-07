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

package pacioli.types.matrix;

import pacioli.types.TypeBase;
import pacioli.types.TypeIdentifier;
import uom.Base;
import uom.BaseUnit;
import uom.PowerProduct;
import uom.Unit;
import uom.UnitMap;

//public class BangBase extends BaseUnit implements TypeBase {
//public class BangBase extends TypeBase {
public class VectorBase extends BaseUnit<TypeBase> implements TypeBase {

    public final TypeIdentifier indexSetName;
    public final TypeIdentifier unitName;
    public final int position;

    public VectorBase(TypeIdentifier indexSetName, TypeIdentifier unitName, int position) {
        assert (!unitName.name.contains("!"));
        assert (!indexSetName.home.isEmpty());
        this.indexSetName = indexSetName;
        this.unitName = unitName;
        this.position = position;
    }

 // hack for matrix type
    public VectorBase(String indexSetName, String unitName, int position) {
        this.indexSetName = new TypeIdentifier("", indexSetName);
        this.unitName = new TypeIdentifier("", unitName);
        this.position = position;
    }
    
    // hack for matrix type
    public VectorBase(String home, String indexSetName, String unitName, int position) {
        assert (!home.isEmpty());
        this.indexSetName = new TypeIdentifier(home, indexSetName);
        this.unitName = new TypeIdentifier(home, unitName);
        this.position = position;
    }

    public String indexSetName() {
        return indexSetName.name;
    }

    public String unitName() {
        return unitName.name;
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
        if (!(real instanceof VectorBase)) {
            return false;
        }
        VectorBase otherBase = (VectorBase) real;
        return indexSetName.equals(otherBase.indexSetName) && unitName.equals(otherBase.unitName)
                && position == otherBase.position;
    }

    @Override
    public String toString() {
        return String.format("%s{%s, %s, %s}", super.toString(), indexSetName, unitName, position);
    }

//    @Override
    public String pretty() {
        return indexSetName.name + "!" + unitName.name;
    }

    public VectorBase shift(int offset) {
        return new VectorBase(indexSetName, unitName, position + offset);
    }

    public VectorBase move(int offset) {
        return new VectorBase(indexSetName, unitName, offset);
    }

    public static Unit<TypeBase> kroneckerNth(Unit<TypeBase> unit, final int index) {
        return unit.map(new UnitMap<TypeBase>() {
            public Unit<TypeBase> map(TypeBase base) {
                if (base instanceof VectorBase) {
                    if (((VectorBase) base).position == index) {
                        return base;
                    } else {
                        return TypeBase.ONE;
                    }
                } else {
                    throw new RuntimeException("kroneckerNth is for row and column units only");
                }
            }
        });
    }

    public static Unit<TypeBase> shiftUnit(Unit<TypeBase> unit, final int offset) {
        return unit.map(new UnitMap<TypeBase>() {
            public Unit<TypeBase> map(TypeBase base) {
                if (base instanceof VectorBase) {
                    return ((VectorBase) base).shift(offset);
                } else {
                    return base;
                }
            }
        });
    }

    @Override
    public String compileToJS() {
        // todo: reconsider the .rowUnit trick
        // DIT NEEMT AAN DAT position 0 is!?!?!?!?!?!?!?!
        return String.format("Pacioli.bangShape('%s', '%s', '%s', '%s').rowUnit", indexSetName.home, indexSetName.name,
                unitName.home, unitName.name);
    }

    @Override
    public String compileToMVM() {
        //assert(!indexSetName.home.isEmpty());
        String unitName = this.unitName.name;
        return String.format("bang_shape(\"index_%s_%s\", \"%s\")",
                indexSetName.home, indexSetName.name,
                unitName.isEmpty() ? "" : String.format("%s!%s" , indexSetName.name, unitName));
    }

}