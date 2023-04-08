package pacioli.symboltable;

import java.util.Optional;

import pacioli.Location;
import pacioli.ast.definition.Definition;

public interface SymbolInfo {

    GenericInfo generic();

    Optional<? extends Definition> getDefinition();

    String name();

    String globalName();

    Boolean isGlobal();
    
    Location getLocation();

    void accept(SymbolTableVisitor visitor);

}
