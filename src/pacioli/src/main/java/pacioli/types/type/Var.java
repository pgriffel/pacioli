package pacioli.types.type;

import java.util.Optional;

import pacioli.compiler.Printable;
import pacioli.symboltable.info.Info;

public interface Var extends Printable {

    // A variable can be one of four kinds
    public enum Kind {
        TYPE {
            @Override
            public String pretty() {
                return "for_type";
            }
        },
        UNIT {
            @Override
            public String pretty() {
                return "for_unit";
            }
        },
        INDEX {
            @Override
            public String pretty() {
                return "for_index";
            }
        },
        OP {
            @Override
            public String pretty() {
                return "for_op";
            }
        };

        abstract public String pretty();
    }

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
