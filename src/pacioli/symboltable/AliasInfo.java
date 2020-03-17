package pacioli.symboltable;

import java.util.Optional;

import pacioli.Location;
import pacioli.ast.definition.AliasDefinition;

public class AliasInfo extends UnitInfo implements SymbolInfo {

    public AliasDefinition definition;
    
    public AliasInfo(String name, String module, Location location) {
        super(new GenericInfo(name, module, true, location));
        
    }
    
    public AliasInfo(GenericInfo generic) {
        super(generic);
    }

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
    public Optional<AliasDefinition> getDefinition() {
        return Optional.of(definition);
    }

    public AliasInfo includeOther(AliasInfo otherInfo) {
        // TODO Auto-generated method stub
        return this;
    }

}
