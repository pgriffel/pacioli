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

package pacioli;

import java.io.PrintWriter;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;

import pacioli.types.PacioliType;
import pacioli.types.TypeVar;
import pacioli.types.Var;

public class Typing extends AbstractPrintable {

    private final PacioliType type;
    private final ConstraintSet constraints;
    private final Map<String, Set<TypeVar>> assumptions = new HashMap<String, Set<TypeVar>>();

    public Typing(PacioliType type) {
        this.type = type;
        this.constraints = new ConstraintSet();
    }

    public void addConstraint(PacioliType lhs, PacioliType rhs, String text) {
        constraints.addConstraint(lhs, rhs, text);
    }

    public void addInstanceConstraint(PacioliType lhs, PacioliType rhs, Set<Var> freeVars, String text) {
        constraints.addInstanceConstraint(lhs, rhs, freeVars, text);
    }

    public void addConstraintsAndAssumptions(Typing other) {
        addConstraints(other);
        addAssumptions(other);
    }
    
    public void addConstraints(Typing other) {
        constraints.addConstraints(other.constraints);
    }
    
    public void addAssumption(String name, TypeVar var) {
        Set<TypeVar> set;
        set = assumptions.get(name);
        if (set == null) {
            set = new HashSet<TypeVar>();
            assumptions.put(name, set);
        }
        set.add(var);
    }
    
    public void addAssumptions(Typing other) {
        for (String key: other.assumptions.keySet()) {
            for (TypeVar var: other.assumptions.get(key)) {
                addAssumption(key, var);
            }
        }
    }
    
    public PacioliType getType() {
        return type;
    }

    @Override
    public void printPretty(PrintWriter out) {
        type.printPretty(out);
        out.print(" with\n");
        constraints.printPretty(out);
        out.print("assuming");
        for (String key: assumptions.keySet()) {
            for (TypeVar var: assumptions.get(key)) {
                out.print("\n  ");
                out.print(key);
                out.print(" :: ");
                out.print(var.pretty());
            }
        }
    }

    public PacioliType solve(Boolean verbose) throws PacioliException {
        return constraints.solve(verbose).apply(type);
    }

    public Set<String> assumedNames() {
        return assumptions.keySet();
    }
    
    public Set<TypeVar> assumptions(String name) {
        Set<TypeVar> set = assumptions.get(name);
        if (set == null) {
            return new HashSet<TypeVar>();
        } else  {
            return set;
        }
    }
}
