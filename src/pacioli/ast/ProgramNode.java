package pacioli.ast;

import java.util.ArrayList;
import java.util.List;

import pacioli.ast.definition.Definition;
import pacioli.ast.expression.IdentifierNode;

public class ProgramNode extends AbstractNode {

    public IdentifierNode module;
    public List<IdentifierNode> includes;
    public List<Definition> definitions;

    public ProgramNode(IdentifierNode name, List<IdentifierNode> includes, List<Definition> definitions) {
        super(name.getLocation());
        this.module = name;
        this.includes = includes;
        this.definitions = definitions;
    }

    public ProgramNode(IdentifierNode name) {
        super(name.getLocation());
        this.module = name;
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
