package pacioli.ast.unit;

import java.util.Optional;

import pacioli.ast.Visitor;
import pacioli.misc.Location;
import pacioli.symboltable.UnitInfo;

public class UnitIdentifierNode extends AbstractUnitNode {

    private final String name;
    private final Optional<String> prefix;

    public UnitInfo info;

    public UnitIdentifierNode(Location location, String name) {
        super(location);
        this.name = name;
        this.prefix = Optional.empty();
    }

    public UnitIdentifierNode(Location location, String prefix, String name) {
        super(location);
        this.prefix = Optional.of(prefix);
        this.name = name;
    }

    public String getName() {
        return name;
    }

    public Optional<String> getPrefix() {
        return prefix;
    }

    @Override
    public void accept(Visitor visitor) {
        visitor.visit(this);
    }
}
