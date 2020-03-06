/*
 * Copyright (c) 2013 - 2014 Paul Griffioen
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
package pacioli.types.ast;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import pacioli.CompilationSettings;
import pacioli.Location;
import pacioli.PacioliFile;
import pacioli.ast.Visitor;
import pacioli.ast.definition.AliasDefinition;
import pacioli.ast.definition.Definition;
import pacioli.symboltable.SymbolInfo;
import pacioli.types.TypeIdentifier;

public class TypeIdentifierNode extends AbstractTypeNode {

    private final String name;
    private final Kind kind;
    private final Definition definition;
    private final PacioliFile home;
    public SymbolInfo info;

    public enum Kind {

        TYPE, UNIT, INDEX
    }

    // Duplicate
    public static final List<String> builtinTypes = new ArrayList<String>(
            Arrays.asList("Tuple", "List", "Index", "Boole", "Void", "Ref", "String", "Report", "Identifier"));

    public TypeIdentifierNode(Location location, String name) {
        super(location);
        this.name = name;
        this.kind = null;
        this.definition = null;
        this.home = null;
        assert (!name.contains("!"));
    }

    public TypeIdentifierNode(Location location, String name, Kind kind, Definition definition, PacioliFile home) {
        super(location);
        this.name = name;
        this.kind = kind;
        this.definition = definition;
        this.home = home;
        assert (!name.contains("!"));
    }

    public String getName() {
        return name;
    }

    public PacioliFile home() {
        assert (isResolved());
        return home;
    }

    public TypeIdentifier typeIdentifier() {
        assert (isResolved());
        return new TypeIdentifier(definition == null ? "" : definition.getModule().getName(), name);
    }

    public boolean isResolved() {
        return kind != null;
    }

    public boolean isVariable() {
        assert (isResolved());
        return definition == null;
    }

    public Definition getDefinition() {
        assert (isResolved());
        return definition;
    }

    public String MVMCode(CompilationSettings settings) {
        if (definition instanceof AliasDefinition) {
            // return "scalar_shape(" + Utils.compileUnitToMVM(((AliasDefinition)
            // definition).evalBody()) + ")";
            throw new RuntimeException("fixme");
        } else {
            return "scalar_shape(unit(\"" + name + "\"))";
        }
    }

    @Override
    public void accept(Visitor visitor) {
        visitor.visit(this);
    }
}
