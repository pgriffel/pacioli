package pacioli.types.type.matrix;

import uom.Unit;

public sealed interface VectorBase extends MatrixBase permits VectorBaseUnit, VectorUnitVar {

    public static VectorUnitVar unitAsVar(Unit<VectorBase> unit) {
        if (unit.singleElement() instanceof VectorUnitVar var) {
            return var;
        } else {
            throw new RuntimeException(String.format("Cannot cast unit %s to var", unit.pretty()));
        }
    }

    public final static Unit<VectorBase> ONE = Unit.one();
}
