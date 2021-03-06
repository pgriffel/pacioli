package pacioli.types;

import pacioli.Printable;
import pacioli.Substitution;
import pacioli.symboltable.SymbolInfo;

public interface Var extends Printable, TypeBase {

    
    PacioliType fresh();

    PacioliType rename(String format);
    
    /**
     * Is the variable a freshly created variable that is not yet generalized in a schema?
     * In that case it has no info.
     * 
     * @return True iff the node has no info
     */
    Boolean isFresh();
    
    /**
     * A variable's info if it exists. If not it is a fresh variable and an error 
     * is thrown. See isFresh().
     * 
     * @return The info for the variable
     */
    SymbolInfo getInfo();

    PacioliType applySubstitution(Substitution subs);
}
