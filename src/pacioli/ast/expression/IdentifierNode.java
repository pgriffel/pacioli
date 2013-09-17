/*
 * Copyright (c) 2013 Paul Griffioen
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

import java.io.PrintWriter;
import java.util.HashSet;
import java.util.LinkedHashSet;
import java.util.Map;
import java.util.Set;
import pacioli.CompilationSettings;
import pacioli.Dictionary;
import pacioli.Location;
import pacioli.Pacioli;
import pacioli.Module;
import pacioli.PacioliException;
import pacioli.Typing;
import pacioli.ast.definition.Definition;
import pacioli.types.PacioliType;

public class IdentifierNode extends AbstractExpressionNode {

    private final String name;
    private final String home;
    private final Definition definition;
    private final Boolean isMutableVar;

    public IdentifierNode(String name, Location location) {
        super(location);
        this.name = name;
        this.home = null;
        this.isMutableVar = null;
        this.definition = null;
    }

    public static IdentifierNode newValueIdentifier(String module, String name, Location location) {
        // Waarom hier de def niet vereisen?
        return new IdentifierNode(module, false, name, location, null);
    }

    public static IdentifierNode newLocalVar(String name, Location location) {
        return new IdentifierNode("", false, name, location, null);
    }

    public static IdentifierNode newLocalMutableVar(String name, Location location) {
        return new IdentifierNode("", true, name, location, null);
    }

    private IdentifierNode(String home, boolean mutable, String name, Location location, Definition definition) {
        super(location);
        this.home = home;
        this.name = name;
        this.isMutableVar = mutable;
        this.definition = definition;
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
        return home.isEmpty() ? name : "user_" + home + "_" + name;
    }

    @Override
    public void printText(PrintWriter out) {
        out.print(name);
    }

    public boolean isMutableVar() {
        assert (isMutableVar != null); // names must have been resolved
        return isMutableVar;
    }

    @Override
    public ExpressionNode resolved(Dictionary dictionary, Map<String, Module> globals, Set<String> context, Set<String> mutableContext) throws PacioliException {

        if (home != null) {
            throw new RuntimeException(String.format("name %s already resolved", name));
        }

        if (mutableContext.contains(name)) {
            if (globals.containsKey(name)) {
                Pacioli.warn("local '%s' shadows global from module '%s'", name, globals.get(name).name);
            }
            return new IdentifierNode("", true, name, getLocation(), null);
        } else if (context.contains(name)) {
            if (globals.containsKey(name)) {
                Pacioli.warn("local '%s' shadows global from module '%s'", name, globals.get(name).name);
            }
            return new IdentifierNode("", false, name, getLocation(), null);
        } else {
            if (globals.containsKey(name)) {
                return new IdentifierNode(globals.get(name).name, false, name, getLocation(), globals.get(name).lookupDefinition(name));
            } else {
                throw new PacioliException(getLocation(), "Name '%s' unknown", name);
            }
        }
    }

    @Override
    public Typing inferTyping(Dictionary dictionary, Map<String, PacioliType> context) throws PacioliException {
        if (home.isEmpty()) {
            assert (context.containsKey(name));
            return new Typing(context.get(name));
        } else {
            if (!dictionary.containsType(name)) {
                throw new PacioliException(getLocation(), "Type '%s' unknown", name);
            };
            PacioliType type = dictionary.getType(name).instantiate();
            Pacioli.logln3("Using %s :: %s", name, type.toText());
            return new Typing(type);
        }
    }

    @Override
    public Set<Definition> uses() {
        Set<Definition> set = new HashSet<Definition>();
        if (definition != null) {
            set.add(definition);
        }
        return set;
    }

    @Override
    public ExpressionNode transformCalls(CallMap map) {
        return this;
    }

    @Override
    public ExpressionNode transformIds(IdMap map) {
        return map.transform(this);
    }

    @Override
    public ExpressionNode transformSequences(SequenceMap map) {
        return this;
    }

    @Override
    public Set<IdentifierNode> locallyAssignedVariables() {
        return new LinkedHashSet<IdentifierNode>();
    }

    @Override
    public ExpressionNode equivalentFunctionalCode() {
        return this;
    }

    @Override
    public String compileToMVM(CompilationSettings settings) {
        if (home == null) {
            throw new RuntimeException(String.format("Id '%s' unresolved at %s", name, getLocation().description()));
        }
        assert (home != null); // names must have been resolved
        String prefix = settings.debug() && Module.debugablePrimitives.contains(home) ? "debug_" : "user_";
        String full = home.isEmpty() ? name : prefix + home + "_" + name;
        return "var(\"" + full + "\")";

    }

    @Override
    public String compileToJS() {
        assert (home != null); // names must have been resolved
        return home.isEmpty() ? name : "fetch_global('" + home + "', '" + name + "')";
    }

    @Override
    public String compileToMATLAB() {
        assert (home != null); // names must have been resolved
        return home.isEmpty() ? name.toLowerCase() : "fetch_global(\"" + home.toLowerCase() + "\", \"" + name.toLowerCase() + "\")";
    }
}
