package pacioli.symboltable.info;

import java.util.Optional;

import pacioli.ast.definition.TypeDefinition;
import pacioli.misc.Location;
import pacioli.misc.PacioliFile;
import pacioli.symboltable.SymbolTableVisitor;

public final class ParametricInfo extends AbstractInfo implements TypeInfo {

    private final TypeDefinition definition;

    public ParametricInfo(String name, PacioliFile file, boolean isGlobal, boolean isPublic, Location location) {
        super(new GeneralInfo(name, file, isGlobal, isPublic, location));
        this.definition = null;
    }

    public ParametricInfo(GeneralInfo info, TypeDefinition definition) {
        super(info);
        this.definition = definition;
    }

    @Override
    public void accept(SymbolTableVisitor visitor) {
        visitor.visit(this);
    }

    @Override
    public String globalName() {
        // throw new RuntimeException("todo");
        // TODO: check this name with the name used by the compiler. This was added just
        // for logging.
        // return String.format("type_%s", name());
        return String.format("%s_%s", generalInfo().getModule().replace("-", "_"), name());
    }

    @Override
    public Optional<TypeDefinition> definition() {
        return Optional.ofNullable(definition);
    }

    public static class Builder extends GeneralBuilder<Builder, ParametricInfo> {

        private TypeDefinition definition;

        @Override
        protected Builder self() {
            return this;
        }

        public Builder definition(TypeDefinition definition) {
            this.definition = definition;
            return this;
        }

        @Override
        public ParametricInfo build() {
            return new ParametricInfo(this.buildGeneralInfo(), this.definition);
        }
    }

    public static Builder builder() {
        return new Builder();
    }
}
