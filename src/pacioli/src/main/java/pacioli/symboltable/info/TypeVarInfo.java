package pacioli.symboltable.info;

import java.util.Optional;

import pacioli.ast.definition.TypeDefinition;
import pacioli.misc.Location;
import pacioli.misc.PacioliFile;
import pacioli.symboltable.SymbolTableVisitor;

public final class TypeVarInfo extends AbstractSymbolInfo implements TypeInfo {

    public TypeVarInfo(
            String name,
            PacioliFile file,
            Boolean isGlobal,
            Location location) {
        super(new GeneralInfo(name, file, isGlobal, location));
    }

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
    public Optional<TypeDefinition> definition() {
        return Optional.empty();
    }

}
