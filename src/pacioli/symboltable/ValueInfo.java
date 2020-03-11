package pacioli.symboltable;

import pacioli.ast.definition.Definition;
import pacioli.ast.definition.ValueDefinition;
import pacioli.ast.expression.IdentifierNode;
import pacioli.types.PacioliType;
import pacioli.types.ast.TypeNode;

public class ValueInfo extends AbstractSymbolInfo implements SymbolInfo {

    public ValueInfo(GenericInfo generic) {
        super(generic);
    }

    public ValueDefinition definition;
    public TypeNode declaredType;
    public PacioliType inferredType;
    public IdentifierNode resultPlace; // for return statements
    public boolean isRef = false;
    public ValueInfo initialRefInfo;

    @Override
    public void accept(SymbolTableVisitor visitor) {
        visitor.visit(this);
    }
    
    @Override
    public String globalName() {
        //return String.format("global_%s_%s", generic().module, name());
        return global(generic().getModule(), name());
    }
    
    public static String global(String module, String name) {
        
        //return String.format("global_%s_%s", module.toLowerCase(), name);
        return String.format("global_%s_%s", module, name);
    }

    @Override
    public Definition getDefinition() {
        return definition;
    }

    public ValueInfo includeOther(ValueInfo other) {
        if (other.definition != null) {
            if (definition == null) {
                definition = other.definition;
            } else {
                //throw new RuntimeException(new PacioliException(getLocation(), "Definition conflict for value " + name()));
            }
        }
        if (other.declaredType != null) {
            if (declaredType == null) {
                declaredType = other.declaredType;
            } else {
                //throw new RuntimeException(new PacioliException(getLocation(), "Definition conflict for value " + name()));
            }
        }
        if (other.inferredType != null) {
            if (inferredType == null) {
                inferredType = other.inferredType;
            } else {
                //throw new RuntimeException(new PacioliException(getLocation(), "Definition conflict for value " + name()));
            }
        }
        if (other.resultPlace != null) {
            if (resultPlace == null) {
                resultPlace = other.resultPlace;
            } else {
                //throw new RuntimeException(new PacioliException(getLocation(), "Definition conflict for value " + name()));
            }
        }
        if (other.initialRefInfo != null) {
            if (initialRefInfo == null) {
                initialRefInfo = other.initialRefInfo;
            } else {
                //throw new RuntimeException(new PacioliException(getLocation(), "Definition conflict for value " + name()));
            }
        }
        return this;
    }

}
