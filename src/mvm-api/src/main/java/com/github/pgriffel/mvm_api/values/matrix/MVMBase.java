package com.github.pgriffel.mvm_api.values.matrix;

import uom.Base;
import uom.Unit;

public sealed interface MVMBase extends Base permits VectorBase, ScalarBase {

    public final static Unit<MVMBase> ONE = Unit.one();

};