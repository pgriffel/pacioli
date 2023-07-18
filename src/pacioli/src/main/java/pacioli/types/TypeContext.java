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

import pacioli.Pacioli;
import pacioli.misc.AbstractPrintable;
import pacioli.misc.Utils;

public class TypeContext extends AbstractPrintable {

    public final List<String> typeVars;
    public final List<String> unitVars;
    public final List<String> indexVars;
    public final List<String> opVars;

    public TypeContext() {
        typeVars = new ArrayList<String>();
        unitVars = new ArrayList<String>();
        indexVars = new ArrayList<String>();
        opVars = new ArrayList<String>();
    }

    public Set<Var> typeVars() {
        Set<Var> vars = new LinkedHashSet<Var>();
        for (String name : typeVars) {
            vars.add(new TypeVar(name));
        }
        for (String name : opVars) {
            vars.add(new OperatorVar(name));
        }
        for (String name : indexVars) {
            vars.add(new IndexSetVar(name));
        }
        for (String name : unitVars) {
            if (name.contains("!")) {
                vars.add(new VectorUnitVar(name));
            } else {
                vars.add(new ScalarUnitVar(name));
            }
        }
        return vars;
    }

    public TypeContext(Set<Var> vars) {
        typeVars = new ArrayList<String>();
        unitVars = new ArrayList<String>();
        indexVars = new ArrayList<String>();
        opVars = new ArrayList<String>();
        for (Var genericVar : vars) {
            if (genericVar instanceof IndexSetVar) {
                indexVars.add(genericVar.pretty());
            } else if (genericVar instanceof ScalarUnitVar || genericVar instanceof VectorUnitVar) {
                unitVars.add(genericVar.pretty());
            } else if (genericVar instanceof TypeVar) {
                typeVars.add(genericVar.pretty());
            } else if (genericVar instanceof OperatorVar) {
                opVars.add(genericVar.pretty());
            } else {
                throw new RuntimeException("Unknown quantifier: " + genericVar.getClass());
            }
        }
    }

    public boolean containsTypeVar(String var) {
        return typeVars.contains(var);
    }

    public boolean containsUnitVar(String var) {
        return unitVars.contains(var);
    }

    public boolean containsIndexVar(String var) {
        return indexVars.contains(var);
    }

    public boolean containsOpVar(String var) {
        return opVars.contains(var);
    }

    public void addAll(TypeContext context) {
        addTypeVars(context.typeVars);
        addUnitVars(context.unitVars);
        addIndexVars(context.indexVars);
        addOpVars(context.opVars);
    }

    public void addTypeVar(String var) {
        typeVars.add(var);
    }

    public void addUnitVar(String var) {
        unitVars.add(var);
    }

    public void addIndexVar(String var) {
        indexVars.add(var);
    }

    public void addOpVar(String var) {
        opVars.add(var);
    }

    public void addTypeVars(List<String> vars) {
        for (String var : vars) {
            typeVars.add(var);
        }
    }

    public void addUnitVars(List<String> vars) {
        for (String var : vars) {
            unitVars.add(var);
        }
    }

    public void addIndexVars(List<String> vars) {
        for (String var : vars) {
            indexVars.add(var);
        }
    }

    public void addOpVars(List<String> vars) {
        for (String var : vars) {
            opVars.add(var);
        }
    }

    @Override
    public void printPretty(PrintWriter out) {
        String quant = quantified("for_op", opVars)
                + quantified("for_type", typeVars)
                + quantified("for_index", indexVars)
                + quantified("for_unit", unitVars);
        out.print(quant);
        if (quant.length() > 30 && Pacioli.Options.wrapTypes) {
            out.println();
            out.print("    ");
        }
        // out.print(quantified("for_type", typeVars));
        // out.print(quantified("for_index", indexVars));
        // out.print(quantified("for_unit", unitVars));
    }

    private static String quantified(String quantifier, List<String> names) {
        if (!names.isEmpty()) {
            return quantifier + " " + Utils.intercalate(", ", names) + ": ";
        } else {
            return "";
        }
    }
}
