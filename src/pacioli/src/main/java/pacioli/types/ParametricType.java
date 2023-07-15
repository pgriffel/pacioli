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

import java.util.List;
import java.util.Optional;
import pacioli.ConstraintSet;
import pacioli.Location;
import pacioli.PacioliException;
import pacioli.ast.definition.TypeDefinition;

public class ParametricType extends AbstractType {

    public final Operator op;
    public final List<TypeObject> args;
    public final Location location;
    public final Optional<TypeDefinition> definition;

    public ParametricType(Location location, Operator op, List<TypeObject> args) {
        this.op = op;
        this.args = args;
        this.definition = Optional.empty();
        this.location = location;
    }

    public ParametricType(Location location, Optional<TypeDefinition> definition,
            Operator op, List<TypeObject> args) {
        this.op = op;
        this.args = args;
        this.definition = definition;
        this.location = location;
    }

    @Override
    public String description() {
        return getName() + " type";
    }

    public String getName() {
        return op.getName();
    }

    @Override
    public String toString() {
        return String.format("<Type '%s' %s>", op.getName(), args);
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
                    String.format("%s arugment %s must match", getName(), i + 1));
        }
        return constraints;
    }

}
