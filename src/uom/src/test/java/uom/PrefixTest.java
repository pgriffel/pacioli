package uom;

import static org.junit.jupiter.api.Assertions.*;

import java.math.BigDecimal;

import org.junit.jupiter.api.Test;

class PrefixTest {

    @Test
    void testPrefixEqualityAndHashCode() {
        Prefix p1 = new Prefix("k", BigDecimal.valueOf(1000));
        Prefix p2 = new Prefix("k", BigDecimal.valueOf(1000));
        Prefix p3 = new Prefix("M", BigDecimal.valueOf(1000000));

        assertEquals(p1, p2);
        assertEquals(p1.hashCode(), p2.hashCode());
        assertNotEquals(p1, p3);
    }

    @Test
    void testPrefixProperties() {
        Prefix kilo = new Prefix("k", BigDecimal.valueOf(1000));

        assertEquals("k", kilo.symbol());
        assertEquals(BigDecimal.valueOf(1000), kilo.prefixFactor());
    }

    @Test
    void testPrefixOneIsIdentityPrefix() {
        assertEquals("", Prefix.ONE.symbol());
        assertEquals(BigDecimal.ONE, Prefix.ONE.prefixFactor());
        assertEquals(Prefix.ONE, new Prefix("", BigDecimal.ONE));
    }

    @Test
    void testPrefixEqualityIgnoresFactor() {
        Prefix p1 = new Prefix("k", BigDecimal.valueOf(1000));
        Prefix p2 = new Prefix("k", BigDecimal.valueOf(1234));

        assertEquals(p1, p2);
        assertEquals(p1.hashCode(), p2.hashCode());
    }
}
