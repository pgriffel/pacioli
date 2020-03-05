package mvm.ast.unit;

import java.io.PrintWriter;

import mvm.AbstractPrintable;
import mvm.MVMException;
import mvm.Machine;
import mvm.values.matrix.MatrixBase;
import uom.Unit;

public class UnitDiv extends AbstractPrintable implements UnitNode {

    private UnitNode left;
    private UnitNode right;

    public UnitDiv(UnitNode x, UnitNode y) {
        this.left = x;
        this.right = y;
    }

    @Override
    public void printText(PrintWriter out) {
        out.print("unit_div(");
        left.printText(out);
        out.print(", ");
        right.printText(out);
        out.print(")");
    }

    @Override
    public Unit<MatrixBase> eval(Machine machine) throws MVMException {
        return left.eval(machine).multiply(right.eval(machine).reciprocal());
    }

}
