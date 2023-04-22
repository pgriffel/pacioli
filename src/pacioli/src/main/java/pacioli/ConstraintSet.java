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
import java.util.Optional;
import java.util.Set;

import pacioli.ast.definition.IndexSetDefinition;
import pacioli.ast.expression.ApplicationNode;
import pacioli.types.PacioliType;
import pacioli.types.TypeBase;
import pacioli.types.Unifiable;
import pacioli.types.Var;
import pacioli.types.matrix.MatrixType;
import uom.Fraction;
import uom.Unit;

/**
 * Solver for type inference constraints.
 * 
 * Based on:
 *   Bastiaan J. Heeren, Top Quality Type Error Messages, PhD Thesis,
 *   Universiteit Utrecht, The Netherlands, 2005
 */
public class ConstraintSet extends AbstractPrintable {
    
    private final List<EqualityConstraint> equalityConstaints = new ArrayList<EqualityConstraint>();
    private final List<InstanceConstraint> instanceConstaints = new ArrayList<InstanceConstraint>();
    private final List<UnitConstraint> unitConstaints = new ArrayList<UnitConstraint>();
    private final List<NModeConstraint> nModeConstaints = new ArrayList<NModeConstraint>();

    
    class EqualityConstraint implements Unifiable<PacioliType> {
        
        public final PacioliType lhs;
        public final PacioliType rhs;
        public String reason;
        
        public EqualityConstraint(PacioliType lhs, PacioliType rhs, String reason) {
            this.lhs = lhs;
            this.rhs = rhs;
            this.reason = reason;
        }

        @Override
        public Set<Var> typeVars() {
            Set<Var> vars = lhs.typeVars();
            vars.addAll(rhs.typeVars());
            return vars;
        }

        @Override
        public Unifiable<PacioliType> applySubstitution(Substitution subs) {
            return new EqualityConstraint(lhs.applySubstitution(subs), rhs.applySubstitution(subs), reason);
        }

        @Override
        public ConstraintSet unificationConstraints(Unifiable<PacioliType> other) throws PacioliException {
            throw new RuntimeException("Should this be just a type method?");
        }

        @Override
        public Substitution unify(Unifiable<PacioliType> other) throws PacioliException {
            throw new RuntimeException("Should this be just a type method?");
        }

        @Override
        public Unifiable<PacioliType> reduce() {
            throw new RuntimeException("Should this be just a type method?");
        }

        @Override
        public List<Unit<TypeBase>> simplificationParts() {
            throw new RuntimeException("Should this be just a type method?");
        }
    }
    
    class InstanceConstraint implements Unifiable<PacioliType> {
        
        public final PacioliType lhs;
        public final PacioliType rhs;
        public String reason;
        public final Set<Var> freeVars;
        
        public InstanceConstraint(PacioliType lhs, PacioliType rhs, Set<Var> freeVars, String reason) {
            this.lhs = lhs;
            this.rhs = rhs;
            this.reason = reason;
            this.freeVars = freeVars;
        }

        // Note that typeVars() is not freeVars(). TODO: use freeVars here or create
        // a new method that properly handles freeVars.
        @Override
        public Set<Var> typeVars() {
            Set<Var> vars = lhs.typeVars();
            vars.addAll(rhs.typeVars());
            vars.addAll(freeVars);
            return vars;
        }

        @Override
        public Unifiable<PacioliType> applySubstitution(Substitution subs) {
            Set<Var> newFreeVars = new HashSet<Var>();
            for (Var freeVar: freeVars) {
                PacioliType freeVarType = freeVar.applySubstitution(subs);
                for (Var var: freeVarType.typeVars()) {
                    newFreeVars.add(var);
                }
            }
            return new InstanceConstraint(
                    lhs.applySubstitution(subs), 
                    rhs.applySubstitution(subs),
                    newFreeVars,
                    reason);
        }

        @Override
        public ConstraintSet unificationConstraints(Unifiable<PacioliType> other) throws PacioliException {
            throw new RuntimeException("Should this be just a type method?");
        }

        @Override
        public Substitution unify(Unifiable<PacioliType> other) throws PacioliException {
            throw new RuntimeException("Should this be just a type method?");
        }

        @Override
        public Unifiable<PacioliType> reduce() {
            throw new RuntimeException("Should this be just a type method?");
        }

