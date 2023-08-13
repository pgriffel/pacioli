package pacioli.symboltable.info;

import java.util.Optional;

import pacioli.ast.definition.UnitDefinition;
import pacioli.misc.Location;
import pacioli.misc.PacioliFile;
import pacioli.symboltable.SymbolTableVisitor;

public final class ScalarBaseInfo extends UnitInfo {

    private final String symbol;
    private final UnitDefinition definition;

    public ScalarBaseInfo(String name, PacioliFile file, boolean isGlobal, boolean isPublic, Location location,
            String symbol) {
        super(new GeneralInfo(name, file, isGlobal, isPublic, location));
        this.symbol = symbol;
        this.definition = null;
    }

    public ScalarBaseInfo(GeneralInfo info, String symbol, UnitDefinition definition) {
        super(info);
        this.symbol = symbol;
        this.definition = definition;
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
    public Optional<UnitDefinition> definition() {
        return Optional.ofNullable(definition);
    }

    public Boolean isAlias() {
        return false;
    }

    public String symbol() {
        return this.symbol;
    }

    public static class Builder extends GeneralBuilder<Builder, ScalarBaseInfo> {

        private UnitDefinition definition;
        public String symbol;

        @Override
        protected Builder self() {
            return this;
        }

        public Builder definition(UnitDefinition definition) {
            this.definition = definition;
            return this;
        }

        public Builder symbol(String symbol) {
            this.symbol = symbol;
            return this;
        }

        @Override
        public ScalarBaseInfo build() {
            return new ScalarBaseInfo(this.buildGeneralInfo(), this.symbol, this.definition);
        }
    }

    public static Builder builder() {
        return new Builder();
    }
}
