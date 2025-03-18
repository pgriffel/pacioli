package mvm.ast;

import java.io.PrintWriter;
import mvm.MVMException;
import mvm.Machine;
import mvm.ast.expression.Expression;
import mvm.values.PacioliValue;
// import pacioli.Pacioli;
import mvm.values.TheVoid;

public class Print implements Instruction {

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
        if (!(result instanceof TheVoid)) {
            // Pacioli.logln("%s", result.toText());
            if (System.console() == null) {
                System.out.println(result.toText());
            } else {
                System.console().format("%s\n", result.toText());
            }
        }
    }

}
