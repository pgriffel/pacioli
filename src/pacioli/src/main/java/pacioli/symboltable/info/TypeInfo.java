package pacioli.symboltable.info;

public sealed interface TypeInfo extends SymbolInfo
                permits ParametricInfo, UnitInfo, IndexSetInfo, TypeVarInfo, ClassInfo {
}
