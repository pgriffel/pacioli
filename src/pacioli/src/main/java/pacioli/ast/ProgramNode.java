/*
 * Copyright (c) 2013 - 2025 Paul Griffioen
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of
 * this software and associated documentation files (the "Software"), to deal in
 * the Software without restriction, including without limitation the rights to
 * use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of
 * the Software, and to permit persons to whom the Software is furnished to do so,
 * subject to the following conditions:
 * 
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS
 * FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
 * COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER
 * IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
 * CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

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
