package mvm.ast;

import java.io.PrintWriter;
import java.math.BigDecimal;

import mvm.AbstractPrintable;
import mvm.MVMException;
import mvm.Machine;
import mvm.ast.unit.UnitNode;
import mvm.values.matrix.MatrixBase;
import uom.DimensionedNumber;
import uom.NamedUnit;

public class StoreUnit extends AbstractPrintable implements Instruction {

    private String name;
    private String symbol;
    private String definitionNumber;
    private UnitNode definitionUnit;

    public StoreUnit(String name, String symbol) {
        this.name = name;
        this.symbol = symbol;
    }

    public StoreUnit(String name, String symbol, String num, UnitNode unit) {
        this.name = name;
        this.symbol = symbol;
        this.definitionNumber = num;
        this.definitionUnit = unit;
    }

    @Override
    public void printText(PrintWriter out) {
        out.print("todo: print storeunti");
    }

    @Override
    public void eval(Machine machine) throws MVMException {
        if (definitionUnit == null) {
            machine.storeUnit(name, new NamedUnit<MatrixBase>(symbol));
        } else {
            machine.storeUnit(name, new NamedUnit<MatrixBase>(symbol,
                    new DimensionedNumber<MatrixBase>(new BigDecimal(definitionNumber), definitionUnit.eval(machine))));
        }
    }

}
