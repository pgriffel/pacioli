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

public class ScaledUnit<B> extends BaseUnit<B> {

    //private final NamedUnit unit;
    private final Unit<B> unit;
    private final Prefix prefix;

    //public ScaledUnit(Prefix scale, NamedUnit scaled) {
    public ScaledUnit(Prefix scale, Unit<B> scaled) {
        prefix = scale;
        unit = scaled;
    }

    @Override
    public int hashCode() {
        return unit.hashCode();
    }

    @Override
    public boolean equals(Object other) {
        if (other == this) {
            return true;
        }
        if (!(other instanceof Unit)) {
            return false;
        }
        Object real = PowerProduct.normal((Unit<B>) other);
        if (real == this) {
            return true;
        }
        if (!(real instanceof ScaledUnit)) {
            return false;
        }
        ScaledUnit<B> otherUnit = (ScaledUnit<B>) real;
        if (!unit.equals(otherUnit.unit)) {
            return false;
        }
        if (!prefix.equals(otherUnit.prefix)) {
            return false;
        }
        return true;
    }

    @Override
    public DimensionedNumber<B> flat() {
        return unit.flat().multiply(prefix.prefixFactor());
    }

    @Override
    public String toText() {
        return prefix.prefixName() + unit.toText();
    }

}