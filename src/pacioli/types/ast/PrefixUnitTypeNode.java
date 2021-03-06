package pacioli.types.ast;

import pacioli.Location;
import pacioli.ast.Visitor;

public class PrefixUnitTypeNode extends AbstractTypeNode {

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
