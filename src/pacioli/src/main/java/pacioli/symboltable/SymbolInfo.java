package pacioli.symboltable;

import java.util.Optional;

import pacioli.ast.definition.Definition;
import pacioli.misc.Location;

public interface SymbolInfo {

    GeneralInfo generalInfo();

    Optional<? extends Definition> getDefinition();

    String name();

    String globalName();

    Boolean isGlobal();

    Location getLocation();

    void accept(SymbolTableVisitor visitor);

}
