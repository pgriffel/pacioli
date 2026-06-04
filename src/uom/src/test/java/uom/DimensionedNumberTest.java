package uom;

import static org.junit.jupiter.api.Assertions.*;

import java.math.BigDecimal;

import org.junit.jupiter.api.Test;

class DimensionedNumberTest {

    @Test
    void testMultiplyNumbersAndUnits() {
        SIBase meter = new SIBase("meter", "m");
        Unit<SIBase> length = Unit.from(meter);
        DimensionedNumber<SIBase> twoMeters = new DimensionedNumber<>(BigDecimal.valueOf(2), length);
        DimensionedNumber<SIBase> threeMeters = new DimensionedNumber<>(BigDecimal.valueOf(3), length);

        DimensionedNumber<SIBase> result = twoMeters.multiply(threeMeters);

        assertEquals(BigDecimal.valueOf(6), result.factor());
        assertEquals(new Fraction(2), result.unit().power(meter));
        assertEquals("6 m^2", result.pretty());
    }

    @Test
    void testDivideProducesReciprocalUnit() {
        SIBase meter = new SIBase("meter", "m");
        SIBase second = new SIBase("second", "s");

        DimensionedNumber<SIBase> velocity = new DimensionedNumber<>(BigDecimal.valueOf(6),
                Unit.<SIBase>from(meter).multiply(Unit.from(second).reciprocal()));

        DimensionedNumber<SIBase> time = new DimensionedNumber<>(BigDecimal.valueOf(2), Unit.from(second));

        DimensionedNumber<SIBase> result = velocity.divide(time);

        assertEquals(0, result.factor().compareTo(BigDecimal.valueOf(3)));
        assertEquals(Fraction.ONE, result.unit().power(meter));
        assertEquals(new Fraction(-2), result.unit().power(second));
    }

    @Test
    void testRaiseIntegerPower() {
        SIBase meter = new SIBase("meter", "m");
        Unit<SIBase> length = Unit.from(meter);
        DimensionedNumber<SIBase> oneMeter = new DimensionedNumber<>(BigDecimal.valueOf(4), length);

        DimensionedNumber<SIBase> area = oneMeter.raise(new Fraction(2));

        assertEquals(BigDecimal.valueOf(16), area.factor());
        assertEquals(new Fraction(2), area.unit().power(meter));
        assertEquals("16 m^2", area.pretty());
    }

    @Test
    void testReciprocal() {
        SIBase meter = new SIBase("meter", "m");
        DimensionedNumber<SIBase> number = new DimensionedNumber<>(BigDecimal.valueOf(5),
                Unit.from(meter));

        DimensionedNumber<SIBase> reciprocal = number.reciprocal();

        assertEquals(0, reciprocal.factor().compareTo(new BigDecimal("0.2")));
        assertEquals(new Fraction(-1), reciprocal.unit().power(meter));
    }

    @Test
    void testToTextUsesPrettyUnit() {
        SIBase meter = new SIBase("meter", "m");
        DimensionedNumber<SIBase> number = new DimensionedNumber<>(BigDecimal.valueOf(2), Unit.from(meter));

        assertEquals("2 m", number.pretty());
    }
}
