package pacioli.symboltable.info;

import java.util.Optional;

import pacioli.ast.definition.Definition;
import pacioli.misc.Location;
import pacioli.misc.PacioliFile;
import pacioli.symboltable.SymbolTableVisitor;

public interface SymbolInfo {

    GeneralInfo generalInfo();

    Optional<? extends Definition> getDefinition();

    String name();

    String globalName();

    Boolean isGlobal();

    Location getLocation();

    void accept(SymbolTableVisitor visitor);

    boolean isFromFile(PacioliFile file);

}