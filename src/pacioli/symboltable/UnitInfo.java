package pacioli.symboltable;

import java.util.List;

import pacioli.ast.definition.Definition;
import pacioli.ast.definition.UnitVectorDefinition.UnitDecl;
import pacioli.ast.unit.UnitNode;

public class UnitInfo extends AbstractSymbolInfo implements SymbolInfo {

    public UnitInfo(GenericInfo generic) {
        super(generic);
    }

    public Definition definition;

    public String symbol;
    public UnitNode baseDefinition;

    public List<UnitDecl> items;

    public boolean isVector = false;

    @Override
    public String globalName() {
        return String.format("unit_%s", name());
    }

    @Override
    public Definition getDefinition() {
        return definition;
    }
    
    public Boolean isAlias() {
        return symbol == null && !isVector;
    }

    public UnitInfo includeOther(UnitInfo otherInfo) {
        // TODO Auto-generated method stub
        return this;
    }

}
