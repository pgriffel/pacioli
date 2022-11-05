package mvm.ast;

import mvm.MVMException;
import mvm.Machine;
import mvm.Printable;

public interface Instruction extends Printable {

    public void eval(Machine machine) throws MVMException;
}
