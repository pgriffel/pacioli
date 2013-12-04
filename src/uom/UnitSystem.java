/*
 * Copyright (c) 2013 Paul Griffioen
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of
 * this software and associated documentation files (the "Software"), to deal in
 * the Software without restriction, including without limitation the rights to
 * use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of
 * the Software, and to permit persons to whom the Software is furnished to do so,
 * subject to the following conditions:
 * 
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS
 * FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
 * COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER
 * IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
 * CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

package uom;

import java.util.HashMap;
import java.util.Set;

public class UnitSystem {

    private final HashMap<String, Prefix> prefixDictionary;
    private final HashMap<String, NamedUnit> unitDictionary;

    public UnitSystem() {
        unitDictionary = new HashMap<String, NamedUnit>();
        prefixDictionary = new HashMap<String, Prefix>();
    }
    
    public void importSystem(UnitSystem other) {
        for (String name: other.names()) {
            addUnit(name, (NamedUnit) other.lookupUnit(name));
        }
    }

    public Set<String> names() {
        return unitDictionary.keySet();
    }
    
    public void addPrefix(String name, Prefix prefix) {
        prefixDictionary.put(name, prefix);
    }

    public boolean congtainsPrefix(String name) {
        return prefixDictionary.containsKey(name);
    }

    public Set<String> prefixNames() {
        return prefixDictionary.keySet();
    }

    public Prefix lookupPrefix(String name) {
        if (prefixDictionary.containsKey(name)) {
            return prefixDictionary.get(name);
        } else {
            throw new RuntimeException("No prefix named '" + name + "'");
        }
    }

    public void addUnit(String name, NamedUnit unit) {
        unitDictionary.put(name, unit);
    }

    public boolean congtainsUnit(String name) {
        for (String prefix : prefixNames()) {
            if (name.startsWith(prefix + ":")) {
                return unitDictionary.containsKey(name.substring(prefix.length() + 1));
            }
        }
        return unitDictionary.containsKey(name);
    }

    public Unit lookupUnit(String name) {
        for (String prefix : prefixNames()) {
            if (name.startsWith(prefix + ":")) {
                String suffix = name.substring(prefix.length() + 1);
                if (unitDictionary.containsKey(suffix)) {
                    return new ScaledUnit(lookupPrefix(prefix), unitDictionary.get(suffix));
                } else {
                    throw new RuntimeException("No unit named '" + suffix + "' when looking for '" + name + "'");
                }
            }
        }
        if (unitDictionary.containsKey(name)) {
            return unitDictionary.get(name);
        } else {
            throw new RuntimeException("No unit named '" + name + "'");
        }
    }
}