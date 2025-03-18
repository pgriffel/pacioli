package pacioli.ast.unit;

import pacioli.ast.AbstractNode;
import pacioli.ast.Node;
import pacioli.ast.Visitor;
import pacioli.compiler.Location;

public class UnitOperationNode extends AbstractNode implements UnitNode {

    public final String operator;
    public final UnitNode left;
    public final UnitNode right;

    public UnitOperationNode(Location location, String operator, UnitNode left, UnitNode right) {
        super(location);
        this.operator = operator;
        this.left = left;
        this.right = right;
    }

    public Node transform(UnitNode left, UnitNode right) {
        return new UnitOperationNode(location(), operator, left, right);
    }

    @Override
    public void accept(Visitor visitor) {
        visitor.visit(this);
    }
}
