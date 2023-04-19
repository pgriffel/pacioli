package pacioli.symboltable;

import java.util.Optional;

import pacioli.Location;
import pacioli.PacioliException;
import pacioli.PacioliFile;
import pacioli.ast.definition.ValueDefinition;
import pacioli.types.FunctionType;
import pacioli.types.PacioliType;
import pacioli.types.Schema;
import pacioli.types.ast.TypeNode;

public class ValueInfo extends AbstractSymbolInfo<ValueInfo> {

    public record ParsedValueInfo(ValueDefinition definition) {

    }

    public record ResolvedValueInfo(ParsedValueInfo parsed, boolean isRef) {

        TypedValueInfo withType(PacioliType type) {
            return new TypedValueInfo(this, type);
        }

    }

    public record TypedValueInfo(ResolvedValueInfo resolved, PacioliType type) {

    }

    // Set during parsing
    private Optional<ValueDefinition> definition = Optional.empty();
    private Optional<TypeNode> declaredType = Optional.empty();
    public final Boolean isMonomorphic;

    // Set during resolving
    private Optional<Boolean> isRef = Optional.of(false);

    // Set during type inference
    public Optional<PacioliType> inferredType = Optional.empty();
    private boolean isPublic;

    public ValueInfo(String name, PacioliFile file, String module, Boolean isGlobal, Boolean isMonomorphic,
            Location location, boolean isPublic) {
        super(new GenericInfo(name, file, module, isGlobal, location));
        this.isMonomorphic = isMonomorphic;
        this.isPublic = isPublic;
    }

    public ValueInfo(GenericInfo generic, Boolean isMonomorphic, boolean isPublic) {
        super(generic);
        this.isMonomorphic = isMonomorphic;
        this.isPublic = isPublic;
    }

    @Override
    public void accept(SymbolTableVisitor visitor) {
        visitor.visit(this);
    }

    @Override
    public String globalName() {
        return global(generic().getModule(), name());
    }

    public static String global(String module, String name) {
        return String.format("glbl_%s_%s", module.replace("-", "_"), name);
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

    public PacioliType getType() {
        if (declaredType.isPresent()) {
            return declaredType.get().evalType();
        } else if (inferredType.isPresent()) {
            return inferredType.get();
        } else {
            throw new RuntimeException("No type info",
                    new PacioliException(getLocation(), "no inferred or declared type"));
        }
    }

    public PacioliType inferredType() {
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

    public void setinferredType(PacioliType type) {
        this.inferredType = Optional.of(type);
    }

    public boolean isPublic() {
        return isPublic;
    }
    
    public boolean isUserDefined() {
        return definition.orElseThrow(() -> new RuntimeException("Must be resolved")).isUserDefined;
    }
}
