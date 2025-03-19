package pacioli.types.ast;

import pacioli.ast.AbstractNode;
import pacioli.ast.Visitor;
import pacioli.compiler.Location;

public class PrefixUnitTypeNode extends AbstractNode implements TypeNode {

    public final TypeIdentifierNode prefix;
    public final TypeIdentifierNode unit;

    public PrefixUnitTypeNode(Location location, TypeIdentifierNode prefix, TypeIdentifierNode unit) {
        super(location);
        this.prefix = prefix;
        this.unit = unit;
    }

    @Override
    public void accept(Visitor visitor) {
        visitor.visit(this);
    }
}
