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

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

import pacioli.AbstractPrintable;
import pacioli.PacioliException;
import pacioli.Substitution;
import pacioli.types.ast.FunctionTypeNode;
import pacioli.types.ast.TypeNode;
import uom.Fraction;
import uom.Unit;

public abstract class AbstractType extends AbstractPrintable implements PacioliType {

    @Override
    public Substitution unify(PacioliType other) throws PacioliException {

        if (equals(other)) {
            return new Substitution();
        }

        if (other instanceof TypeVar) {
            return new Substitution((TypeVar) other, this);
        }

        if (getClass().equals(other.getClass())) {
            return unificationConstraints(other).solve();
        } else {
            throw new PacioliException("Cannot unify a %s and a %s", description(), other.description());
        }
    }

    @Override
    public PacioliType simplify() {
        Substitution mgu = new Substitution();
        List<Unit<TypeBase>> parts = simplificationParts();
        Set<TypeVar> ignore = new HashSet<TypeVar>();
        for (int i = 0; i < parts.size(); i++) {
            Unit<TypeBase> part = mgu.apply(parts.get(i));
            Substitution simplified = unitSimplify(part, ignore);
            for (TypeBase base : simplified.apply(part).bases()) {
                if (base instanceof TypeVar) {
                    ignore.add((TypeVar) base);
                }
            }
            mgu = simplified.compose(mgu);
        }
        PacioliType result = applySubstitution(mgu);
        return result;
    }

    private static Substitution unitSimplify(Unit<TypeBase> unit, Set<TypeVar> ignore) {

        List<TypeBase> varBases = new ArrayList<TypeBase>();
        List<TypeBase> fixedBases = new ArrayList<TypeBase>();

        for (TypeBase base : unit.bases()) {
            if (base instanceof TypeVar && !ignore.contains((TypeVar) base)) {
                varBases.add(base);
            } else {
                fixedBases.add(base);
            }

        }

        if (varBases.isEmpty()) {
            return new Substitution();
        }

        TypeVar minVar = (TypeVar) varBases.get(0);
        for (TypeBase var : varBases) {
            if (unit.power(var).abs().compareTo(unit.power(minVar).abs()) < 0) {
                minVar = (TypeVar) var;
            }
        }
        assert (unit.power(minVar).isInt());
        Fraction minPower = unit.power(minVar);

        if (minPower.signum() < 0) {
            Substitution tmp = new Substitution(minVar, minVar.reciprocal());
            return unitSimplify(tmp.apply(unit), ignore).compose(tmp);
        }

        if (varBases.size() == 1) {

            TypeVar var = (TypeVar) varBases.get(0);
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

    @Override
    public boolean isInstanceOf(PacioliType other) {
        return isInstanceOf(this, other);
    }

    private static boolean isInstanceOf(PacioliType x, PacioliType y) {
        try {
            PacioliType sub = x.fresh();
            PacioliType sup = y.fresh();
            PacioliType unified = unified(sub, sup);
            return alphaEqual(sub, unified);
        } catch (PacioliException ex) {
            System.out.println(ex);
            return false;
        }
    }

    private static PacioliType unified(PacioliType x, PacioliType y) throws PacioliException {
        return x.unify(y).apply(x);
    }

    private static boolean alphaEqual(PacioliType x, PacioliType y) throws PacioliException {
        return x.simplify().unify(y.simplify()).isInjective();
    }

    @Override
    public PacioliType instantiate() {
        // throw new RuntimeException("Can only instantiate a schema");
        return this;
    }

    @Override
    public Schema generalize() {
        PacioliType unfresh = unfresh();
        return new Schema(unfresh.typeVars(), unfresh);
    }

    @Override
    public PacioliType fresh() {
        Substitution map = new Substitution();
        for (TypeVar var : typeVars()) {
            map = map.compose(new Substitution(var, var.fresh()));
        }
        return applySubstitution(map);
    }

    @Override
    public PacioliType unfresh() {

        // Replace all type variables by type variables named a, b, c, d, ...
        Substitution map = new Substitution();
        int character = 97; // character a
        for (TypeVar var : typeVars()) {
            map = map.compose(new Substitution(var, var.rename(String.format("%s", (char) character++))));
        }
        PacioliType unfreshType = applySubstitution(map);

        // Replace all unit vector variables by its name prefixed by the index set name.
        map = new Substitution();
        for (String name : unfreshType.unitVecVarCompoundNames()) {
            String[] parts = name.split("!");
            // FIXME
            // The assert fails for a type schema, because the variables are not refreshed
            // and might
            // already contain !
            // assert(parts.length == 2);
            if (parts.length == 2) {
                map = map.compose(new Substitution(new TypeVar("for_unit", parts[1]), new TypeVar("for_unit", name)));
            }
        }
        return unfreshType.applySubstitution(map);

    }
    
    @Override
    public TypeNode deval() {
        return null;
    }
}
