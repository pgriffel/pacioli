package pacioli.symboltable;

import pacioli.ast.definition.Definition;
import pacioli.types.ast.TypeNode;

public class TypeInfo extends AbstractSymbolInfo implements SymbolInfo {

    public TypeInfo(GenericInfo generic) {
        super(generic);
    }

    public Definition definition;
    public TypeNode typeAST;
    public Boolean isIndexSetId;
    public Boolean isUnitId;
    public Boolean isVar;

    @Override
    public void accept(SymbolTableVisitor visitor) {
        visitor.visit(this);
    }
    
    @Override
    public String globalName() {
        throw new RuntimeException("todo");
    }

    @Override
    public Definition getDefinition() {
        return definition;
    }

    public TypeInfo includeOther(TypeInfo otherInfo) {
        // TODO Auto-generated method stub
        return this;
    }
}
