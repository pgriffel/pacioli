package mvm.values.matrix;

import uom.Base;
import uom.PowerProduct;
import uom.Unit;

public sealed interface MVMBase extends Base permits VectorBase, ScalarBase {

    public final static Unit<MVMBase> ONE = new PowerProduct<MVMBase>();

};