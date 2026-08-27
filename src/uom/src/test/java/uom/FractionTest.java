package uom;

import static org.junit.jupiter.api.Assertions.*;

import org.junit.jupiter.api.Test;

class FractionTest {

    @Test
    void testNormalization() {
        assertEquals(new Fraction(1, 2), new Fraction(2, 4));
        assertEquals(new Fraction(-1, 2), new Fraction(-2, 4));
        assertEquals(new Fraction(1, 1), new Fraction(3, 3));
        assertEquals(Fraction.ZERO, new Fraction(0, 5));
    }

    @Test
    void testArithmeticOperations() {
        Fraction a = new Fraction(1, 2);
        Fraction b = new Fraction(1, 3);

        assertEquals(new Fraction(5, 6), a.add(b));
        assertEquals(new Fraction(1, 6), a.mult(b));
        assertEquals(new Fraction(3, 2), a.div(b));
        assertEquals(new Fraction(-1, 2), a.negate());
        assertEquals(new Fraction(0), a.floor());
        assertTrue(a.isInt() == false);
    }

    @Test
    void testComparisonAndSignum() {
        assertTrue(new Fraction(1, 2).compareTo(new Fraction(2, 3)) < 0);
        assertTrue(new Fraction(3, 4).compareTo(new Fraction(3, 4)) == 0);
        assertEquals(1, new Fraction(3, 4).signum());
        assertEquals(-1, new Fraction(-3, 4).signum());
    }

    @Test
    void testZeroDenominatorThrows() {
        assertThrows(RuntimeException.class, () -> new Fraction(1, 0));
    }

    @Test
    void testToStringFormatsValues() {
        assertEquals("1/2", new Fraction(1, 2).toString());
        assertEquals("2", new Fraction(2, 1).toString());
        assertEquals("0", new Fraction(0, 3).toString());
    }

    @Test
    void testAbsAndFloor() {
        assertEquals(new Fraction(1, 2), new Fraction(-1, 2).abs());
        assertEquals(new Fraction(1, 2), new Fraction(1, 2).abs());
        assertEquals(new Fraction(0), new Fraction(0, 3).abs());

        assertEquals(new Fraction(-1), new Fraction(-1, 2).floor());
        assertEquals(new Fraction(1), new Fraction(3, 2).floor());
        assertEquals(new Fraction(2), new Fraction(2, 1).floor());
        assertEquals(new Fraction(-2), new Fraction(-2, 1).floor());
        assertEquals(new Fraction(-3), new Fraction(-5, 2).floor());
    }

    @Test
    void testIsIntTrueForWholeNumber() {
        assertTrue(new Fraction(4, 1).isInt());
        assertFalse(new Fraction(3, 2).isInt());
    }

    @Test
    void testPrimitiveConversions() {
        Fraction f = new Fraction(3, 2);

        assertEquals(1, f.intValue());
        assertEquals(1L, f.longValue());
        assertEquals(1.5, f.doubleValue(), 1e-9);
        assertEquals(1.5f, f.floatValue(), 1e-6f);
    }
}
