package pacioli.symboltable.info;

public sealed interface TypeSymbolInfo extends SymbolInfo
        permits ParametricInfo, UnitInfo, IndexSetInfo, TypeVarInfo, ClassInfo {
}