        @Override
        public List<Unit<TypeBase>> simplificationParts() {
            throw new RuntimeException("Should this be just a type method?");
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
    
    class NModeConstraint implements Unifiable<PacioliType> {
        
        public final PacioliType resultType;
        public final PacioliType tensorType;
        public final Integer dimension;
        public final PacioliType matrixType;
        public String reason;
        public final ApplicationNode node;
        
        public NModeConstraint(PacioliType resultType, PacioliType tensorType, Integer dimension,
                PacioliType matrixType, ApplicationNode node, String reason) {
            this.resultType = resultType;
            this.tensorType = tensorType;
            this.dimension = dimension;
            this.matrixType = matrixType;
            this.node = node;
            this.reason = reason;
        }

        @Override
        public Set<Var> typeVars() {
            Set<Var> vars = resultType.typeVars();
            vars.addAll(tensorType.typeVars());
            vars.addAll(matrixType.typeVars());
            return vars;
        }

        @Override
        public Unifiable<PacioliType> applySubstitution(Substitution subs) {
            return new NModeConstraint(
                    resultType.applySubstitution(subs), 
                    tensorType.applySubstitution(subs), 
                    dimension, 
                    matrixType.applySubstitution(subs),
                    node,
                    reason);
        }

        @Override
        public ConstraintSet unificationConstraints(Unifiable<PacioliType> other) throws PacioliException {
            throw new RuntimeException("Should this be just a type method?");
        }

        @Override
        public Substitution unify(Unifiable<PacioliType> other) throws PacioliException {
            throw new RuntimeException("Should this be just a type method?");
        }

        @Override
        public Unifiable<PacioliType> reduce() {
            throw new RuntimeException("Should this be just a type method?");
        }

        @Override
        public List<Unit<TypeBase>> simplificationParts() {
            throw new RuntimeException("Should this be just a type method?");
        }
    }

    
    public ConstraintSet() {
    }
    
    public void addConstraint(PacioliType lhs, PacioliType rhs, String text) {
        this.equalityConstaints.add(new EqualityConstraint(lhs, rhs, text));
    }
        
    public void addInstanceConstraint(PacioliType lhs, PacioliType rhs, Set<Var> freeVars, String reason) {
        this.instanceConstaints.add(new InstanceConstraint(lhs, rhs, freeVars, reason));
    }

    public void addUnitConstraint(Unit<TypeBase> lhs, Unit<TypeBase> rhs, String text) {
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
        for (NModeConstraint constraint: other.nModeConstaints) {
            nModeConstaints.add(constraint);
        }
    }

    public void addNModeConstraint(PacioliType resultType, PacioliType tensorType, Integer integer,
            PacioliType matrixType, ApplicationNode node, String text) {
        this.nModeConstaints.add(new NModeConstraint(resultType, tensorType, integer, matrixType, node, text));
    }
    
    @Override
    public void printPretty(PrintWriter out) {
        for (EqualityConstraint constraint: equalityConstaints) {
            out.format("  %s = %s\n", 
                    constraint.lhs.pretty(), 
                    constraint.rhs.pretty(), 
                    constraint.reason);
        }
        for (InstanceConstraint constraint: instanceConstaints) {
            out.format("  %s <: for %s: %s\n", 
                    constraint.lhs.pretty(), 
                    Utils.intercalateText(", ", new ArrayList<Var>(constraint.freeVars)),
                    constraint.rhs.pretty());
        }
        for (UnitConstraint constraint: unitConstaints) {
            out.format("  %s u= %s\n", 
                    constraint.lhs.pretty(), 
                    constraint.rhs.pretty());
        }
        for (NModeConstraint constraint: nModeConstaints) {
            out.format("  %s = nmode(%s, %s, %s)\n", 
                    constraint.resultType.pretty(), 
                    constraint.tensorType.pretty(),
                    constraint.dimension,
                    constraint.matrixType.pretty());
        }
    }

    public Substitution solve() throws PacioliException {
        return solve(false);
    }

    public Substitution solve(Boolean verbose) throws PacioliException {
        
        List<EqualityConstraint> todoEqs = new ArrayList<EqualityConstraint>(equalityConstaints);
        List<UnitConstraint> todoUnits = new ArrayList<UnitConstraint>(unitConstaints);
        List<InstanceConstraint> todoInsts = new ArrayList<InstanceConstraint>(instanceConstaints);
        List<NModeConstraint> todoNModes = new ArrayList<NModeConstraint>(nModeConstaints);
        
        Substitution mgu = new Substitution();
        
        while (!todoEqs.isEmpty() || !todoInsts.isEmpty() || !todoUnits.isEmpty() || !todoNModes.isEmpty())  {
            
            while (!todoEqs.isEmpty()) {
                
                EqualityConstraint constraint = todoEqs.get(0);
                todoEqs.remove(0);
                
                PacioliType left = mgu.apply(constraint.lhs);
                PacioliType right = mgu.apply(constraint.rhs);
                try {
                    if (verbose) {
                        Pacioli.logIf(Pacioli.Options.logTypeInferenceDetails,"\nUnifying %s and %s\n%s", left.pretty(), right.pretty(), constraint.reason);
                    }
                    Substitution subs = left.unify(right);
                    mgu = subs.compose(mgu);
                    if (verbose) {
                        Pacioli.logIf(Pacioli.Options.logTypeInferenceDetails,"Result=\n%s", subs.pretty());
                    }
                } catch (PacioliException ex) {
                    throw new PacioliException("\n%s:\n\n%s\n =\n%s \n\n%s", constraint.reason, left.unfresh().pretty(),
                            right.unfresh().pretty(), ex.getLocalizedMessage());
                }   
            }
            
            while (!todoUnits.isEmpty()) {
                
                UnitConstraint constraint = todoUnits.get(0);
                todoUnits.remove(0);
                
                try {
                    Unit<TypeBase> left = mgu.apply(constraint.lhs);
                    Unit<TypeBase> right = mgu.apply(constraint.rhs);
                    
                    if (verbose) {
                        Pacioli.logIf(Pacioli.Options.logTypeInferenceDetails,"\nUnifying units %s and %s\n%s", left.pretty(), right.pretty(), constraint.reason);
                    }
                    
                    mgu = unifyUnits(left, right).compose(mgu);
                } catch (PacioliException ex) {
                    throw new PacioliException("\n" + ex.getLocalizedMessage() + "\n\n" + constraint.reason);
                }     
            }
            

            while (!todoNModes.isEmpty()) {
                
                NModeConstraint constraint = todoNModes.get(0);
                todoNModes.remove(0);
                
                PacioliType result = mgu.apply(constraint.resultType);
                PacioliType tensor = mgu.apply(constraint.tensorType);
                Integer n = constraint.dimension;
                PacioliType matrix = mgu.apply(constraint.matrixType);
                
                try {
                    if (verbose) {
                        Pacioli.logIf(Pacioli.Options.logTypeInferenceDetails,"\nUnifying %s and nmode(%s, %s, %s)\n%s", 
                                result.pretty(), 
                                tensor.pretty(), 
                                n,
                                matrix.pretty(),
                                constraint.reason);
                    }
                    
                 // The parameters of nmode
                    MatrixType tensorType;
                    MatrixType matrixType;
                    ApplicationNode node = constraint.node;
                    
                    // Try to get the type of the tensor parameter
                    try {
                        tensorType = (MatrixType) tensor;
                    } catch (Exception ex) {
                        throw new PacioliException(node.getLocation(), 
                                "First argument of nmode must have a valid matrix type: %s",
                                ex.getMessage());
                    }
                    
                    // Try to get the type of the matrix parameter 
                    try {
                        matrixType = (MatrixType) matrix;
                    } catch (Exception ex) {
                        throw new PacioliException(node.arguments.get(2).getLocation(), 
                                "Third argument of nmode must be a valid matrix type");
                    }

                    // Determine the shape of the row dimension
                    List<Integer> shape = new ArrayList<Integer>();
                    for (int i = 0; i < tensorType.rowDimension.width(); i++) {
                        Optional<IndexSetDefinition> def = tensorType.rowDimension.nthIndexSetInfo(i).getDefinition();
                        if (def.isPresent()) {
                            shape.add(def.get().getItems().size());   
                        } else {
                            new PacioliException(node.arguments.get(0).getLocation(), 
                                    "Index set %s has no known size", i);             
                        }
                    }

                    // Remember the shape for the code generators
                    node.nmodeShape = shape;
                    
                    // Call MatrixType nmode on the found types and require that the 
                    // result equals the outcome 
                    // String message = String.format("During inference %s\nthe infered type must follow the nmode rules",
                    //         node.sourceDescription());
                    
                    if (verbose) {
                        Pacioli.logIf(Pacioli.Options.logTypeInferenceDetails,"\nUnifying %s and %s\n%s", 
                                result.pretty(), 
                                tensorType.nmode(n, matrixType).pretty(),
                                constraint.reason);
                    }
                    
                    //typing.addConstraint(tensorType.nmode(n, matrixType), resultType, message);
                    Substitution subs = result.unify(tensorType.nmode(n, matrixType));
                    //Substitution subs = result.unify(tensor);
                    
                    mgu = subs.compose(mgu);
                    if (verbose) {
                        Pacioli.logIf(Pacioli.Options.logTypeInferenceDetails,"Result=\n%s", subs.pretty());
                    }
                } catch (PacioliException ex) {
                    throw new PacioliException("\n%s:\n\n%s\n =\nnmode(%s, %s, %s) \n\n%s", constraint.reason, 
                            result.unfresh().pretty(),
                            tensor.unfresh().pretty(), 
                            n,
                            matrix.unfresh().pretty(),
                            ex.getLocalizedMessage());
                }   
            }
           
            if (0 < todoInsts.size()) {
                
                Set<Var> active = new HashSet<Var>();
                
                for (InstanceConstraint con: todoInsts) {
                    InstanceConstraint constraint = (InstanceConstraint) mgu.apply(con);
                    active.addAll(constraint.lhs.typeVars());
                    HashSet<Var> copy = new HashSet<Var>(constraint.rhs.typeVars());
                    copy.retainAll(constraint.freeVars);
                    active.addAll(copy);
                }
                
//                if (verbose) {
//                    Pacioli.logln3("\nactive vars");
//                    for (Var var: active) {
//                        Pacioli.log3(", %s", var.pretty());
//                    }
//                }
              
                Integer chosenConstraint = null;
                InstanceConstraint constraint = null;
                
                int i = 0;
                while (i < todoInsts.size() && chosenConstraint == null) {

                    constraint = (InstanceConstraint) mgu.apply(todoInsts.get(i));

//                    if (verbose) {
//                           Pacioli.logln3("constraint (k=%s, todoIns=%s) %s <: %s", 
//                                   i,
//                                   todoInsts.size(),
//                                   constraint.lhs.pretty(),
//                            constraint.rhs.pretty());                    
//                            Pacioli.logln3("right vars");
//                    }
                    Set<Var> leftVars = constraint.rhs.typeVars(); 
                    Boolean appli = true;
                    for (Var var:leftVars) {
                        Boolean constrainApp = constraint.freeVars.contains(var) ||!active.contains(var);
//                        if (verbose) {
//                        Pacioli.log3(", %s, infree=%s, inactive=%s, applic=%s", var.pretty(),
//                                constraint.freeVars.contains(var),
//                                active.contains(var),
//                                constrainApp);
//                        }
                        appli = appli && constrainApp; 
                    }
                    
                    if (appli) {
                        chosenConstraint = i;
                    }

//                    if (verbose) {
//                        Pacioli.logln3("Free vars");
//                        for (Var var: constraint.freeVars) {
//                            Pacioli.log3(", %s", var.pretty());
//                            
//                        }
//                    }
                                        
                    i++;
                }
                assert(chosenConstraint instanceof Integer);
                assert(constraint instanceof InstanceConstraint);
                                  
                todoInsts.remove((int) chosenConstraint);
                
                if (verbose) {
                    Pacioli.logIf(Pacioli.Options.logTypeInferenceDetails,"\nInstance unifying %s and %s\n%s", constraint.lhs.pretty(), constraint.rhs.pretty(), constraint.reason);
                }
                
                PacioliType left = constraint.lhs;
                PacioliType right = constraint.rhs.generalize(constraint.freeVars).instantiate();

//                if (verbose) {
//                    Pacioli.logln3("\nUnifying generalized: %s and %s\n%s", left.pretty(), right.pretty(), constraint.reason);
//                }
                
                try {
                    Substitution subs = left.unify(right);
                    mgu = subs.compose(mgu);
                    if (verbose) {
                        Pacioli.logIf(Pacioli.Options.logTypeInferenceDetails,"Result=\n%s", subs.pretty());
                    }
                } catch (PacioliException ex) {
                    throw new PacioliException("\n%s:\n\n%s\n =\n%s \n\n%s", constraint.reason, left.unfresh().pretty(),
                            right.unfresh().pretty(), ex.getLocalizedMessage());
                }
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
