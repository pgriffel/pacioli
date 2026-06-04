package uom;

import static org.junit.jupiter.api.Assertions.*;

import org.junit.jupiter.api.Test;

class UnitTest {

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

        Unit<SimpleBase> length = Unit.from(meter);
        Unit<SimpleBase> time = Unit.from(second);
        Unit<SimpleBase> velocity = length.multiply(time.reciprocal());

        assertTrue(velocity.bases().contains(meter));
        assertTrue(velocity.bases().contains(second));
        assertEquals(Fraction.ONE, velocity.power(meter));
        assertEquals(new Fraction(-1), velocity.power(second));
    }

    @Test
    void testRaiseAndReciprocal() {
        SimpleBase meter = new SimpleBase("m");
        Unit<SimpleBase> length = Unit.from(meter);

        Unit<SimpleBase> area = length.raise(new Fraction(2));
        assertEquals(new Fraction(2), area.power(meter));

        Unit<SimpleBase> inverseArea = area.reciprocal();
        assertEquals(new Fraction(-2), inverseArea.power(meter));
    }

    @Test
    void testEqualityIsOrderIndependent() {
        SimpleBase meter = new SimpleBase("m");
        SimpleBase second = new SimpleBase("s");

        Unit<SimpleBase> unitA = Unit.from(meter).multiply(Unit.from(second));
        Unit<SimpleBase> unitB = Unit.from(second).multiply(Unit.from(meter));

        assertEquals(unitA, unitB);
    }

    @Test
    void testToStringOmitsExponentOne() {
        SimpleBase meter = new SimpleBase("m");
        Unit<SimpleBase> length = Unit.from(meter);
        assertEquals("m", length.pretty());

        Unit<SimpleBase> area = length.raise(new Fraction(2));
        assertEquals("m^2", area.pretty());
    }

    private static final class UnitBase implements Base {
        private final String name;

        private UnitBase(String name) {
            this.name = name;
        }

        @Override
        public String pretty() {
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

        DimensionedNumber<UnitBase> flat() {
            return new DimensionedNumber<>(this);
        }
    }

    @Test
    void testMapAppliesUnitMapToEachBase() {
        SimpleBase meter = new SimpleBase("m");
        SimpleBase second = new SimpleBase("s");

        Unit<SimpleBase> velocity = Unit.from(meter)
                .multiply(Unit.from(second).raise(new Fraction(2)));
        Unit<SimpleBase> mapped = velocity.flatMap(base -> Unit.from(base).raise(new Fraction(2)));

        assertEquals(new Fraction(2), mapped.power(meter));
        assertEquals(new Fraction(4), mapped.power(second));
    }

    @Test
    void testFlatUsesBaseFlat() {
        UnitBase meter = new UnitBase("m");
        Unit<UnitBase> length = Unit.from(meter);

        DimensionedNumber<UnitBase> flat = length.reduce(UnitBase::flat);

        assertEquals(0, flat.factor().compareTo(java.math.BigDecimal.ONE));
        assertEquals(length, flat.unit());
    }
}
