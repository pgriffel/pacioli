/*
* Copyright (c) 2013 - 2014 Paul Griffioen
*
* Permission is hereby granted, free of charge, to any person obtaining a
copy of
* this software and associated documentation files (the "Software"), to deal
in
* the Software without restriction, including without limitation the rights
to
* use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of
* the Software, and to permit persons to whom the Software is furnished to do
so,
* subject to the following conditions:
*
* The above copyright notice and this permission notice shall be included in
all
* copies or substantial portions of the Software.
*
* THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
* IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS
* FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS
OR
* COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
WHETHER
* IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
* CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/

package pacioli.types;

import pacioli.compiler.PacioliException;
import pacioli.symboltable.SymbolTable;
import pacioli.symboltable.info.ParametricInfo;

public record OperatorVar(String name, ParametricInfo info) implements Operator, Var {

    public OperatorVar(ParametricInfo info) {
        this(info.name(), info);
    }

    public OperatorVar() {
        this(SymbolTable.freshVarName(), null);
    }

    public OperatorVar(String name) {
        this(name, null);
    }

    @Override
    public OperatorVar rename(String name) {
        // TODO: Don't copy info?
        return new OperatorVar(name);
    }

    @Override
    public OperatorVar fresh() {
        return new OperatorVar(SymbolTable.freshVarName());
    }

    @Override
    public String description() {
        return "type variable";
    }

    @Override
    public String toString() {
        return "<ovar " + name + ">";
    }

    @Override
    public Boolean isFresh() {
        return info == null;
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
        if (!(other instanceof OperatorVar)) {
            return false;
        }
        OperatorVar otherVar = (OperatorVar) other;
        return name.equals(otherVar.name);
    }

    public String name() {
        return name;
    }

    @Override
    public ParametricInfo info() {
        if (info != null) {
            return info;
        } else {
            throw new RuntimeException(String.format("No info present for fresh type variable %s", name));
        }
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
