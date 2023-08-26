package pacioli.symboltable.info;

import java.util.Optional;

import pacioli.ast.definition.AliasDefinition;
import pacioli.compiler.Location;
import pacioli.symboltable.SymbolTableVisitor;

public final class AliasInfo extends UnitInfo {

    private final AliasDefinition definition;

    public AliasInfo(GeneralInfo info, AliasDefinition definition) {
        super(info);
        this.definition = definition;
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
    public Optional<AliasDefinition> definition() {
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
        public Optional<Location> definitionLocation() {
            return Optional.ofNullable(this.definition).map(def -> def.location());
        }

        @Override
        public AliasInfo build() {
            return new AliasInfo(this.buildGeneralInfo(), definition);
        }
    }

    public static Builder builder() {
        return new Builder();
    }
}
