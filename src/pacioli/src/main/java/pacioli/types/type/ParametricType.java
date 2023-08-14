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

package pacioli.types.type;

import java.util.List;
import java.util.Optional;

import pacioli.ast.definition.TypeDefinition;
import pacioli.compiler.Location;
import pacioli.compiler.PacioliException;
import pacioli.types.ConstraintSet;
import pacioli.types.TypeVisitor;

public class ParametricType extends AbstractType {

    private final Operator op;
    private final List<TypeObject> args;
    private final Location location;
    private final TypeDefinition definition;

    public ParametricType(Location location, Operator op, List<TypeObject> args) {
        this.op = op;
        this.args = args;
        this.definition = null;
        this.location = location;
    }

    public ParametricType(Location location, TypeDefinition definition,
            Operator op, List<TypeObject> args) {
        this.op = op;
        this.args = args;
        this.definition = definition;
        this.location = location;
    }

    public Operator op() {
        return op;
    }

    public List<TypeObject> args() {
        return args;
    }

    public Location location() {
        return location;
    }

    public Optional<TypeDefinition> definition() {
        return Optional.ofNullable(definition);
    }

    @Override
    public String description() {
        return name() + " type";
    }

    public String name() {
        return op.name();
    }

    @Override
    public String toString() {
        return String.format("<Type '%s' %s>", op.name(), args);
    }

    @Override
    public void accept(TypeVisitor visitor) {
        visitor.visit(this);
    }

    @Override
    public ConstraintSet unificationConstraints(TypeObject other) throws PacioliException {
        ParametricType otherType = (ParametricType) other;
        if (args.size() != otherType.args.size()) {
            throw new PacioliException("Number of arguments for '%s and '%s' differ", this.pretty(),
                    otherType.pretty());
        }
        ConstraintSet constraints = new ConstraintSet();
        constraints.addConstraint(op, otherType.op, String.format("Type operator must match"));
        for (int i = 0; i < args.size(); i++) {
            constraints.addConstraint(args.get(i), otherType.args.get(i),
                    String.format("%s arugment %s must match", name(), i + 1));
        }
        return constraints;
    }

}
