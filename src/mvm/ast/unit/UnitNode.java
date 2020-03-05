package mvm.ast.unit;

import mvm.MVMException;
import mvm.Machine;
import mvm.Printable;
import mvm.values.matrix.MatrixBase;
import uom.Unit;

public interface UnitNode extends Printable {

    public Unit<MatrixBase> eval(Machine machine) throws MVMException;
}
