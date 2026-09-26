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

/**
 * Implementation of the Base interface for SI units.
 */
public class SIBase implements Base {

    private final String name;
    private final String symbol;
    private final Prefix prefix;

    public SIBase(String name, String symbol) {
        this.name = name;
        this.symbol = symbol;
        this.prefix = Prefix.ONE;
    }

    public SIBase(String name, String symbol, Prefix prefix) {
        this.name = name;
        this.symbol = symbol;
        this.prefix = prefix;
    }

    public String name() {
        return name;
    }

    public String symbol() {
        return symbol;
    }

    public Prefix prefix() {
        return prefix;
    }

    @Override
    public int hashCode() {
        final int prime = 31;
        int result = 1;
        result = prime * result + ((name == null) ? 0 : name.hashCode());
        result = prime * result + ((symbol == null) ? 0 : symbol.hashCode());
        result = prime * result + ((prefix == null) ? 0 : prefix.hashCode());
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
        SIBase other = (SIBase) obj;
        if (name == null) {
            if (other.name != null)
                return false;
        } else if (!name.equals(other.name))
            return false;
        if (symbol == null) {
            if (other.symbol != null)
                return false;
        } else if (!symbol.equals(other.symbol))
            return false;
        if (prefix == null) {
            if (other.prefix != null)
                return false;
        } else if (!prefix.equals(other.prefix))
            return false;
        return true;
    }

    @Override
    public String pretty() {
        return prefix.equals(Prefix.ONE) ? this.symbol : prefix.symbol() + this.symbol;
    }

    public DimensionedNumber<SIBase> reduce() {
        return Unit
                .from(new SIBase(this.name, this.symbol))
                .multiply(this.prefix.prefixFactor());
    }

}