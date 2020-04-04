package pacioli.symboltable;

import java.util.Optional;

import pacioli.Location;
import pacioli.PacioliException;
import pacioli.ast.definition.ValueDefinition;
import pacioli.types.FunctionType;
import pacioli.types.PacioliType;
import pacioli.types.Schema;
import pacioli.types.ast.TypeNode;

public class ValueInfo extends AbstractSymbolInfo implements SymbolInfo {
    
    // Set during parsing
    private Optional<ValueDefinition> definition = Optional.empty();
    private Optional<TypeNode> declaredType = Optional.empty();

    // Set during resolving
    private Optional<Boolean> isRef = Optional.of(false);
    
    // Set during type inference
    public Optional<PacioliType> inferredType = Optional.empty();
    
    public ValueInfo(String name, String module, Boolean isGlobal, Location location, Boolean fromProgram) {
        super(new GenericInfo(name, module, isGlobal, location, fromProgram));
    }
    
    public ValueInfo(GenericInfo generic) {
        super(generic);
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
        if (inferredType.isPresent()) {
            return inferredType.get();
        } else if (declaredType.isPresent()) {
            return declaredType.get().evalType(false);
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
                    new PacioliException(getLocation(), "no inferred type"));
        }
    }
    
    public Boolean isFunction() {
        Schema schema = (Schema) getType();
        return schema.type instanceof FunctionType;
    }
    
    public void setinferredType(PacioliType type) {
        this.inferredType = Optional.of(type);
    }
    
    public ValueInfo includeOther(ValueInfo other) {
        
        if (other.definition.isPresent()) {
            if (!definition.isPresent()) {
                definition = other.definition;
            } else {
                //throw new RuntimeException(new PacioliException(getLocation(), "Definition conflict for value " + name()));
            }
        }
        
        if (other.declaredType.isPresent()) {
            if (!declaredType.isPresent()) {
                declaredType = other.declaredType;
            } else {
                //throw new RuntimeException(new PacioliException(getLocation(), "Definition conflict for value " + name()));
            }
        }
        
        if (other.inferredType.isPresent()) {
            if (!inferredType.isPresent()) {
                inferredType = other.inferredType;
            } else {
                //throw new RuntimeException(new PacioliException(getLocation(), "Definition conflict for value " + name()));
            }
        }
        
        return this;
    }

}
