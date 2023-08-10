package pacioli.symboltable.info;

import java.util.Optional;

import pacioli.ast.definition.IndexSetDefinition;
import pacioli.misc.Location;
import pacioli.misc.PacioliFile;
import pacioli.symboltable.SymbolTableVisitor;

public final class IndexSetInfo extends AbstractSymbolInfo implements TypeSymbolInfo {

    private Optional<IndexSetDefinition> definition = Optional.empty();

    @Override
    public void accept(SymbolTableVisitor visitor) {
        visitor.visit(this);
    }

    public IndexSetInfo(String name, PacioliFile file, Boolean isGlobal, Location location) {
        super(new GeneralInfo(name, file, isGlobal, location));
    }

    public IndexSetInfo(GeneralInfo info) {
        super(info);
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
        return String.format("index_%s_%s", generalInfo().getModule(), name());
    }
}