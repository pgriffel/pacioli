package pacioli.symboltable;

import pacioli.ast.definition.Definition;
import pacioli.types.ast.TypeNode;

public class TypeInfo implements SymbolInfo {

	public Definition definition;
	public TypeNode typeAST;
	public GenericInfo generic;
	public Boolean isIndexSetId;
	public Boolean isUnitId;
	public Boolean isVar;
	
	@Override
	public GenericInfo generic() {
		return generic;
	}
	
	@Override
	public String name() {
		return generic.name;
	}

	@Override
	public String globalName() {
		throw new RuntimeException("todo");
	}
	
	@Override
	public Definition getDefinition() {
		return definition;
	}

}
