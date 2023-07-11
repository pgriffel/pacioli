package pacioli.symboltable;

import java.util.Optional;

import pacioli.Location;
import pacioli.PacioliFile;
import pacioli.ast.definition.ClassDefinition;
import pacioli.ast.definition.ValueDefinition;

public final class ClassInfo extends AbstractSymbolInfo implements TypeSymbolInfo {

    public final ClassDefinition definition;
    public final PacioliFile file;

    public ClassInfo(ClassDefinition definition, PacioliFile file, Location location) {
        super(new GenericInfo(definition.localName(), file, true, location));
        this.definition = definition;
        this.file = file;
    }

    @Override
    public void accept(SymbolTableVisitor visitor) {
        visitor.visit(this);
    }

    @Override
    public String globalName() {
        return global(generic().getModule(), name());
    }

    public static String global(String module, String name) {
        return String.format("%s_%s", module.replace("-", "_"), name);
    }

    @Override
    public Optional<ValueDefinition> getDefinition() {
        return getDefinition();
    }

}
