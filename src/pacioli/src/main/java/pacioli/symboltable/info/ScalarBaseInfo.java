package pacioli.symboltable.info;

import java.util.Optional;

import pacioli.ast.definition.UnitDefinition;
import pacioli.misc.Location;
import pacioli.misc.PacioliFile;
import pacioli.symboltable.SymbolTableVisitor;

public final class ScalarBaseInfo extends UnitInfo {

    public String symbol;
    private Optional<UnitDefinition> definition = Optional.empty();

    public ScalarBaseInfo(String name, PacioliFile file, Boolean isGlobal, Location location) {
        super(new GeneralInfo(name, file, isGlobal, location));
    }

    public ScalarBaseInfo(GeneralInfo info) {
        super(info);
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
    public Optional<UnitDefinition> getDefinition() {
        return definition;
    }

    public void setDefinition(UnitDefinition definition) {
        this.definition = Optional.of(definition);
    }

    public Boolean isAlias() {
        return false;
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
            // if (definition == null || file == null || instances == null) {
            // throw new RuntimeException("Class info incomplete");
            // }
            ScalarBaseInfo info = new ScalarBaseInfo(this.buildGeneralInfo());
            info.symbol = this.symbol;
            info.definition = Optional.ofNullable(this.definition);
            return info;
        }
    }

    public static Builder builder() {
        return new Builder();
    }
}
