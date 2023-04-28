package pacioli.symboltable;

import java.util.Optional;


import pacioli.Location;
import pacioli.PacioliFile;
import pacioli.ast.definition.TypeDefinition;
import pacioli.types.ast.TypeNode;

public final class TypeInfo extends AbstractSymbolInfo implements TypeSymbolInfo {

    public TypeInfo (String name, PacioliFile file, String module, Boolean isGlobal, Location location) {
        super(new GenericInfo(name, file, module, isGlobal, location));
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
        // return String.format("type_%s", name());
        return String.format("%s_%s", generic().getModule().replace("-", "_"), name());
    }

    @Override
    public Optional<TypeDefinition> getDefinition() {
        return definition;
    }
    
    public void setDefinition(TypeDefinition definition) {
        this.definition = Optional.of(definition);
    }
}
