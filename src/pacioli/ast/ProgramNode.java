package pacioli.ast;

import java.util.ArrayList;
import java.util.List;

import pacioli.Location;
import pacioli.ast.definition.Definition;
import pacioli.ast.expression.IdentifierNode;

public class ProgramNode extends AbstractNode {

    public List<IdentifierNode> includes;
    public List<Definition> definitions;
    
    public ProgramNode(Location location, List<IdentifierNode> includes, List<Definition> definitions) {
        super(location);
        this.includes = includes;
        this.definitions = definitions;
    }
    public ProgramNode(Location location) {
        super(location);
        this.includes = new ArrayList<IdentifierNode>();
        this.definitions = new ArrayList<Definition>();
    }

    public void addDefinition(Definition definition) {
        definitions.add(definition);
    }

    public void addInclude(IdentifierNode include) {
        includes.add(include);
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
