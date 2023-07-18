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
import pacioli.CompilationSettings;
import pacioli.PacioliException;
import pacioli.symboltable.SymbolTable;
import pacioli.symboltable.VectorBaseInfo;
import uom.BaseUnit;

public class VectorUnitVar extends BaseUnit<TypeBase> implements TypeObject, UnitVar {

    private final String name;
    public Optional<VectorBaseInfo> info;

    // Constructors

    public VectorUnitVar(VectorBaseInfo info) {
        name = info.name();
        assert (name.contains("!"));
        this.info = Optional.of(info);
    }

    public VectorUnitVar(String name) {
        this.name = name;
        assert (name.contains("!"));
        this.info = Optional.empty();
    }

    @Override
    public TypeObject fresh() {
        return new VectorUnitVar(SymbolTable.freshVarName() + "!" + SymbolTable.freshVarName());
    }

    public TypeObject rename(String name) {
        return new VectorUnitVar(name);
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
        if (!(other instanceof VectorUnitVar)) {
            return false;
        }
        VectorUnitVar otherVar = (VectorUnitVar) other;
        return name.equals(otherVar.name);
    }

    @Override
    public String toString() {
        return "<uvar " + name + ">";
    }

    // Properties

    public String unitPart() {
        String[] parts = name.split("!");
        return parts[1];
    }

    @Override
    public VectorBaseInfo getInfo() {
        if (info.isPresent()) {
            return info.get();
        } else {
            throw new RuntimeException(String.format("No info present for fresh vector unit variable %s", name));
        }
    }

    @Override
    public String description() {
        return "vector unit variable";
    }

    @Override
    public Boolean isFresh() {
        return !info.isPresent();
    }

    @Override
    public String pretty() {
        return name;
    }

    public String getName() {
        return name;
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

    @Override
    public String asJS() {
        return "new Pacioli.PowerProduct('_" + this.pretty() + "_')";
    }

    @Override
    public String asMVMUnit(CompilationSettings settings) {
        return TypeObject.super.compileToMVM(settings);
    }

    @Override
    public String asMVMShape(CompilationSettings settings) {
        return TypeObject.super.compileToMVM(settings);
    }

}
