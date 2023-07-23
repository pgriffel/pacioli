package pacioli.symboltable;

import java.util.Optional;

import pacioli.ast.definition.InstanceDefinition;
import pacioli.misc.PacioliFile;

/**
 * Part of ClassInfo.
 */
public final class InstanceInfo extends AbstractSymbolInfo {

    private static int counter = 0;

    public final InstanceDefinition definition;
    public final String uniquePrefix = String.format("inst_%s", counter++);

    public InstanceInfo(
            InstanceDefinition definition,
            PacioliFile file) {
        super(new GeneralInfo(definition.getName(), file, true, definition.getLocation()));
        this.definition = definition;
    }

    @Override
    public void accept(SymbolTableVisitor visitor) {
        throw new UnsupportedOperationException("ToDO?");
        // visitor.visit(this);
    }

    @Override
    public String globalName() {
        return global(generalInfo().getModule(), name());
    }

    public static String global(String module, String name) {
        return String.format("%s_%s", module.replace("-", "_"), name);
    }

    @Override
    public Optional<InstanceDefinition> getDefinition() {
        return Optional.of(definition);
    }
}
