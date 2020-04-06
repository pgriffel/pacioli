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
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

import pacioli.types.PacioliType;
import pacioli.types.TypeBase;
import pacioli.types.TypeVar;
import pacioli.types.Var;
import pacioli.types.visitors.UsesVars;
import uom.Fraction;
import uom.Unit;

public class ConstraintSet extends AbstractPrintable {

    private final List<PacioliType> lhss;
    private final List<PacioliType> rhss;
    private final List<String> reason;
    private final List<Unit<TypeBase>> ulhss;
    private final List<Unit<TypeBase>> urhss;
    private final List<String> ureason;
    
    private final List<EqualityConstraint> equalityConstaints = new ArrayList<EqualityConstraint>();
    private final List<InstanceConstraint> instanceConstaints = new ArrayList<InstanceConstraint>();
    private final List<UnitConstraint> unitConstaints = new ArrayList<UnitConstraint>();
    
    
    class EqualityConstraint {
        
        public final PacioliType lhs;
        public final PacioliType rhs;
        public String reason;
        
        public EqualityConstraint(PacioliType lhs, PacioliType rhs, String reason) {
            this.lhs = lhs;
            this.rhs = rhs;
            this.reason = reason;
        }
    }
    
    class InstanceConstraint{
        
        public final PacioliType lhs;
        public final PacioliType rhs;
        public String reason;
        public final List<TypeVar> freeVars;
        
        public InstanceConstraint(PacioliType lhs, PacioliType rhs, List<TypeVar> freeVars, String reason) {
            this.lhs = lhs;
            this.rhs = rhs;
            this.reason = reason;
            this.freeVars = freeVars;
        }
    }
    
    class UnitConstraint {
        
        public final Unit<TypeBase> lhs;
        public final Unit<TypeBase> rhs;
        public String reason;
        
        public UnitConstraint(Unit<TypeBase> lhs, Unit<TypeBase> rhs, String reason) {
            this.lhs = lhs;
            this.rhs = rhs;
            this.reason = reason;
        }
    }
    
    
    public ConstraintSet() {
        lhss = new ArrayList<PacioliType>();
        rhss = new ArrayList<PacioliType>();
        reason = new ArrayList<String>();
        ulhss = new ArrayList<Unit<TypeBase>>();
        urhss = new ArrayList<Unit<TypeBase>>();
        ureason = new ArrayList<String>();
    }

    
    public void addConstraint(PacioliType lhs, PacioliType rhs, String text) {
        assert (lhs != null);
        assert (rhs != null);
        lhss.add(lhs);
        rhss.add(rhs);
        reason.add(text);
        this.equalityConstaints.add(new EqualityConstraint(lhs, rhs, text));
    }
        
    public void addInstanceConstraint(PacioliType lhs, PacioliType rhs, List<TypeVar> freeVars, String reason) {
        this.instanceConstaints.add(new InstanceConstraint(lhs, rhs, freeVars, reason));
    }

    public void addUnitConstraint(Unit<TypeBase> lhs, Unit<TypeBase> rhs, String text) {
        ulhss.add(lhs);
        urhss.add(rhs);
        ureason.add(text);
        this.unitConstaints.add(new UnitConstraint(lhs, rhs, text));
    }

