package pacioli.symboltable;

import java.util.ArrayList;
import java.util.List;

import pacioli.ast.definition.Toplevel;
import pacioli.misc.PacioliException;

public class PacioliTable {

    public final SymbolTable<ValueInfo> values;
    public final SymbolTable<TypeSymbolInfo> types;
    public final List<Toplevel> toplevels;

    private PacioliTable(
            SymbolTable<ValueInfo> values,
            SymbolTable<TypeSymbolInfo> types,
            List<Toplevel> toplevels) {
        this.values = values;
        this.types = types;
        this.toplevels = toplevels;
    }

    public static PacioliTable initialFrom(
            SymbolTable<ValueInfo> values,
            SymbolTable<TypeSymbolInfo> types) {
        return new PacioliTable(values, types, new ArrayList<>());
    }

    public static PacioliTable initial() {
        return new PacioliTable(new SymbolTable<ValueInfo>(), new SymbolTable<TypeSymbolInfo>(), new ArrayList<>());
    }

    public void addAll(PacioliTable pacioliTable) {
        values.addAll(pacioliTable.values);
        types.addAll(pacioliTable.types);
    }

    // public PacioliTable pushNew() {
    // SymbolTable<ValueInfo> values = new SymbolTable<ValueInfo>();
    // SymbolTable<TypeSymbolInfo> types = new SymbolTable<TypeSymbolInfo>();

    // values.parent = this.values;
    // types.parent = this.types;

    // return new PacioliTable(values, types, new ArrayList<>());
    // }

    public void setParent(PacioliTable symbolTable) {
        if (values.parent != null) {
            throw new RuntimeException(String.format("Expected null parent"));
        }
        if (types.parent != null) {
            throw new RuntimeException(String.format("Expected null parent"));
        }

        values.parent = symbolTable.values;
        types.parent = symbolTable.types;
    }

    public PacioliTable popParent() {
        PacioliTable top = new PacioliTable(this.values, this.types, this.toplevels);
        this.values.parent = null;
        this.types.parent = null;
        return top;
    }

    public void addInfo(TypeSymbolInfo info) throws PacioliException {
        String name = info.name();
        if (types.contains(name)) {
            throw new PacioliException(info.getLocation(), "Duplicate type set name: " + name);
        } else {
            types.put(name, info);
        }
    }

    public void addInfo(ValueInfo info) throws PacioliException {
        String name = info.name();
        if (values.contains(name)) {
            throw new PacioliException(info.getLocation(),
                    "Duplicate name: " + name + values.lookup(name).getLocation().description());
        } else {
            values.put(name, info);
        }
    }

    public void addToplevel(Toplevel toplevel) {
        this.toplevels.add(toplevel);
    }

};
