package pacioli.symboltable.info;

import java.util.Optional;

import pacioli.ast.definition.TypeDefinition;
import pacioli.compiler.Location;
import pacioli.compiler.PacioliFile;
import pacioli.symboltable.SymbolTableVisitor;

public final class TypeVarInfo extends AbstractInfo implements TypeInfo {

    public TypeVarInfo(
            String name,
            PacioliFile file,
            boolean isGlobal,
            boolean isPublic,
            Location location) {
        super(new GeneralInfo(name, file, isGlobal, isPublic, location));
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
        return String.format("%s_%s", generalInfo().module().replace("-", "_"), name());
    }

    @Override
    public Optional<TypeDefinition> definition() {
        return Optional.empty();
    }

}
