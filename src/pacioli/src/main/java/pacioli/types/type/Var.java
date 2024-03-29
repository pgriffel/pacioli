package pacioli.types.type;

import java.util.Optional;

import pacioli.compiler.Printable;
import pacioli.symboltable.info.Info;

public interface Var extends Printable {

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
     * A variable's info if it exists. See isFresh().
     * 
     * @return The info for the variable
     */
    Optional<? extends Info> info();
}
