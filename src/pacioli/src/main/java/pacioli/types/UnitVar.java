package pacioli.types;

import pacioli.symboltable.info.SymbolInfo;

public interface UnitVar extends Var, TypeBase {

    public String pretty();

    TypeObject fresh();

    TypeObject rename(String format);

    /**
     * Is the variable a freshly created variable that is not yet generalized in a
     * schema?
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
}
