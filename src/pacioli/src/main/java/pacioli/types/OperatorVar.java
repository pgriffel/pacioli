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

import java.io.PrintWriter;
import java.util.LinkedHashSet;
import java.util.Optional;
import java.util.Set;

import pacioli.CompilationSettings;
import pacioli.ConstraintSet;
import pacioli.PacioliException;
import pacioli.Substitution;
import pacioli.symboltable.SymbolTable;
import pacioli.symboltable.ParametricInfo;

public record OperatorVar(String name, Optional<ParametricInfo> info) implements Operator, Var {

    // Constructors

    public OperatorVar(ParametricInfo info) {
        this(info.name(), Optional.of(info));
    }

    public OperatorVar() {
        this(SymbolTable.freshVarName(), Optional.empty());
    }

    public OperatorVar(String name) {
        this(name, Optional.empty());
    }

    @Override
    public OperatorVar fresh() {
        return new OperatorVar(SymbolTable.freshVarName());
    }

    @Override
    public OperatorVar rename(String name) {
        return new OperatorVar(name);
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
        if (!(other instanceof OperatorVar)) {
            return false;
        }
        OperatorVar otherVar = (OperatorVar) other;
        return name.equals(otherVar.name);
    }

    // Pretty printing

    @Override
    public void printPretty(PrintWriter out) {
        out.print(pretty());
    }

    @Override
    public String pretty() {
        if (false && !name.isEmpty()) {
            String first = name.substring(0, 1);
            return first.toUpperCase() + name.substring(1);
        } else {
            return name;
        }
    }

    // Properties

    public String getName() {
        return name;
    }

    @Override
    public String description() {
        return "type variable";
    }

    @Override
    public ParametricInfo getInfo() {
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

    // Visiting visitors

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
