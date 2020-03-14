package pacioli.ast;

import java.util.ArrayList;
import java.util.List;

import pacioli.Location;
import pacioli.ast.definition.Definition;
import pacioli.ast.expression.IdentifierNode;
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
