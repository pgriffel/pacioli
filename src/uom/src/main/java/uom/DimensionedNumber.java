/*
 * Copyright (c) 2015 - 2015 Paul Griffioen
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

import java.math.BigDecimal;
import java.math.MathContext;
import java.math.RoundingMode;

public class DimensionedNumber<B> {

    private final Unit<B> unit;
    private final BigDecimal factor;

    public DimensionedNumber() {
        // unit = Unit.ONE;
        unit = new PowerProduct<B>();
        factor = BigDecimal.ONE;
    }

    public DimensionedNumber(Unit<B> unit) {
        this.unit = unit;
        factor = BigDecimal.ONE;
    }

    public DimensionedNumber(BigDecimal factor) {
        // unit = Unit.ONE;
        unit = new PowerProduct<B>();
        this.factor = factor;
    }

    public DimensionedNumber(BigDecimal factor, Unit<B> unit) {
        this.unit = unit;
        this.factor = factor;
    }

    public BigDecimal factor() {
        return factor;
    }

    public Unit<B> unit() {
        return unit;
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
        if (!(other instanceof DimensionedNumber)) {
            return false;
        }
        DimensionedNumber<B> otherNumber = (DimensionedNumber<B>) other;
        if (factor.compareTo(otherNumber.factor()) != 0) {
            return false;
        }
        return unit.equals(otherNumber.unit);
    }

    @Override
    public String toString() {
        return factor.toString() + " " + unit.toString();
    }

    public DimensionedNumber<B> multiply(BigDecimal factor) {
        return new DimensionedNumber<B>(this.factor.multiply(factor), unit);
    }

    public DimensionedNumber<B> multiply(DimensionedNumber<B> other) {
        return new DimensionedNumber<B>(other.factor.multiply(factor), other.unit.multiply(unit));
    }

    public DimensionedNumber<B> divide(DimensionedNumber<B> other) {
        return new DimensionedNumber<B>(other.factor.divide(factor), other.unit.multiply(unit.reciprocal()));
    }

    public DimensionedNumber<B> raise(Fraction power) {
        BigDecimal raisedFactor;
        if (power.isInt()) {
            int pow = power.intValue();
            if (0 < pow) {
                raisedFactor = factor.pow(pow, MathContext.DECIMAL128);
            } else {
                raisedFactor = BigDecimal.ONE.divide(factor.pow(-pow, MathContext.DECIMAL128), 25,
                        RoundingMode.HALF_UP);
            }
        } else {
            raisedFactor = new BigDecimal(Math.pow(factor.doubleValue(), power.doubleValue()));
        }
        return new DimensionedNumber<B>(raisedFactor, unit.raise(power));
    }

    public DimensionedNumber<B> reciprocal() {
        return raise(new Fraction(-1));
    }

    public DimensionedNumber<B> flat() {
        return unit.flat().multiply(factor);
    }

    public String toText() {
        return factor.toString() + " " + unit.pretty();
    }
}
