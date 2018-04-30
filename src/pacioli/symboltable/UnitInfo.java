package pacioli.symboltable;

import java.util.List;

import pacioli.ast.definition.Definition;
import pacioli.ast.definition.UnitVectorDefinition.UnitDecl;
import pacioli.ast.unit.UnitNode;

public class UnitInfo implements SymbolInfo {

	public Definition definition;
	
	public String symbol;
	public UnitNode baseDefinition;
	
	public List<UnitDecl> items;
	
	public GenericInfo generic;

	public boolean isVector = false;

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
		return String.format("unit_%s", generic.name);
	}
	
	@Override
	public Definition getDefinition() {
		return definition;
	}

}
