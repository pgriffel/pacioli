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
import java.util.HashMap;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;
import pacioli.ConstraintSet;
import pacioli.PacioliException;
import pacioli.Printable;
import pacioli.Substitution;
import uom.BaseUnit;
import uom.Unit;

public class TypeVar extends BaseUnit implements PacioliType, Printable, TypeBase {

    private static int counter = 0;
    private final String name;
    public final String quantifier;
    public final boolean active;

    public TypeVar(String quantifier) {
        name = freshName();
        active = true;
        this.quantifier = quantifier;
    }

    public TypeVar(String quantifier, String name) {
        this.name = name;
        active = true;
        this.quantifier = quantifier;
    }

    private TypeVar(String quantifier, String name, boolean active) {
        this.name = name;
        this.active = active;
        this.quantifier = quantifier;
    }

    public TypeVar changeActivation(boolean status) {
        return new TypeVar(quantifier, name, status);
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
        if (!(other instanceof TypeVar)) {
            return false;
        }
        TypeVar otherVar = (TypeVar) other;
        return name.equals(otherVar.name);
    }

    @Override
    public void printText(PrintWriter out) {
        out.print(name);
    }

    @Override
    public String toText() {
        if (!name.isEmpty() && quantifier.equals("for_index")) {
            String first = name.substring(0, 1);
            return first.toUpperCase() + name.substring(1);
        } else {
            return name;
        }
    }

    @Override
    public Set<TypeVar> typeVars() {
        Set<TypeVar> vars = new LinkedHashSet<TypeVar>();
        vars.add(this);
        return vars;
    }

    @Override
    public ConstraintSet unificationConstraints(PacioliType other) throws PacioliException {
        // see unification on ConstraintSet
        throw new UnsupportedOperationException("Not supported yet.");
    }

    @Override
    public String description() {
        return "type variable";
    }

    @Override
    public List<Unit> simplificationParts() {
        List<Unit> parts = new ArrayList<Unit>();
        return parts;
    }

    @Override
    public PacioliType applySubstitution(Substitution subs) {
        return subs.apply((PacioliType) this);
    }

    @Override
    public Substitution unify(PacioliType other) throws PacioliException {
        if (equals(other)) {
            return new Substitution();
        } else {
            // To ensure we do not lose the information that a variable is an index variable.
            if (other instanceof TypeVar && ((TypeVar) other).quantifier.equals("for_type")) {
                return new Substitution((TypeVar) other, this);
            } else {
                return new Substitution(this, other);
            }
        }
    }

    @Override
    public PacioliType simplify() {
        return this;
    }

    @Override
    public boolean isInstanceOf(PacioliType other) {
        return false;
    }

    @Override
    public PacioliType instantiate() {
        return this;
    }

    @Override
    public Schema generalize() {
    	throw new RuntimeException("Cannot generalize a schema");
    }

    @Override
    public PacioliType fresh() {
        return new TypeVar(quantifier);
    }

    public PacioliType rename(String name) {
        return new TypeVar(quantifier, name);
    }

    private static String freshName() {
        return "?" + counter++;
    }

    @Override
    public PacioliType unfresh() {
        return new TypeVar(quantifier, "a");
    }

    @Override
    public PacioliType freeze() {
        return changeActivation(false);
    }

    @Override
    public PacioliType unfreeze() {
        return changeActivation(true);
    }

	@Override
	public String compileToJS() {
		if (quantifier.equals("for_unit")) {
			return "new Pacioli.PowerProduct('_" + this.toText() + "_')";
		} else {
			return "'_" + this.toText() + "_'";
		}
	}
}
