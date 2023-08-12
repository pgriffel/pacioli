package pacioli.symboltable.info;

import java.util.Optional;

import pacioli.ast.definition.TypeDefinition;
import pacioli.misc.Location;
import pacioli.misc.PacioliFile;
import pacioli.symboltable.SymbolTableVisitor;
import pacioli.types.ast.TypeNode;

public final class ParametricInfo extends AbstractSymbolInfo implements TypeInfo {

    private Optional<TypeDefinition> definition = Optional.empty();
    public TypeNode typeAST;
    public Boolean isIndexSetId;
    public Boolean isUnitId;
    public Boolean isVar;

    public ParametricInfo(String name, PacioliFile file, Boolean isGlobal, Location location) {
        super(new GeneralInfo(name, file, isGlobal, location));
    }

    public ParametricInfo(GeneralInfo info) {
        super(info);
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
    public Optional<TypeDefinition> getDefinition() {
        return definition;
    }

    public void setDefinition(TypeDefinition definition) {
        this.definition = Optional.of(definition);
    }

    public static class Builder extends GeneralBuilder<Builder, ParametricInfo> {

        private TypeDefinition definition;
        private TypeNode typeAST;

        @Override
        protected Builder self() {
            return this;
        }

        public Builder definition(TypeDefinition definition) {
            this.definition = definition;
            return this;
        }

        public Builder typeAST(TypeNode typeAST) {
            this.typeAST = typeAST;
            return this;
        }

        @Override
        public ParametricInfo build() {
            // if (definition == null || file == null || instances == null) {
            // throw new RuntimeException("Class info incomplete");
            // }
            ParametricInfo info = new ParametricInfo(this.buildGeneralInfo());
            info.typeAST = this.typeAST;
            info.definition = Optional.ofNullable(this.definition);
            return info;
        }
    }

    public static Builder builder() {
        return new Builder();
    }
}
