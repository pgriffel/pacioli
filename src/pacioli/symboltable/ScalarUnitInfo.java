package pacioli.symboltable;

import java.util.List;

import pacioli.ast.definition.Definition;
import pacioli.ast.definition.UnitDefinition;
import pacioli.ast.definition.UnitVectorDefinition.UnitDecl;
import pacioli.ast.unit.UnitNode;

public class ScalarUnitInfo extends UnitInfo implements SymbolInfo {

    public ScalarUnitInfo(GenericInfo generic) {
        super(generic);
    }

    public UnitDefinition definition;
    
    //public Definition definition;

    public String symbol;
    public UnitNode baseDefinition;

    public List<UnitDecl> items;

    public boolean isVector = false;

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
        return symbol == null && !isVector;
    }

    public ScalarUnitInfo includeOther(ScalarUnitInfo otherInfo) {
        // TODO Auto-generated method stub
        return this;
    }

}
