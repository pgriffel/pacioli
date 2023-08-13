package pacioli.ast;

import java.util.ArrayList;
import java.util.List;

import pacioli.ast.definition.Definition;
import pacioli.compiler.Location;

public class ProgramNode extends AbstractNode {

    private final List<IncludeNode> includes;
    private final List<ImportNode> imports;
    private final List<ExportNode> exports;
    private final List<Definition> definitions;

    public ProgramNode(
            Location location,
            List<IncludeNode> includes,
            List<ImportNode> imports,
            List<ExportNode> exports,
            List<Definition> definitions) {
        super(location);
        this.includes = includes;
        this.imports = imports;
        this.exports = exports;
        this.definitions = definitions;
    }

    public ProgramNode(Location location) {
        super(location);
        this.includes = new ArrayList<IncludeNode>();
        this.imports = new ArrayList<ImportNode>();
        this.exports = new ArrayList<ExportNode>();
        this.definitions = new ArrayList<Definition>();
    }

    public List<IncludeNode> includes() {
        return includes;
    }

    public List<ImportNode> imports() {
        return imports;
    }

    public List<ExportNode> exports() {
        return exports;
    }

    public List<Definition> definitions() {
        return definitions;
    }

    @Override
    public void accept(Visitor visitor) {
        visitor.visit(this);
    }

    public void addInclude(IncludeNode node) {
        includes.add(node);
    }

    public void addImport(ImportNode node) {
        imports.add(node);
    }

    public void addExport(ExportNode node) {
        exports.add(node);
    }

    public void addDefinition(Definition definition) {
        definitions.add(definition);
    }

}
