package pacioli.ast.unit;

import java.io.PrintWriter;
import pacioli.Location;
import pacioli.ast.Node;
import pacioli.ast.Visitor;

public class UnitOperationNode extends AbstractUnitNode {

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
        return new UnitOperationNode(getLocation(), operator, left, right);
    }

    @Override
    public void printText(PrintWriter out) {
        left.printText(out);
        out.print(operator);
        right.printText(out);
    }

    @Override
    public void accept(Visitor visitor) {
        visitor.visit(this);
    }

    @Override
    public String compileToMATLAB() {
        // TODO Auto-generated method stub
        return null;
    }
}
