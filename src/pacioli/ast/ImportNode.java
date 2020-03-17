package pacioli.ast;

import pacioli.Location;
import pacioli.ast.expression.StringNode;

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

    @Override
    public String compileToMATLAB() {
        throw new RuntimeException("todo");
    }

}
