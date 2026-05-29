package uom;

import static org.junit.jupiter.api.Assertions.*;

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
}
