package pacioli.symboltable.info;

import java.util.List;
import java.util.Optional;

import pacioli.ast.definition.ValueDefinition;
import pacioli.misc.PacioliException;
import pacioli.symboltable.SymbolTableVisitor;
import pacioli.types.FunctionType;
import pacioli.types.TypeObject;
import pacioli.types.Schema;
import pacioli.types.ast.TypeNode;

public class ValueInfo extends AbstractSymbolInfo {

    private final boolean isMonomorphic;
    private final boolean isPublic; // visibility noemen en enum maken
    private final boolean isRef;

    private final Optional<ValueDefinition> definition;
    private final Optional<TypeNode> declaredType;
    private final Optional<ClassInfo> typeClass;

    // Set during type inference
    // TODO: make private. This will clear up the need for the throws below
    public Optional<TypeObject> inferredType = Optional.empty();

    public ValueInfo(
            GeneralInfo info,
            boolean isMonomorphic,
            boolean isPublic,
            boolean isRef,
            Optional<ValueDefinition> definition,
            Optional<ClassInfo> typeClass,
            Optional<TypeNode> declaredType) {
        super(info);
        this.isMonomorphic = isMonomorphic;
        this.isPublic = isPublic;
        this.definition = definition;
        this.typeClass = typeClass;
        this.declaredType = declaredType;
        this.isRef = isRef;
    }

    @Override
    public void accept(SymbolTableVisitor visitor) {
        visitor.visit(this);
    }

    @Override
    public String globalName() {
        return String.format("%s_%s", generalInfo().getModule(), name());
    }

    public static String global(String module, String name) {
        return String.format("%s_%s", module, name);
    }

    @Override
    public Optional<ValueDefinition> getDefinition() {
        return definition;
    }

    public boolean isMonomorphic() {
        return isMonomorphic;
    }

    public Optional<TypeNode> getDeclaredType() {
        return declaredType;
    }

    public Optional<ClassInfo> typeClass() {
        return typeClass;
    }

    public List<String> getDocuParts() {
        if (this.generalInfo().getDocumentation().isPresent()) {
            String[] parts = this.generalInfo().getDocumentation().get().split("\\r?\\n\s*\\r?\\n");
            return List.of(parts);
        } else {
            return List.of();
        }
    }

    public boolean isRef() {
        return isRef;
    }

    public TypeObject getType() {
        if (declaredType.isPresent()) {
            return declaredType.get().evalType();
        } else if (inferredType.isPresent()) {
            return inferredType.get();
        } else {
            throw new RuntimeException("No type info",
                    new PacioliException(getLocation(), "no inferred or declared type for %s", name()));
        }
    }

    public TypeObject inferredType() {
        if (inferredType.isPresent()) {
            return inferredType.get();
        } else {
            throw new RuntimeException("No type info (did you mean getType() instead of inferredType()?)",
                    new PacioliException(getLocation(), "no inferred type for %s ", name()));
        }
    }

    public Boolean isFunction() {
        Schema schema = (Schema) getType();
        return schema.type instanceof FunctionType;
    }

    public void setinferredType(TypeObject type) {
        this.inferredType = Optional.of(type);
    }

    public boolean isPublic() {
        return isPublic;
    }

    public boolean isUserDefined() {
        return definition.map(def -> def.isUserDefined).orElse(false);
    }

    public boolean isOverloaded() {
        return !this.typeClass.isEmpty();
    }

    public static class Builder extends GeneralBuilder<Builder, ValueInfo> {

        public Boolean isMonomorphic;
        public Boolean isPublic;
        public boolean isRef = false;
        public ValueDefinition definition;
        public TypeNode declaredType;
        public ClassInfo typeClass;

        @Override
        protected Builder self() {
            return this;
        }

        public Builder isMonomorphic(Boolean isMonomorphic) {
            this.isMonomorphic = isMonomorphic;
            return this;
        }

        public Builder isPublic(boolean isPublic) {
            this.isPublic = isPublic;
            return this;
        }

        public Builder definition(ValueDefinition definition) {
            this.definition = definition;
            return this;
        }

        public Builder declaredType(TypeNode declaredType) {
            this.declaredType = declaredType;
            return this;
        }

        public Builder isRef(boolean isRef) {
            this.isRef = isRef;
            return this;
        }

        public Builder typeClass(ClassInfo typeClass) {
            this.typeClass = typeClass;
            return this;
        }

        public ValueInfo build() {
            if (isMonomorphic == null ||
                    isPublic == null) {
                throw new RuntimeException("Field missing");
            }
            return new ValueInfo(
                    this.buildGeneralInfo(),
                    isMonomorphic,
                    isPublic,
                    isRef,
                    Optional.ofNullable(definition),
                    Optional.ofNullable(typeClass),
                    Optional.ofNullable(declaredType));
        }
    }

    public static Builder builder() {
        return new Builder();
    }
}
