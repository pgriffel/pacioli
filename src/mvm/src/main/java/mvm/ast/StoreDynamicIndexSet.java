package mvm.ast;

import java.io.PrintWriter;
import java.util.ArrayList;
import java.util.List;

import mvm.AbstractPrintable;
import mvm.MVMException;
import mvm.Machine;
import mvm.ast.expression.Expression;
import mvm.values.PacioliList;
import mvm.values.PacioliString;
import mvm.values.PacioliValue;
import mvm.values.matrix.IndexSet;

public class StoreDynamicIndexSet extends AbstractPrintable implements Instruction {

    private String full;
    private String name;
    private Expression body;

    public StoreDynamicIndexSet(String full, String name, Expression body) {
        this.full = full;
        this.name = name;
        this.body = body;
    }

    @Override
    public void printText(PrintWriter out) {
        out.print("todo: print storeindexset");
    }

    @Override
    public void eval(Machine machine) throws MVMException {

        // Check that the index set does not already exist
        if (machine.indexSets.containsKey(full)) {
            throw new MVMException("Redefining index set '%s'", name);
        }
                
        // Evaluate the body. It should produce a list of strings.
        PacioliValue result = body.eval(machine.store);

        if (result instanceof PacioliList) {

            PacioliList list = (PacioliList) result;

            List<String> listValues = new ArrayList<>();

            for (PacioliValue item : list.items()) {

                if (item instanceof PacioliString) {

                    PacioliString string = (PacioliString) item;
                    listValues.add(string.toText());

                } else {
                    throw new MVMException("Index set body must evaluate to a list of strings, but the list contains a '%s'", item.getClass());
                }
            }

            // Store the list of strings as the index set
            machine.indexSets.put(full, new IndexSet(name, listValues));

        } else {
            throw new MVMException("Index set body must evaluate to a list, but it is a '%s'", result.getClass());
        }

    }

}
