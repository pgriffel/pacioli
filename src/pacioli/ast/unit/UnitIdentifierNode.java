package pacioli.ast.unit;

import pacioli.Location;
import pacioli.ast.Visitor;
import pacioli.symboltable.UnitInfo;

public class UnitIdentifierNode extends AbstractUnitNode {

    public final String name;
    public final String prefix;
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
