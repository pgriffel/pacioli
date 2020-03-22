package pacioli.ast;

import java.util.ArrayList;
import java.util.List;

import pacioli.Location;
import pacioli.ast.definition.Definition;

public class ProgramNode extends AbstractNode {

    public List<IncludeNode> includes;
    public List<ImportNode> imports;
    public List<Definition> definitions;
    
    public ProgramNode(Location location, List<IncludeNode> includes, List<ImportNode> imports, List<Definition> definitions) {
        super(location);
        this.includes = includes;
        this.imports = imports;
        this.definitions = definitions;
    }
    public ProgramNode(Location location) {
        super(location);
        this.includes = new ArrayList<IncludeNode>();
        this.imports = new ArrayList<ImportNode>();
        this.definitions = new ArrayList<Definition>();
    }
    
    public void addDefinition(Definition definition) {
        definitions.add(definition);
    }

    public void addInclude(IncludeNode node) {
        includes.add(node);
    }
    
    public void addImport(ImportNode node) {
        imports.add(node);
    }

    @Override
    public void accept(Visitor visitor) {
        visitor.visit(this);
    }
}
