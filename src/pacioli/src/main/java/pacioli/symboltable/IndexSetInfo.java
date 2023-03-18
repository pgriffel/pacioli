package pacioli.symboltable;

import java.util.Optional;

import pacioli.Location;
import pacioli.ast.definition.IndexSetDefinition;

public class IndexSetInfo extends AbstractSymbolInfo implements SymbolInfo {

    private Optional<IndexSetDefinition> definition = Optional.empty();

    @Override
    public void accept(SymbolTableVisitor visitor) {
        visitor.visit(this);
    }
    
    public IndexSetInfo(String name, String module, Boolean isGlobal, Location location, Boolean fromProgram) {
        super(new GenericInfo(name, module, isGlobal, location, fromProgram));
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

    public IndexSetInfo includeOther(IndexSetInfo otherInfo) {
        // TODO Auto-generated method stub
        return this;
    }

    public IndexSetInfo withFromProgram(boolean b) {
        IndexSetInfo info = new IndexSetInfo(generic());
        info.definition = definition;
        return info;
    }
}
