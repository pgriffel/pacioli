package pacioli.ast;

import pacioli.Location;
import pacioli.ast.expression.StringNode;

public class IncludeNode extends AbstractNode {

    public StringNode name;
    
    public IncludeNode(Location location, StringNode name) {
        super(location);
        this.name = name;
    }
    
    
    @Override
    public void accept(Visitor visitor) {
        visitor.visit(this);
    }
}
