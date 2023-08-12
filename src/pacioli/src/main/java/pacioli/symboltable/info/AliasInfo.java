package pacioli.symboltable.info;

import java.util.Optional;

import pacioli.ast.definition.AliasDefinition;
import pacioli.symboltable.SymbolTableVisitor;

public final class AliasInfo extends UnitInfo {

    public AliasDefinition definition;

    public AliasInfo(GeneralInfo info) {
        super(info);
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
        return Optional.ofNullable(definition);
    }

    public static class Builder extends GeneralBuilder<Builder, AliasInfo> {

        private AliasDefinition definition;

        public Builder definition(AliasDefinition definition) {
            this.definition = definition;
            return this;
        }

        @Override
        protected Builder self() {
            return this;
        }

        @Override
        public AliasInfo build() {
            AliasInfo info = new AliasInfo(this.buildGeneralInfo());
            info.definition = definition;
            return info;
        }

    }

    public static Builder builder() {
        return new Builder();
    }
}
