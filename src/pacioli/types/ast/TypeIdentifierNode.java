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

import java.io.PrintWriter;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

import pacioli.CompilationSettings;
import pacioli.Dictionary;
import pacioli.Location;
import pacioli.PacioliException;
import pacioli.PacioliFile;
import pacioli.TypeContext;
import pacioli.Utils;
import pacioli.ast.definition.AliasDefinition;
import pacioli.ast.definition.Definition;
import pacioli.types.PacioliType;
import pacioli.types.TypeIdentifier;
import pacioli.types.TypeVar;
import pacioli.types.matrix.IndexType;
import pacioli.types.matrix.MatrixType;
import pacioli.types.matrix.StringBase;

public class TypeIdentifierNode extends AbstractTypeNode {

    private final String name;
    private final Kind kind;
    private final Definition definition;
    private final PacioliFile home;

    private enum Kind {

        TYPE, UNIT, INDEX
    }

    public TypeIdentifierNode(Location location, String name) {
        super(location);
        this.name = name;
        this.kind = null;
        this.definition = null;
        this.home = null;
        assert (!name.contains("!"));
    }

    private TypeIdentifierNode(Location location, String name, Kind kind, Definition definition, PacioliFile home) {
        super(location);
        this.name = name;
        this.kind = kind;
        this.definition = definition;
        this.home = home;
        assert (!name.contains("!"));
    }

