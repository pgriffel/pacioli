package pacioli.types;

import pacioli.symboltable.ParametricInfo;

public sealed interface Operator extends TypeObject permits OperatorConst, OperatorVar {

    String getName();

    ParametricInfo getInfo();
}
