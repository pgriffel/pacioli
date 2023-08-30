package pacioli.ast;

import pacioli.ast.expression.StringNode;
import pacioli.compiler.Location;

public class ImportNode extends AbstractNode {

    public StringNode name;
    public String version;

    public ImportNode(Location location, StringNode name) {
        super(location);
        this.name = name;
    }

    @Override
    public void accept(Visitor visitor) {
        visitor.visit(this);
    }

}
