package uom;

import static org.junit.jupiter.api.Assertions.*;

import java.util.Set;

import org.junit.jupiter.api.Test;

class PowerProductTest {

    private static final class SimpleBase implements Base {
        private final String name;

        private SimpleBase(String name) {
            this.name = name;
        }

        @Override
        public String pretty() {
            return name;
        }

        @Override
        public String toString() {
            return name;
        }

        @Override
        public boolean equals(Object other) {
            if (this == other) {
                return true;
            }
            if (!(other instanceof SimpleBase)) {
                return false;
            }
            return name.equals(((SimpleBase) other).name);
        }

        @Override
        public int hashCode() {
            return name.hashCode();
        }
    }

    @Test
    void testMultiplyAddsExponents() {
        SimpleBase meter = new SimpleBase("m");
        SimpleBase second = new SimpleBase("s");

        PowerProduct<SimpleBase> length = new PowerProduct<>(meter);
        PowerProduct<SimpleBase> time = new PowerProduct<>(second);
        Unit<SimpleBase> velocity = length.multiply(time.reciprocal());

        assertTrue(velocity.bases().contains(meter));
        assertTrue(velocity.bases().contains(second));
        assertEquals(Fraction.ONE, velocity.power(meter));
        assertEquals(new Fraction(-1), velocity.power(second));
    }

    @Test
    void testRaiseAndReciprocal() {
        SimpleBase meter = new SimpleBase("m");
        PowerProduct<SimpleBase> length = new PowerProduct<>(meter);

        Unit<SimpleBase> area = length.raise(new Fraction(2));
        assertEquals(new Fraction(2), area.power(meter));

        Unit<SimpleBase> inverseArea = area.reciprocal();
        assertEquals(new Fraction(-2), inverseArea.power(meter));
    }

    @Test
    void testEqualityIsOrderIndependent() {
        SimpleBase meter = new SimpleBase("m");
        SimpleBase second = new SimpleBase("s");

        Unit<SimpleBase> unitA = new PowerProduct<>(meter).multiply(new PowerProduct<>(second));
        Unit<SimpleBase> unitB = new PowerProduct<>(second).multiply(new PowerProduct<>(meter));

        assertEquals(unitA, unitB);
    }

    @Test
    void testToStringOmitsExponentOne() {
        SimpleBase meter = new SimpleBase("m");
        Unit<SimpleBase> length = new PowerProduct<>(meter);
        assertEquals("m", length.toString());

        Unit<SimpleBase> area = length.raise(new Fraction(2));
        assertEquals("m^2", area.toString());
    }

    private static final class UnitBase implements Base, Unit<UnitBase> {
        private final String name;

        private UnitBase(String name) {
            this.name = name;
        }

        @Override
        public Set<UnitBase> bases() {
            return Set.of(this);
        }

        @Override
        public Fraction power(UnitBase base) {
            return equals(base) ? Fraction.ONE : Fraction.ZERO;
        }

        @Override
        public Unit<UnitBase> multiply(Unit<UnitBase> other) {
            return new PowerProduct<>(this).multiply(other);
        }

        @Override
        public DimensionedNumber<UnitBase> multiply(java.math.BigDecimal factor) {
            return new DimensionedNumber<>(factor, this);
        }

        @Override
        public Unit<UnitBase> raise(Fraction power) {
            return new PowerProduct<>(this).raise(power);
        }

        @Override
        public Unit<UnitBase> reciprocal() {
            return new PowerProduct<>(this).reciprocal();
        }

        @Override
        public DimensionedNumber<UnitBase> flat() {
            return new DimensionedNumber<>(java.math.BigDecimal.ONE, this);
        }

        @Override
        public String pretty() {
            return name;
        }

        @Override
        public Unit<UnitBase> map(UnitMap<UnitBase> map) {
            return map.map(this);
        }

        @Override
        public <T> T fold(UnitFold<UnitBase, T> fold) {
            return fold.expt(fold.map(this), Fraction.ONE);
        }

        @Override
        public String toString() {
            return name;
        }

        @Override
        public boolean equals(Object other) {
            if (this == other) {
                return true;
            }
            if (!(other instanceof UnitBase)) {
                return false;
            }
            return name.equals(((UnitBase) other).name);
        }

        @Override
        public int hashCode() {
            return name.hashCode();
        }
    }

    @Test
    void testMapAppliesUnitMapToEachBase() {
        SimpleBase meter = new SimpleBase("m");
        SimpleBase second = new SimpleBase("s");

        Unit<SimpleBase> velocity = new PowerProduct<>(meter)
                .multiply(new PowerProduct<>(second).raise(new Fraction(2)));
        Unit<SimpleBase> mapped = velocity.map(base -> new PowerProduct<>(base).raise(new Fraction(2)));

        assertEquals(new Fraction(2), mapped.power(meter));
        assertEquals(new Fraction(4), mapped.power(second));
    }

    @Test
    void testFlatUsesBaseFlat() {
        UnitBase meter = new UnitBase("m");
        Unit<UnitBase> length = new PowerProduct<>(meter);

        DimensionedNumber<UnitBase> flat = length.flat();

        assertEquals(0, flat.factor().compareTo(java.math.BigDecimal.ONE));
        assertEquals(length, flat.unit());
    }
}
