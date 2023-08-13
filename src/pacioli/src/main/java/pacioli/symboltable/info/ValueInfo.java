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
    private final boolean isRef;
    private final ValueDefinition definition;
    private final TypeNode declaredType;
    private final ClassInfo typeClass;

    // Set during type inference
    private TypeObject inferredType;

    public ValueInfo(
            GeneralInfo info,
            boolean isMonomorphic,
            boolean isRef,
            ValueDefinition definition,
            ClassInfo typeClass,
            TypeNode declaredType) {
        super(info);
        this.isMonomorphic = isMonomorphic;
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
    public Optional<ValueDefinition> definition() {
        return Optional.ofNullable(this.definition);
    }

    public boolean isMonomorphic() {
        return this.isMonomorphic;
    }

    public Optional<TypeNode> getDeclaredType() {
        return Optional.ofNullable(this.declaredType);
    }

    public Optional<ClassInfo> typeClass() {
        return Optional.ofNullable(this.typeClass);
    }

    public List<String> getDocuParts() {
        if (this.generalInfo().documentation().isPresent()) {
            String[] parts = this.generalInfo().documentation().get().split("\\r?\\n\s*\\r?\\n");
            return List.of(parts);
        } else {
            return List.of();
        }
    }

    public boolean isRef() {
        return isRef;
    }

    public TypeObject getType() {
        if (declaredType != null) {
            return declaredType.evalType();
        } else if (inferredType != null) {
            return inferredType;
        } else {
            throw new RuntimeException("No type info",
                    new PacioliException(location(), "no inferred or declared type for %s", name()));
        }
    }

    public Optional<TypeObject> inferredType() {
        return Optional.ofNullable(inferredType);
    }

    public TypeObject inferredTypeChecked() {
        if (inferredType != null) {
            return inferredType;
        } else {
            throw new RuntimeException("No type info (did you mean getType() instead of inferredType()?)",
                    new PacioliException(location(), "no inferred type for %s ", name()));
        }
    }

    public Boolean isFunction() {
        Schema schema = (Schema) getType();
        return schema.type instanceof FunctionType;
    }

    public void setinferredType(TypeObject type) {
        this.inferredType = type;
    }

    public boolean isUserDefined() {
        return this.definition != null ? this.definition.isUserDefined : false;
    }

    public boolean isOverloaded() {
        return this.typeClass != null;
    }

    public static class Builder extends GeneralBuilder<Builder, ValueInfo> {

        public Boolean isMonomorphic;
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
            if (isMonomorphic == null) {
                throw new RuntimeException("Field missing");
            }
            return new ValueInfo(
                    this.buildGeneralInfo(),
                    this.isMonomorphic,
                    this.isRef,
                    this.definition,
                    this.typeClass,
                    this.declaredType);
        }
    }

    public static Builder builder() {
        return new Builder();
    }
}
