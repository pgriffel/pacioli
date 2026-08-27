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

import java.math.BigInteger;

/**
 * Fractional numbers for precise powers in units of measurement.
 * 
 * The unit class stores a unit as a map from Bases to Fractions.
 */
public class Fraction extends Number implements Comparable<Fraction> {

    private final int numerator;
    private final int denominator;

    public Fraction(int number) {
        numerator = number;
        denominator = 1;
    }

    public Fraction(int numerator, int denominator) {
        if (denominator == 0) {
            throw new RuntimeException("division by zero in fraction construction");
        }
        if (numerator == 0) {
            this.numerator = 0;
            this.denominator = 1;
        } else {
            int gcd = BigInteger.valueOf(numerator).gcd(BigInteger.valueOf(denominator)).intValue();
            if (denominator < 0) {
                this.numerator = -numerator / gcd;
                this.denominator = -denominator / gcd;
            } else {
                this.numerator = numerator / gcd;
                this.denominator = denominator / gcd;
            }
        }
    }

    @Override
    public int hashCode() {
        final int prime = 31;
        int result = 1;
        result = prime * result + numerator;
        if (numerator != 0) {
            result = prime * result + denominator;
        }
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
        Fraction other = (Fraction) obj;
        if (numerator != other.numerator)
            return false;
        if (numerator == 0 && other.numerator == 0) {
            return true;
        }
        if (denominator != other.denominator)
            return false;
        return true;
    }

    public Fraction mult(Fraction other) {
        return new Fraction(numerator * other.numerator, denominator * other.denominator);
    }

    public Fraction div(Fraction other) {
        return new Fraction(numerator * other.denominator, denominator * other.numerator);
    }

    public Fraction add(Fraction other) {
        int common = denominator * other.denominator;
        return new Fraction(numerator * other.denominator + denominator * other.numerator, common);
    }

    public Fraction abs() {
        return (numerator < 0) ? negate() : this;
    }

    public Fraction floor() {
        int div = numerator / denominator;
        int rem = numerator % denominator;
        if (rem == 0) {
            return new Fraction(div);
        }
        if ((numerator < 0) ^ (denominator < 0)) {
            return new Fraction(div - 1);
        }
        return new Fraction(div);
    }

    public boolean isInt() {
        return denominator == 1;
    }

    public static final Fraction MINTHREE = new Fraction(-3);
    public static final Fraction MINTWO = new Fraction(-2);
    public static final Fraction MINONE = new Fraction(-1);
    public static final Fraction ZERO = new Fraction(0);
    public static final Fraction ONE = new Fraction(1);
    public static final Fraction TWO = new Fraction(2);
    public static final Fraction THREE = new Fraction(3);

    public int compareTo(Fraction other) {
        int left = numerator * other.denominator;
        int right = denominator * other.numerator;
        if (left < right) {
            return -1;
        } else if (left > right) {
            return 1;
        } else {
            return 0;
        }
    }

    public int signum() {
        return compareTo(Fraction.ZERO);
    }

    public Fraction negate() {
        return new Fraction(-numerator, denominator);
    }

    public String toString() {
        if (denominator == 1) {
            return String.format("%s", numerator);
        } else {
            return String.format("%s/%s", numerator, denominator);
        }
    }

    @Override
    public int intValue() {
        return numerator / denominator;
    }

    @Override
    public double doubleValue() {
        double num = (double) numerator;
        double den = (double) denominator;
        return num / den;
    }

    @Override
    public long longValue() {
        long num = (long) numerator;
        long den = (long) denominator;
        return num / den;
    }

    @Override
    public float floatValue() {
        float num = (float) numerator;
        float den = (float) denominator;
        return num / den;
    }
}
