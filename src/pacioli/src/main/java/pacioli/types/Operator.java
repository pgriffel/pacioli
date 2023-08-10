package pacioli.types;

import pacioli.symboltable.info.ParametricInfo;

public sealed interface Operator extends TypeObject permits OperatorConst, OperatorVar {

    String getName();

    ParametricInfo getInfo();
}
