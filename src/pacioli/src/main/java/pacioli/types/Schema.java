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
import java.util.Set;

import pacioli.ConstraintSet;
import pacioli.PacioliException;
import pacioli.Substitution;
import pacioli.TypeContext;

public class Schema extends AbstractType {

    public final Set<Var> variables;
    public final TypeObject type;

    public Schema(Set<Var> context, TypeObject type) {
        this.variables = context;
        this.type = type;
    }

    @Override
    public void printPretty(PrintWriter out) {
        newContext().printPretty(out);
        type.printPretty(out);

    }

    public TypeContext newContext() {
        return (new TypeContext(variables));
    }

    @Override
    public String description() {
        return "schema";
    }

    @Override
    public TypeObject instantiate() {
        Substitution map = new Substitution();
        for (Var var : variables) {
            map = map.compose(new Substitution(var, var.fresh()));
        }
        return type.applySubstitution(map);
    }

    @Override
    public Schema generalize() {
        throw new RuntimeException("Cannot generalize a schema");
    }

    @Override
    public ConstraintSet unificationConstraints(TypeObject other) throws PacioliException {
        throw new UnsupportedOperationException("Not supported yet.");
    }

    @Override
    public void accept(TypeVisitor visitor) {
        visitor.visit(this);
    }

    public TypeObject getType() {
        return type;
    }
}
