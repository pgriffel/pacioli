package pacioli.ast.unit;

import java.util.Optional;

import pacioli.ast.AbstractNode;
import pacioli.ast.Visitor;
import pacioli.compiler.Location;
import pacioli.symboltable.info.UnitInfo;

public class UnitIdentifierNode extends AbstractNode implements UnitNode {

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
