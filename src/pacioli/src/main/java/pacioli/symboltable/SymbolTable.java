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

package pacioli.symboltable;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.function.Function;

import pacioli.symboltable.info.Info;

public class SymbolTable<R extends Info> {

    private final Map<String, R> table = new HashMap<String, R>();
    private SymbolTable<R> parent;

    private static int counter;

    public SymbolTable() {
        this.parent = null;
    }

    public SymbolTable(SymbolTable<R> parent) {
        this.parent = parent;
    }

    public SymbolTable<R> parent() {
        return parent;
    }

    public void setParent(SymbolTable<R> parent) {
        this.parent = parent;
    }

    public void put(String name, R entry) {
        table.put(name, entry);
    }

    public R lookup(String name) {
        R entry = table.get(name);
        if (entry == null && parent != null) {
            return parent.lookup(name);
        } else {
            return entry;
        }
    }

    public R lookupLocally(String name) {
        return table.get(name);
    }

    public Boolean contains(String name) {
        return lookup(name) != null;
    }

    public List<R> allInfos() {
        List<R> values = new ArrayList<R>();
        SymbolTable<R> current = this;
        while (current != null) {
            for (R value : current.table.values()) {
                values.add(value);
            }
            current = current.parent;
        }
        return values;
    }

    public List<R> allInfos(Function<R, Boolean> filter) {
        List<R> values = new ArrayList<R>();
        SymbolTable<R> current = this;
        while (current != null) {
            for (R value : current.table.values()) {
                if (filter.apply(value)) {
                    values.add(value);
                }
            }
            current = current.parent;
        }
        return values;
    }

    public List<String> allNames() {
        List<String> names = new ArrayList<String>();
        SymbolTable<R> current = this;
        while (current != null) {
            for (String name : current.table.keySet()) {
                names.add(name);
            }
            current = current.parent;
        }
        return names;
    }

    public List<String> localNames() {
        List<String> names = new ArrayList<String>();
        for (String name : table.keySet()) {
            names.add(name);
        }
        return names;
    }

    public List<R> localInfos() {
        List<R> values = new ArrayList<>();
        for (R value : table.values()) {
            values.add(value);
        }
        return values;
    }

    public SymbolTable<R> addAll(SymbolTable<? extends R> it) {
        for (String name : it.table.keySet()) {
            table.put(name, it.table.get(name));
        }
        return this;
    }

    public void accept(SymbolTableVisitor visitor) {
        for (Info info : table.values()) {
            info.accept(visitor);
        }
    }

    public String freshSymbolName() {
        String candidate = "sym_" + counter++;
        while (contains(candidate)) {
            candidate = "sym_" + counter++;
        }
        return candidate;
    }

    /**
     * A counter for freshVarName.
     */
    private static int varCounter;

    /**
     * A unique variable name for type, unit and index set variables in types,
     * without access to any symbol table.
     * 
     * Uniqueness is achieved by using using names that cannot occur in any
     * namespaces. Since a questionmark is not valid in an identifier, using
     * this as prefix makes it unique.
     * 
     * See SymbolTable for unique names that require no prefixes like the
     * question mark.
     * 
     * @return A unique name.
     */
    public static String freshVarName() {
        return "?" + varCounter++;
    }

    private static int namesCounter;

    /**
     * Fresh names for generated code. Assumes that globals and locals
     * are in the glbl and lcl subspaces. This ensures no name clashses
     * with the fresh variable names.
     * 
     * @param names
     * @return
     */
    public static List<String> freshNames(List<String> names) {
        List<String> fresh = new ArrayList<String>();
        for (String name : names) {
            fresh.add("fresh_" + name + namesCounter);
        }
        return fresh;
    }
}
