package pacioli.symboltable;

import java.util.List;
import java.util.Optional;

import pacioli.Location;
import pacioli.PacioliException;
import pacioli.PacioliFile;
import pacioli.ast.definition.ValueDefinition;
import pacioli.types.FunctionType;
import pacioli.types.TypeObject;
import pacioli.types.Schema;
import pacioli.types.ast.TypeNode;

public class ValueInfo extends AbstractSymbolInfo {

    public record ParsedValueInfo(ValueDefinition definition) {

    }

    public record ResolvedValueInfo(ParsedValueInfo parsed, boolean isRef) {

        TypedValueInfo withType(TypeObject type) {
            return new TypedValueInfo(this, type);
        }

    }

    public record TypedValueInfo(ResolvedValueInfo resolved, TypeObject type) {

    }

    // Set during parsing
    private Optional<ValueDefinition> definition = Optional.empty();
    private Optional<TypeNode> declaredType = Optional.empty();
    private Optional<String> docu = Optional.empty();
    public final Boolean isMonomorphic;

    // Set during resolving
    private Optional<Boolean> isRef = Optional.of(false);

    // Set during type inference
    public Optional<TypeObject> inferredType = Optional.empty();
    private boolean isPublic;

    public ValueInfo(String name, PacioliFile file, Boolean isGlobal, Boolean isMonomorphic,
            Location location, boolean isPublic) {
        super(new GeneralInfo(name, file, isGlobal, location));
        this.isMonomorphic = isMonomorphic;
        this.isPublic = isPublic;
    }

    public ValueInfo(GeneralInfo info, Boolean isMonomorphic, boolean isPublic) {
        super(info);
        this.isMonomorphic = isMonomorphic;
        this.isPublic = isPublic;
    }

    @Override
    public void accept(SymbolTableVisitor visitor) {
        visitor.visit(this);
    }

    @Override
    public String globalName() {
        return global(generalInfo().getModule(), name());
    }

    public static String global(String module, String name) {
        return String.format("%s_%s", module.replace("-", "_"), name);
    }

    @Override
    public Optional<ValueDefinition> getDefinition() {
        return definition;
    }

    public Optional<ValueDefinition> getValueDefinition() {
        return definition;
    }

    public void setDefinition(ValueDefinition definition) {
        this.definition = Optional.of(definition);
    }

    public Optional<TypeNode> getDeclaredType() {
        return declaredType;
    }

    public void setDeclaredType(TypeNode declaredType) {
        this.declaredType = Optional.of(declaredType);
    }

    public Optional<String> getDocu() {
        return docu;
    }

    public List<String> getDocuParts() {
        if (docu.isPresent()) {
            String[] parts = docu.get().split("\\r?\\n\s*\\r?\\n");
            return List.of(parts);
        } else {
            return List.of();
        }
    }

    public void setDocu(String docu) {
        this.docu = Optional.of(docu);
    }

    public Boolean isRef() {
        if (isRef.isPresent()) {
            return isRef.get();
        } else {
            throw new RuntimeException("No isRef value, ValueInfo must have been resolved");
        }
    }

    public void setIsRef(Boolean isRef) {
        this.isRef = Optional.of(isRef);
    }

    public TypeObject getType() {
        if (declaredType.isPresent()) {
            return declaredType.get().evalType();
        } else if (inferredType.isPresent()) {
            return inferredType.get();
        } else {
            throw new RuntimeException("No type info",
                    new PacioliException(getLocation(), "no inferred or declared type"));
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
        return definition.orElseThrow(() -> new RuntimeException("Must be resolved")).isUserDefined;
    }

    public static class Builder {
        public String name;
        public PacioliFile file;
        public Boolean isGlobal;
        public Boolean isMonomorphic;
        public Location location;
        public boolean isPublic;
        public ValueDefinition definition;
        public TypeNode declaredType;
        public String docu;

        public Builder name(String name) {
            this.name = name;
            return this;
        }

        public Builder file(PacioliFile file) {
            this.file = file;
            return this;
        }

        public Builder isGlobal(Boolean isGlobal) {
            this.isGlobal = isGlobal;
            return this;
        }

        public Builder isMonomorphic(Boolean isMonomorphic) {
            this.isMonomorphic = isMonomorphic;
            return this;
        }

        public Builder location(Location location) {
            this.location = location;
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

        public Builder docu(String docu) {
            this.docu = docu;
            return this;
        }

        public ValueInfo build() {
            ValueInfo info = new ValueInfo(name, file, isGlobal, isMonomorphic, location, isPublic);
            if (declaredType != null)
                info.setDeclaredType(declaredType);
            if (docu != null)
                info.setDocu(docu);
            if (definition != null)
                info.setDefinition(definition);
            return info;
        }
    }

    public static Builder builder() {
        return new Builder();
    }
}
