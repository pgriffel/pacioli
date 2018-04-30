package pacioli.symboltable;

import pacioli.ast.definition.Definition;

public interface SymbolInfo {

	GenericInfo generic();
	
	Definition getDefinition();
	
	String name();
	
	String globalName();

}
