package pacioli.symboltable.info;

public sealed interface TypeInfo extends Info
        permits ParametricInfo, UnitInfo, IndexSetInfo, TypeVarInfo, ClassInfo {
}
