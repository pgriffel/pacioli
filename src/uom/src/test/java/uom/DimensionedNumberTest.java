package uom;

import static org.junit.jupiter.api.Assertions.*;

import java.math.BigDecimal;

import org.junit.jupiter.api.Test;

class DimensionedNumberTest {

    private static final class SimpleBase implements Base {
        private final String name;

        SimpleBase(String name) {
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

    private static final class UnitBase implements Base {
        private final String name;

        UnitBase(String name) {
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
    }

    @Test
    void testMultiplyNumbersAndUnits() {
        SimpleBase meter = new SimpleBase("m");
        Unit<SimpleBase> length = new Unit<>(meter);
        DimensionedNumber<SimpleBase> twoMeters = new DimensionedNumber<>(BigDecimal.valueOf(2), length);
        DimensionedNumber<SimpleBase> threeMeters = new DimensionedNumber<>(BigDecimal.valueOf(3), length);

        DimensionedNumber<SimpleBase> result = twoMeters.multiply(threeMeters);

        assertEquals(BigDecimal.valueOf(6), result.factor());
        assertEquals(new Fraction(2), result.unit().power(meter));
        assertEquals("6 m^2", result.toText());
    }

    @Test
    void testDivideProducesReciprocalUnit() {
        SimpleBase meter = new SimpleBase("m");
        SimpleBase second = new SimpleBase("s");

        DimensionedNumber<SimpleBase> velocity = new DimensionedNumber<>(BigDecimal.valueOf(6),
                new Unit<SimpleBase>(meter).multiply(new Unit<>(second).reciprocal()));

        DimensionedNumber<SimpleBase> time = new DimensionedNumber<>(BigDecimal.valueOf(2), new Unit<>(second));

        DimensionedNumber<SimpleBase> result = velocity.divide(time);

        assertEquals(0, result.factor().compareTo(BigDecimal.valueOf(3)));
        assertEquals(Fraction.ONE, result.unit().power(meter));
        assertEquals(new Fraction(-2), result.unit().power(second));
    }

    @Test
    void testRaiseIntegerPower() {
        SimpleBase meter = new SimpleBase("m");
        Unit<SimpleBase> length = new Unit<>(meter);
        DimensionedNumber<SimpleBase> oneMeter = new DimensionedNumber<>(BigDecimal.valueOf(4), length);

        DimensionedNumber<SimpleBase> area = oneMeter.raise(new Fraction(2));

        assertEquals(BigDecimal.valueOf(16), area.factor());
        assertEquals(new Fraction(2), area.unit().power(meter));
        assertEquals("16 m^2", area.toText());
    }

    @Test
    void testReciprocal() {
        SimpleBase meter = new SimpleBase("m");
        DimensionedNumber<SimpleBase> number = new DimensionedNumber<>(BigDecimal.valueOf(5),
                new Unit<>(meter));

        DimensionedNumber<SimpleBase> reciprocal = number.reciprocal();

        assertEquals(0, reciprocal.factor().compareTo(new BigDecimal("0.2")));
        assertEquals(new Fraction(-1), reciprocal.unit().power(meter));
    }

    @Test
    void testToTextUsesPrettyUnit() {
        UnitBase meter = new UnitBase("m");
        DimensionedNumber<UnitBase> number = new DimensionedNumber<>(BigDecimal.valueOf(2), new Unit<>(meter));

        assertEquals("2 m", number.toText());
    }
}
