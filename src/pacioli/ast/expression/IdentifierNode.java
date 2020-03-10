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

package pacioli.ast.expression;

import pacioli.Location;
import pacioli.PacioliFile;
import pacioli.ast.Visitor;
import pacioli.ast.definition.Declaration;
import pacioli.ast.definition.Definition;
import pacioli.ast.definition.ValueDefinition;
import pacioli.symboltable.ValueInfo;

public class IdentifierNode extends AbstractExpressionNode {

    public final String name;

    // Set during resolving
    public ValueInfo info;

    // Is this used?
    private final String home;
    private final Boolean isMutableVar;

    public IdentifierNode(String name, Location location) {
        super(location);
        this.name = name;
        this.home = null;
        this.isMutableVar = null;
    }

    public static IdentifierNode newValueIdentifier(String module, String name, Location location) {
        assert (module != null);
        return new IdentifierNode(module, false, name, location);
    }

    public static IdentifierNode newLocalVar(String name, Location location) {
        return new IdentifierNode("", false, name, location);
    }

    public static IdentifierNode newLocalMutableVar(String name, Location location) {
        return new IdentifierNode("", true, name, location);
    }

    public IdentifierNode(String home, boolean mutable, String name, Location location) {
        super(location);
        assert (home != null);
        this.name = name;
        this.home = home;
        this.isMutableVar = mutable;
    }
/*
    public IdentifierNode resolve(ValueDefinition def, Declaration decl, Boolean mutable) {
        Definition homeDef = def == null ? decl : def;
        String home = homeDef == null ? "" : homeDef.getModule().getName();
        return new IdentifierNode("", home, mutable, name, getLocation(), def, decl, true);
    };
*/
    private IdentifierNode(String myHome, String home, boolean mutable, String name, Location location,
            ValueDefinition definition, Declaration declaration, Boolean isResolved) {
        super(location);
        this.home = home;
        this.name = name;
        this.isMutableVar = mutable;
    }

    @Override
    public int hashCode() {
        return name.hashCode();
    }

    @Override
    public boolean equals(Object other) {
        if (other == this) {
            return true;
        }
        if (!(other instanceof IdentifierNode)) {
            return false;
        }
        IdentifierNode otherNode = (IdentifierNode) other;
        return name.equals(otherNode.name);
    }

    public String getName() {
        return name;
    }

    public String fullName() {
        assert (home != null); // names must have been resolved
        return home.isEmpty() ? name : "global_" + home + "_" + name;
    }

    public String compiledName(String prefix) {
        return prefix + home + "_" + name;
    }

    public boolean isLocal() {
        assert (home != null); // names must have been resolved
        return home.isEmpty();
    }
/*
    @Override
    public void printText(PrintWriter out) {
        out.print(name);
    }
*/
    public boolean isMutableVar() {
        assert (isMutableVar != null); // names must have been resolved
        return isMutableVar;
    }

    // what is this????
    public Boolean debugable() {
        return PacioliFile.debugablePrimitives.contains(home);
    }

    @Override
    public String compileToMATLAB() {
        assert (home != null); // names must have been resolved
        return home.isEmpty() ? name.toLowerCase()
                : "Pacioli.value(\"" + home.toLowerCase() + "\", \"" + name.toLowerCase() + "\")";
    }

    @Override
    public void accept(Visitor visitor) {
        visitor.visit(this);
    }
}
