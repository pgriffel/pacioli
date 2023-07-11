package pacioli.symboltable;

public sealed interface TypeSymbolInfo extends SymbolInfo
        permits ParametricInfo, UnitInfo, IndexSetInfo, TypeVarInfo, ClassInfo {
}
