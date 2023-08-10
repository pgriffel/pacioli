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

import pacioli.misc.CompilationSettings;
import pacioli.misc.PacioliException;
import pacioli.misc.Printable;
import pacioli.misc.Printer;
import pacioli.symboltable.info.ParametricInfo;
import pacioli.types.matrix.MatrixType;
import pacioli.types.visitors.VectorVarNames;
import pacioli.types.visitors.JSGenerator;
import pacioli.types.visitors.MVMGenerator;
import pacioli.types.visitors.PrettyPrinter;
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

    @Override
    public default void printPretty(PrintWriter out) {
        this.accept(new PrettyPrinter(new Printer(out)));
    }

    public default Set<Var> typeVars() {
        return new UsesVars().varSetAccept(this);
    };

    public default TypeObject applySubstitution(Substitution subs) {
        return new SubstituteVisitor(subs).typeNodeAccept(this);
    };

    public ConstraintSet unificationConstraints(TypeObject other) throws PacioliException;

    public default Substitution unify(TypeObject other) throws PacioliException {
        return unify(this, other);
    };

    public static Substitution unify(TypeObject x, TypeObject y) throws PacioliException {
        if (x.equals(y)) {
            return new Substitution();
        }

        if (x instanceof Var) {
            return new Substitution((Var) x, y);
        }

        if (y instanceof Var) {
            return new Substitution((Var) y, x);
        }

        if (x.getClass().equals(y.getClass())) {
            return x.unificationConstraints(y).solve(false);
        } else {
            throw new PacioliException("Cannot unify a %s and a %s", x.description(), y.description());
        }
    };

    public static TypeObject unified(TypeObject x, TypeObject y) throws PacioliException {
        return x.applySubstitution(x.unify(y));
    }

    public default TypeObject instantiate() {
        return this;
    }

    public default TypeObject fresh() {
        Substitution map = new Substitution();
        for (Var var : typeVars()) {
            map = map.compose(new Substitution(var, var.fresh()));
        }
        return applySubstitution(map);
    }

    public default TypeObject reduce(Function<? super ParametricInfo, ? extends Boolean> reduceCallback) {
        return new ReduceTypes(reduceCallback).typeNodeAccept(this);
    };

    public default List<Unit<TypeBase>> simplificationParts() {
        return new SimplificationParts().partsAccept(this);
    };

    public default TypeObject simplify() {
        Substitution mgu = new Substitution();
        List<Unit<TypeBase>> parts = simplificationParts();
        Set<UnitVar> ignore = new HashSet<>();
        for (int i = 0; i < parts.size(); i++) {
            Unit<TypeBase> part = mgu.apply(parts.get(i));
            Substitution simplified = unitSimplify(part, ignore);
            for (TypeBase base : simplified.apply(part).bases()) {
                if (base instanceof Var) {
                    ignore.add((UnitVar) base);
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

    public static boolean alphaEqual(TypeObject x, TypeObject y) throws PacioliException {
        return x.fresh().simplify().unify(y.simplify()).isInjective();
    }

    public default Schema generalize(Set<Var> context) {
        Set<Var> vars = new HashSet<Var>();
        for (Var var : typeVars()) {
            if (!context.contains(var)) {
                vars.add(var);
            }
        }
        // TODO: conditions in the schema are currenlty lost
        return new Schema(vars, this, List.of());
    }

    public default Schema generalize() {
        return generalize(new HashSet<Var>());
    }

    public default TypeObject unfresh() {

        // Replace all type variables by type variables named a, b, c, d, ...
        Substitution map = new Substitution();
        int character = 97; // character a
        for (Var var : typeVars()) {
            // TypeVar var = (TypeVar) gvar; //fixme
            if (var instanceof VectorUnitVar) {
                char ch = (char) character++;
                // Results in weird types like b!b. Is that okay?
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

    public default String compileToJS() {
        StringWriter outputStream = new StringWriter();
        this.accept(new JSGenerator(new Printer(new PrintWriter(outputStream))));
        return outputStream.toString();
    };

    public default String compileToMVM(CompilationSettings settings) {
        // Currently only the matrix type is compiled. This is just enough
        // to get shapes in the MVM.
        if (!(this instanceof MatrixType))
            throw new UnsupportedOperationException("yo");
        StringWriter outputStream = new StringWriter();
        this.accept(new MVMGenerator(new Printer(new PrintWriter(outputStream)),
                settings));
        return outputStream.toString();
    }

    // Hack to print proper compound unit vector in schema's
    default public Set<String> unitVecVarCompoundNames() {
        return new VectorVarNames().acceptTypeObject(this);
    };

    // UNITTODO
    public static Substitution unitSimplify(Unit<TypeBase> unit, Set<UnitVar> ignore) {

        List<TypeBase> varBases = new ArrayList<TypeBase>();
        List<TypeBase> fixedBases = new ArrayList<TypeBase>();

        for (TypeBase base : unit.bases()) {
            if (base instanceof UnitVar && !ignore.contains((Var) base)) {
                varBases.add(base);
            } else {
                fixedBases.add(base);
            }

        }

        if (varBases.isEmpty()) {
            return new Substitution();
        }

        UnitVar minVar = (UnitVar) varBases.get(0);
        for (TypeBase var : varBases) {
            if (unit.power(var).abs().compareTo(unit.power(minVar).abs()) < 0) {
                minVar = (UnitVar) var;
            }
        }
        assert (unit.power(minVar).isInt());
        Fraction minPower = unit.power(minVar);

        if (minPower.signum() < 0) {
            Substitution tmp = new Substitution(minVar, minVar.reciprocal());
            return unitSimplify(tmp.apply(unit), ignore).compose(tmp);
        }

        if (varBases.size() == 1) {

            UnitVar var = (UnitVar) varBases.get(0);
            assert (unit.power(var).isInt());
            int power = unit.power(var).intValue();
            // Unit residu = Unit.ONE.multiply(unit.factor());
            Unit<TypeBase> residu = TypeBase.ONE;

            for (TypeBase fixed : fixedBases) {
                assert (unit.power(fixed).isInt());
                int fixedPower = unit.power(fixed).intValue();
                residu = residu.multiply(fixed.raise(new Fraction(-fixedPower / power)));
            }

            return new Substitution(var, var.multiply(residu));
        }

        Unit<TypeBase> rest = (Unit<TypeBase>) TypeBase.ONE;
        for (TypeBase var : unit.bases()) {
            if (!var.equals(minVar)) {
                assert (unit.power(var).isInt());
                rest = rest.multiply(var.raise(unit.power(var).div(minPower).floor().negate()));
            }
        }

        Substitution tmp = new Substitution(minVar, minVar.multiply(rest));
        return unitSimplify(tmp.apply(unit), ignore).compose(tmp);
    }
}
