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
import java.util.ArrayList;
import java.util.Collections;
import java.util.Comparator;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

/**
 * Unit of measurement.
 * 
 * A unit type Unit<B> is parameterized with base type B. The bases in the unit
 * are of type B.
 * 
 * The unit is stored as a sparse map from bases to fractional numbers. The
 * fractional numbers avoid rounding errors.
 * 
 * A base is not a unit. Use Unit.from(base) to create a base unit from a base.
 */
public class Unit<B extends Base> {

    /**
     * Interface for the fold method
     */
    public interface Fold<X extends Base, Y> {

        public Y map(X base);

        public Y mult(Y x, Y y);

        public Y expt(Y x, Fraction n);

        public Y one();
    }

    /**
     * Interface for the map method
     */
    public interface Map<X extends Base, Y extends Base> {
        public Y apply(X base);
    }

    /**
     * Interface for the flatMap method
     */
    public interface FlatMap<X extends Base, Y extends Base> {
        public Unit<Y> apply(X base);
    }

    /**
     * Interface for the reduce method
     */
    public interface Reduce<X extends Base> {

        public DimensionedNumber<X> apply(X base);
    }

    private final HashMap<B, Fraction> powers;

    private Unit() {
        powers = new HashMap<B, Fraction>();
    }

    private Unit(B base) {
        powers = new HashMap<B, Fraction>();
        powers.put(base, Fraction.ONE);
    }

