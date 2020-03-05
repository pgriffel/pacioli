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

//public class PowerProduct<B extends Base<B>> implements Unit<B> {
public class PowerProduct<B> implements Unit<B> {

    private final HashMap<B, Fraction> powers;

    public PowerProduct() {
        powers = new HashMap<B, Fraction>();
    }
    
    public PowerProduct(Unit<B> x, Unit<B> y) {
        //PowerProduct<B> powers = new HashMap<B, Fraction>();

        HashMap<B, Fraction> hash = new HashMap<B, Fraction>();
        for (B base : x.bases()) {
            hash.put(base, x.power(base));
        }
        for (B base : y.bases()) {
            hash.put(base, y.power(base).add(x.power(base)));
        }
        powers = hash;
        //return new PowerProduct<B>(hash);
    }
    
    public PowerProduct(B base) {
        powers = new HashMap<B, Fraction>();
        powers.put(base, Fraction.ONE);
    }

    private PowerProduct(HashMap<B, Fraction> map) {
        powers = map;
    }

    public Set<B> bases() {
        Set<B> bases = new HashSet<B>();
        for (B base : powers.keySet()) {
            if (power(base).compareTo(Fraction.ZERO) != 0) {
                bases.add(base);
            }
        }
        return bases;
    }

    @Override
    public Fraction power(B base) {
        Fraction value = powers.get(base);
        return (value == null ? Fraction.ZERO : value);
    }

    public static <B extends Base<B>> Unit<B> normal(Unit<B> unit) {
        Set<B> bases = unit.bases();
        if (bases.size() == 1) {
            B base = (B) bases.toArray()[0];
            if (unit.power(base).compareTo(Fraction.ONE) == 0) {
                return (Unit<B>) base;
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
        if (!(other instanceof Unit<?>)) {
            return false;
        }
        Unit<B> otherUnit = (Unit<B>) other;
        for (B base : bases()) {
            if (power(base).compareTo(otherUnit.power(base)) != 0) {
                return false;
            }
        }
        for (B base : otherUnit.bases()) {
            if (power(base).compareTo(otherUnit.power(base)) != 0) {
                return false;
            }
        }
        return true;
    }

    @Override
    public String toString() {
        String output = "";
        for (B base : bases()) {
            output += String.format("*%s^%s", base, power(base));
        }
        return output;
    }

    @Override
    public DimensionedNumber multiply(BigDecimal factor) {
        return new DimensionedNumber(factor, this);
    }

    @Override
    public Unit<B> multiply(Unit<B> other) {

        HashMap<B, Fraction> hash = new HashMap<B, Fraction>();
        for (B base : bases()) {
            hash.put(base, power(base));
        }
        for (B base : other.bases()) {
            hash.put(base, other.power(base).add(power(base)));
        }
        return new PowerProduct<B>(hash);
    }

    @Override
    public Unit<B> raise(Fraction power) {
        HashMap<B, Fraction> hash = new HashMap<B, Fraction>();
        for (B base : bases()) {
            hash.put(base, power(base).mult(power));
        }
        return new PowerProduct<B>(hash);
    }

    @Override
    public Unit reciprocal() {
        return raise(new Fraction(-1));
    }

    @Override
    public DimensionedNumber flat() {
        DimensionedNumber number = new DimensionedNumber();
        for (B base : bases()) {
            DimensionedNumber flattened = ((Unit<B>) base).flat().raise(power(base));
            number = number.multiply(flattened);
        }
        return number;
    }

    @Override
    public <T> T fold(UnitFold<B, T> fold) {
        //T newUnit = new PowerProduct();
        T result = fold.one();
        for (B base : bases()) {
            T mapped = fold.expt(fold.map(base), power(base));
            result = fold.mult(result, mapped);
        }
        return result;
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

    @Override
    public String toText() {

        String symbolic = "";
        String sep = "";

        List<B> bases = new ArrayList<B>(bases());
        Collections.sort(bases, new BaseComparator());
        for (B base : bases) {
            Fraction power = power(base);
            if (0 < power.signum()) {
                symbolic = symbolic.concat(sep);
                // sep = "·";
                sep = "*";
                symbolic = symbolic.concat(((Unit<B>) base).toText());

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
        for (B base : bases) {
            Fraction power = power(base);
            if (power.signum() < 0) {
                // power = power.negate();
                symbolic = symbolic.concat(sep);
                // sep = "·";
                sep = "/";
                symbolic = symbolic.concat(((Unit<B>) base).toText());

                if (power.compareTo(Fraction.MINONE) != 0) {
                    symbolic = symbolic.concat("^");
                    symbolic = symbolic.concat(power.negate().toString());
                }
            }
        }

        return symbolic;
    }

    public class BaseComparator<B> implements Comparator<B> {

        @Override
        public int compare(B o1, B o2) {
            String text1 = ((Unit<B>) o1).toText();
            String text2 = ((Unit<B>) o2).toText();
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