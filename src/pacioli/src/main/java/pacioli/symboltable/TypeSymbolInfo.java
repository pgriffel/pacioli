package pacioli.symboltable;

import pacioli.Location;

public sealed interface TypeSymbolInfo extends SymbolInfo permits TypeInfo, UnitInfo, IndexSetInfo  {

    TypeSymbolInfo withFromProgram(boolean b);
    

}
