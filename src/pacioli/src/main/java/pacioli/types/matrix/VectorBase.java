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

import pacioli.CompilationSettings;
import pacioli.symboltable.VectorBaseInfo;
import pacioli.types.TypeBase;
import pacioli.types.TypeIdentifier;
import uom.BaseUnit;
import uom.PowerProduct;
import uom.Unit;
import uom.UnitMap;

public class VectorBase extends BaseUnit<TypeBase> implements TypeBase {

    public final VectorBaseInfo vectorUnitInfo;
    public final TypeIdentifier indexSetName;
    public final TypeIdentifier unitName;
    public final int position;

    public VectorBase(TypeIdentifier indexSetName, TypeIdentifier unitName, int position,
            VectorBaseInfo vectorUnitInfo) {
        assert (!unitName.name.contains("!"));
        assert (!indexSetName.home.isEmpty());
        assert (vectorUnitInfo.name().contains("!"));
        this.indexSetName = indexSetName;
        this.unitName = unitName;
        this.position = position;
        this.vectorUnitInfo = vectorUnitInfo;
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

    public String pretty() {
        // return indexSetName.name + "!" + unitName.name;
        assert (vectorUnitInfo.name().equals(indexSetName.name + "!" + unitName.name));
        return vectorUnitInfo.name();
    }

    public VectorBase shift(int offset) {
        return new VectorBase(indexSetName, unitName, position + offset, vectorUnitInfo);
    }

    public VectorBase move(int offset) {
        return new VectorBase(indexSetName, unitName, offset, vectorUnitInfo);
    }

    // UNITTODO
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
                    // We must be called with a unit variable. Ignore that to get pretty printing
                    // working.
                    return base;
                    // throw new RuntimeException("kroneckerNth is for row and column units only");
                }
            }
        });
    }

    // UNITTODO
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
    public String asJS() {
        // return String.format("Pacioli.bangShape('%s', '%s', '%s', '%s').rowUnit",
        // indexSetName.home, indexSetName.name,
        // unitName.home, unitName.name);
        return String.format("Pacioli.unitVectorType('%s', '%s_%s', %s)", indexSetName.home, indexSetName.name,
                this.unitName.name, position);
    }

    @Override
    public String asMVMUnit(CompilationSettings settings) {
        throw new UnsupportedOperationException("Is this used");
        // String unitName = this.unitName.name;
        // return String.format("bang_shape(\"index_%s_%s\", \"%s\")",
        // indexSetName.home, indexSetName.name,
        // unitName.isEmpty() ? "" : String.format("%s!%s", indexSetName.name,
        // unitName));
    }

    @Override
    public String asMVMShape(CompilationSettings settings) {
        String unitName = this.unitName.name;
        return String.format("bang_shape(\"index_%s_%s\", \"%s\")",
                indexSetName.home, indexSetName.name,
                unitName.isEmpty() ? "" : String.format("%s!%s", indexSetName.name, unitName));
    }

}