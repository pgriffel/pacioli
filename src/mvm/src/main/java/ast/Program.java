package mvm.ast;

import java.io.PrintWriter;
import java.util.ArrayList;
import java.util.List;

import mvm.AbstractPrintable;

public class Program extends AbstractPrintable {

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
}
