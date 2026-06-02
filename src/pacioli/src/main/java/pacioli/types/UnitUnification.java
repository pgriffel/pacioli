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

package pacioli.types;

import java.util.ArrayList;
import java.util.List;
import java.util.Set;

import pacioli.compiler.PacioliException;
import pacioli.types.matrix.MatrixBase;
import pacioli.types.type.UnitVar;
import pacioli.types.type.Var;
import uom.Fraction;
import uom.Unit;

public class UnitUnification {

    public static Substitution unifyUnits(Unit<MatrixBase> x, Unit<MatrixBase> y) throws PacioliException {
        try {
            if (x.equals(y)) {
                return new Substitution();
            } else {
                // hier met de factor(s) multiplyen?
                return unitUnify(x.multiply(y.reciprocal()));
            }
        } catch (PacioliException ex) {
            throw new PacioliException("Cannot unify units %s and %s", x.pretty(), y.pretty());
        }
    }

    private static Substitution unitUnify(Unit<MatrixBase> unit) throws PacioliException {

        List<MatrixBase> varBases = new ArrayList<MatrixBase>();
        List<MatrixBase> fixedBases = new ArrayList<MatrixBase>();

        for (MatrixBase base : unit.bases()) {
            if (base instanceof UnitVar unitVar && !unitVar.isGround()) {
                varBases.add(base);
            } else {
                fixedBases.add(base);
            }

        }

        if (varBases.isEmpty()) {
            if (fixedBases.isEmpty()) {
                return new Substitution();
            } else {
                throw new PacioliException("Cannot unify unit 1 %s", unit.pretty());
            }
        }

        if (varBases.size() == 1) {

            UnitVar var = (UnitVar) varBases.get(0);
            assert (unit.power(var).isInt());
            int power = unit.power(var).intValue();
            Unit<MatrixBase> residu = MatrixBase.ONE;

            for (MatrixBase fixed : fixedBases) {
                assert (unit.power(fixed).isInt());
                int fixedPower = unit.power(fixed).intValue();
                if (fixedPower % power != 0) {
                    throw new PacioliException("Cannot unify unit 2 %s", unit.pretty());
                }
                residu = residu.multiply(Unit.from(fixed).raise(new Fraction(-fixedPower / power)));
            }

            return new Substitution(var, residu);
        }

        UnitVar minVar = (UnitVar) varBases.get(0);
        for (MatrixBase var : varBases) {
            if (unit.power(var).abs().compareTo(unit.power(minVar).abs()) < 0) {
                minVar = (UnitVar) var;
            }
        }

        assert (unit.power(minVar).isInt());
        Fraction minPower = unit.power(minVar);
        Unit<MatrixBase> rest = MatrixBase.ONE;
        for (MatrixBase var : unit.bases()) {
            if (!var.equals(minVar)) {
                assert (unit.power(var).isInt());
                rest = rest.multiply(
                        Unit.from(var).raise(unit.power(var).div(minPower).floor().negate()));
            }
        }

        Substitution tmp = new Substitution(minVar, Unit.<MatrixBase>from(minVar).multiply(rest));
        return unitUnify(tmp.apply(unit)).compose(tmp);
    }

    // UNITTODO
    public static Substitution unitSimplify(Unit<MatrixBase> unit, Set<UnitVar> ignore) {

        List<MatrixBase> varBases = new ArrayList<MatrixBase>();
        List<MatrixBase> fixedBases = new ArrayList<MatrixBase>();

        for (MatrixBase base : unit.bases()) {
            if (base instanceof UnitVar unitVar && !unitVar.isGround() && !ignore.contains((Var) base)) {
                varBases.add(base);
            } else {
                fixedBases.add(base);
            }

        }

        if (varBases.isEmpty()) {
            return new Substitution();
        }

        UnitVar minVar = (UnitVar) varBases.get(0);
        for (MatrixBase var : varBases) {
            if (unit.power(var).abs().compareTo(unit.power(minVar).abs()) < 0) {
                minVar = (UnitVar) var;
            }
        }
        assert (unit.power(minVar).isInt());
        Fraction minPower = unit.power(minVar);

        if (minPower.signum() < 0) {
            Substitution tmp = new Substitution(minVar, Unit.<MatrixBase>from(minVar).reciprocal());
            return unitSimplify(tmp.apply(unit), ignore).compose(tmp);
        }

        if (varBases.size() == 1) {

            UnitVar var = (UnitVar) varBases.get(0);
            assert (unit.power(var).isInt());
            int power = unit.power(var).intValue();
            // Unit residu = Unit.ONE.multiply(unit.factor());
            Unit<MatrixBase> residu = MatrixBase.ONE;

            for (MatrixBase fixed : fixedBases) {
                assert (unit.power(fixed).isInt());
                int fixedPower = unit.power(fixed).intValue();
                residu = residu.multiply(Unit.from(fixed).raise(new Fraction(-fixedPower / power)));
            }

            return new Substitution(var, Unit.<MatrixBase>from(var).multiply(residu));
        }

        Unit<MatrixBase> rest = (Unit<MatrixBase>) MatrixBase.ONE;
        for (MatrixBase var : unit.bases()) {
            if (!var.equals(minVar)) {
                assert (unit.power(var).isInt());
                rest = rest.multiply(
                        Unit.<MatrixBase>from(var).raise(unit.power(var).div(minPower).floor().negate()));
            }
        }

        Substitution tmp = new Substitution(minVar, Unit.<MatrixBase>from(minVar).multiply(rest));
        return unitSimplify(tmp.apply(unit), ignore).compose(tmp);
    }
}
