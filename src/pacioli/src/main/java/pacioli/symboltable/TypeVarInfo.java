package pacioli.symboltable;

import java.util.Optional;

import pacioli.ast.definition.TypeDefinition;
import pacioli.misc.Location;
import pacioli.misc.PacioliFile;
import pacioli.types.ast.TypeNode;

public final class TypeVarInfo extends AbstractSymbolInfo implements TypeSymbolInfo {

    public TypeVarInfo(String name, PacioliFile file, Boolean isGlobal, Location location) {
        super(new GeneralInfo(name, file, isGlobal, location));
    }

    public TypeVarInfo(GeneralInfo info) {
        super(info);
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
        // throw new RuntimeException("todo");
        // TODO: check this name with the name used by the compiler. This was added just
        // for logging.
        // return String.format("type_%s", name());
        return String.format("%s_%s", generalInfo().getModule().replace("-", "_"), name());
    }

    @Override
    public Optional<TypeDefinition> getDefinition() {
        return definition;
    }

    public void setDefinition(TypeDefinition definition) {
        this.definition = Optional.of(definition);
    }
}
