package pacioli.symboltable.info;

import java.util.Optional;

import pacioli.ast.definition.InstanceDefinition;
import pacioli.misc.PacioliFile;
import pacioli.symboltable.SymbolTableVisitor;

/**
 * Part of ClassInfo.
 */
public final class InstanceInfo extends AbstractSymbolInfo {

    public final InstanceDefinition definition;

    public InstanceInfo(
            InstanceDefinition definition,
            PacioliFile file,
            String uniqueSuffix) {
        super(new GeneralInfo(definition.getName() + uniqueSuffix, file, true, definition.getLocation()));
        this.definition = definition;
    }

    @Override
    public void accept(SymbolTableVisitor visitor) {
        throw new UnsupportedOperationException("ToDO?");
        // visitor.visit(this);
    }

    @Override
    public String globalName() {
        return String.format("%s_%s", generalInfo().getModule(), name());
    }

    @Override
    public Optional<InstanceDefinition> definition() {
        return Optional.of(definition);
    }
}
