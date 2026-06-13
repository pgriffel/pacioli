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

package uom;

import java.math.BigDecimal;
import java.math.MathContext;
import java.math.RoundingMode;

/**
 * A dimensioned number is a pair ru with r the number's magnitude and u the
 * number's unit of measurement.
 * 
 * The magnitude is a BigDecimal to give unit conversions higher precision.
 */
public class DimensionedNumber<B extends Base> {

    /**
     * The dimensioned number's magnitude.
     */
    private final BigDecimal factor;

    /**
     * The dimensioned number's unit of measurement.
     */
    private final Unit<B> unit;

    /**
     * The dimensionless number 1.
     */
    public DimensionedNumber() {
        this.factor = BigDecimal.ONE;
        this.unit = Unit.one();
    }

    /**
     * A dimensioned number 1.
     */
    public DimensionedNumber(Unit<B> unit) {
        this.factor = BigDecimal.ONE;
        this.unit = unit;
    }

    /**
     * A dimensioned number 1 constructed from a base.
     * 
     * A convenience function that creates a unit from the base.
     */
    public DimensionedNumber(B base) {
        this.factor = BigDecimal.ONE;
        this.unit = Unit.from(base);
    }

    /**
     * A dimensioneless number.
     */
    public DimensionedNumber(BigDecimal factor) {
        this.factor = factor;
        this.unit = Unit.one();
    }

    /**
     * A dimensioned number.
     */
    public DimensionedNumber(BigDecimal factor, Unit<B> unit) {
        this.unit = unit;
        this.factor = factor;
    }

    /**
     * The dimensioned number's magnitude.
     */
    public BigDecimal factor() {
        return factor;
    }

    /**
     * The dimensioned number's unit of measurement.
     */
    public Unit<B> unit() {
        return unit;
    }

    @Override
    public int hashCode() {
        final int prime = 31;
        int result = 1;
        result = prime * result + ((factor == null) ? 0 : factor.stripTrailingZeros().hashCode());
        result = prime * result + ((unit == null) ? 0 : unit.hashCode());
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
        DimensionedNumber other = (DimensionedNumber) obj;
        if (factor == null) {
            if (other.factor != null)
                return false;
        } else if (factor.compareTo(other.factor) != 0)
            return false;
        if (unit == null) {
            if (other.unit != null)
                return false;
        } else if (!unit.equals(other.unit))
            return false;
        return true;
    }

    @Override
    public String toString() {
        return factor.toString() + " " + unit.toString();
    }

    /**
     * Scales a dimensioned number by a dimensionless factor.
     * 
     * @param factor The factor to scale with.
     * @return The scaled number
     */
    public DimensionedNumber<B> multiply(BigDecimal factor) {
        return new DimensionedNumber<B>(
                this.factor.multiply(factor),
                unit);
    }

    /**
     * Product of two dimensioned numbers.
     * 
     * @param other A dimensioned number
     * @return The product.
     */
    public DimensionedNumber<B> multiply(DimensionedNumber<B> other) {
        return new DimensionedNumber<B>(
                other.factor.multiply(factor),
                other.unit.multiply(unit));
    }

    /**
     * Division of two dimensioned numbers.
     * 
     * @param other A dimensioned number
     * @return The quotient.
     */
    public DimensionedNumber<B> divide(DimensionedNumber<B> other) {
        // TODO: what to do for scale. The current 25 is not based on anything
        return new DimensionedNumber<B>(
                factor.divide(other.factor, 25, RoundingMode.HALF_UP),
                unit.multiply(other.unit.reciprocal()));
    }

    /**
     * Exponent of a dimensioned number.
     * 
     * @param power The power to raise the number with
     * @return The number raised to the given power.
     */
    public DimensionedNumber<B> raise(Fraction power) {
        BigDecimal raisedFactor;
        if (power.isInt()) {
            int pow = power.intValue();
            if (0 < pow) {
                raisedFactor = factor.pow(pow, MathContext.DECIMAL128);
            } else {
                // TODO: what to do for scale. The current 25 is not based on anything
                raisedFactor = BigDecimal.ONE.divide(factor.pow(-pow, MathContext.DECIMAL128), 25,
                        RoundingMode.HALF_UP);
            }
        } else {
            raisedFactor = new BigDecimal(Math.pow(factor.doubleValue(), power.doubleValue()));
        }
        return new DimensionedNumber<B>(raisedFactor, unit.raise(power));
    }

    /**
     * The reciprocal of a dimensioned number.
     * 
     * Equals raise(new Fraction(-1))
     * 
     * @return The reciprocal
     */
    public DimensionedNumber<B> reciprocal() {
        return raise(new Fraction(-1));
    }

    /**
     * Reduces a dimensioned number to an equivalent coherent form.
     * 
     * A coherent dimensioned number is a number expressed in base units only.
     * 
     * Maps the reducer (recursively) to all bases in the number's unit. It is
     * assumed the reducer replaces a base with the base's definition.
     * 
     * @param reducer Function that maps a base to a coherent equivalent.
     * @return The coherent equivalent of the dimensioned number.
     */
    public DimensionedNumber<B> reduce(Unit.Reduce<B> reducer) {
        return unit.reduce(reducer).multiply(factor);
    }

    /**
     * Text form for use in output.
     * 
     * @return String form suitable for output.
     */
    public String pretty() {
        return factor.toString() + " " + unit.pretty();
    }
}