    @Override
    public void printText(PrintWriter out) {
        out.print(name);
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

    @Override
    public PacioliType eval(boolean reduce) throws PacioliException {
        if (isVariable()) {
            switch (kind) {
                case TYPE:
                    return new TypeVar("for_type", name);
                case UNIT:
                    return new MatrixType(new TypeVar("for_unit", name));
                case INDEX:
                    return new IndexType(new TypeVar("for_index", name));
                default:
                    throw new RuntimeException("Unknown kind");
            }
        } else {
            if (definition instanceof AliasDefinition) {
                return new MatrixType(((AliasDefinition) definition).evalBody());
            } else {
                return new MatrixType(new StringBase(name));
            }
        }
    }

    @Override
    public String compileToJS(boolean boxed) {
        if (definition instanceof AliasDefinition) {
            return "Pacioli.scalarShape(" + Utils.compileUnitToJS(((AliasDefinition) definition).evalBody()) + ")";
        } else {
            return "Pacioli.scalarShape(Pacioli.unit('" + name + "'))";
        }
    }

    @Override
    public String compileToMVM(CompilationSettings settings) {
        if (definition instanceof AliasDefinition) {
            return "scalar_shape(" + Utils.compileUnitToMVM(((AliasDefinition) definition).evalBody()) + ")";
        } else {
            return "scalar_shape(unit(\"" + name + "\"))";
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
    public static final List<String> builtinTypes =
            new ArrayList<String>(Arrays.asList("Tuple", "List", "Index", "Boole", "Void", "Ref", "String", "Report", "Identifier"));

    public TypeIdentifierNode resolveAsType(Dictionary dictionary, TypeContext context) throws PacioliException {
        Definition definition = null;
        if (!context.containsTypeVar(name) && !builtinTypes.contains(name)) {
            if (dictionary.containsTypeDefinition(name)) {
                definition = dictionary.getTypeDefinition(name);
            } else {
                throw new PacioliException(getLocation(), "Type '" + name + "' unknown");
            }
        }
        return new TypeIdentifierNode(getLocation(), name, Kind.TYPE, definition, dictionary.home());
    }

    public TypeIdentifierNode resolveAsUnit(Dictionary dictionary, TypeContext context) throws PacioliException {
        Definition definition = null;
        if (!context.containsUnitVar(name)) {
            if (dictionary.containsUnitDefinition(name)) {
                definition = dictionary.getUnitDefinition(name);
            } else {
                throw new PacioliException(getLocation(), "Unit '" + name + "' unknown");
            }
        }
        return new TypeIdentifierNode(getLocation(), name, Kind.UNIT, definition, dictionary.home());
    }

    public TypeIdentifierNode resolveAsUnitVector(String indexSet, Dictionary dictionary, TypeContext context) throws PacioliException {
        Definition definition = null;
        String fullName = indexSet + "!" + name;
        if (!context.containsUnitVar(fullName)) {
            if (dictionary.containsUnitVectorDefinition(fullName)) {
                definition = dictionary.getUnitVectorDefinition(fullName);
            } else {
                throw new PacioliException(getLocation(), "Unit vector '" + fullName + "' unknown" + context.toText());
            }
        }
        return new TypeIdentifierNode(getLocation(), name, Kind.UNIT, definition, dictionary.home());
    }

    public TypeIdentifierNode resolveAsIndex(Dictionary dictionary, TypeContext context) throws PacioliException {
        Definition definition = null;
        if (!context.containsIndexVar(name)) {
            if (dictionary.containsIndexSetDefinition(name)) {
                definition = dictionary.getIndexSetDefinition(name);
            } else {
                throw new PacioliException(getLocation(), "Index set '" + name + "' unknown");
            }
        }
        return new TypeIdentifierNode(getLocation(), name, Kind.INDEX, definition, dictionary.home());
    }

    @Override
    public TypeNode resolved(Dictionary dictionary, TypeContext context) throws PacioliException {

        boolean isTypeVar = context.containsTypeVar(name);
        boolean isUnitVar = context.containsUnitVar(name);
        boolean isIndexVar = context.containsIndexVar(name);

        if (isTypeVar) {
            if (isUnitVar) {
                throw new PacioliException(getLocation(), "Type variable '" + name + "' refers to a type and to a unit");
            }
            if (isIndexVar) {
                throw new PacioliException(getLocation(), "Type variable '" + name + "' refers to a type and to an index set");
            }
            return new TypeIdentifierNode(getLocation(), name, Kind.TYPE, null, dictionary.home());
        } else if (isUnitVar) {
            if (isIndexVar) {
                throw new PacioliException(getLocation(), "Type variable '" + name + "' refers to a unit and to an index set");
            }
            return new TypeIdentifierNode(getLocation(), name, Kind.UNIT, null, dictionary.home());
        } else if (isIndexVar) {
            return new TypeIdentifierNode(getLocation(), name, Kind.INDEX, null, dictionary.home());
        } else {

            boolean isType = dictionary.containsTypeDefinition(name);
            boolean isUnit = dictionary.containsUnitDefinition(name);
            boolean isIndex = dictionary.containsIndexSetDefinition(name);
            boolean isAlias = dictionary.containsAliasDefinition(name);

            if (isType) {
                if (isUnit) {
                    throw new PacioliException(getLocation(), "Type '" + name + "' refers to a type and to a unit");
                }
                if (isIndex) {
                    throw new PacioliException(getLocation(), "Type '" + name + "' refers to a type and to an index set");
                }
                if (isAlias) {
                    throw new PacioliException(getLocation(), "Type '" + name + "' refers to a type and to an alias");
                }
                return new TypeIdentifierNode(getLocation(), name, Kind.TYPE, dictionary.getTypeDefinition(name), dictionary.home());
            } else if (isUnit) {
                if (isIndex) {
                    throw new PacioliException(getLocation(), "Type '" + name + "' refers to a unit and to an index set");
                }
                if (isAlias) {
                    throw new PacioliException(getLocation(), "Type '" + name + "' refers to a unit and to an alias");
                }
                return new TypeIdentifierNode(getLocation(), name, Kind.UNIT, dictionary.getUnitDefinition(name), dictionary.home());
            } else if (isIndex) {
                if (isAlias) {
                    throw new PacioliException(getLocation(), "Type '" + name + "' refers to a index set and to an alias");
                }
                return new TypeIdentifierNode(getLocation(), name, Kind.INDEX, dictionary.getIndexSetDefinition(name), dictionary.home());
            } else if (isAlias) {
                return new TypeIdentifierNode(getLocation(), name, Kind.UNIT, dictionary.getAliasDefinition(name), dictionary.home());
            } else {
                throw new PacioliException(getLocation(), "Type identifier '" + name + "' unknown");
            }
        }
    }
}
