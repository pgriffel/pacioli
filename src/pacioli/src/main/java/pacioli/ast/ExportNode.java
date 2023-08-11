package pacioli.ast;

import java.util.List;

import pacioli.ast.expression.IdentifierNode;
import pacioli.misc.Location;

public class ExportNode extends AbstractNode {

    public List<IdentifierNode> identifiers;

    public ExportNode(Location location, List<IdentifierNode> identifiers) {
        super(location);
        this.identifiers = identifiers;
    }

    @Override
    public void accept(Visitor visitor) {
        visitor.visit(this);
    }
}
