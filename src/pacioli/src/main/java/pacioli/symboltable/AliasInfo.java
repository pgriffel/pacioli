package pacioli.symboltable;

import java.util.Optional;

import pacioli.Location;
import pacioli.PacioliFile;
import pacioli.ast.definition.AliasDefinition;

public final class AliasInfo extends UnitInfo<AliasInfo> {

    public AliasDefinition definition;
    
    public AliasInfo(String name, PacioliFile file, String module, Location location) {
        super(new GenericInfo(name, file, module, true, location));
        
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
}
