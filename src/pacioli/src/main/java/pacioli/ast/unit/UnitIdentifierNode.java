package pacioli.ast.unit;

import java.util.Optional;

import pacioli.ast.Visitor;
import pacioli.misc.Location;
import pacioli.symboltable.info.UnitInfo;

public class UnitIdentifierNode extends AbstractUnitNode {

    private final String name;
    private final String prefix;

    public UnitInfo info;

    public UnitIdentifierNode(Location location, String name) {
        super(location);
        this.name = name;
        this.prefix = null;
    }

    public UnitIdentifierNode(Location location, String prefix, String name) {
        super(location);
        this.prefix = prefix;
        this.name = name;
    }

    public String name() {
        return name;
    }

    public Optional<String> prefix() {
        return Optional.ofNullable(prefix);
    }

    @Override
    public void accept(Visitor visitor) {
        visitor.visit(this);
    }
}
