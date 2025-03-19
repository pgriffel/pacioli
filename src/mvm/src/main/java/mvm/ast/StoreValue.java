package mvm.ast;

import java.io.PrintWriter;

import mvm.MVMException;
import mvm.Machine;
import mvm.ast.expression.Expression;

public class StoreValue implements Instruction {

    private String name;
    private Expression body;

    public StoreValue(String n, Expression e) {
        this.name = n;
        this.body = e;
    }

    @Override
    public void printText(PrintWriter out) {
        out.print("todo: print store value");
    }

    @Override
    public void eval(Machine machine) throws MVMException {
        // Pacioli.logln("Storing %s", name);
        machine.storeCode(name, body);
    }

}
