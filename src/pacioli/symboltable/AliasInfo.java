package pacioli.symboltable;

import java.util.List;

import pacioli.ast.definition.AliasDefinition;
import pacioli.ast.definition.Definition;
import pacioli.ast.definition.UnitVectorDefinition.UnitDecl;
import pacioli.ast.unit.UnitNode;

public class AliasInfo extends UnitInfo implements SymbolInfo {

    public AliasDefinition definition;
    
    public AliasInfo(GenericInfo generic) {
        super(generic);
    }
    
/*
    //public Definition definition;

    public String symbol;
    public UnitNode baseDefinition;

    public List<UnitDecl> items;

    public boolean isVector = false;
*/

    public Boolean isAlias() {
        return true;
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

    public AliasInfo includeOther(AliasInfo otherInfo) {
        // TODO Auto-generated method stub
        return this;
    }

}
