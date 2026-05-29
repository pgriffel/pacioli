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

package uom;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Set;

import javax.management.RuntimeErrorException;

public class UnitSystem<B extends Base> {

    record Equation<X extends Base>(Unit<X> lhs, Unit<X> rhs) {
    }

    private final HashMap<String, Prefix> prefixDictionary;
    private final HashMap<String, B> unitDictionary;

    private final List<B> bases;

    private final List<Equation<B>> equations;

    private UnitSystem(HashMap<String, Prefix> prefixDictionary, HashMap<String, B> baseDictionary, List<B> bases,
            List<Equation<B>> equations) {
        this.prefixDictionary = prefixDictionary;
        this.unitDictionary = baseDictionary;
        this.bases = bases;
        this.equations = equations;
    }

    public UnitSystem() {
        unitDictionary = new HashMap<String, B>();
        prefixDictionary = new HashMap<String, Prefix>();
        this.bases = new ArrayList<>();
        this.equations = new ArrayList<>();
    }

    public UnitSystem<B> importSystem(UnitSystem<B> other) {
        return union(this, other);
    }

    public static <B extends Base> List<String> check(UnitSystem<B> x, UnitSystem<B> y) {
        List<String> issues = new ArrayList<>();
        for (String name : x.names()) {
            // y.lookupBase(name)
            // baseDictionary.put(name, y.lookupUnit(name));
        }

        return issues;
    }

    public static <B extends Base> UnitSystem<B> union(UnitSystem<B> x, UnitSystem<B> y) {
        HashMap<String, Prefix> prefixDictionary = new HashMap<>();
        HashMap<String, B> unitDictionary = new HashMap<>();

        ArrayList<B> bases = new ArrayList<>();

        ArrayList<Equation<B>> equations = new ArrayList<>();

        for (String name : x.names()) {
            unitDictionary.put(name, y.lookupBase(name));
        }

        return new UnitSystem<B>(prefixDictionary, unitDictionary, bases, equations);
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

    public void addUnit(String name, B unit) {
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

    public B lookupBase(String name) {
        return this.unitDictionary.get(name);
    }

    public Unit<B> lookupUnit(String name) {
        throw new RuntimeException("lookupUnit obsolete, use lookupBase!?");
        // for (String prefix : prefixNames()) {
        // if (name.startsWith(prefix + ":")) {
        // String suffix = name.substring(prefix.length() + 1);
        // if (unitDictionary.containsKey(suffix)) {
        // Prefix pre = lookupPrefix(prefix);
        // B base = unitDictionary.get(suffix);

        // return new PowerProduct<B>(base.);
        // } else {
        // throw new RuntimeException("No unit named '" + suffix + "' when looking for
        // '" + name + "'");
        // }
        // }
        // }
        // if (unitDictionary.containsKey(name)) {
        // return unitDictionary.get(name);
        // } else {
        // throw new RuntimeException("No unit named '" + name + "'");
        // }
    }
}