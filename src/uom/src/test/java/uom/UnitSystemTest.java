package uom;

import static org.junit.jupiter.api.Assertions.*;

import java.math.BigDecimal;

import org.junit.jupiter.api.Test;

class UnitSystemTest {

    @Test
    void testAddAndLookupPrefix() {
        UnitSystem<SIBase> system = new UnitSystem<>();
        Prefix kilo = new Prefix("k", BigDecimal.valueOf(1000));

        system.addPrefix("k", kilo);

        assertTrue(system.containsPrefix("k"));
        assertEquals(kilo, system.lookupPrefix("k").get());
        assertEquals("k", system.lookupPrefix("k").get().symbol());
    }

    @Test
    void testLookupPrefixMissingThrows() {
        UnitSystem<SIBase> system = new UnitSystem<>();
        assertTrue(system.lookupPrefix("x").isEmpty());
    }

    @Test
    void testAddAndLookupBase() {
        UnitSystem<SIBase> system = new UnitSystem<>();
        SIBase meter = new SIBase("meter", "m");

        system.addBase("meter", meter);

        assertTrue(system.containsBase("meter"));
        assertEquals(meter, system.lookupBase("meter").get());
    }

    @Test
    void testBaseNamesContainsAddedBase() {
        UnitSystem<SIBase> system = new UnitSystem<>();
        SIBase meter = new SIBase("meter", "m");

        system.addBase("meter", meter);

        assertTrue(system.baseNames().contains("meter"));
    }

    @Test
    void testContainsBaseFalseWhenMissing() {
        UnitSystem<SIBase> system = new UnitSystem<>();

        assertFalse(system.containsBase("foo"));
        assertTrue(system.lookupBase("foo").isEmpty());
    }
}
