package pacioli.symboltable.info;

import java.util.Optional;

import pacioli.ast.definition.Definition;
import pacioli.compiler.Location;
import pacioli.compiler.PacioliFile;
import pacioli.symboltable.SymbolTableVisitor;

public interface Info {

    GeneralInfo generalInfo();

    String name();

    String globalName();

    boolean isGlobal();

    boolean isPublic();

    Location location();

    Optional<? extends Definition> definition();

    void accept(SymbolTableVisitor visitor);

    boolean isFromFile(PacioliFile file);

}