    private Unit(HashMap<B, Fraction> map) {
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

    public Fraction power(B base) {
        Fraction value = powers.get(base);
        return (value == null ? Fraction.ZERO : value);
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

    public Unit<B> multiply(Unit<B> other) {
        HashMap<B, Fraction> hash = new HashMap<B, Fraction>();

        for (B base : this.bases()) {
            hash.put(base, this.power(base));
        }

        for (B base : other.bases()) {
            hash.put(base, other.power(base).add(this.power(base)));
        }

        return new Unit<>(hash);
    }

    public DimensionedNumber<B> multiply(BigDecimal factor) {
        return new DimensionedNumber<B>(factor, this);
    }

    public Unit<B> raise(Fraction power) {
        HashMap<B, Fraction> hash = new HashMap<B, Fraction>();
        for (B base : bases()) {
            hash.put(base, power(base).mult(power));
        }
        return new Unit<B>(hash);
    }

    public Unit<B> reciprocal() {
        return raise(new Fraction(-1));
    }

    /**
     * Does the unit have a single base and does that base has power 1?
     * 
     * See singleElement
     * 
     * @return True if so.
     */
    public boolean isElementary() {
        return this.powers.size() == 1
                && this.powers.values().iterator().next().equals(Fraction.ONE);
    }

    /**
     * The single base in the unit.
     * 
     * It is an error if the unit does not have exactly one base or the power of
     * that base does not equal 1.
     * 
     * See isElementary.
     * 
     * @return The base
     */
    public B singleElement() {
        if (this.powers.size() == 1) {
            B base = this.powers.keySet().iterator().next();

            if (power(base).equals(Fraction.ONE)) {
                return base;
            }
        }

        throw new RuntimeException(
                String.format("Cannot get single element of %s, unit is not elementary.", this.toString()));
    }

    /**
     * Reduces the unit of measurement to an equivalent coherent dimensioned number.
     * 
     * A coherent dimensioned number is a number expressed in base units only.
     * 
     * Maps the reducer (recursively) to all bases in the number's unit. It is
     * assumed the reducer replaces a base with a coherent equivalent.
     * 
     * @param reducer Function that maps a base to a coherent equivalent.
     * @return The equivalent coherent dimensioned number.
     */
    public DimensionedNumber<B> reduce(Reduce<B> reducer) {
        DimensionedNumber<B> number = new DimensionedNumber<B>();

        for (B base : bases()) {
            DimensionedNumber<B> coherent = reducer.apply(base).raise(power(base));

            number = number.multiply(coherent);
        }

        return number;
    }

    /**
     * Maps b0^p0 * ... * bn^pn to f(b0)^p0 * ... * f(b0)^pn, where f(bi) is
     * a unit constructed from the result of applying the given map to bi.
     * 
     * @param <T> Type of the mapped bases
     * @param map A map from bases to bases
     * @return The mapped unit
     */
    public <T extends Base> Unit<T> map(Map<B, T> map) {
        Unit<T> newUnit = new Unit<T>();

        for (B base : bases()) {
            Unit<T> mapped = new Unit<T>(map.apply(base)).raise(power(base));

            newUnit = newUnit.multiply(mapped);
        }

        return newUnit;
    }

    /**
     * Maps b0^p0 * ... * bn^pn to f(b0)^p0 * ... * f(b0)^pn, where f(bi) is the
     * result of applying the given map to bi.
     * 
     * @param <T> Type of the mapped units
     * @param map A map from bases to units
     * @return The mapped unit
     */
    public <T extends Base> Unit<T> flatMap(FlatMap<B, T> map) {
        Unit<T> newUnit = new Unit<T>();

        for (B base : bases()) {
            Unit<T> mapped = map.apply(base).raise(power(base));

            newUnit = newUnit.multiply(mapped);
        }

        return newUnit;
    }

    /**
     * In b0^p0 * ... * bn^pn replaces b0 by fold.map(b0), * by fold.mult and ^ by
     * fold.expt.
     * 
     * Returns fold.one() if this unit is 1 (the identity unit one()).
     * 
     * @param <T>  Type of the result
     * @param fold The fold operations
     * @return The folded unit
     */
    public <T> T fold(Fold<B, T> fold) {
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
    }

    /**
     * Alphabetical order of units of measurement. Orders the units using the pretty
     * form.
     */
    public class BaseComparator<X extends Base> implements Comparator<X> {

        @Override
        public int compare(X o1, X o2) {
            String text1 = o1.pretty();
            String text2 = o2.pretty();
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

    @Override
    public String toString() {
        return fold(new Fold<B, String>() {

            @Override
            public String map(B base) {
                return base.toString();
            }

            @Override
            public String mult(String x, String y) {
                return x + "*" + y;
            }

            @Override
            public String expt(String x, Fraction n) {
                if (n.intValue() == 1) {
                    return x;
                } else {
                    return x + "^" + n.toString();
                }
            }

            @Override
            public String one() {
                return "1";
            }
        });
    }

    /**
     * Text form for use in output.
     * 
     * @return String form suitable for output.
     */
    public String pretty() {

        String symbolic = "";
        String sep = "";

        List<B> bases = new ArrayList<B>(bases());
        Collections.sort(bases, new BaseComparator<B>());
        for (B base : bases) {
            Fraction power = power(base);
            if (0 < power.signum()) {
                symbolic = symbolic.concat(sep);
                // sep = "ï¿½";
                sep = "*";
                symbolic = symbolic.concat(base.pretty());

                // if (power.compareTo(Fraction.MINTHREE) == 0) {
                // symbolic = symbolic.concat("ï¿½");
                // } else if (power.compareTo(Fraction.MINTWO) == 0) {
                // symbolic = symbolic.concat("ï¿½");
                // } else if (power.compareTo(Fraction.MINONE) == 0) {
                // symbolic = symbolic.concat("ï¿½");
                // } else if (power.compareTo(Fraction.TWO) == 0) {
                // symbolic = symbolic.concat("ï¿½");
                // } else if (power.compareTo(Fraction.THREE) == 0) {
                // symbolic = symbolic.concat("ï¿½");
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
        // sep = "ï¿½";
        for (B base : bases) {
            Fraction power = power(base);
            if (power.signum() < 0) {
                // power = power.negate();
                symbolic = symbolic.concat(sep);
                // sep = "ï¿½";
                sep = "/";
                symbolic = symbolic.concat(base.pretty());

                if (power.compareTo(Fraction.MINONE) != 0) {
                    symbolic = symbolic.concat("^");
                    symbolic = symbolic.concat(power.negate().toString());
                }
            }
        }

        return symbolic;
    }

    /**
     * Creates a base unit from a base.
     * 
     * @param <B>  The unit's base type
     * @param base A base
     * @return A base unit
     */
    public static <B extends Base> Unit<B> from(B base) {
        return new Unit<B>(base);
    }

    /**
     * The identity element in the group of units.
     * 
     * @param <B> The unit's base type
     * @return A 'dimensionless' unit
     */
    public static <B extends Base> Unit<B> one() {
        return new Unit<B>();
    }

}
