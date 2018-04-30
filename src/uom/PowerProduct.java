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
import java.util.ArrayList;
import java.util.Collections;
import java.util.Comparator;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

public class PowerProduct implements Unit {

    private final HashMap<Base, Fraction> powers;

    public PowerProduct() {
        powers = new HashMap<Base, Fraction>();
    }

    public PowerProduct(Base base) {
        powers = new HashMap<Base, Fraction>();
        powers.put(base, Fraction.ONE);
    }

    private PowerProduct(HashMap<Base, Fraction> map) {
        powers = map;
    }

    public Set<Base> bases() {
        Set<Base> bases = new HashSet<Base>();
        for (Base base : powers.keySet()) {
            if (power(base).compareTo(Fraction.ZERO) != 0) {
                bases.add(base);
            }
        }
        return bases;
    }

    @Override
    public Fraction power(Base base) {
        Fraction value = powers.get(base);
        return (value == null ? Fraction.ZERO : value);
    }

    public static Unit normal(Unit unit) {
        Set<Base> bases = unit.bases();
        if (bases.size() == 1) {
            Base base = (Base) bases.toArray()[0];
            if (unit.power(base).compareTo(Fraction.ONE) == 0) {
                return base;
            } else {
                return unit;
            }
        } else {
            return unit;
        }
    }

    @Override
    public int hashCode() {
        return powers.hashCode();
    }

    @Override
    public boolean equals(Object other) {
        if (other == this) {
            return true;
        }
        if (!(other instanceof Unit)) {
            return false;
        }
        Unit otherUnit = (Unit) other;
        for (Base base : bases()) {
            if (power(base).compareTo(otherUnit.power(base)) != 0) {
                return false;
            }
        }
        for (Base base : otherUnit.bases()) {
            if (power(base).compareTo(otherUnit.power(base)) != 0) {
                return false;
            }
        }
        return true;
    }

    @Override
    public String toString() {
        String output = "";
        for (Base base : bases()) {
            output += String.format("*%s^%s", base, power(base));
        }
        return output;
    }

    @Override
    public DimensionedNumber multiply(BigDecimal factor) {
        return new DimensionedNumber(factor, this);
    }

    @Override
    public Unit multiply(Unit other) {

        HashMap<Base, Fraction> hash = new HashMap<Base, Fraction>();
        for (Base base : bases()) {
            hash.put(base, power(base));
        }
        for (Base base : other.bases()) {
            hash.put(base, other.power(base).add(power(base)));
        }
        return new PowerProduct(hash);
    }

    @Override
    public Unit raise(Fraction power) {
        HashMap<Base, Fraction> hash = new HashMap<Base, Fraction>();
        for (Base base : bases()) {
            hash.put(base, power(base).mult(power));
        }
        return new PowerProduct(hash);
    }

    @Override
    public Unit reciprocal() {
        return raise(new Fraction(-1));
    }

    @Override
    public DimensionedNumber flat() {
        DimensionedNumber number = new DimensionedNumber();
        for (Base base : bases()) {
            DimensionedNumber flattened = base.flat().raise(power(base));
            number = number.multiply(flattened);
        }
        return number;
    }

    @Override
    public Unit map(UnitMap map) {
        Unit newUnit = new PowerProduct();
        for (Base base : bases()) {
            Unit mapped = map.map(base).raise(power(base));
            newUnit = newUnit.multiply(mapped);
        }
        return newUnit;
    }

    @Override
    public String toText() {

        String symbolic = "";
        String sep = "";

        List<Base> bases = new ArrayList<Base>(bases());
        Collections.sort(bases, new BaseComparator());
        for (Base base : bases) {
            Fraction power = power(base);
            if (0 < power.signum()) {
                symbolic = symbolic.concat(sep);
                // sep = "·";
                sep = "*";
                symbolic = symbolic.concat(base.toText());

                // if (power.compareTo(Fraction.MINTHREE) == 0) {
                // symbolic = symbolic.concat("³");
                // } else if (power.compareTo(Fraction.MINTWO) == 0) {
                // symbolic = symbolic.concat("²");
                // } else if (power.compareTo(Fraction.MINONE) == 0) {
                // symbolic = symbolic.concat("¹");
                // } else if (power.compareTo(Fraction.TWO) == 0) {
                // symbolic = symbolic.concat("²");
                // } else if (power.compareTo(Fraction.THREE) == 0) {
                // symbolic = symbolic.concat("³");
                // } else if (power.compareTo(Fraction.ONE) != 0) {
                // symbolic = symbolic.concat("^");
                // symbolic = symbolic.concat(power.toString());
                // }
                if (power.compareTo(Fraction.ONE) != 0) {
                    symbolic = symbolic.concat("^");
                    symbolic = symbolic.concat(power.toString());
                }
            }
        }
        if (symbolic.isEmpty()) {
            symbolic = "1";
        }
        sep = "/";
        // sep = "·";
        for (Base base : bases) {
            Fraction power = power(base);
            if (power.signum() < 0) {
                // power = power.negate();
                symbolic = symbolic.concat(sep);
                // sep = "·";
                sep = "/";
                symbolic = symbolic.concat(base.toText());

                if (power.compareTo(Fraction.MINONE) != 0) {
                    symbolic = symbolic.concat("^");
                    symbolic = symbolic.concat(power.negate().toString());
                }
            }
        }

        return symbolic;
    }

    public class BaseComparator implements Comparator<Base> {

        @Override
        public int compare(Base o1, Base o2) {
            String text1 = o1.toText();
            String text2 = o2.toText();
            if (text1.length() > 0 && text2.length() > 0) {
                boolean char1Upper = Character.isUpperCase(text1.charAt(0));
                boolean char2Upper = Character.isUpperCase(text2.charAt(0));
                if (char1Upper && !char2Upper) {
                    return 1;
                }
                if (!char1Upper && char2Upper) {
                    return -1;
                }
            }
            return text1.compareTo(text2);
        }
    }
}