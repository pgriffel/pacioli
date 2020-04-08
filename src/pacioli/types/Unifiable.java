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

import pacioli.ConstraintSet;
import pacioli.PacioliException;
import pacioli.Printable;
import pacioli.Substitution;
import uom.Fraction;
import uom.Unit;

/**
 * 
 */
public interface Unifiable<B> {

    public Set<Var> typeVars();

    public Unifiable<B> applySubstitution(Substitution subs);

    public ConstraintSet unificationConstraints(Unifiable<B> other) throws PacioliException;

    public Substitution unify(Unifiable<B> other) throws PacioliException;
    
    public Unifiable<B> reduce();

    public List<Unit<TypeBase>> simplificationParts();

    public default Unifiable<B> simplify() {
        Substitution mgu = new Substitution();
        List<Unit<TypeBase>> parts = simplificationParts();
        Set<Var> ignore = new HashSet<Var>();
        for (int i = 0; i < parts.size(); i++) {
            Unit<TypeBase> part = mgu.apply(parts.get(i));
            Substitution simplified = unitSimplify(part, ignore);
            for (TypeBase base : simplified.apply(part).bases()) {
                if (base instanceof Var) {
                    ignore.add((Var) base);
                }
            }
            mgu = simplified.compose(mgu);
        }
        Unifiable<B> result = applySubstitution(mgu);
        return result;
    }

    public default boolean isInstanceOf(Unifiable<B> other) {
        return isInstanceOf(this, other);
    }

    public static <B> boolean isInstanceOf(Unifiable<B> x, Unifiable<B> y) {
        try {
            Unifiable<B> sub = x.fresh();
            Unifiable<B> sup = y.fresh();
            Unifiable<B> unified = unified(sub, sup);
            return alphaEqual(sub, unified);
        } catch (PacioliException ex) {
            System.out.println(ex);
            return false;
        }
    }
    
    public static <B> Unifiable<B> unified(Unifiable<B> x, Unifiable<B> y) throws PacioliException {
        return x.unify(y).apply(x);
    }

    public static <B> boolean alphaEqual(Unifiable<B> x, Unifiable<B> y) throws PacioliException {
        return x.fresh().simplify().unify(y.simplify()).isInjective();
    }
    
    public default Unifiable<B> instantiate() {
        return this;
    }
//
//    public default List<B> yo (List<B> in) {
//        return in;
//    }
//    
//    public List<B> yo2 (List<B> in);
//    
//    public default List<B> fresh2() {
//        ArrayList<B> list = new ArrayList<B>();
//        return list;
//    }
//    
//    public default void test() {
//        List<B> f1 = fresh2();
//        //f1.get(0).pretty();
//    }
    
    //public Unifiable fresh();
    public default Unifiable<B> fresh() {
        Substitution map = new Substitution();
        for (Var var : typeVars()) {
            map = map.compose(new Substitution(var, var.fresh()));
        }
        return applySubstitution(map);
    }
    
    public static Substitution unitSimplify(Unit<TypeBase> unit, Set<Var> ignore) {

        List<TypeBase> varBases = new ArrayList<TypeBase>();
        List<TypeBase> fixedBases = new ArrayList<TypeBase>();

        for (TypeBase base : unit.bases()) {
            if (base instanceof Var && !ignore.contains((Var) base)) {
                varBases.add(base);
            } else {
                fixedBases.add(base);
            }

        }

        if (varBases.isEmpty()) {
            return new Substitution();
        }

        Var minVar = (Var) varBases.get(0);
        for (TypeBase var : varBases) {
            if (unit.power(var).abs().compareTo(unit.power(minVar).abs()) < 0) {
                minVar = (Var) var;
            }
        }
        assert (unit.power(minVar).isInt());
        Fraction minPower = unit.power(minVar);

        if (minPower.signum() < 0) {
            Substitution tmp = new Substitution(minVar, minVar.reciprocal());
            return unitSimplify(tmp.apply(unit), ignore).compose(tmp);
        }

        if (varBases.size() == 1) {

            Var var = (Var) varBases.get(0);
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
