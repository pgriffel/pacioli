package mvm.ast;

import java.io.PrintWriter;
import java.math.BigDecimal;

import mvm.AbstractPrintable;
import mvm.MVMException;
import mvm.Machine;
import mvm.ast.unit.UnitNode;
import mvm.values.PacioliValue;
import pacioli.Pacioli;
import uom.DimensionedNumber;
import uom.NamedUnit;

public class Print extends AbstractPrintable implements Instruction {

	private Expression body;

	public Print(Expression exp) {
		this.body = exp;
	}
	
	@Override
	public void printText(PrintWriter out) {
		out.format("todo: print print");
	}

	@Override
	public void eval(Machine machine) throws MVMException {
		PacioliValue result = body.eval(machine.store);
		if (result != null) {
			Pacioli.logln("%s", result.toText());
		}
	}

}
