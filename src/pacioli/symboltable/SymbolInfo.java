package pacioli.symboltable;

import pacioli.Location;
import pacioli.ast.definition.Definition;

public interface SymbolInfo {

    GenericInfo generic();

    Definition getDefinition();

    String name();

    String globalName();

    //Boolean isExternal();

    Location getLocation();

    void accept(SymbolTableVisitor visitor);

}
