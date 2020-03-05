package mvm.ast.unit;

import java.io.PrintWriter;

import mvm.AbstractPrintable;
import mvm.MVMException;
import mvm.Machine;
import mvm.values.matrix.MatrixBase;
import uom.Fraction;
import uom.Unit;

public class UnitExpt extends AbstractPrintable implements UnitNode {

    private UnitNode unit;
    private Fraction power;

    public UnitExpt(UnitNode unit, Fraction power) {
        this.unit = unit;
        this.power = power;
    }

    @Override
    public void printText(PrintWriter out) {
        out.print("unit_expt(");
        unit.printText(out);
        out.print(", ");
        out.print(power);
        out.print(")");
    }

    @Override
    public Unit<MatrixBase> eval(Machine machine) throws MVMException {
        return unit.eval(machine).raise(power);
    }

}
