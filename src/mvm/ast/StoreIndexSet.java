package mvm.ast;

import java.io.PrintWriter;
import java.util.List;

import mvm.AbstractPrintable;
import mvm.MVMException;
import mvm.Machine;
import mvm.values.matrix.IndexSet;

public class StoreIndexSet extends AbstractPrintable implements Instruction {

    private String full;
    private String name;
    private List<String> values;

    public StoreIndexSet(String full, String name, List<String> values) {
        this.full = full;
        this.name = name;
        this.values = values;
    }

    @Override
    public void printText(PrintWriter out) {
        out.print("todo: print storeindexset");
    }

    @Override
    public void eval(Machine machine) throws MVMException {
        if (machine.indexSets.containsKey(full)) {
            throw new MVMException("Redefining index set '%s'", name);
        }
        machine.indexSets.put(full, new IndexSet(name, values));
    }

}
