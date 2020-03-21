package pacioli.types;

import pacioli.Printable;

public interface Var extends Printable, TypeBase {

    PacioliType fresh();

    PacioliType rename(String format);

}
