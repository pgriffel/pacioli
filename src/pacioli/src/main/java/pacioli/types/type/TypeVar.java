/*
 * Copyright 2026 Paul Griffioen
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

package pacioli.types.type;

import java.util.Optional;

import pacioli.compiler.PacioliException;
import pacioli.symboltable.SymbolTable;
import pacioli.symboltable.info.Info;
import pacioli.symboltable.info.TypeVarInfo;
import pacioli.types.ConstraintSet;
import pacioli.types.TypeVisitor;

public class TypeVar implements TypeObject, Var {

    private final String name;
    private final TypeVarInfo info;
    private final boolean ground;

    // Constructors

    public TypeVar(TypeVarInfo info) {
        this(info.name(), info, false);
    }

    public TypeVar() {
        this(SymbolTable.freshVarName(), null, false);
    }

    public TypeVar(String name) {
        this(name, null, false);
    }

    public TypeVar(String name, TypeVarInfo info, boolean ground) {
        this.name = name;
        this.info = info;
        this.ground = ground;
    }

    @Override
    public TypeObject fresh() {
        return new TypeVar(SymbolTable.freshVarName(), null, false);
    }

    @Override
    public TypeObject rename(String name) {
        return new TypeVar(name, this.info, this.ground);
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

    public String name() {
        return name;
    }

    @Override
    public String description() {
        return "type variable";
    }

    @Override
    public Optional<? extends Info> info() {
        return Optional.ofNullable(this.info);
    }

    @Override
    public Boolean isFresh() {
        return this.info == null;
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

    @Override
    public boolean isGround() {
        return ground;
    }

    @Override
    public TypeVar setGround(boolean ground) {
        return new TypeVar(this.name, this.info, ground);
    }
}
