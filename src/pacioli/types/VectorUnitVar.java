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

import pacioli.CompilationSettings;
import pacioli.ConstraintSet;
import pacioli.PacioliException;
import pacioli.Substitution;
import pacioli.symboltable.VectorUnitInfo;
import pacioli.types.ast.TypeNode;
import uom.BaseUnit;
import uom.Unit;

public class VectorUnitVar extends BaseUnit<TypeBase> implements PacioliType, Var {

    private static int counter = 0;
    private final String name;
    public final String quantifier;
    private Optional<VectorUnitInfo> info;

    public VectorUnitVar(VectorUnitInfo info) {
        name = info.name();
        this.quantifier = "for_unit";
        this.info = Optional.of(info);
    }

    public VectorUnitVar(String quantifier, String name) {
        this.name = name;
        this.quantifier = quantifier;
        this.info = Optional.empty();
    }

    @Override
    public Set<String> unitVecVarCompoundNames() {
        return new LinkedHashSet<String>();
    }
/*
    private TypeVar(String quantifier, String name, boolean active) {
        this.name = name;
        this.quantifier = quantifier;
    }

    public TypeVar changeActivation(boolean status) {
        return new TypeVar(quantifier, name, status);
    }
*/
    @Override
    public int hashCode() {
        return name.hashCode();
    }

    @Override
    public boolean equals(Object other) {
        if (other == this) {
            return true;
        }
        if (!(other instanceof VectorUnitVar)) {
            return false;
        }
        VectorUnitVar otherVar = (VectorUnitVar) other;
        return name.equals(otherVar.name);
    }

    @Override
    public void printPretty(PrintWriter out) {
        out.print(pretty());
    }

    @Override
    public String pretty() {
        if (!name.isEmpty() && quantifier.equals("for_index")) {
            String first = name.substring(0, 1);
            return first.toUpperCase() + name.substring(1);
        } else {
            return name;
        }
    }

    @Override
    public Set<Var> typeVars() {
        Set<Var> vars = new LinkedHashSet<Var>();
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
    public List<Unit<TypeBase>> simplificationParts() {
        List<Unit<TypeBase>> parts = new ArrayList<Unit<TypeBase>>();
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
            return new Substitution(this, other);
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
        PacioliType unfresh = unfresh();
        return new Schema(unfresh.typeVars(), unfresh);
    }

    @Override
    public PacioliType fresh() {
        return new VectorUnitVar(quantifier, freshName());
    }

    public PacioliType rename(String name) {
        return new VectorUnitVar(quantifier, name);
    }

    private static String freshName() {
        return "?" + counter++;
    }

    @Override
    public PacioliType unfresh() {
        return new VectorUnitVar(quantifier, "a");
    }

    @Override
    public String compileToJS() {
        if (quantifier.equals("for_unit")) {
            return "new Pacioli.PowerProduct('_" + this.pretty() + "_')";
        } else {
            return "'_" + this.pretty() + "_'";
        }
    }

    @Override
    public PacioliType reduce() {
        return this;
    }

    @Override
    public TypeNode deval() {
        throw new UnsupportedOperationException("Not supported yet.");
    }
    
    @Override
    public VectorUnitInfo getInfo() {
        if (info.isPresent()) {
            return info.get(); 
        } else {
            throw new RuntimeException(String.format("No info present for fresh vector unit variable %s", name));
        }
    }

    @Override
    public Boolean isFresh() {
       return !info.isPresent();
    }

    @Override
    public String compileToMVM(CompilationSettings settings) {
        return PacioliType.super.compileToMVM(settings);
    }
}
