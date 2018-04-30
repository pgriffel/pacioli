package pacioli.symboltable;

import pacioli.ast.definition.Definition;
import pacioli.ast.expression.IdentifierNode;
import pacioli.types.PacioliType;
import pacioli.types.ast.TypeNode;

public class ValueInfo implements SymbolInfo {

    public GenericInfo generic;
    public Definition definition;
    public TypeNode declaredType;
    public PacioliType inferredType;
    public IdentifierNode resultPlace; // for return statements
    public boolean isRef = false;

    @Override
    public GenericInfo generic() {
        return generic;
    }

    @Override
    public String name() {
        return generic.name;
    }

    @Override
    public String globalName() {
        return String.format("global_%s_%s", generic.module, generic.name);
    }

    @Override
    public Definition getDefinition() {
        return definition;
    }

}
