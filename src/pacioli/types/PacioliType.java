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

import pacioli.CompilationSettings;
import pacioli.ConstraintSet;
import pacioli.Pacioli;
import pacioli.PacioliException;
import pacioli.Printable;
import pacioli.Substitution;
import pacioli.types.ast.TypeNode;
import pacioli.types.visitors.Devaluator;
import pacioli.types.visitors.UsesVars;
import uom.Fraction;
import uom.Unit;

/**
 * A PacioliType is the semantic counterpart of a TypeNode.
 * 
 * Type equality, unification, etc. is defined on PacioliTypes and not on TypeNodes.
 * 
 * Use eval and deval to switch between the two type representations.
 *
 */
public interface PacioliType extends Printable {

    public String description();
    
    public void accept(TypeVisitor visitor);

    public default Set<Var> typeVars() {
        return new UsesVars().varSetAccept(this);
    };

    public PacioliType applySubstitution(Substitution subs);

    public ConstraintSet unificationConstraints(PacioliType other) throws PacioliException;

    public Substitution unify(PacioliType other) throws PacioliException;

    public PacioliType reduce();

    public List<Unit<TypeBase>> simplificationParts();

    //public PacioliType simplify();
    
    public default PacioliType simplify() {
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
        PacioliType result = applySubstitution(mgu);
        return result;
    }

    public boolean isInstanceOf(PacioliType other);

    //public PacioliType instantiate();
    
    public default PacioliType instantiate() {
        // throw new RuntimeException("Can only instantiate a schema");
        return this;
    }

    //public Schema generalize();
    
    public default Schema generalize() {
        PacioliType unfresh = unfresh();
        //PacioliType unfresh = this;
        return new Schema(unfresh.typeVars(), unfresh);
    }


    public PacioliType fresh();
    
    public default PacioliType unfresh() {

        // Replace all type variables by type variables named a, b, c, d, ...
        Substitution map = new Substitution();
        int character = 97; // character a
        for (Var var : typeVars()) {
            //TypeVar var = (TypeVar) gvar; //fixme 
            if (var instanceof VectorUnitVar) {
                char ch = (char) character++;
                map = map.compose(new Substitution(var, var.rename(String.format("%s!%s", ch, ch))));
            } else {
                map = map.compose(new Substitution(var, var.rename(String.format("%s", (char) character++))));
            }
        }
        PacioliType unfreshType = applySubstitution(map);

        // Replace all unit vector variables by its name prefixed by the index set name.
        map = new Substitution();
        for (String name : unfreshType.unitVecVarCompoundNames()) {
            //Pacioli.logln("mapping %s (%s)", name, pretty());
            //Pacioli.logln("unfresh %s", unfreshType.pretty());
            String[] parts = name.split("!");
            // FIXME
            // The assert fails for a type schema, because the variables are not refreshed
            // and might
            // already contain !
            // assert(parts.length == 2);
            if (parts.length == 2) {
                Var var1 = new VectorUnitVar(parts[1] + "!" + parts[1]);
                Var var2 = new VectorUnitVar(name);
                //Pacioli.logln("mapping %s to %s", var1, var2);
                map = map.compose(new Substitution(var1, var2));
            }
        }
        return unfreshType.applySubstitution(map);

    }
    
    //public TypeNode deval();

    public default TypeNode deval() {
        return new Devaluator().typeNodeAccept(this);
    }

    public String compileToJS();
    
    public default String compileToMVM(CompilationSettings settings) {
        return deval().compileToMVM(new CompilationSettings());                
    }
    
    
    // Hack to print proper compound unit vector in schema's
    public Set<String> unitVecVarCompoundNames();

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
