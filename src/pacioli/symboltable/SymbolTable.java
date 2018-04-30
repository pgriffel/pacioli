package pacioli.symboltable;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;


/*public class SymbolTable {

	private final Map<String, SymbolInfo> table = new HashMap<String, SymbolInfo>();
	private final SymbolTable parent;
	
	public SymbolTable() {
		this.parent = null;
	}
	
	public SymbolTable(SymbolTable parent) {
		this.parent = parent;
	}
	
	public void put(String name, SymbolInfo entry) {
		table.put(name, entry);
	}
	
	public SymbolInfo lookup(String name) {
		SymbolInfo entry = table.get(name);
		if (entry == null && parent != null) {
			return parent.lookup(name);
		} else {
			return entry;
		} 
	}
	
	public Boolean contains(String name) {
		return lookup(name) != null;
	}
	
	public List<String> allNames() {
		List<String> names = new ArrayList<String>();
		SymbolTable current = this;
		while (current != null) {
			for (String name: current.table.keySet()) {
				names.add(name);
			}
			current = current.parent;
		}
		return names;
	}
	
	public void addAll(SymbolTable other) {
		for (String name: other.table.keySet()) {
			table.put(name, other.table.get(name));
		}
		
	}
	
	public void print(String header) {
		Pacioli.logln("Begin %s table", header);
		for (String name: table.keySet()) {
			Pacioli.logln("  %s -> %s", name, table.get(name));
		}
		Pacioli.logln("End table");
	}
}*/


public class SymbolTable<R extends SymbolInfo> {

	private final Map<String,R> table = new HashMap<String, R>();
	private final SymbolTable<R> parent;
	
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
	
	public List<String> allNames() {
		List<String> names = new ArrayList<String>();
		SymbolTable<R> current = this;
		while (current != null) {
			for (String name: current.table.keySet()) {
				names.add(name);
			}
			current = current.parent;
		}
		return names;
	}
	
	public List<String> localNames() {
		List<String> names = new ArrayList<String>();
		for (String name: table.keySet()) {
			names.add(name);
		}
		return names;
	}
	
	public void addAll(SymbolTable<R> it) {
		for (String name: it.table.keySet()) {
			table.put(name, it.table.get(name));
		}
		
	}
}


