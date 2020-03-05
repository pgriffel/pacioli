package mvm.ast;

import java.io.PrintWriter;
import java.util.List;

import mvm.AbstractPrintable;
import mvm.MVMException;
import mvm.Machine;
import mvm.ast.unit.UnitNode;
import mvm.values.matrix.IndexSet;
import mvm.values.matrix.MatrixBase;
import mvm.values.matrix.UnitVector;
import uom.Unit;

public class StoreUnitVector extends AbstractPrintable implements Instruction {

    private String entity;
    private String name;
    private List<String> names;
    private List<UnitNode> units;

    public StoreUnitVector(String entity, String name, List<String> names, List<UnitNode> units) {
        this.entity = entity;
        this.name = name;
        this.names = names;
        this.units = units;
    }

    @Override
    public void printText(PrintWriter out) {
        out.print("todo:print store unit vec");
    }

    @Override
    public void eval(Machine machine) throws MVMException {

        // Lookup the index set
        IndexSet indexSet;
        if (machine.indexSets.containsKey(entity)) {
            indexSet = machine.indexSets.get(entity);
        } else {
            throw new MVMException("Index set '%s' unnown", entity);
        }

        // Create a unit array for the index set and fill it with ones
        int n = indexSet.size();
        Unit[] unitArray = new Unit[n];
        for (int i = 0; i < n; i++) {
            unitArray[i] = MatrixBase.ONE;
        }

        // Fill the unit array with the units
        for (int i = 0; i < names.size(); i++) {
            int row = indexSet.ElementPosition(names.get(i));
            if (row < 0) {
                throw new MVMException("Element " + names.get(i) + " unknown");
            }
            unitArray[row] = units.get(i).eval(machine);
        }

        // Store the unit array as unit vector in the machine
        machine.unitVectors.put(name, new UnitVector(indexSet, name, unitArray));

    }

}
