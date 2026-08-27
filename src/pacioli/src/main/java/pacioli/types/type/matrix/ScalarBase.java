package pacioli.types.type.matrix;

import uom.DimensionedNumber;
import uom.Unit;

public sealed interface ScalarBase extends MatrixBase permits ScalarBaseUnit, ScalarUnitVar {

    public static ScalarUnitVar unitAsVar(Unit<ScalarBase> unit) {
        if (unit.singleElement() instanceof ScalarUnitVar var) {
            return var;
        } else {
            throw new RuntimeException(String.format("Cannot cast unit %s to var", unit.pretty()));
        }
    }

    public final static Unit<ScalarBase> ONE = Unit.one();

    default DimensionedNumber<ScalarBase> flat() {
        return new DimensionedNumber<ScalarBase>(this);
    }
}
