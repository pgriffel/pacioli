package mvm.ast.unit;

import java.io.PrintWriter;

import mvm.AbstractPrintable;
import mvm.MVMException;
import mvm.Machine;
import mvm.values.matrix.MatrixBase;
import uom.Unit;

public class UnitNamed extends AbstractPrintable implements UnitNode {

    private String name;

    public UnitNamed(String name) {
        this.name = name;
    }

    @Override
    public void printText(PrintWriter out) {
        out.format("unit(%s)", name);

    }

    @Override
    public Unit<MatrixBase> eval(Machine machine) throws MVMException {
        if (name.isEmpty()) {
            return MatrixBase.ONE;
        } else if (machine.unitSystem.congtainsUnit(name)) {
            return machine.unitSystem.lookupUnit(name);
        } else {
            throw new MVMException("unit '%s' unknown", name);
        }
    }

}
