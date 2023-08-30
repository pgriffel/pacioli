package pacioli.types.ast;

import java.util.ArrayList;
import java.util.List;

import pacioli.ast.Visitor;
import pacioli.compiler.Location;

public class QuantNode extends AbstractTypeNode {

    public final TypeIdentifierNode.Kind kind;
    public final List<TypeIdentifierNode> ids;
    public final List<TypePredicateNode> conditions;

    public QuantNode(
            Location location,
            TypeIdentifierNode.Kind kind,
            List<TypeIdentifierNode> ids,
            List<TypePredicateNode> conditions) {
        super(location);
        this.kind = kind;
        this.ids = ids;
        this.conditions = conditions;
    }

    @Override
    public void accept(Visitor visitor) {
        visitor.accept(this);
    }

    public QuantNode withoutConditions() {
        return new QuantNode(location(), this.kind, this.ids, new ArrayList<>());
    }
}
