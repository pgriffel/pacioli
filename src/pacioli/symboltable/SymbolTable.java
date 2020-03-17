package pacioli.symboltable;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class SymbolTable<R extends SymbolInfo> {

    private final Map<String, R> table = new HashMap<String, R>();
    private final SymbolTable<R> parent;

    private static int counter;
    
    public SymbolTable() {
        this.parent = null;
    }

    public SymbolTable(SymbolTable<R> parent) {
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

    public void addAll(SymbolTable<R> it) {
        for (String name : it.table.keySet()) {
            table.put(name, it.table.get(name));
        }

    }
    
    public void accept(SymbolTableVisitor visitor) {
        for (SymbolInfo info: table.values()) {
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
}
