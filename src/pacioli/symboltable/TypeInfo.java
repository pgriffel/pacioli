package pacioli.symboltable;

import java.util.Optional;

import pacioli.Location;
import pacioli.ast.definition.TypeDefinition;
import pacioli.types.ast.TypeNode;

public class TypeInfo extends AbstractSymbolInfo implements SymbolInfo {

    public TypeInfo (String name, String module, Boolean isGlobal, Location location, Boolean fromProgram) {
        super(new GenericInfo(name, module, isGlobal, location, fromProgram));
    }
    
    public TypeInfo(GenericInfo generic) {
        super(generic);
    }

    private Optional<TypeDefinition> definition = Optional.empty();
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
    public Optional<TypeDefinition> getDefinition() {
        return definition;
    }
    
    public void setDefinition(TypeDefinition definition) {
        this.definition = Optional.of(definition);
    }

    public TypeInfo includeOther(TypeInfo otherInfo) {
        // TODO Auto-generated method stub
        return this;
    }
}
