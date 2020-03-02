package pacioli.symboltable;

import pacioli.ast.definition.Definition;
import pacioli.ast.definition.IndexSetDefinition;

public class IndexSetInfo extends AbstractSymbolInfo implements SymbolInfo {

    public IndexSetDefinition definition;

    public IndexSetInfo(GenericInfo generic) {
        super(generic);
    };
    
    @Override
    public Definition getDefinition() {
        return definition;
    }
    
    @Override
    public String globalName() {
        return String.format("index_%s_%s", generic().module, name());
    }

    public IndexSetInfo includeOther(IndexSetInfo otherInfo) {
        // TODO Auto-generated method stub
        return this;
    }
}
