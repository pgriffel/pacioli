package pacioli.symboltable;

import java.util.Optional;

import pacioli.Location;
import pacioli.PacioliFile;
import pacioli.ast.definition.IndexSetDefinition;

public final class IndexSetInfo extends AbstractSymbolInfo<IndexSetInfo> implements TypeSymbolInfo {

    private Optional<IndexSetDefinition> definition = Optional.empty();

    @Override
    public void accept(SymbolTableVisitor visitor) {
        visitor.visit(this);
    }
    
    public IndexSetInfo(String name, PacioliFile file, String module, Boolean isGlobal, Location location) {
        super(new GenericInfo(name, file, module, isGlobal, location));
    }
    
    public IndexSetInfo(GenericInfo generic) {
        super(generic);
    };
    
    @Override
    public Optional<IndexSetDefinition> getDefinition() {
        return definition;
    }
    
    public void setDefinition(IndexSetDefinition definition) {
        this.definition = Optional.of(definition);
    }
    
    @Override
    public String globalName() {
        return String.format("index_%s_%s", generic().getModule(), name());
    }
}
