package pacioli.symboltable;

import java.util.Optional;

import pacioli.Location;
import pacioli.PacioliFile;
import pacioli.ast.definition.UnitDefinition;

public final class ScalarBaseInfo extends UnitInfo {

    public String symbol;
    private Optional<UnitDefinition> definition = Optional.empty();
    
    public ScalarBaseInfo(String name, PacioliFile file, Boolean isGlobal, Location location) {
        super(new GenericInfo(name, file, isGlobal, location));
    }
    
    public ScalarBaseInfo(GenericInfo generic) {
        super(generic);
    }

    @Override
    public void accept(SymbolTableVisitor visitor) {
        visitor.visit(this);
    }
    
    @Override
    public String globalName() {
        return String.format("sbase_%s", name());
    }

    @Override
    public Optional<UnitDefinition> getDefinition() {
        return definition;
    }
    
    public void setDefinition(UnitDefinition definition) {
        this.definition = Optional.of(definition);
    }
    
    public Boolean isAlias() {
        return false;
    }
}
