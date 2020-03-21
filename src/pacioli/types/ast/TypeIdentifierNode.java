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
import pacioli.ast.Visitor;
import pacioli.symboltable.SymbolInfo;
import pacioli.types.TypeIdentifier;

public class TypeIdentifierNode extends AbstractTypeNode {

    // An identifier can be one of three kinds
    public enum Kind {TYPE, UNIT, INDEX}

    // From construction during parsing
    private final String name;
    private final Kind kind;
    
    // Set during resolving
    public SymbolInfo info;
    
    // Duplicate
    public static final List<String> builtinTypes = new ArrayList<String>(
            Arrays.asList("Tuple", "List", "Index", "Boole", "Void", "Ref", "String", "Report", "Identifier"));

    public TypeIdentifierNode(Location location, String name) {
        super(location);
        this.name = name;
        this.kind = null;
        assert (!name.contains("!"));
    }
    
    public TypeIdentifierNode(Location location, String name, SymbolInfo info) {
        super(location);
        this.name = name;
        this.kind = null;
        assert (!name.contains("!"));
        this.info = info;
    }

    public String getName() {
        return name;
    }
    
    // Fixme: this will always assert.
    public TypeIdentifier typeIdentifier() {
        assert (isResolved());
        return new TypeIdentifier("", name);
    }

    public boolean isResolved() {
        return kind != null;
    }

    @Override
    public void accept(Visitor visitor) {
        visitor.visit(this);
    }
}
