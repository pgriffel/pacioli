package pacioli.symboltable;

import pacioli.ast.definition.Definition;
import pacioli.ast.definition.IndexSetDefinition;

public class IndexSetInfo implements SymbolInfo {

    public IndexSetDefinition definition;
    public GenericInfo generic;

    @Override
    public GenericInfo generic() {
        return generic;
    }

    @Override
    public Definition getDefinition() {
        return definition;
    }

    @Override
    public String name() {
        return generic.name;
    }

    @Override
    public String globalName() {
        return String.format("index_%s_%s", generic.module, generic.name);
    }
}
