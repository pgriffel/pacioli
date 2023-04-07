package pacioli.symboltable;

public sealed interface TypeSymbolInfo extends SymbolInfo permits TypeInfo, UnitInfo, IndexSetInfo  {

    TypeSymbolInfo withFromProgram(boolean b);
    

}
