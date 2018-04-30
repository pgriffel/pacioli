package pacioli.ast.unit;

import java.io.PrintWriter;
import pacioli.Location;
import pacioli.ast.Node;
import pacioli.ast.Visitor;

public class UnitPowerNode extends AbstractUnitNode {

    public final UnitNode base;
    public final NumberUnitNode power;

    public UnitPowerNode(Location location, UnitNode base, NumberUnitNode power) {
        super(location);
        this.base = base;
        this.power = power;
    }

    public Node transform(UnitNode base) {
        return new UnitPowerNode(getLocation(), base, power);
    }

    @Override
    public void printText(PrintWriter out) {
        base.printText(out);
        out.print("^");
        power.printText(out);
    }

    @Override
    public void accept(Visitor visitor) {
        visitor.visit(this);
    }

    @Override
    public String compileToJS(boolean boxed) {
        // TODO Auto-generated method stub
        return null;
    }

    @Override
    public String compileToMATLAB() {
        // TODO Auto-generated method stub
        return null;
    }
}
