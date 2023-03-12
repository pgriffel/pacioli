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

import java.math.BigDecimal;
import java.util.HashSet;
import java.util.Set;

public abstract class BaseUnit<B> extends AbstractUnit<B> implements Base<B> {
    @Override
    public Set<B> bases() {
        Set<B> set = new HashSet<B>();
        set.add((B) this);
        return set;
    }

    @Override
    public Fraction power(B base) {
        if (equals(base)) {
            return Fraction.ONE;
        } else {
            return Fraction.ZERO;
        }
    }

 
    @Override
    public DimensionedNumber<B> multiply(BigDecimal other) {
        PowerProduct<B> me = new PowerProduct<B>((B) this);
        return me.multiply(other);
    }

    @Override
    public Unit<B> raise(Fraction power) {
        PowerProduct<B> me = new PowerProduct<B>((B) this);
        return me.raise(power);
    }

    @Override
    public Unit<B> reciprocal() {
        return raise(new Fraction(-1));
    }

    @Override
    public DimensionedNumber<B> flat() {
        return new DimensionedNumber<B>(this);
    }
}
