package uom;

import static org.junit.jupiter.api.Assertions.*;

import java.math.BigDecimal;

import org.junit.jupiter.api.Test;

class UnitSystemTest {

    @Test
    void testAddAndLookupUnit() {
        UnitSystem<SIBase> system = new UnitSystem<>();
        SIBase meter = new SIBase("meter", "m");

        system.addUnit("m", meter);

        assertTrue(system.containsUnit("m"));
        assertEquals(meter, system.lookupBase("m"));
        assertEquals("m", system.lookupBase("m").pretty());
    }

    @Test
    void testAddAndLookupPrefix() {
        UnitSystem<SIBase> system = new UnitSystem<>();
        Prefix kilo = new Prefix("k", BigDecimal.valueOf(1000));

        system.addPrefix("k", kilo);

        assertTrue(system.congtainsPrefix("k"));
        assertEquals(kilo, system.lookupPrefix("k"));
        assertEquals("k", system.lookupPrefix("k").prefixName());
    }

    @Test
    void testContainsPrefixedUnitName() {
        UnitSystem<SIBase> system = new UnitSystem<>();
        SIBase meter = new SIBase("meter", "m");
        Prefix deci = new Prefix("d", BigDecimal.valueOf(0.1));

        system.addUnit("m", meter);
        system.addPrefix("d", deci);

        assertTrue(system.containsUnit("d:m"));
    }

    @Test
    void testLookupPrefixMissingThrows() {
        UnitSystem<SIBase> system = new UnitSystem<>();
        assertThrows(RuntimeException.class, () -> system.lookupPrefix("x"));
    }
}
