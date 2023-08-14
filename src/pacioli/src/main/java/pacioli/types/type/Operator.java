package pacioli.types.type;

import java.util.Optional;

import pacioli.symboltable.info.ParametricInfo;

public sealed interface Operator extends TypeObject permits OperatorConst, OperatorVar {

    String name();

    Optional<ParametricInfo> info();
}
