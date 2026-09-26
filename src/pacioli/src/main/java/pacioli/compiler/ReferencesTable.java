/*
 * Copyright 2026 Paul Griffioen
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

package pacioli.compiler;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * A mapping from a value or type name to a list with all references to the
 * value or type.
 */
public record ReferencesTable(
        Map<String, List<Entry>> values,
        Map<String, List<Entry>> types) {

    public static class Builder {

        Map<String, List<ReferencesTable.Entry>> valuesTable = new HashMap<>();
        Map<String, List<ReferencesTable.Entry>> typeTable = new HashMap<>();

        void entry(Entry entry) {
            addRef(entry.kind().equals(ReferencesTable.Kind.VALUE) ? valuesTable : typeTable, entry);
        }

        void entries(List<Entry> entries) {
            for (Entry entry : entries) {
                this.entry(entry);
            }
        }

        ReferencesTable build() {
            return new ReferencesTable(valuesTable, typeTable);
        }

        static List<ReferencesTable.Entry> refTableEntry(Map<String, List<ReferencesTable.Entry>> table, String name) {
            if (!table.containsKey(name)) {
                table.put(name, new ArrayList<>());
            }

            return table.get(name);
        }

        static void addRef(Map<String, List<Entry>> table, Entry ref) {
            var r = refTableEntry(table, ref.name());
            if (!r.stream().anyMatch(x -> x.location().equals(ref.location()))) {
                r.add(ref);
            }
        }
    }

    public static Builder builder() {
        return new Builder();
    }

    public enum Kind {
        VALUE, UNIT, TYPE
    }

    public record Entry(String name, Location location, Kind kind) {
    };

    /**
     * All nodes (typically identifier nodes) that refer to the value with the given
     * name. Includes the definition of the value itself.
     * 
     * @param name Name of some value
     * @return All references to the value
     */
    public List<Entry> getValueReferences(String name) {
        return this.values.get(name);
    }

    /**
     * All nodes (typically identifier nodes) that refer to the type with the given
     * name. Includes the definition of the type itself.
     * 
     * @param name Name of some type
     * @return All references to the type
     */
    public List<Entry> getTypeReferences(String name) {
        return this.types.get(name);
    }

}
