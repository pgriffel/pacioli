package pacioli.symboltable.info;

import java.util.ArrayList;
import java.util.List;
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

    public IndexSetInfo(GeneralInfo info) {
        super(info);
    }

    public IndexSetInfo(String name, PacioliFile file, Boolean isGlobal, Location location) {
        super(new GeneralInfo(name, file, isGlobal, location));
    }

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

    public static class Builder extends GeneralBuilder<Builder, IndexSetInfo> {

        // public final GeneralBuilder generalBuilder = new GeneralBuilder();

        private IndexSetDefinition definition;
        // private PacioliFile file;
        public List<InstanceInfo> instances = new ArrayList<>();

        public Builder definition(IndexSetDefinition definition) {
            this.definition = definition;
            return this;
        }

        // public Builder file(PacioliFile file) {
        // this.file = file;
        // return this;
        // }

        public Builder instance(InstanceInfo def) {
            this.instances.add(def);
            return this;
        }

        @Override
        public IndexSetInfo build() {
            // if (definition == null || file == null || instances == null) {
            // throw new RuntimeException("Class info incomplete");
            // }
            IndexSetInfo info = new IndexSetInfo(buildGeneralInfo());
            info.setDefinition(definition);
            return info;
        }

        // @Override
        // public GeneralBuilder generalBuilder() {
        // return generalBuilder;
        // }

        @Override
        public Builder isPublic(boolean isPublic) {
            // TODO Auto-generated method stub
            throw new UnsupportedOperationException("Unimplemented method 'isPublic'");
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
