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
import java.util.List;

import pacioli.ast.definition.Toplevel;
import pacioli.compiler.PacioliException;
import pacioli.symboltable.info.TypeInfo;
import pacioli.symboltable.info.ValueInfo;

public class PacioliTable {

    private final SymbolTable<ValueInfo> values;
    private final SymbolTable<TypeInfo> types;
    private final List<Toplevel> toplevels;

    private PacioliTable(
            SymbolTable<ValueInfo> values,
            SymbolTable<TypeInfo> types,
            List<Toplevel> toplevels) {
        this.values = values;
        this.types = types;
        this.toplevels = toplevels;
    }

    public static PacioliTable initial(
            SymbolTable<ValueInfo> values,
            SymbolTable<TypeInfo> types) {
        return new PacioliTable(values, types, new ArrayList<>());
    }

    public static PacioliTable empty() {
        return new PacioliTable(new SymbolTable<ValueInfo>(), new SymbolTable<TypeInfo>(), new ArrayList<>());
    }

    public SymbolTable<ValueInfo> values() {
        return values;
    }

    public SymbolTable<TypeInfo> types() {
        return types;
    }

    public List<Toplevel> toplevels() {
        return toplevels;
    }

    public void addAll(PacioliTable pacioliTable) {
        values.addAll(pacioliTable.values);
        types.addAll(pacioliTable.types);
    }

    public void setParent(PacioliTable symbolTable) {
        if (values.parent() != null) {
            throw new RuntimeException(String.format("Expected null parent"));
        }
        if (types.parent() != null) {
            throw new RuntimeException(String.format("Expected null parent"));
        }

        values.setParent(symbolTable.values());
        types.setParent(symbolTable.types());
    }

    public PacioliTable popParent() {
        PacioliTable top = new PacioliTable(this.values, this.types, this.toplevels);
        this.values.setParent(null);
        this.types.setParent(null);
        return top;
    }

    public void addInfo(TypeInfo info) throws PacioliException {
        String name = info.name();
        if (types.contains(name)) {
            throw new PacioliException(info.location(), "Duplicate type set name: " + name);
        } else {
            types.put(name, info);
        }
    }

    public void addInfo(ValueInfo info) throws PacioliException {
        String name = info.name();
        if (values.contains(name)) {
            throw new PacioliException(info.location(),
                    "Duplicate name: " + name + values.lookup(name).location().description());
        } else {
            values.put(name, info);
        }
    }

    public void addToplevel(Toplevel toplevel) {
        this.toplevels.add(toplevel);
    }

};
