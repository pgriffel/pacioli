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
import java.io.StringWriter;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.function.Function;

import pacioli.CompilationSettings;
import pacioli.ConstraintSet;
import pacioli.PacioliException;
import pacioli.Printable;
import pacioli.Printer;
import pacioli.Substitution;
import pacioli.symboltable.TypeInfo;
import pacioli.types.ast.TypeNode;
import pacioli.types.visitors.VectorVarNames;
import pacioli.types.visitors.Devaluator;
import pacioli.types.visitors.JSGenerator;
import pacioli.types.visitors.ReduceTypes;
import pacioli.types.visitors.SimplificationParts;
import pacioli.types.visitors.SubstituteVisitor;
import pacioli.types.visitors.UsesVars;
import uom.Fraction;
import uom.Unit;

/**
 * A PacioliType is the semantic counterpart of a TypeNode.
 * 
 * Type equality, unification, etc. is defined on PacioliTypes and not on
 * TypeNodes.
 * 
 * Use eval and deval to switch between the two type representations.
 *
 */
public interface TypeObject extends Printable {

    public String description();

    public void accept(TypeVisitor visitor);

    public ConstraintSet unificationConstraints(TypeObject other) throws PacioliException;

    // Duplicate of AbstractPrintable.pretty
    public default String pretty() {
        StringWriter out = new StringWriter();
        printPretty(new PrintWriter(out));
        return out.toString();
    }

    public default Substitution unify(TypeObject other) throws PacioliException {

        if (equals(other)) {
            return new Substitution();
        }

        if (other instanceof Var) {
            return new Substitution((Var) other, this);
        }

        if (getClass().equals(other.getClass())) {
            return unificationConstraints(other).solve(false);
        } else {
            throw new PacioliException("Cannot unify a %s and a %s", description(), other.description());
        }
    }

    public default TypeObject fresh() {
        Substitution map = new Substitution();
        for (Var var : typeVars()) {
            map = map.compose(new Substitution(var, var.fresh()));
        }
        return applySubstitution(map);
    }

    public default Set<Var> typeVars() {
        return new UsesVars().varSetAccept(this);
    };

    public default TypeObject applySubstitution(Substitution subs) {
        return new SubstituteVisitor(subs).typeNodeAccept(this);
    };

    public default TypeObject reduce(Function<? super TypeInfo, ? extends Boolean> reduceCallback) {
        return new ReduceTypes(reduceCallback).typeNodeAccept(this);
    };

    public default List<Unit<TypeBase>> simplificationParts() {
        return new SimplificationParts().partsAccept(this);
    };

    public default TypeObject simplify() {
        Substitution mgu = new Substitution();
        List<Unit<TypeBase>> parts = simplificationParts();
        Set<Var> ignore = new HashSet<Var>();
        for (int i = 0; i < parts.size(); i++) {
            Unit<TypeBase> part = mgu.apply(parts.get(i));
            Substitution simplified = Unifiable.unitSimplify(part, ignore);
            for (TypeBase base : simplified.apply(part).bases()) {
                if (base instanceof Var) {
                    ignore.add((Var) base);
                }
            }
            mgu = simplified.compose(mgu);
        }
        TypeObject result = applySubstitution(mgu);
        return result;
    }

    public default boolean isInstanceOf(TypeObject other) {
        return isInstanceOf(this, other);
    }

    public static boolean isInstanceOf(TypeObject x, TypeObject y) {
        try {
            TypeObject sub = x.fresh();
            TypeObject sup = y.fresh();
            TypeObject unified = unified(sub, sup);
            return alphaEqual(sub, unified);
        } catch (PacioliException ex) {
            System.out.println(ex);
            return false;
        }
    }

    public static TypeObject unified(TypeObject x, TypeObject y) throws PacioliException {
        return x.unify(y).apply(x);
    }

    public static boolean alphaEqual(TypeObject x, TypeObject y) throws PacioliException {
        return x.fresh().simplify().unify(y.simplify()).isInjective();
    }

    public default TypeObject instantiate() {
        return this;
    }

    public default Schema generalize(Set<Var> context) {
        TypeObject unfresh = this;
        // PacioliType unfresh = unfresh();
        Set<Var> vars = new HashSet<Var>();
        for (Var var : unfresh.typeVars()) {
            if (!context.contains(var)) {
                vars.add(var);
            }
        }
        return new Schema(vars, unfresh);
    }

    public default Schema generalize() {
        return generalize(new HashSet<Var>());
        // PacioliType unfresh = unfresh();
        // return new Schema(unfresh.typeVars(), unfresh);
    }

    public default TypeObject unfresh() {

        // Replace all type variables by type variables named a, b, c, d, ...
        Substitution map = new Substitution();
        int character = 97; // character a
        for (Var var : typeVars()) {
            // TypeVar var = (TypeVar) gvar; //fixme
            if (var instanceof VectorUnitVar) {
                char ch = (char) character++;
                map = map.compose(new Substitution(var, var.rename(String.format("%s!%s", ch, ch))));
            } else {
                map = map.compose(new Substitution(var, var.rename(String.format("%s", (char) character++))));
            }
        }
        TypeObject unfreshType = applySubstitution(map);

        // Replace all unit vector variables by its name prefixed by the index set name.
        map = new Substitution();
        Set<String> names = new VectorVarNames().acceptTypeObject(unfreshType);
        // Set<String> names = unfreshType.unitVecVarCompoundNames();
        for (String name : names) {
            String[] parts = name.split("!");
            assert (parts.length == 2);
            if (parts.length == 2) {
                Var var1 = new VectorUnitVar(parts[1] + "!" + parts[1]);
                Var var2 = new VectorUnitVar(name);
                map = map.compose(new Substitution(var1, var2));
            }
        }
        return unfreshType.applySubstitution(map);

    }

    public default TypeNode deval() {
        return new Devaluator().typeNodeAccept(this);
    }

    public default String compileToJS() {
        StringWriter outputStream = new StringWriter();
        this.accept(new JSGenerator(new Printer(new PrintWriter(outputStream))));
        return outputStream.toString();
    };

    public default String compileToMVM(CompilationSettings settings) {
        return deval().compileToMVM(new CompilationSettings());
    }

    // Hack to print proper compound unit vector in schema's
    default public Set<String> unitVecVarCompoundNames() {
        return new VectorVarNames().acceptTypeObject(this);
    };

}
