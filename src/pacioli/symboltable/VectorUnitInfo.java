package pacioli.symboltable;

import java.util.List;
import java.util.Optional;

import pacioli.ast.definition.IndexSetDefinition;
import pacioli.ast.definition.UnitVectorDefinition;
import pacioli.ast.definition.UnitVectorDefinition.UnitDecl;

public class VectorUnitInfo extends UnitInfo implements SymbolInfo {

    private Optional<UnitVectorDefinition> definition = Optional.empty();
    public List<UnitDecl> items;
    
    public VectorUnitInfo(GenericInfo generic) {
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
    public Optional<UnitVectorDefinition> getDefinition() {
        return definition;
    }
    
    public void setDefinition(UnitVectorDefinition definition) {
        this.definition = Optional.of(definition);
    }
    
    public VectorUnitInfo includeOther(VectorUnitInfo otherInfo) {
        // TODO Auto-generated method stub
        return this;
    }

}
