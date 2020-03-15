package pacioli.symboltable;

import java.util.Optional;

import pacioli.ast.definition.UnitDefinition;

public abstract class UnitInfo extends AbstractSymbolInfo implements SymbolInfo {

    public UnitInfo(GenericInfo generic) {
        super(generic);
    }
    
    @Override
    public String globalName() {
        return String.format("unit_%s", name());
    }
    
    public Boolean isAlias() {
        return false;
    }

    public UnitInfo includeOther(UnitInfo otherInfo) {
        return this;
    }
    

    //abstract public Optional<? extends UnitDefinition> getUnitDefinition();

}
