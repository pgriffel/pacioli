package pacioli.types.ast;

import java.util.List;

import pacioli.ast.Visitor;
import pacioli.misc.Location;

public class ContextNode extends AbstractTypeNode {

    public final TypeIdentifierNode.Kind kind;
    public final List<TypeIdentifierNode> ids;
    public final List<TypeApplicationNode> conditions;

    public ContextNode(Location location, TypeIdentifierNode.Kind kind, List<TypeIdentifierNode> ids,
            List<TypeApplicationNode> conditions) {
        super(location);
        this.kind = kind;
        this.ids = ids;
        this.conditions = conditions;
    }

    @Override
    public void accept(Visitor visitor) {
        visitor.accept(this);
    }
}
