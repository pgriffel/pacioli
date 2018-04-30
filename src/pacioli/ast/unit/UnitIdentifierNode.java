package pacioli.ast.unit;

import java.io.PrintWriter;
import pacioli.Location;
import pacioli.ast.Visitor;
import pacioli.ast.definition.Definition;
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

    private UnitIdentifierNode(Location location, String prefix, String name, Definition definition) {
        super(location);
        this.prefix = prefix;
        this.name = name;
    }

    @Override
    public void printText(PrintWriter out) {
        if (prefix == null) {
            out.print(name);
        } else {
            out.print(prefix);
            out.print(":");
            out.print(name);
        }
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
