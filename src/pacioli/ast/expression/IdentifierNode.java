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

import java.io.PrintWriter;
import java.util.HashSet;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;

import pacioli.CompilationSettings;
import pacioli.Dictionary;
import pacioli.Location;
import pacioli.PacioliFile;
import pacioli.Pacioli;
import pacioli.PacioliException;
import pacioli.Typing;
import pacioli.ValueContext;
import pacioli.ast.definition.Declaration;
import pacioli.ast.definition.Definition;
import pacioli.ast.definition.ValueDefinition;
import pacioli.types.PacioliType;
import pacioli.types.TypeIdentifier;

public class IdentifierNode extends AbstractExpressionNode {

    private final String name;
    private final String home;
    private final ValueDefinition definition;
    private final Declaration declaration;
    private final Boolean isMutableVar;

    public IdentifierNode(String name, Location location) {
        super(location);
        this.name = name;
        this.home = null;
        this.isMutableVar = null;
        this.definition = null;
        this.declaration = null;
    }
    
    private IdentifierNode(String home, boolean mutable, String name, Location location) {
        super(location);
        this.name = name;
        this.home = home;
        this.isMutableVar = mutable;
        this.definition = null;
        this.declaration = null;
    }

    public static IdentifierNode newValueIdentifier(String module, String name, Location location) {
        // Waarom hier de def niet vereisen?
        return new IdentifierNode(module, false, name, location);
    }

    public static IdentifierNode newLocalVar(String name, Location location) {
        return new IdentifierNode("", false, name, location);
    }

    public static IdentifierNode newLocalMutableVar(String name, Location location) {
        return new IdentifierNode("", true, name, location);
    }

    private IdentifierNode(String home, boolean mutable, String name, Location location, ValueDefinition definition) {
        super(location);
        this.home = home;
        this.name = name;
        this.isMutableVar = mutable;
        this.definition = definition;
        this.declaration = null;
    }
    
    private IdentifierNode(String home, boolean mutable, String name, Location location, Declaration declaration) {
        super(location);
        this.home = home;
        this.name = name;
        this.isMutableVar = mutable;
        this.definition = null;
        this.declaration = declaration;
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
    
    public TypeIdentifier typeIdentifier() {
    	assert (home != null); // names must have been resolved
        return new TypeIdentifier(home, name);
    }

    public String fullName() {
        assert (home != null); // names must have been resolved
        return home.isEmpty() ? name : "global_" + home + "_" + name;
    }
    
    public boolean isLocal() {
        assert (home != null); // names must have been resolved
        return home.isEmpty();
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
    public ExpressionNode resolved(Dictionary dictionary, ValueContext context) throws PacioliException {

        if (home != null) {
            throw new RuntimeException(String.format("name %s already resolved", name));
        }

        if (context.isRefVar(name)) {
            if (dictionary.containsValueDefinition(name)) {
                Pacioli.warn("local '%s' shadows global from module '%s'", name, dictionary.getValueDefinition(name).getModule().getName());
            }
            return new IdentifierNode("", true, name, getLocation());
        } else if (context.containsVar(name)) {
            if (dictionary.containsValueDefinition(name)) {
                Pacioli.warn("local '%s' shadows global from module '%s'", name, dictionary.getValueDefinition(name).getModule().getName());
            }
            return new IdentifierNode("", false, name, getLocation());
        } else {
            if (dictionary.containsValueDefinition(name)) {
            	ValueDefinition definition = dictionary.getValueDefinition(name);
            	return new IdentifierNode(definition.getModule().getName(), false, name, getLocation(), definition);
            } else if (dictionary.containsDeclaration(name)) {
            	Declaration definition = dictionary.getDeclaration(name);
            	return new IdentifierNode(definition.getModule().getName(), false, name, getLocation(), definition);
            } else {
            	throw new PacioliException(getLocation(), "Name '%s' unknown", name);
            }
        }
    }

    @Override
    public Typing inferTyping(Map<String, PacioliType> context) throws PacioliException {
        if (home.isEmpty()) {
            assert (context.containsKey(name));
            return new Typing(context.get(name));
        } else if (definition != null) {
        	Pacioli.logln3("Using %s :: ", name);
        	PacioliType type = definition.getType().instantiate();
            Pacioli.logln3("%s", type.toText());
            return new Typing(type);
        } else if (declaration!= null) {
        	Pacioli.logln3("Using %s ::", name);
            PacioliType type = declaration.getType().instantiate();
            Pacioli.logln3("%s", type.toText());
            return new Typing(type);
        } else {
        	throw new RuntimeException("Expected a definition or a declaration");
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
    public Set<IdentifierNode> locallyAssignedVariables() {
        return new LinkedHashSet<IdentifierNode>();
    }

    @Override
    public ExpressionNode desugar() {
        if (isMutableVar()) {
            return ApplicationNode.newCall(getLocation(), "Primitives", "ref_get", this);
        } else {
            return this;
        }
    }

    @Override
    public String compileToMVM(CompilationSettings settings) {
        if (home == null) {
            throw new RuntimeException(String.format("Id '%s' unresolved at %s", name, getLocation().description()));
        }
        assert (home != null); // names must have been resolved
        String prefix = settings.debug() && PacioliFile.debugablePrimitives.contains(home) ? "debug_" : "global_";
        String full = home.isEmpty() ? name : prefix + home + "_" + name;
        return "var(\"" + full + "\")";

    }

    @Override
    public String compileToJS() {
        assert (home != null); // names must have been resolved
        return home.isEmpty() ? name : "Pacioli.fetchValue('" + home + "', '" + name + "')";
    }
    
    @Override
    public String compileToMATLAB() {
        assert (home != null); // names must have been resolved
        return home.isEmpty() ? name.toLowerCase() : "Pacioli.value(\"" + home.toLowerCase() + "\", \"" + name.toLowerCase() + "\")";
    }

	@Override
	public ExpressionNode liftStatements(PacioliFile module,
			List<ValueDefinition> blocks) {
		// TODO Auto-generated method stub
		return null;
	}
}
