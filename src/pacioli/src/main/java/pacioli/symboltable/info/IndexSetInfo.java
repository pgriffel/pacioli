package pacioli.symboltable.info;

import java.util.Optional;

import pacioli.ast.definition.IndexSetDefinition;
import pacioli.misc.Location;
import pacioli.misc.PacioliFile;
import pacioli.symboltable.SymbolTableVisitor;

public final class IndexSetInfo extends AbstractSymbolInfo implements TypeInfo {

    private final IndexSetDefinition definition;

    @Override
    public void accept(SymbolTableVisitor visitor) {
        visitor.visit(this);
    }

    public IndexSetInfo(GeneralInfo info, IndexSetDefinition definition) {
        super(info);
        this.definition = definition;
    }

    public IndexSetInfo(String name, PacioliFile file, boolean isGlobal, boolean isPublic, Location location) {
        super(new GeneralInfo(name, file, isGlobal, isPublic, location));
        this.definition = null;
    }

    @Override
    public Optional<IndexSetDefinition> definition() {
        return Optional.ofNullable(this.definition);
    }

    @Override
    public String globalName() {
        return String.format("index_%s_%s", generalInfo().getModule(), name());
    }

    public static class Builder extends GeneralBuilder<Builder, IndexSetInfo> {

        private IndexSetDefinition definition;

        public Builder definition(IndexSetDefinition definition) {
            this.definition = definition;
            return this;
        }

        @Override
        public IndexSetInfo build() {
            return new IndexSetInfo(buildGeneralInfo(), definition);
        }

        @Override
        protected Builder self() {
            return this;
        }

    }

    public static Builder builder() {
        return new Builder();
    }
}
