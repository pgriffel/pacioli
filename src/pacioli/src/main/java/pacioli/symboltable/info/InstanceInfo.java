package pacioli.symboltable.info;

import java.util.Optional;

import pacioli.ast.definition.InstanceDefinition;
import pacioli.misc.PacioliFile;
import pacioli.symboltable.SymbolTableVisitor;

/**
 * Part of ClassInfo.
 */
public final class InstanceInfo extends AbstractInfo {

    private final InstanceDefinition definition;

    public InstanceInfo(
            InstanceDefinition definition,
            PacioliFile file,
            String uniqueSuffix) {
        super(new GeneralInfo(definition.name() + uniqueSuffix, file, true, true, definition.location()));
        this.definition = definition;
    }

    @Override
    public void accept(SymbolTableVisitor visitor) {
        throw new UnsupportedOperationException("ToDO?");
        // visitor.visit(this);
    }

    @Override
    public String globalName() {
        return String.format("%s_%s", generalInfo().module(), name());
    }

    @Override
    public Optional<InstanceDefinition> definition() {
        return Optional.of(definition);
    }
}
