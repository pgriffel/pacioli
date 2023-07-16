package pacioli.types.visitors;

import java.util.HashSet;
import java.util.Set;

import pacioli.types.TypeBase;
import pacioli.types.TypeObject;
import pacioli.types.VectorUnitVar;
import pacioli.types.matrix.IndexType;
import pacioli.types.matrix.MatrixType;
import uom.Unit;

public class VectorVarNames extends Collector<String> {

    public VectorVarNames() {
        super(new HashSet<>());

    }

    public Set<String> acceptTypeObject(TypeObject child) {
        return (Set<String>) super.acceptTypeObject(child);
    }

    @Override
    public void visit(MatrixType type) {
        for (String name : unitVecVarNames(type.rowDimension, type.rowUnit)) {
            addItem(name);
        }
        for (String name : unitVecVarNames(type.columnDimension, type.columnUnit)) {
            addItem(name);
        }
    }

    private Set<String> unitVecVarNames(IndexType dimension, Unit<TypeBase> unit) {
        Set<String> names = new HashSet<String>();
        if (dimension.isVar()) {
            for (TypeBase base : unit.bases()) {
                if (base instanceof VectorUnitVar vbase) {
                    names.add(dimension.varName() + "!" + vbase.unitPart());
                } else {
                    throw new RuntimeException("Expected a VectorUnitVar");
                }
            }
        }
        return names;
    }

}
