package mvm.ast.unit;

import mvm.MVMException;
import mvm.Machine;
import mvm.Printable;
import uom.Unit;

public interface UnitNode extends Printable {

    public Unit eval(Machine machine) throws MVMException;
}
