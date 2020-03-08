package pacioli.symboltable;

import pacioli.ast.definition.Definition;
import pacioli.ast.definition.UnitDefinition;

public class ScalarUnitInfo extends UnitInfo implements SymbolInfo {

    public UnitDefinition definition;
    public String symbol;

    public ScalarUnitInfo(GenericInfo generic) {
        super(generic);
    }

    @Override
    public void accept(SymbolTableVisitor visitor) {
        visitor.visit(this);
    }
    
    @Override
    public String globalName() {
        return String.format("unit_%s", name());
    }

    @Override
    public Definition getDefinition() {
        return definition;
    }
    
    public Boolean isAlias() {
        return false;
    }

    public ScalarUnitInfo includeOther(ScalarUnitInfo otherInfo) {
        return this;
    }

}
