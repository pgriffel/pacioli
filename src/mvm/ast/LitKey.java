package mvm.ast;

import java.io.PrintWriter;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;

import mvm.AbstractPrintable;
import mvm.Environment;
import mvm.MVMException;
import mvm.values.PacioliValue;
import mvm.values.matrix.IndexSet;
import mvm.values.matrix.Key;
import mvm.values.matrix.MatrixDimension;

public class LitKey extends AbstractPrintable implements Expression {

    private List<String> entities;
	private List<String> items;

    public LitKey(List<String> entities, List<String> items) {
        this.entities = entities;
        this.items = items;
    }

    @Override
    public PacioliValue eval(Environment environment) throws MVMException {
    	List<IndexSet> sets = new ArrayList<IndexSet>();
    	HashMap<String, IndexSet> indexSets = environment.getMachine().indexSets;
		for (String entity: entities) {
			if (indexSets.containsKey(entity)) {
				sets.add(indexSets.get(entity));
			} else {
				throw new MVMException("Index set '%s' unnown", entity);
			}
		}
    	return new Key(items, new MatrixDimension(sets));
    }

    @Override
    public void printText(PrintWriter out) {
        
    }
}
