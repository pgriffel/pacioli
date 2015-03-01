package pacioli;

import java.util.ArrayList;
import java.util.Collection;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Map.Entry;
import java.util.Set;

import mvm.values.matrix.IndexSet;
import mvm.values.matrix.MatrixDimension;
import pacioli.ast.definition.AliasDefinition;
import pacioli.ast.definition.Declaration;
import pacioli.ast.definition.Definition;
import pacioli.ast.definition.IndexSetDefinition;
import pacioli.ast.definition.TypeDefinition;
import pacioli.ast.definition.UnitDefinition;
import pacioli.ast.definition.UnitVectorDefinition;
import pacioli.ast.definition.ValueDefinition;
import pacioli.types.PacioliType;
import pacioli.types.TypeIdentifier;
import pacioli.types.ast.TypeNode;
import pacioli.types.matrix.IndexType;
import pacioli.types.matrix.MatrixType;

public class Dictionary {
	
	private PacioliFile home = null;
	
	private final Map<String, UnitDefinition> unitDefinitions = new HashMap<String, UnitDefinition>();
	private final Map<String, IndexSetDefinition> indexSetDefinitions = new HashMap<String, IndexSetDefinition>();;
	private final Map<String, UnitVectorDefinition> unitVectorDefinitions = new HashMap<String, UnitVectorDefinition>();
	private final Map<String, TypeDefinition> typeDefinitions = new HashMap<String, TypeDefinition>();
	private final Map<String, AliasDefinition> aliasDefinitions = new HashMap<String, AliasDefinition>();
	private final Map<String, Declaration> declarations = new HashMap<String, Declaration>();
	private final Map<String, ValueDefinition> valueDefinitions = new HashMap<String, ValueDefinition>();
	
	public void setHome(PacioliFile home) {
		this.home = home;
	}

	public PacioliFile home() {
		return home;
	}
	
	public void putValueDefinition(String name, ValueDefinition definition) {
    	valueDefinitions.put(name, definition);
    }
    
    public void putUnitDefinition(String name, UnitDefinition definition) {
    	unitDefinitions.put(name, definition);
    }

	public void putAliasDefinition(String name, AliasDefinition definition) {
		aliasDefinitions.put(name, definition);
	}

	public void putDeclaration(String name, Declaration declaration) {
		declarations.put(name, declaration);
	}

	public void putIndexSetDefinition(String name, IndexSetDefinition definition) {
		indexSetDefinitions.put(name, definition);
	}

	public void putTypeDefinition(String name, TypeDefinition definition) {
		typeDefinitions.put(name, definition);
	}

	public void putUnitVectorDefinition(String name, UnitVectorDefinition definition) {
		unitVectorDefinitions.put(name, definition);
	}
	
	public boolean containsValueDefinition(String name) {
		return valueDefinitions.containsKey(name);
	}

	public ValueDefinition getValueDefinition(String name) {
		return valueDefinitions.get(name);
	}

	public boolean containsIndexSetDefinition(String name) {
		return indexSetDefinitions.containsKey(name);
	}

	public IndexSetDefinition getIndexSetDefinition(String name) {
		return indexSetDefinitions.get(name);
	}

	public boolean containsUnitDefinition(String name) {
		return unitDefinitions.containsKey(name);
	}

	public boolean containsUnitVectorDefinition(String name) {
		return unitVectorDefinitions.containsKey(name);
	}

	public boolean containsAliasDefinition(String name) {
		return aliasDefinitions.containsKey(name);
	}
	
	public AliasDefinition getAliasDefinition(String name) {
		return aliasDefinitions.get(name);
	}
	
	public boolean containsTypeDefinition(String name) {
		return typeDefinitions.containsKey(name);
	}

	public TypeDefinition getTypeDefinition(String name) {
		return typeDefinitions.get(name);
	}
	
	public UnitDefinition getUnitDefinition(String name) {
		return unitDefinitions.get(name);
	}
	
	public UnitVectorDefinition getUnitVectorDefinition(String name) {
		return unitVectorDefinitions.get(name);
	}

	public boolean containsDeclaration(String name) {
		return declarations.containsKey(name);
	}

	public Declaration getDeclaration(String name) {
		return declarations.get(name);
	}

