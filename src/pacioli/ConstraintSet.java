/*
 * Copyright (c) 2013 Paul Griffioen
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
import java.util.ArrayList;
import java.util.List;
import pacioli.types.PacioliType;
import pacioli.types.TypeVar;
import uom.Base;
import uom.Fraction;
import uom.Unit;

public class ConstraintSet extends AbstractPrintable {

    private final List<PacioliType> lhss;
    private final List<PacioliType> rhss;
    private final List<String> reason;
    private final List<Unit> ulhss;
    private final List<Unit> urhss;
    private final List<String> ureason;

    public ConstraintSet() {
        lhss = new ArrayList<PacioliType>();
        rhss = new ArrayList<PacioliType>();
        reason = new ArrayList<String>();
        ulhss = new ArrayList<Unit>();
        urhss = new ArrayList<Unit>();
        ureason = new ArrayList<String>();
    }

    public void addConstraint(PacioliType lhs, PacioliType rhs, String text) {
        lhss.add(lhs);
        rhss.add(rhs);
        reason.add(text);
    }

    public void addConstraints(ConstraintSet other) {
        for (int i = 0; i < other.lhss.size(); i++) {
            lhss.add(other.lhss.get(i));
            rhss.add(other.rhss.get(i));
            reason.add(other.reason.get(i));
        }
        for (int i = 0; i < other.ulhss.size(); i++) {
            ulhss.add(other.ulhss.get(i));
            urhss.add(other.urhss.get(i));
            ureason.add(other.ureason.get(i));
        }
    }

    public void addUnitConstraint(Unit lhs, Unit rhs, String text) {
        ulhss.add(lhs);
        urhss.add(rhs);
        ureason.add(text);
    }

    @Override
    public void printText(PrintWriter out) {
        for (int i = 0; i < lhss.size(); i++) {
            out.format("  %s = %s\n", lhss.get(i).toText(), rhss.get(i).toText());
        }
        for (int i = 0; i < ulhss.size(); i++) {
            out.format("  %s u= %s\n", ulhss.get(i).toText(), urhss.get(i).toText());
        }
    }

    public Substitution solve() throws PacioliException {
        Substitution mgu = new Substitution();
        for (int i = 0; i < lhss.size(); i++) {
            PacioliType left = mgu.apply(lhss.get(i));
            PacioliType right = mgu.apply(rhss.get(i));
            try {
                mgu = left.unify(right).compose(mgu);
            } catch (PacioliException ex) {
                throw new PacioliException("\n%s:\n\n%s\n =\n%s \n\n%s",
                        reason.get(i), left.unfresh().toText(), right.unfresh().toText(), ex.getLocalizedMessage());
            }
        }
        for (int i = 0; i < ulhss.size(); i++) {
            try {
                Unit left = mgu.apply(ulhss.get(i));
                Unit right = mgu.apply(urhss.get(i));
                mgu = unifyUnits(left, right).compose(mgu);
            } catch (PacioliException ex) {
                throw new PacioliException("\n" + ex.getLocalizedMessage() + "\n\n" + ureason.get(i));
            }

        }
        return mgu;
    }

    private Substitution unifyUnits(Unit x, Unit y) throws PacioliException {
        try {
            if (x.equals(y)) {
                return new Substitution();
            } else {
                // hier met de factor(s) multiplyen?
                return unitUnify(x.multiply(y.reciprocal()));
            }
        } catch (PacioliException ex) {
            throw new PacioliException("Cannot unify units %s and %s", x.toText(), y.toText());
        }
    }

    private Substitution unitUnify(Unit unit) throws PacioliException {

        List<Base> varBases = new ArrayList<Base>();
        List<Base> fixedBases = new ArrayList<Base>();

        for (Base base : unit.bases()) {
            if (base instanceof TypeVar && ((TypeVar) base).active) {
                varBases.add(base);
            } else {
                fixedBases.add(base);
            }

        }

        if (varBases.isEmpty()) {
            if (fixedBases.isEmpty()) {
                return new Substitution();
            } else {
                throw new PacioliException("Cannot unify unit 1 %s", unit.toText());
            }
        }

        if (varBases.size() == 1) {

            TypeVar var = (TypeVar) varBases.get(0);
            assert (unit.power(var).isInt());
            int power = unit.power(var).intValue();
            Unit residu = Unit.ONE;

            for (Base fixed : fixedBases) {
                assert (unit.power(fixed).isInt());
                int fixedPower = unit.power(fixed).intValue();
                if (fixedPower % power != 0) {
                    throw new PacioliException("Cannot unify unit 2 %s", unit.toText());
                }
                residu = residu.multiply(fixed.raise(new Fraction(-fixedPower / power)));
            }

            return new Substitution(var, residu);
        }

        TypeVar minVar = (TypeVar) varBases.get(0);
        for (Base var : varBases) {
            if (unit.power(var).abs().compareTo(unit.power(minVar).abs()) < 0) {
                minVar = (TypeVar) var;
            }
        }

        assert (unit.power(minVar).isInt());
        Fraction minPower = unit.power(minVar);
        Unit rest = Unit.ONE;
        for (Base var : unit.bases()) {
            if (!var.equals(minVar)) {
                assert (unit.power(var).isInt());
                rest = rest.multiply(var.raise(unit.power(var).div(minPower).floor().negate()));
            }
        }

        Substitution tmp = new Substitution(minVar, minVar.multiply(rest));
        return unitUnify(tmp.apply(unit)).compose(tmp);
    }
}
