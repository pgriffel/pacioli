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

import java.util.List;
import java.util.Set;

import pacioli.CompilationSettings;
import pacioli.ConstraintSet;
import pacioli.PacioliException;
import pacioli.Printable;
import pacioli.Substitution;
import pacioli.types.ast.TypeNode;
import pacioli.types.visitors.Devaluator;
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

    public Set<Var> typeVars();

    public PacioliType applySubstitution(Substitution subs);

    public ConstraintSet unificationConstraints(PacioliType other) throws PacioliException;

    public Substitution unify(PacioliType other) throws PacioliException;

    public PacioliType reduce();

    public List<Unit<TypeBase>> simplificationParts();

    public PacioliType simplify();

    public boolean isInstanceOf(PacioliType other);

    public PacioliType instantiate();

    public Schema generalize();

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

}
