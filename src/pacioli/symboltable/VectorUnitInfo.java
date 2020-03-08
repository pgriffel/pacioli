package pacioli.symboltable;

import java.util.List;

import pacioli.ast.definition.Definition;
import pacioli.ast.definition.UnitVectorDefinition;
import pacioli.ast.definition.UnitVectorDefinition.UnitDecl;
import pacioli.ast.unit.UnitNode;

public class VectorUnitInfo extends UnitInfo implements SymbolInfo {

    public UnitVectorDefinition definition;
    public List<UnitDecl> items;
    
    public VectorUnitInfo(GenericInfo generic) {
        super(generic);
    }
/*
    

    public String symbol;
    public UnitNode baseDefinition;



    public boolean isVector = false;
*/
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

    public VectorUnitInfo includeOther(VectorUnitInfo otherInfo) {
        // TODO Auto-generated method stub
        return this;
    }

}
