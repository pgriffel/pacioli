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
import pacioli.symboltable.IndexSetInfo;
import pacioli.symboltable.SymbolTable;
import uom.BaseUnit;
import uom.Unit;

public class IndexSetVar extends BaseUnit<TypeBase> implements PacioliType, Var {

    private final String name;
    public final Optional<IndexSetInfo> info;

    // Constructors
    
    public IndexSetVar(IndexSetInfo info) {
        name = info.name();
        this.info = Optional.of(info);
    }

    public IndexSetVar(String name) {
        this.name = name;
        this.info = Optional.empty();
    }
    
    @Override
    public PacioliType fresh() {
        return new IndexSetVar(SymbolTable.freshVarName());
    }

    public PacioliType rename(String name) {
        return new IndexSetVar(name);
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
        if (!(other instanceof IndexSetVar)) {
            return false;
        }
        IndexSetVar otherVar = (IndexSetVar) other;
        return name.equals(otherVar.name);
    }
    
    @Override
    public String toString() {
        return "'" + name + "'";
    }

    public String getName() {
        return name;
    }

    
    // Properties
    
    @Override
    public IndexSetInfo getInfo() {
        if (info.isPresent()) {
            return info.get(); 
        } else {
            throw new RuntimeException(String.format("No info present for fresh index set variable %s", name));
        }
    }

    @Override
    public Boolean isFresh() {
       return !info.isPresent();
    }
    
    @Override
    public String description() {
        return "type variable";
    }

    // Pretty printing
    
    @Override
    public void printPretty(PrintWriter out) {
        out.print(pretty());
    }

    @Override
    public String pretty() {
        // should be done in unfresh
        if (!name.isEmpty()) {
            String first = name.substring(0, 1);
            return first.toUpperCase() + name.substring(1);
        } else {
            return name;
        }
    }

    // Visiting visitors

    @Override
    public void accept(TypeVisitor visitor) {
        visitor.visit(this);
    }
    
    // Should be visitors

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
    public PacioliType reduce() {
        return this;
    }

    @Override
    public String compileToJS() {
        return "'_" + this.pretty() + "_'";
    }

    @Override
    public String compileToMVM(CompilationSettings settings) {
        return PacioliType.super.compileToMVM(settings);
    }

}
