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
import java.util.Set;
import pacioli.ConstraintSet;
import pacioli.PacioliException;
import pacioli.Substitution;
import pacioli.types.ast.FunctionTypeNode;
import pacioli.types.ast.TypeNode;
import uom.Unit;

public class FunctionType extends AbstractType {

    public final PacioliType domain;
    public final PacioliType range;

    public FunctionType(PacioliType domain, PacioliType range) {
        this.domain = domain;
        this.range = range;
    }

    @Override
    public void printPretty(PrintWriter out) {
        if (domain instanceof ParametricType && ((ParametricType) domain).name.equals("Tuple")) {
            out.print(((ParametricType) domain).pprintArgs());
        } else {
            domain.printPretty(out);
        }
        out.print(" -> ");
        range.printPretty(out);
    }
    
    @Override
    public Set<String> unitVecVarCompoundNames() {
        Set<String> all = new LinkedHashSet<String>();
        all.addAll(domain.unitVecVarCompoundNames());
        all.addAll(range.unitVecVarCompoundNames());
        return all;
    }

    @Override
    public ConstraintSet unificationConstraints(PacioliType other) throws PacioliException {
        FunctionType otherType = (FunctionType) other;
        ConstraintSet constraints = new ConstraintSet();
        constraints.addConstraint(domain, otherType.domain, String.format("Function domain's types must match"));
        constraints.addConstraint(range, otherType.range, String.format("Function range's type must match"));
        return constraints;
    }

    @Override
    public String description() {
        return "function type";
    }


    @Override
    public PacioliType applySubstitution(Substitution subs) {
        return new FunctionType(domain.applySubstitution(subs), range.applySubstitution(subs));
    }

    @Override
    public String compileToJS() {
        StringBuilder out = new StringBuilder();
        out.append("new Pacioli.Type('function', [");
        out.append(domain.compileToJS());
        out.append(", ");
        out.append(range.compileToJS());
        out.append("])");
        return out.toString();
    }

    @Override
    public PacioliType reduce() {
        return new FunctionType(domain.reduce(), range.reduce());
    }

    @Override
    public void accept(TypeVisitor visitor) {
        visitor.visit(this);
    }

}
