package uom;

import static org.junit.jupiter.api.Assertions.*;

import java.math.BigDecimal;

import org.junit.jupiter.api.Test;

class UnitSystemTest {

    private static final class TestBase implements Base {
        private final String name;

        private TestBase(String name) {
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
            if (!(other instanceof TestBase)) {
                return false;
            }
            return name.equals(((TestBase) other).name);
        }

        @Override
        public int hashCode() {
            return name.hashCode();
        }
    }

    @Test
    void testAddAndLookupUnit() {
        UnitSystem<TestBase> system = new UnitSystem<>();
        TestBase meter = new TestBase("meter");

        system.addUnit("m", meter);

        assertTrue(system.congtainsUnit("m"));
        assertEquals(meter, system.lookupBase("m"));
        assertEquals("meter", system.lookupBase("m").pretty());
    }

    @Test
    void testAddAndLookupPrefix() {
        UnitSystem<TestBase> system = new UnitSystem<>();
        Prefix kilo = new Prefix("k", BigDecimal.valueOf(1000));

        system.addPrefix("k", kilo);

        assertTrue(system.congtainsPrefix("k"));
        assertEquals(kilo, system.lookupPrefix("k"));
        assertEquals("k", system.lookupPrefix("k").prefixName());
    }

    @Test
    void testContainsPrefixedUnitName() {
        UnitSystem<TestBase> system = new UnitSystem<>();
        TestBase meter = new TestBase("meter");
        Prefix deci = new Prefix("d", BigDecimal.valueOf(0.1));

        system.addUnit("m", meter);
        system.addPrefix("d", deci);

        assertTrue(system.congtainsUnit("d:m"));
    }

    @Test
    void testLookupPrefixMissingThrows() {
        UnitSystem<TestBase> system = new UnitSystem<>();
        assertThrows(RuntimeException.class, () -> system.lookupPrefix("x"));
    }
}
