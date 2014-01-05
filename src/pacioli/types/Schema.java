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

package pacioli.types;

import java.io.PrintWriter;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Set;
import pacioli.ConstraintSet;
import pacioli.PacioliException;
import pacioli.Substitution;
import pacioli.TypeContext;
import uom.Unit;

public class Schema extends AbstractType {

    private final Set<TypeVar> variables;
    private final PacioliType type;

    public Schema(Set<TypeVar> context, PacioliType type) {
        this.variables = context;
        this.type = type;
    }

    @Override
    public void printText(PrintWriter out) {
        new TypeContext(variables).printText(out);
        type.printText(out);
    }

    @Override
    public String description() {
        return "schema";
    }

    @Override
    public Set<TypeVar> typeVars() {
        Set<TypeVar> freeVars = new LinkedHashSet<TypeVar>(type.typeVars());
        freeVars.removeAll(variables);
        return freeVars;
    }

    @Override
    public PacioliType instantiate() {
        Substitution map = new Substitution();
        for (TypeVar var : variables) {
            map = map.compose(new Substitution(var, var.fresh()));
        }
        return map.apply(type);
    }

    @Override
    public Schema generalize() {
    	throw new RuntimeException("Cannot generalize a schema");
    }

    @Override
    public PacioliType applySubstitution(Substitution subs) {
        Substitution reduced = new Substitution(subs);
        reduced.removeAll(variables);
        return new Schema(variables, type.applySubstitution(reduced));
    }

    @Override
    public ConstraintSet unificationConstraints(PacioliType other) throws PacioliException {
        throw new UnsupportedOperationException("Not supported yet."); //To change body of generated methods, choose Tools | Templates.
    }

    @Override
    public List<Unit> simplificationParts() {
        throw new UnsupportedOperationException("Not supported yet."); //To change body of generated methods, choose Tools | Templates.
    }
}
