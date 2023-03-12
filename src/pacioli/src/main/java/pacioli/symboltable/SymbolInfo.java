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
    
    /** 
     * Is the symbol part of the main program that is loaded? Generally
     * this means that it is false for al symbols from libraries, but note
     * that this is also true when a library is loaded as main program.
     * 
     * @return True iff the symbol is from the main program.
     */
    Boolean isFromProgram();

}
