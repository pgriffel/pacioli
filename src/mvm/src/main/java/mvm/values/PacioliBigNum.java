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

package mvm.values;

import java.io.PrintWriter;
import java.math.BigDecimal;
import java.math.MathContext;

public class PacioliBigNum implements PacioliValue {

    static public int precision = 14;

    public final BigDecimal value;

    public PacioliBigNum(BigDecimal value) {
        this.value = value;
    }

    public PacioliBigNum(String value) {
        this.value = new BigDecimal(value);
    }

    @Override
    public void printText(PrintWriter out) {
        out.print(value);
    }

    @Override
    public void printTerminalText(PrintWriter out) {
        out.print(value);
    }

    @Override
    public int hashCode() {
        return value.hashCode();
    }

    @Override
    public boolean equals(Object other) {
        if (other == this) {
            return true;
        }
        if (!(other instanceof PacioliBigNum)) {
            return false;
        }
        PacioliBigNum otherString = (PacioliBigNum) other;
        return this.value.compareTo(otherString.value) == 0;
    }

    public PacioliBigNum add(PacioliBigNum other) {
        return new PacioliBigNum(value.add(other.value));
    }

    public PacioliBigNum subtract(PacioliBigNum other) {
        return new PacioliBigNum(value.subtract(other.value));
    }

    public PacioliBigNum multiply(PacioliBigNum other) {
        return new PacioliBigNum(value.multiply(other.value));
    }

    public PacioliBigNum divide(PacioliBigNum other, int precision) {
        MathContext mc = new MathContext(precision);
        return new PacioliBigNum(value.divide(other.value, mc));
    }

    public PacioliBigNum power(int n) {
        return new PacioliBigNum(value.pow(n));
    }

    public PacioliBigNum sqrt(int precision) {
        MathContext mc = new MathContext(precision);
        return new PacioliBigNum(value.sqrt(mc));
    }
}
