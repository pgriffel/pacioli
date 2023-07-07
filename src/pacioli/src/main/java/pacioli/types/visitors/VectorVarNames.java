package pacioli.types.visitors;

import java.util.HashSet;
import java.util.LinkedHashSet;
import java.util.Set;

import pacioli.types.TypeBase;
import pacioli.types.TypeObject;
import pacioli.types.VectorUnitVar;
import pacioli.types.matrix.IndexType;
import pacioli.types.matrix.MatrixType;
import uom.Unit;

public class VectorVarNames extends Collector<String> {

    // private Stack<Set<String>> nodeStack = new Stack<>();

    public VectorVarNames() {
        super(new HashSet<>());

    }

    public Set<String> acceptTypeObject(TypeObject child) {
        // Pacioli.logln("accept: %s", child.getClass());
        child.accept(this);
        return (Set<String>) nodeStack.pop();
    }

    public void returnParts(Set<String> value) {
        // Pacioli.logln("return: %s", value.getClass());
        nodeStack.push(value);
    }

    @Override
    public void visit(MatrixType type) {
        Set<String> names = new LinkedHashSet<String>();
        names.addAll(dimensionUnitVecVarCompoundNames(type.rowDimension,
                type.rowUnit));
        names.addAll(dimensionUnitVecVarCompoundNames(type.columnDimension,
                type.columnUnit));
        returnParts(names);
    }

    public Set<String> dimensionUnitVecVarCompoundNames(IndexType dimension, Unit<TypeBase> unit) {
        Set<String> names = new HashSet<String>();
        if (dimension.isVar()) {
            for (TypeBase base : unit.bases()) {
                assert (base instanceof VectorUnitVar);
                VectorUnitVar vbase = (VectorUnitVar) base;
                // Pacioli.logln("Adding %s ! %s", dimension.varName(), vbase.unitPart());
                names.add(dimension.varName() + "!" + vbase.unitPart());
                // names.add(base.pretty());
            }
        }
        return names;
    }

}
