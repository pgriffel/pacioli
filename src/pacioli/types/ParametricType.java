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
import pacioli.symboltable.TypeInfo;

public class ParametricType extends AbstractType {

    public final String name;
    public final List<PacioliType> args;
    public final TypeInfo info;
    public final Optional<TypeDefinition> definition;

    public ParametricType(String name, List<PacioliType> args) {
        this.info = null;
        this.name = name;
        this.args = args;
        this.definition = Optional.empty();
    }
    
    public ParametricType(TypeInfo info, List<PacioliType> args) {
        this.info = info;
        this.name = info.name();
        this.args = args;
        this.definition = Optional.empty();
    }

    public ParametricType(String name) {
        this.info = null;
        this.name = name;
        this.args = new ArrayList<PacioliType>();
        this.definition = Optional.empty();
    }

    public ParametricType(TypeDefinition definition, List<PacioliType> args) {
        this.info = null;
        this.name = definition.localName();
        this.args = args;
        this.definition = Optional.of(definition);
    }
    
    public ParametricType(TypeInfo info, Optional<TypeDefinition> definition, List<PacioliType> args) {
        this.info = info;
        this.name = info.name();
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
    public PacioliType applySubstitution(Substitution subs) {
        List<PacioliType> items = new ArrayList<PacioliType>();
        for (PacioliType type : args) {
            items.add(type.applySubstitution(subs));
        }
        //return new ParametricType(name, definition, items);
        return new ParametricType(info, definition, items);
    }

    @Override
    public void accept(TypeVisitor visitor) {
        visitor.visit(this);
    }
}
