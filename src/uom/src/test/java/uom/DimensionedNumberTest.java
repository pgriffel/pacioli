package uom;

import static org.junit.jupiter.api.Assertions.*;

import java.math.BigDecimal;
import java.util.Set;

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

    private static final class UnitBase implements Base, Unit<UnitBase> {
        private final String name;

        UnitBase(String name) {
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
            return new DimensionedNumber<>(BigDecimal.ONE, this);
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
    void testMultiplyNumbersAndUnits() {
        SimpleBase meter = new SimpleBase("m");
        PowerProduct<SimpleBase> length = new PowerProduct<>(meter);
        DimensionedNumber<SimpleBase> twoMeters = new DimensionedNumber<>(BigDecimal.valueOf(2), length);
        DimensionedNumber<SimpleBase> threeMeters = new DimensionedNumber<>(BigDecimal.valueOf(3), length);

        DimensionedNumber<SimpleBase> result = twoMeters.multiply(threeMeters);

        assertEquals(BigDecimal.valueOf(6), result.factor());
        assertEquals(new Fraction(2), result.unit().power(meter));
        assertEquals("6 m^2", result.toString());
    }

    @Test
    void testDivideProducesReciprocalUnit() {
        SimpleBase meter = new SimpleBase("m");
        SimpleBase second = new SimpleBase("s");

        DimensionedNumber<SimpleBase> velocity = new DimensionedNumber<>(BigDecimal.valueOf(6),
                new PowerProduct<SimpleBase>(meter).multiply(new PowerProduct<>(second).reciprocal()));

        DimensionedNumber<SimpleBase> time = new DimensionedNumber<>(BigDecimal.valueOf(2), new PowerProduct<>(second));

        DimensionedNumber<SimpleBase> result = velocity.divide(time);

        assertEquals(0, result.factor().compareTo(BigDecimal.valueOf(3)));
        assertEquals(Fraction.ONE, result.unit().power(meter));
        assertEquals(new Fraction(-2), result.unit().power(second));
    }

    @Test
    void testRaiseIntegerPower() {
        SimpleBase meter = new SimpleBase("m");
        PowerProduct<SimpleBase> length = new PowerProduct<>(meter);
        DimensionedNumber<SimpleBase> oneMeter = new DimensionedNumber<>(BigDecimal.valueOf(4), length);

        DimensionedNumber<SimpleBase> area = oneMeter.raise(new Fraction(2));

        assertEquals(BigDecimal.valueOf(16), area.factor());
        assertEquals(new Fraction(2), area.unit().power(meter));
        assertEquals("16 m^2", area.toString());
    }

    @Test
    void testReciprocal() {
        SimpleBase meter = new SimpleBase("m");
        DimensionedNumber<SimpleBase> number = new DimensionedNumber<>(BigDecimal.valueOf(5),
                new PowerProduct<>(meter));

        DimensionedNumber<SimpleBase> reciprocal = number.reciprocal();

        assertEquals(0, reciprocal.factor().compareTo(new BigDecimal("0.2")));
        assertEquals(new Fraction(-1), reciprocal.unit().power(meter));
    }

    @Test
    void testToTextUsesPrettyUnit() {
        UnitBase meter = new UnitBase("m");
        DimensionedNumber<UnitBase> number = new DimensionedNumber<>(BigDecimal.valueOf(2), new PowerProduct<>(meter));

        assertEquals("2 m", number.toText());
    }
}
