package uom;

import static org.junit.jupiter.api.Assertions.*;

import java.math.BigDecimal;

import org.junit.jupiter.api.Test;

class UnitTest {

    @Test
    void testMultiplyAddsExponents() {
        SIBase meter = new SIBase("meter", "m");
        SIBase second = new SIBase("second", "s");

        Unit<SIBase> length = Unit.from(meter);
        Unit<SIBase> time = Unit.from(second);
        Unit<SIBase> velocity = length.multiply(time.reciprocal());

        assertTrue(velocity.bases().contains(meter));
        assertTrue(velocity.bases().contains(second));
        assertEquals(Fraction.ONE, velocity.power(meter));
        assertEquals(new Fraction(-1), velocity.power(second));
    }

    @Test
    void testRaiseAndReciprocal() {
        SIBase meter = new SIBase("meter", "m");
        Unit<SIBase> length = Unit.from(meter);

        Unit<SIBase> area = length.raise(new Fraction(2));
        assertEquals(new Fraction(2), area.power(meter));

        Unit<SIBase> inverseArea = area.reciprocal();
        assertEquals(new Fraction(-2), inverseArea.power(meter));
    }

    @Test
    void testEqualityIsOrderIndependent() {
        SIBase meter = new SIBase("meter", "m");
        SIBase second = new SIBase("second", "s");

        Unit<SIBase> unitA = Unit.from(meter).multiply(Unit.from(second));
        Unit<SIBase> unitB = Unit.from(second).multiply(Unit.from(meter));

        assertEquals(unitA, unitB);
    }

    @Test
    void testToStringOmitsExponentOne() {
        SIBase meter = new SIBase("meter", "m");
        Unit<SIBase> length = Unit.from(meter);
        assertEquals("m", length.pretty());

        Unit<SIBase> area = length.raise(new Fraction(2));
        assertEquals("m^2", area.pretty());
    }

    @Test
    void testMultiplyWithSIBaseAndPrefix() {
        SIBase kiloMeter = new SIBase("meter", "m", new Prefix("k", BigDecimal.valueOf(1000)));
        SIBase second = new SIBase("second", "s");

        Unit<SIBase> velocity = Unit.from(kiloMeter).multiply(Unit.from(second).reciprocal());

        assertEquals(Fraction.ONE, velocity.power(kiloMeter));
        assertEquals(new Fraction(-1), velocity.power(second));
        assertEquals("km/s", velocity.pretty());
    }

    @Test
    void testReduceWithSIBasePrefix() {
        SIBase kiloMeter = new SIBase("meter", "m", new Prefix("k", BigDecimal.valueOf(1000)));

        DimensionedNumber<SIBase> coherent = Unit.from(kiloMeter).reduce(SIBase::reduce);

        assertEquals(0, coherent.factor().compareTo(BigDecimal.valueOf(1000)));
        assertEquals(Fraction.ONE, coherent.unit().power(new SIBase("meter", "m")));
        assertEquals("1000 m", coherent.pretty());
    }

    @Test
    void testMapAppliesUnitMapToEachBase() {
        SIBase meter = new SIBase("meter", "m");
        SIBase second = new SIBase("second", "s");

        Unit<SIBase> velocity = Unit.from(meter)
                .multiply(Unit.from(second).raise(new Fraction(2)));
        Unit<SIBase> mapped = velocity.flatMap(base -> Unit.from(base).raise(new Fraction(2)));

        assertEquals(new Fraction(2), mapped.power(meter));
        assertEquals(new Fraction(4), mapped.power(second));
    }

    @Test
    void testFlatUsesSIBaseReduce() {
        SIBase kiloMeter = new SIBase("meter", "m", new Prefix("k", BigDecimal.valueOf(1000)));
        Unit<SIBase> length = Unit.from(kiloMeter);

        DimensionedNumber<SIBase> flat = length.reduce(SIBase::reduce);

        assertEquals(0, flat.factor().compareTo(BigDecimal.valueOf(1000)));
        assertEquals(Unit.from(new SIBase("meter", "m")), flat.unit());
    }

    @Test
    void testMultiplyByScalarReturnsDimensionedNumber() {
        SIBase meter = new SIBase("meter", "m");
        Unit<SIBase> length = Unit.from(meter);

        DimensionedNumber<SIBase> threeMeters = length.multiply(BigDecimal.valueOf(3));

        assertEquals(BigDecimal.valueOf(3), threeMeters.factor());
        assertEquals(length, threeMeters.unit());
    }

    @Test
    void testMapAppliesMapToEachBase() {
        SIBase meter = new SIBase("meter", "m");
        SIBase second = new SIBase("second", "s");

        Unit<SIBase> velocity = Unit.from(meter).multiply(Unit.from(second).reciprocal());
        Unit<SIBase> mapped = velocity.map(base -> new SIBase(base.name() + "_mapped", base.symbol() + "m"));

        assertEquals(Fraction.ONE, mapped.power(new SIBase("meter_mapped", "mm")));
        assertEquals(new Fraction(-1), mapped.power(new SIBase("second_mapped", "sm")));
    }

    @Test
    void testOneIsDimensionless() {
        Unit<SIBase> one = Unit.one();
        SIBase meter = new SIBase("meter", "m");

        assertEquals(Fraction.ZERO, one.power(meter));
        assertEquals("1", one.pretty());
    }

    @Test
    void testSingleElementAndIsElementary() {
        SIBase meter = new SIBase("meter", "m");
        Unit<SIBase> length = Unit.from(meter);

        assertTrue(length.isElementary());
        assertEquals(meter, length.singleElement());
    }

    @Test
    void testSingleElementThrowsForCompoundUnit() {
        SIBase meter = new SIBase("meter", "m");
        SIBase second = new SIBase("second", "s");
        Unit<SIBase> velocity = Unit.from(meter).multiply(Unit.from(second));

        assertFalse(velocity.isElementary());
        assertThrows(RuntimeException.class, velocity::singleElement);
    }

    @Test
    void testZeroExponentBaseExcludedFromBases() {
        SIBase meter = new SIBase("meter", "m");
        Unit<SIBase> dimensionless = Unit.from(meter).multiply(Unit.from(meter).reciprocal());

        assertFalse(dimensionless.bases().contains(meter));
        assertEquals("1", dimensionless.pretty());
    }
}
