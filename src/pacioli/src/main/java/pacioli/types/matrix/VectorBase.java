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

package pacioli.types.matrix;

import pacioli.compiler.CompilationSettings;
import pacioli.symboltable.info.VectorBaseInfo;
import pacioli.types.type.TypeBase;
import pacioli.types.type.TypeIdentifier;
import uom.Unit;

public class VectorBase implements TypeBase {

    private final VectorBaseInfo vectorUnitInfo;
    private final TypeIdentifier indexSetName;
    private final TypeIdentifier unitName;
    private final int position;

    public VectorBase(TypeIdentifier indexSetName, TypeIdentifier unitName, int position,
            VectorBaseInfo vectorUnitInfo) {
        assert (!unitName.name().contains("!"));
        assert (!indexSetName.home().isEmpty());
        assert (vectorUnitInfo.name().contains("!"));
        this.indexSetName = indexSetName;
        this.unitName = unitName;
        this.position = position;
        this.vectorUnitInfo = vectorUnitInfo;
    }

    public VectorBaseInfo vectorUnitInfo() {
        return vectorUnitInfo;
    }

    public TypeIdentifier indexSetName() {
        return indexSetName;
    }

    public TypeIdentifier unitName() {
        return unitName;
    }

    public int position() {
        return position;
    }

    @Override
    public int hashCode() {
        final int prime = 31;
        int result = 1;
        result = prime * result + ((indexSetName == null) ? 0 : indexSetName.hashCode());
        result = prime * result + ((unitName == null) ? 0 : unitName.hashCode());
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
        if (indexSetName == null) {
            if (other.indexSetName != null)
                return false;
        } else if (!indexSetName.equals(other.indexSetName))
            return false;
        if (unitName == null) {
            if (other.unitName != null)
                return false;
        } else if (!unitName.equals(other.unitName))
            return false;
        if (position != other.position)
            return false;
        return true;
    }

    @Override
    public String toString() {
        return String.format("%s{%s, %s, %s}", super.toString(), indexSetName, unitName, position);
    }

    public String pretty() {
        // return indexSetName.name + "!" + unitName.name;
        assert (vectorUnitInfo.name().equals(indexSetName.name() + "!" + unitName.name()));
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
        return unit.flatMap(base -> {
            if (base instanceof VectorBase vBase) {
                if (vBase.position == index) {
                    return Unit.from(base);
                } else {
                    return TypeBase.ONE;
                }
            } else {
                // We must be called with a unit variable. Ignore that to get pretty printing
                // working.
                return Unit.from(base);
                // throw new RuntimeException("kroneckerNth is for row and column units only");
            }
        });
    }

    // UNITTODO
    public static Unit<TypeBase> shiftUnit(Unit<TypeBase> unit, final int offset) {
        return unit.map(base -> base instanceof VectorBase vectorBase ? vectorBase.shift(offset) : base);
    }

    @Override
    public String asJS(boolean forType) {
        // return String.format("Pacioli.bangShape('%s', '%s', '%s', '%s').rowUnit",
        // indexSetName.home, indexSetName.name,
        // unitName.home, unitName.name);
        return String.format("Pacioli.unitVectorType('vbase_%s_%s_%s', %s)", indexSetName.home(), indexSetName.name(),
                this.unitName.name(), position);
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
        String unitName = this.unitName.name();
        return String.format("bang_shape(\"index_%s_%s\", \"%s\")",
                indexSetName.home(), indexSetName.name(),
                unitName.isEmpty() ? "" : String.format("%s!%s", indexSetName.name(), unitName));
    }

}