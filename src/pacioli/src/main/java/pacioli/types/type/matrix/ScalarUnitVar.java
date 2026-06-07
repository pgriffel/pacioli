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

package pacioli.types.type.matrix;

import java.io.PrintWriter;
import java.util.Optional;

import pacioli.compiler.CompilationSettings;
import pacioli.compiler.PacioliException;
import pacioli.symboltable.SymbolTable;
import pacioli.symboltable.info.ScalarBaseInfo;
import pacioli.types.ConstraintSet;
import pacioli.types.TypeVisitor;
import pacioli.types.type.TypeObject;
import pacioli.types.type.UnitVar;
import pacioli.types.type.Var;

public final class ScalarUnitVar implements ScalarBase, UnitVar, TypeObject {

    // Debug flag
    private static final boolean PRINT_GROUNDED_VARS = true;

    private final String name;
    private final ScalarBaseInfo info;
    private final boolean ground;

    // Constructors

    public ScalarUnitVar(ScalarBaseInfo info) {
        this(info.name(), info, false);
    }

    public ScalarUnitVar(String name) {
        this(name, null, false);
    }

    public ScalarUnitVar(String name, ScalarBaseInfo info, boolean ground) {
        this.name = name;
        this.info = info;
        this.ground = ground;
    }

    @Override
    public TypeObject fresh() {
        return new ScalarUnitVar(SymbolTable.freshVarName(), null, false);
    }

    public boolean isVar() {
        return !isGround();
    }

    public TypeObject rename(String name) {
        return new ScalarUnitVar(name, this.info, this.ground);
    }

    // Equality

    @Override
    public int hashCode() {
        final int prime = 31;
        int result = 1;
        result = prime * result + ((name == null) ? 0 : name.hashCode());
        result = prime * result + (ground ? 1231 : 1237);
        return result;
    }

    @Override
    public boolean equals(Object obj) {
        if (this == obj)
            return true;
        if (obj == null)
            return false;
        if (getClass() != obj.getClass())
            return false;
        ScalarUnitVar other = (ScalarUnitVar) obj;
        if (name == null) {
            if (other.name != null)
                return false;
        } else if (!name.equals(other.name))
            return false;
        if (ground != other.ground)
            return false;
        return true;
    }

    @Override
    public String toString() {
        return "<uvar " + this.pretty() + ">";
    }

    // Pretty printing

    @Override
    public void printPretty(PrintWriter out) {
        out.print(pretty());
    }

    @Override
    public String pretty() {
        return this.ground && PRINT_GROUNDED_VARS ? "{" + name + "}" : name;
    }

    public String name() {
        return name;
    }

    // Properties

    @Override
    public Optional<ScalarBaseInfo> info() {
        return Optional.ofNullable(this.info);
    }

    @Override
    public Boolean isFresh() {
        return info == null;
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
    public ConstraintSet unificationConstraints(TypeObject other) throws PacioliException {
        // see unification on ConstraintSet
        throw new UnsupportedOperationException("Not supported yet.");
    }

    @Override
    public String asJS(boolean forType) {
        return "Pacioli.unitFromVarName('_" + this.pretty() + "_')";
    }

    @Override
    public String asMVMUnit(CompilationSettings settings) {
        return TypeObject.super.compileToMVM(settings);
    }

    @Override
    public String asMVMShape(CompilationSettings settings) {
        return TypeObject.super.compileToMVM(settings);
    }

    @Override
    public boolean isGround() {
        return ground;
    }

    @Override
    public Var setGround(boolean ground) {
        return new ScalarUnitVar(this.name, this.info, ground);
    }
}
