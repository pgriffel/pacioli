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

package pacioli.ast.definition;

import java.io.PrintWriter;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;
import pacioli.CompilationSettings;
import pacioli.Dictionary;
import pacioli.Location;
import pacioli.Module;
import pacioli.PacioliException;
import pacioli.TypeConstraint;
import pacioli.TypeContext;
import pacioli.types.PacioliType;
import pacioli.types.ParametricType;
import pacioli.types.ast.TypeApplicationNode;
import pacioli.types.ast.TypeNode;

public class TypeDefinition extends AbstractDefinition {

    private final TypeContext context;
    private final TypeNode lhs;
    private final TypeNode rhs;
    private TypeConstraint constraint;

    public TypeDefinition(Module module, Location location, TypeContext context, TypeNode lhs, TypeNode rhs) {
        super(module, location);
        this.context = context;
        this.lhs = lhs;
        this.rhs = rhs;
        constraint = null;
    }

    public TypeConstraint constaint(boolean reduce) throws PacioliException {
        assert (constraint != null);
        if (!reduce) {
            throw new RuntimeException("todo: contraint when reduce is false");
        }
        return constraint;
    }

    @Override
    public void printText(PrintWriter out) {
        throw new UnsupportedOperationException("Not supported yet."); //To change body of generated methods, choose Tools | Templates.
    }

    @Override
    public String localName() {
        assert (lhs instanceof TypeApplicationNode);
        return ((TypeApplicationNode) lhs).name;
    }

    @Override
    public void updateDictionary(Dictionary dictionary, boolean reduce) throws PacioliException {

        TypeContext totalContext = new TypeContext();
        //totalContext.addAll(context);
        totalContext.addAll(this.context);

        if (lhs instanceof TypeApplicationNode) {
            TypeApplicationNode app = (TypeApplicationNode) lhs;

            if (dictionary.containsTypeDefinition(app.name) || dictionary.containsKnownType(app.name)) {
                throw new PacioliException(getLocation(), "Type '%s' already defined", app.name);
            }

            List<PacioliType> types = new ArrayList<PacioliType>();
            for (TypeNode arg : app.args) {
                types.add(arg.eval(dictionary, totalContext, reduce));
            }

            PacioliType lhsType = new ParametricType(app.name, types);

            //PacioliType lhsType = lhs.eval(dictionary, totalContext, reduce);


            PacioliType rhsType = rhs.eval(dictionary, totalContext, reduce);
            if (lhsType instanceof ParametricType) {
                ParametricType parametricLhs = (ParametricType) lhsType;
                constraint = new TypeConstraint(parametricLhs, rhsType);
            } else {
                throw new PacioliException(getLocation(), "Left side of typedef is not a type function: %s", lhsType.toText());
            }
        } else {
            throw new PacioliException(getLocation(), "Left side of typedef is not a type function: %s", lhs.toText());
        }
        dictionary.addTypeDefinition(this);
    }

    @Override
    public void resolveNames(Dictionary dictionary, Map<String, Module> globals, Set<String> context, Set<String> mutableContext) throws PacioliException {
    }

    @Override
    public Set<Definition> uses() {
        return new HashSet<Definition>();
    }

    @Override
    public String compileToMVM(CompilationSettings settings) {
        throw new UnsupportedOperationException("Not supported yet."); //To change body of generated methods, choose Tools | Templates.
    }

    @Override
    public String compileToJS() {
        throw new UnsupportedOperationException("Not supported yet."); //To change body of generated methods, choose Tools | Templates.
    }

    @Override
    public String compileToMATLAB() {
        throw new UnsupportedOperationException("Not supported yet."); //To change body of generated methods, choose Tools | Templates.
    }
}
