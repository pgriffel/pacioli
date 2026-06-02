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

//public class Unit<B extends Base<B>> implements Unit<B> {
public class Unit<B extends Base> {

    public static <B extends Base> Unit<B> from(B base) {
        return new Unit<B>(base);
    }

    public static <B extends Base> Unit<B> one() {
        return new Unit<B>();
    }

    private final HashMap<B, Fraction> powers;

    public Unit() {
        powers = new HashMap<B, Fraction>();
    }

    public Unit(Unit<B> x, Unit<B> y) {
        // Unit<B> powers = new HashMap<B, Fraction>();

        HashMap<B, Fraction> hash = new HashMap<B, Fraction>();
        for (B base : x.bases()) {
            hash.put(base, x.power(base));
        }
        for (B base : y.bases()) {
            hash.put(base, y.power(base).add(x.power(base)));
        }
        powers = hash;
        // return new Unit<B>(hash);
    }

    public Unit(B base) {
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

    /**
     * @deprecated No longer relevant
     * 
     * @param <B>
     * @param unit
     * @return
     */
    public static <B extends Base> Unit<B> normal(Unit<B> unit) {
        return unit;
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
        return fold(new UnitFold<B, String>() {

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
        /*
         * String output = "";
         * for (B base : bases()) {
         * output += String.format("*%s^%s", base, power(base));
         * }
         * return output;
         */
    }

    public Unit<B> multiply(Unit<B> other) {
        return new Unit<B>(this, other);
    }

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

    // @Override
    // public Unit<B> map(UnitMap<B> map) {
    // Unit<B> newUnit = new Unit<B>();
    // for (B base : bases()) {
    // Unit<B> mapped = map.map(base).raise(power(base));
    // newUnit = newUnit.multiply(mapped);
    // }
    // return newUnit;
    // }

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

    public DimensionedNumber<B> flat(BaseFlatten<B> flattener) {
        DimensionedNumber<B> number = new DimensionedNumber<B>();
        for (B base : bases()) {
            DimensionedNumber<B> flattened = flattener.flatten(base).raise(power(base));
            number = number.multiply(flattened);
        }
        return number;
    }

    /*
     * @Override
     * public <T> T fold(UnitFold<B, T> fold) {
     * //T newUnit = new Unit();
     * T result = fold.one();
     * for (B base : bases()) {
     * T mapped = fold.expt(fold.map(base), power(base));
     * result = fold.mult(result, mapped);
     * }
     * return result;
     * }
     */
    public <T extends Base> Unit<T> map(UnitMap<B, T> map) {
        Unit<T> newUnit = new Unit<T>();
        for (B base : bases()) {
            Unit<T> mapped = new Unit<T>(map.apply(base)).raise(power(base));
            newUnit = newUnit.multiply(mapped);
        }
        return newUnit;
    }

    public <T extends Base> Unit<T> flatMap(UnitFlatMap<B, T> map) {
        Unit<T> newUnit = new Unit<T>();
        for (B base : bases()) {
            Unit<T> mapped = map.apply(base).raise(power(base));
            newUnit = newUnit.multiply(mapped);
        }
        return newUnit;
    }

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

    public boolean isElementary() {
        if (this.powers.size() == 1) {
            return this.powers.entrySet().iterator().next().getValue().equals(Fraction.ONE);
        } else {
            return false;
        }
    }

    public B singleElement() {
        if (this.powers.size() == 1) {
            return this.powers.keySet().iterator().next();
        } else {
            throw new RuntimeException(
                    String.format("Cannot get single element of %s, unit is not elementary.", this.pretty()));
        }
    }

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
}

// /*
// * Copyright 2026 Paul Griffioen
// *
// * Permission is hereby granted, free of charge, to any person obtaining a
// copy
// * of this software and associated documentation files (the "Software"), to
// deal
// * in the Software without restriction, including without limitation the
// rights
// * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// * copies of the Software, and to permit persons to whom the Software is
// * furnished to do so, subject to the following conditions:
// *
// * The above copyright notice and this permission notice shall be included in
// * all copies or substantial portions of the Software.
// *
// * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
// FROM,
// * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
// THE
// * SOFTWARE.
// */

// package uom;

// import java.math.BigDecimal;
// import java.util.Set;

// public interface Unit<B extends Base> {

// public static <B extends Base> Unit<B> from(B base) {
// return new Unit<B>(base);
// }

// public static <B extends Base> Unit<B> one() {
// return new Unit<B>();
// }

// public Set<B> bases();

// public Fraction power(B base);

// public Unit<B> multiply(Unit<B> other);

// public DimensionedNumber<B> multiply(BigDecimal factor);

// public Unit<B> raise(Fraction power);

// public Unit<B> reciprocal();

// public DimensionedNumber<B> flat(BaseFlatten<B> flatten);

// public String pretty();

// public <A extends Base> Unit<A> map(UnitMap<B, A> map);

// public <A extends Base> Unit<A> flatMap(UnitFlatMap<B, A> map);

// public <T> T fold(UnitFold<B, T> fold);

// boolean isElementary();

// B singleElement();
// }