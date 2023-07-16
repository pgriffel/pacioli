package pacioli.symboltable;

import java.util.Optional;

import pacioli.Location;
import pacioli.PacioliFile;
import pacioli.ast.definition.AliasDefinition;

public final class AliasInfo extends UnitInfo {

    public AliasDefinition definition;

    public AliasInfo(String name, PacioliFile file, Location location) {
        super(new GeneralInfo(name, file, true, location));

    }

    public AliasInfo(GeneralInfo info) {
        super(info);
    }

    public Boolean isAlias() {
        return true;
    }

    @Override
    public void accept(SymbolTableVisitor visitor) {
        visitor.visit(this);
    }

    @Override
    public String globalName() {
        return String.format("unit_%s", name());
    }

    @Override
    public Optional<AliasDefinition> getDefinition() {
        return Optional.of(definition);
    }
}