    public void addConstraints(ConstraintSet other) {
        for (EqualityConstraint constraint: other.equalityConstaints) {
            equalityConstaints.add(constraint);
        }
        for (InstanceConstraint constraint: other.instanceConstaints) {
            instanceConstaints.add(constraint);
        }
        for (UnitConstraint constraint: other.unitConstaints) {
            unitConstaints.add(constraint);
        }
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

    @Override
    public void printPretty(PrintWriter out) {
//        for (int i = 0; i < lhss.size(); i++) {
//            out.format("  %s = %s\n", lhss.get(i).pretty(), rhss.get(i).pretty());
//        }
        for (int i = 0; i < ulhss.size(); i++) {
            out.format("  %s u= %s\n", ulhss.get(i).pretty(), urhss.get(i).pretty());
        }
        for (EqualityConstraint constraint: equalityConstaints) {
            out.format("  %s = %s\n", constraint.lhs.pretty(), constraint.rhs.pretty(), constraint.reason);
            //out.format("  %s = %s %s\n", constraint.lhs.pretty(), constraint.rhs.pretty(), constraint.reason);
        }
        for (InstanceConstraint constraint: instanceConstaints) {
            out.format("  %s <: for %s: %s\n", constraint.lhs.pretty(), 
                    Utils.intercalateText(", ", constraint.freeVars),
                    constraint.rhs.pretty());
        }
        for (UnitConstraint constraint: unitConstaints) {
            out.format("  %s u= %s\n", constraint.lhs.pretty(), constraint.rhs.pretty());
        }
    }
    
    Set<Var> activeVars() {
        Set<Var> vars = new HashSet<Var>();
        for (EqualityConstraint constraint: equalityConstaints) {
            vars.addAll(constraint.lhs.typeVars());
            vars.addAll(constraint.rhs.typeVars());
        }
        for (InstanceConstraint constraint: instanceConstaints) {
            vars.addAll(constraint.lhs.typeVars());
            vars.addAll(constraint.rhs.typeVars());
            vars.removeAll(constraint.freeVars); // correct? could be done on rhs vars only.
        }
        for (UnitConstraint constraint: unitConstaints) {
            vars.addAll(UsesVars.unitVars(constraint.lhs));
            vars.addAll(UsesVars.unitVars(constraint.rhs));
        }
        return vars;
    }

    public Substitution solveNO() throws PacioliException {
        return solve(false);
    }
    
    public Substitution solve(Boolean verbose) throws PacioliException {
        Substitution mgu = new Substitution();
        for (int i = 0; i < lhss.size(); i++) {
            PacioliType left = mgu.apply(lhss.get(i));
            PacioliType right = mgu.apply(rhss.get(i));
            try {
                if (verbose) {
                    Pacioli.logln3("Unifying %s and %s\n%s", left.pretty(), right.pretty(), reason.get(i));
                }
                mgu = left.unify(right).compose(mgu);
            } catch (PacioliException ex) {
                throw new PacioliException("\n%s:\n\n%s\n =\n%s \n\n%s", reason.get(i), left.unfresh().pretty(),
                        right.unfresh().pretty(), ex.getLocalizedMessage());
            }
        }
        for (int i = 0; i < ulhss.size(); i++) {
            try {
                Unit<TypeBase> left = mgu.apply(ulhss.get(i));
                Unit<TypeBase> right = mgu.apply(urhss.get(i));
                mgu = unifyUnits(left, right).compose(mgu);
            } catch (PacioliException ex) {
                throw new PacioliException("\n" + ex.getLocalizedMessage() + "\n\n" + ureason.get(i));
            }

        }
        return mgu;
    }

    private Substitution unifyUnits(Unit<TypeBase> x, Unit<TypeBase> y) throws PacioliException {
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

    private Substitution unitUnify(Unit<TypeBase> unit) throws PacioliException {

        List<TypeBase> varBases = new ArrayList<TypeBase>();
        List<TypeBase> fixedBases = new ArrayList<TypeBase>();

        for (TypeBase base : unit.bases()) {
            if (base instanceof Var) {
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

            Var var = (Var) varBases.get(0);
            assert (unit.power(var).isInt());
            int power = unit.power(var).intValue();
            Unit<TypeBase> residu = TypeBase.ONE;

            for (TypeBase fixed : fixedBases) {
                assert (unit.power(fixed).isInt());
                int fixedPower = unit.power(fixed).intValue();
                if (fixedPower % power != 0) {
                    throw new PacioliException("Cannot unify unit 2 %s", unit.pretty());
                }
                residu = residu.multiply(fixed.raise(new Fraction(-fixedPower / power)));
            }

            return new Substitution(var, residu);
        }

        Var minVar = (Var) varBases.get(0);
        for (TypeBase var : varBases) {
            if (unit.power(var).abs().compareTo(unit.power(minVar).abs()) < 0) {
                minVar = (Var) var;
            }
        }

        assert (unit.power(minVar).isInt());
        Fraction minPower = unit.power(minVar);
        Unit<TypeBase> rest = TypeBase.ONE;
        for (TypeBase var : unit.bases()) {
            if (!var.equals(minVar)) {
                assert (unit.power(var).isInt());
                rest = rest.multiply(var.raise(unit.power(var).div(minPower).floor().negate()));
            }
        }

        Substitution tmp = new Substitution(minVar, minVar.multiply(rest));
        return unitUnify(tmp.apply(unit)).compose(tmp);
    }
}
