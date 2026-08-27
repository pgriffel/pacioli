package mvm.values.matrix;

import uom.DimensionedNumber;
import uom.Prefix;
import uom.SIBase;
import uom.Unit;

public final class ScalarBase extends SIBase implements MVMBase {

    public final static Unit<ScalarBase> ONE = Unit.one();

    protected DimensionedNumber<ScalarBase> definition;

    public ScalarBase(String name, String symbol) {
        super(name, symbol);
    }

    public ScalarBase(String name, String symbol, DimensionedNumber<ScalarBase> definition) {
        super(name, symbol);
        this.definition = definition;
    }

    public ScalarBase(String name, String symbol, Prefix prefix) {
        super(name, symbol, prefix);
    }

    public DimensionedNumber<ScalarBase> flat() {
        return this.definition;
    }

}
