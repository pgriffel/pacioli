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
