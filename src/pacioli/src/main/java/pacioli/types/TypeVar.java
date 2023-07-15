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

import java.util.Optional;
import pacioli.ConstraintSet;
import pacioli.PacioliException;
import pacioli.symboltable.SymbolTable;
import pacioli.symboltable.TypeVarInfo;
import uom.BaseUnit;

public class TypeVar extends BaseUnit<TypeBase> implements TypeObject, Var {

    private final String name;
    public final Optional<TypeVarInfo> info;

    // Constructors

    public TypeVar(TypeVarInfo info) {
        name = info.name();
        this.info = Optional.of(info);
    }

    public TypeVar() {
        name = SymbolTable.freshVarName();
        this.info = Optional.empty();
    }

    public TypeVar(String name) {
        this.name = name;
        this.info = Optional.empty();
    }

    @Override
    public TypeObject fresh() {
        return new TypeVar(SymbolTable.freshVarName());
    }

    @Override
    public TypeObject rename(String name) {
        return new TypeVar(name);
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
        if (!(other instanceof TypeVar)) {
            return false;
        }
        TypeVar otherVar = (TypeVar) other;
        return name.equals(otherVar.name);
    }

    @Override
    public String toString() {
        return String.format("<tvar %s>", name);
    }

    @Override
    public String pretty() {
        return name;
    }

    public String getName() {
        return name;
    }

    @Override
    public String description() {
        return "type variable";
    }

    @Override
    public TypeVarInfo getInfo() {
        if (info.isPresent()) {
            return info.get();
        } else {
            throw new RuntimeException(String.format("No info present for fresh type variable %s", name));
        }
    }

    @Override
    public Boolean isFresh() {
        return !info.isPresent();
    }

    @Override
    public void accept(TypeVisitor visitor) {
        visitor.visit(this);
    }

    @Override
    public ConstraintSet unificationConstraints(TypeObject other) throws PacioliException {
        // see unification on ConstraintSet
        throw new UnsupportedOperationException("Not supported yet.");
    }
}
