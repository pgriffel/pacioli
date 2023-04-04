package pacioli.symboltable;

import java.util.Optional;


import pacioli.Location;
import pacioli.PacioliFile;
import pacioli.ast.definition.TypeDefinition;
import pacioli.types.ast.TypeNode;

public final class TypeInfo extends AbstractSymbolInfo implements TypeSymbolInfo {

    public TypeInfo (String name, PacioliFile file, String module, Boolean isGlobal, Location location, Boolean fromProgram) {
        super(new GenericInfo(name, file, module, isGlobal, location, fromProgram));
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
        //throw new RuntimeException("todo");
        // TODO: check this name with the name used by the compiler. This was added just for logging.
        return String.format("type_%s", name());
    }

    @Override
    public Optional<TypeDefinition> getDefinition() {
        return definition;
    }
    
    public void setDefinition(TypeDefinition definition) {
        this.definition = Optional.of(definition);
    }

    public TypeInfo includeOther(TypeInfo otherInfo) {
        TypeInfo info = new TypeInfo(generic());
        info.definition = otherInfo.definition;
        info.typeAST = otherInfo.typeAST;
        info.isIndexSetId = otherInfo.isIndexSetId;
        info.isUnitId = otherInfo.isUnitId;
        //info.isVar = otherInfo.isVar;
        return info;
        //return this;
    }

    public TypeInfo withFromProgram(boolean fromProgram) {
        TypeInfo info = new TypeInfo(generic().withFromProgram(fromProgram));
        info.definition = definition;
        info.typeAST = typeAST;
        info.isIndexSetId = isIndexSetId;
        info.isUnitId = isUnitId;
        info.isVar = isVar;
        return info;
    }
}
