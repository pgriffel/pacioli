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

package uom;

public class NamedUnit<B> extends BaseUnit<B> {

    private final String symbolic;
    protected DimensionedNumber<B> definition;

    public NamedUnit(String symbolic) {
        this.symbolic = symbolic;
        this.definition = new DimensionedNumber<B>(this);
    }

    public NamedUnit(String symbolic, DimensionedNumber<B> definition) {
        this.symbolic = symbolic;
        this.definition = definition.flat();
    }

    public void setDefinition(DimensionedNumber<B> definition) {
        this.definition = definition.flat();
    }

    @Override
    public int hashCode() {
        return symbolic.hashCode();
    }

    @Override
    public boolean equals(Object other) {
        if (other == this) {
            return true;
        }
        if (!(other instanceof Unit)) {
            return false;
        }
        Unit<B> real = PowerProduct.normal((Unit<B>) other);
        if (real == this) {
            return true;
        }
        if (!(real instanceof NamedUnit)) {
            return false;
        }
        NamedUnit<B> otherUnit = (NamedUnit<B>) real;
        if (!symbolic.equals(otherUnit.symbolic)) {
            return false;
        }
        return true;
    }

    @Override
    public String pretty() {
        return symbolic;
    }

    @Override
    public DimensionedNumber<B> flat() {
        return definition;
    }
}