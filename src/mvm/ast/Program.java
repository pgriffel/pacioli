package mvm.ast;

import java.io.PrintWriter;
import java.util.ArrayList;
import java.util.List;

import mvm.AbstractPrintable;
import mvm.Environment;
import mvm.MVMException;
import mvm.values.PacioliValue;

public class Program  extends AbstractPrintable implements Expression {

	public List<String> requires = new ArrayList<String>();
	public List<Instruction> instructions = new ArrayList<Instruction>();
	
	public void addRequire(String require) {
		requires.add(require);
	}
	
	public void addInstruction(Instruction instruction) {
		instructions.add(instruction);
	}
	
	@Override
	public void printText(PrintWriter out) {
		out.format("todo: prog");
	}

	@Override
	public PacioliValue eval(Environment environment) throws MVMException {
		throw new MVMException("cannot do that");
	}

}
