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

public abstract class AbstractUnit<B> implements Unit<B> {

    @Override
    public Unit<B> multiply(Unit<B> other) {
        return new PowerProduct<B>(this, other);
    }

    @Override
    public <T> T fold(UnitFold<B, T> fold) {
        T result = null;
        for (B base : bases()) {
            Fraction power = power(base);
            T mapped;
            if (power.equals(Fraction.ONE)) {
                mapped = fold.map(base);
            } else {
                mapped = fold.expt(fold.map(base), power);
            }
            if (result == null) {
                result = mapped;
            } else {
                result = fold.mult(result, mapped);
            }
        }
        return (result == null) ? fold.one() : result;
        /*
         * T result = fold.one();
         * for (B base : bases()) {
         * T mapped = fold.expt(fold.map(base), power(base));
         * result = fold.mult(result, mapped);
         * }
         * return result;
         */
    }

    @Override
    public Unit<B> map(UnitMap<B> map) {
        Unit<B> newUnit = new PowerProduct<B>();
        for (B base : bases()) {
            Unit<B> mapped = map.map(base).raise(power(base));
            newUnit = newUnit.multiply(mapped);
        }
        return newUnit;
    }
}
