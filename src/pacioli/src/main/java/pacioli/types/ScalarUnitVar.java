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
import java.util.LinkedHashSet;
import java.util.Optional;
import java.util.Set;

import pacioli.CompilationSettings;
import pacioli.ConstraintSet;
import pacioli.PacioliException;
import pacioli.Substitution;
import pacioli.symboltable.ScalarUnitInfo;
import pacioli.symboltable.SymbolTable;
import uom.BaseUnit;

public class ScalarUnitVar extends BaseUnit<TypeBase> implements PacioliType, Var {

    private final String name;
    public final Optional<ScalarUnitInfo> info;

    // Constructors
    
    public ScalarUnitVar(ScalarUnitInfo info) {
        name = info.name();
        this.info = Optional.of(info);
    }

    public ScalarUnitVar(String name) {
        this.name = name;
        this.info = Optional.empty();
    }

    @Override
    public PacioliType fresh() {
        return new ScalarUnitVar(SymbolTable.freshVarName());
    }

    public PacioliType rename(String name) {
        return new ScalarUnitVar(name);
    }

    // Equality

    @Override
    public int hashCode() {
        return name.hashCode();
    }

    @Override
    public boolean equals(Object other) {
        if (other == this) {
            return true;
        }
        if (!(other instanceof ScalarUnitVar)) {
            return false;
        }
        ScalarUnitVar otherVar = (ScalarUnitVar) other;
        return name.equals(otherVar.name);
    }

    @Override
    public String toString() {
        return "'" + name + "'";
    }

    // Pretty printing
    
    @Override
    public void printPretty(PrintWriter out) {
        out.print(pretty());
    }

    @Override
    public String pretty() {
        return name;
    }

    // Properties

    @Override
    public ScalarUnitInfo getInfo() {
        if (info.isPresent()) {
            return info.get(); 
        } else {
            throw new RuntimeException(String.format("No info present for fresh scalar unit variable %s", name));
        }
    }

    @Override
    public Boolean isFresh() {
       return !info.isPresent();
    }
    
    @Override
    public String description() {
        return "scalar unit variable";
    }
    
    // Visiting visitors

    @Override
    public void accept(TypeVisitor visitor) {
        visitor.visit(this);
    }
    
    // To move to visitors 

    @Override
    public ConstraintSet unificationConstraints(PacioliType other) throws PacioliException {
        // see unification on ConstraintSet
        throw new UnsupportedOperationException("Not supported yet.");
    }

    @Override
    public Set<String> unitVecVarCompoundNames() {
        return new LinkedHashSet<String>();
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
    public String compileToJS() {
        //return "new Pacioli.PowerProduct('_" + this.pretty() + "_')";
        return "Pacioli.unitFromVarName('_" + this.pretty() + "_')";
    }

    @Override
    public String compileToMVM(CompilationSettings settings) {
        return PacioliType.super.compileToMVM(settings);
    }
}
