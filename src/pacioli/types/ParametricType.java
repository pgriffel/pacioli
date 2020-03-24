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

package pacioli.types;

import java.io.PrintWriter;
import java.util.ArrayList;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Optional;
import java.util.Set;

import pacioli.ConstraintSet;
import pacioli.PacioliException;
import pacioli.Substitution;
import pacioli.Utils;
import pacioli.ast.definition.TypeDefinition;
import pacioli.types.ast.TypeNode;
import uom.Unit;

public class ParametricType extends AbstractType {

    public final String name;
    public final List<PacioliType> args;
    public final Optional<TypeDefinition> definition;

    public ParametricType(String name, List<PacioliType> args) {
        this.name = name;
        this.args = args;
        this.definition = Optional.empty();
    }

    public ParametricType(String name) {
        this.name = name;
        this.args = new ArrayList<PacioliType>();
        this.definition = Optional.empty();
    }

    public ParametricType(TypeDefinition definition, List<PacioliType> args) {
        this.name = definition.localName();
        this.args = args;
        this.definition = Optional.of(definition);
    }

    private ParametricType(String name, Optional<TypeDefinition> definition, List<PacioliType> args) {
        this.name = name;
        this.args = args;
        this.definition = definition;
    }

    public String pprintArgs() {
        return "(" + Utils.intercalateText(", ", args) + ")";
    }

    @Override
    public void printPretty(PrintWriter out) {
        out.print(name);
        out.print(pprintArgs());
    }

    @Override
    public Set<Var> typeVars() {
        Set<Var> all = new LinkedHashSet<Var>();
        for (PacioliType type : args) {
            all.addAll(type.typeVars());
        }
        return all;
    }

    @Override
    public Set<String> unitVecVarCompoundNames() {
        Set<String> all = new LinkedHashSet<String>();
        for (PacioliType type : args) {
            all.addAll(type.unitVecVarCompoundNames());
        }
        return all;
    }

    @Override
    public ConstraintSet unificationConstraints(PacioliType other) throws PacioliException {
        ParametricType otherType = (ParametricType) other;
        if (!name.equals(otherType.name)) {
            throw new PacioliException("Types '%s and '%s' differ", name, otherType.name);
        }
        if (args.size() != otherType.args.size()) {
            throw new PacioliException("Number of arguments for '%s and '%s' differ", this.pretty(),
                    otherType.pretty());
        }
        ConstraintSet constraints = new ConstraintSet();
        for (int i = 0; i < args.size(); i++) {
            constraints.addConstraint(args.get(i), otherType.args.get(i),
                    String.format("%s arugment %s must match", name, i + 1));
        }
        return constraints;
    }

    @Override
    public String description() {
        return name + " type";
    }

    @Override
    public List<Unit<TypeBase>> simplificationParts() {
        List<Unit<TypeBase>> parts = new ArrayList<Unit<TypeBase>>();
        for (PacioliType arg : args) {
            parts.addAll(arg.simplificationParts());
        }
        return parts;
    }

    @Override
    public PacioliType applySubstitution(Substitution subs) {
        List<PacioliType> items = new ArrayList<PacioliType>();
        for (PacioliType type : args) {
            items.add(type.applySubstitution(subs));
        }
        return new ParametricType(name, definition, items);
    }

    @Override
    public String compileToJS() {
        StringBuilder builder = new StringBuilder();

        if (name.equals("Boole")) {
            builder.append("new Pacioli.Type('boole')");
        } else if (name.equals("String")) {
            builder.append("new Pacioli.Type('string')");
        } else if (name.equals("Report")) {
            builder.append("new Pacioli.Type('report')");
        } else if (name.equals("Void")) {
            builder.append("null");
        } else if (name.equals("Index")) {
            builder.append("new Pacioli.Type('coordinate', ");
            builder.append("new Pacioli.Coordinates(null, [");
            String sep = "";
            for (PacioliType arg : args) {
                builder.append(sep);
                builder.append(arg.compileToJS());
                sep = ", ";
            }
            builder.append("]))");
        } else if (name.equals("List")) {

            builder.append("new Pacioli.Type(");
            builder.append("\"list\", ");
            String sep = "";
            for (PacioliType arg : args) {
                builder.append(sep);
                builder.append(arg.compileToJS());
                sep = ", ";
            }
            builder.append(")");
        } else if (name.equals("Ref")) {

            builder.append("new Pacioli.Type(");
            builder.append("\"reference\", ");
            String sep = "";
            for (PacioliType arg : args) {
                builder.append(sep);
                builder.append(arg.compileToJS());
                sep = ", ";
            }
            builder.append(")");
        } else if (name.equals("Tuple")) {
            builder.append("new Pacioli.Type(");
            builder.append("\"tuple\", [");
            String sep = "";
            for (PacioliType arg : args) {
                builder.append(sep);
                builder.append(arg.compileToJS());
                sep = ", ";
            }
            builder.append("])");
        } else {
            throw new RuntimeException("Parametric Type " + name + " unknown");
        }
        return builder.toString();
    }

    @Override
    public PacioliType reduce() {
        List<PacioliType> items = new ArrayList<PacioliType>();
        for (PacioliType type : args) {
            items.add(type.reduce());
        }
        try {
            if (!definition.isPresent()) {
                // return this;
                return new ParametricType(name, definition, items);
            } else {
                return definition.get().constaint(true).reduce(new ParametricType(name, definition, items));
            }
        } catch (PacioliException e) {
            throw new RuntimeException(e);
        }
    }

    @Override
    public TypeNode deval() {
        // TODO Auto-generated method stub
        return null;
        
    }
}
