package pacioli.ast.definition;

import pacioli.Location;
import pacioli.ast.Visitor;
import pacioli.ast.expression.IdentifierNode;
import pacioli.types.ast.TypeNode;

public class Declaration extends AbstractDefinition {

    public final IdentifierNode id;
    public final TypeNode typeNode;
    public final boolean isPublic;

    public Declaration(Location location, IdentifierNode id, TypeNode typeNode, boolean isPublic) {
        super(location);
        this.id = id;
        this.typeNode = typeNode;
        this.isPublic = isPublic;
    }

    public Declaration transform(TypeNode node) {
        return new Declaration(getLocation(), id, node, isPublic);
    }

    @Override
    public String getName() {
        return id.getName();
    }

    @Override
    public void accept(Visitor visitor) {
        visitor.visit(this);
    }
}