	public void addAll(Dictionary other) throws PacioliException {
		for (Entry<String, UnitDefinition> entry: other.unitDefinitions.entrySet()) {
			if (unitDefinitions.containsKey(entry.getKey())) {
				throw new PacioliException("\nName clash for %s", entry.getKey());
			}
			unitDefinitions.put(entry.getKey(), entry.getValue());
		}
		for (Entry<String, IndexSetDefinition> entry: other.indexSetDefinitions.entrySet()) {
			if (indexSetDefinitions.containsKey(entry.getKey())) {
				throw new PacioliException("\nName clash for %s", entry.getKey());
			}
			indexSetDefinitions.put(entry.getKey(), entry.getValue());
		}
		for (Entry<String, UnitVectorDefinition> entry: other.unitVectorDefinitions.entrySet()) {
			if (unitVectorDefinitions.containsKey(entry.getKey())) {
				throw new PacioliException("\nName clash for %s", entry.getKey());
			}
			unitVectorDefinitions.put(entry.getKey(), entry.getValue());
		}
		for (Entry<String, TypeDefinition> entry: other.typeDefinitions.entrySet()) {
			if (typeDefinitions.containsKey(entry.getKey())) {
				throw new PacioliException("\nName clash for %s", entry.getKey());
			}
			typeDefinitions.put(entry.getKey(), entry.getValue());
		}
		for (Entry<String, AliasDefinition> entry: other.aliasDefinitions.entrySet()) {
			if (aliasDefinitions.containsKey(entry.getKey())) {
				throw new PacioliException("\nName clash for %s", entry.getKey());
			}
			aliasDefinitions.put(entry.getKey(), entry.getValue());
		}
		for (Entry<String, Declaration> entry: other.declarations.entrySet()) {
			if (declarations.containsKey(entry.getKey())) {
				throw new PacioliException("\nName clash for %s", entry.getKey());
			}
			putDeclaration(entry.getKey(), entry.getValue());
		}
		for (Entry<String, ValueDefinition> entry: other.valueDefinitions.entrySet()) {
			if (valueDefinitions.containsKey(entry.getKey())) {
				throw new PacioliException("\nName clash for %s", entry.getKey());
			}
			valueDefinitions.put(entry.getKey(), entry.getValue());
		}
	}

	public MatrixDimension compileTimeRowDimension(TypeNode typeNode) throws PacioliException {
    	PacioliType type = typeNode.eval(false);
    	if (type instanceof MatrixType) {
    		MatrixType matrixType = (MatrixType) type;
    		if (matrixType.rowDimension.isVar()) {
    			throw new PacioliException(typeNode.getLocation(), "Expected a closed matrix type but found %s", matrixType.description());
    		} else {
    			return compileTimeMatrixDimension(matrixType.rowDimension);
    		}
    	} else {
    		throw new PacioliException(typeNode.getLocation(), "Expected a matrix type but found %s", MatrixType.class);
    	}
    }
	
    public MatrixDimension compileTimeColumnDimension(TypeNode typeNode) throws PacioliException {
    	PacioliType type = typeNode.eval(false);
    	if (type instanceof MatrixType) {
    		MatrixType matrixType = (MatrixType) type;
    		if (matrixType.columnDimension.isVar()) {
    			throw new PacioliException(typeNode.getLocation(), "Expected a closed matrix type but found %s", matrixType.description());
    		} else {
    			return compileTimeMatrixDimension(matrixType.columnDimension);
    		}
    	} else {
    		throw new PacioliException(typeNode.getLocation(), "Expected a matrix type but found %s", MatrixType.class);
    	}
    }
    	    
    private MatrixDimension compileTimeMatrixDimension(IndexType dimType) throws PacioliException {
    	List<IndexSet> sets = new ArrayList<IndexSet>();
    	for (TypeIdentifier id : dimType.getIndexSets()) {
    		// todo: also include home to identify an index set
    		sets.add(getIndexSetDefinition(id.name).getIndexSet());
    	}
        return new MatrixDimension(sets);
    }

	public Collection<UnitDefinition> unitDefinitions() {
		return unitDefinitions.values();
	}

	public Collection<UnitVectorDefinition> unitVectorDefinitions() {
		return unitVectorDefinitions.values();
	}

	public Collection<ValueDefinition> valueDefinitions() {
		return valueDefinitions.values();
	}

	public Collection<AliasDefinition> aliasDefinitions() {
		return aliasDefinitions.values();
	}

	public Collection<Declaration> declarations() {
		return declarations.values();
	}

	public Collection<TypeDefinition> typeDefinitions() {
		return typeDefinitions.values();
	}

	public Collection<IndexSetDefinition> indexSetDefinitions() {
		return indexSetDefinitions.values();
	}
	
	public Collection<Definition> allDefinitions() {
		Set<Definition> definitions = new HashSet<Definition>();
		definitions.addAll(unitDefinitions());
		definitions.addAll(indexSetDefinitions());
		definitions.addAll(unitVectorDefinitions());
		definitions.addAll(aliasDefinitions());
		definitions.addAll(typeDefinitions());
		definitions.addAll(declarations());
		definitions.addAll(valueDefinitions());
		return definitions;
	}

}