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

package pacioli.ast.definition;

import java.io.PrintWriter;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

import pacioli.CompilationSettings;
import pacioli.Dictionary;
import pacioli.Location;
import pacioli.PacioliFile;
import pacioli.PacioliException;
import pacioli.Program;
import pacioli.TypeConstraint;
import pacioli.TypeContext;
import pacioli.types.PacioliType;
import pacioli.types.ParametricType;
import pacioli.types.TypeVar;
import pacioli.types.ast.TypeApplicationNode;
import pacioli.types.ast.TypeIdentifierNode;
import pacioli.types.ast.TypeNode;

public class TypeDefinition extends AbstractDefinition {

    private final TypeContext context;
    private final TypeNode lhs;
    private final TypeNode rhs;
	private TypeApplicationNode resolvedLhs;
    private TypeNode resolvedRhs;
    private TypeConstraint constraint;

    public TypeDefinition(Location location, TypeContext context, TypeNode lhs, TypeNode rhs) {
        super(location);
        this.context = context;
        this.lhs = lhs;
        this.rhs = rhs;
    }

    public TypeConstraint constaint(boolean reduce) throws PacioliException {

        TypeContext totalContext = new TypeContext();
        totalContext.addAll(this.context);

        if (lhs instanceof TypeApplicationNode) {
            TypeApplicationNode app = resolvedLhs;

            List<PacioliType> types = new ArrayList<PacioliType>();
            for (TypeNode arg : app.getArgs()) {
                types.add(arg.eval(false));
            }

            PacioliType lhsType = new ParametricType(app.getName(), types);

            PacioliType rhsType = resolvedRhs.eval(true);
            if (lhsType instanceof ParametricType) {
                ParametricType parametricLhs = (ParametricType) lhsType;
                constraint = new TypeConstraint(parametricLhs, rhsType);
            } else {
                throw new PacioliException(getLocation(), "Left side of typedef is not a type function: %s", lhsType.toText());
            }
        } else {
            throw new PacioliException(getLocation(), "Left side of typedef is not a type function: %s", lhs.toText());
        }
        
        assert (constraint != null);
        if (!reduce) {
            throw new RuntimeException("todo: contraint when reduce is false");
        }
        return constraint;
    }

	@Override
	public void addToProgram(Program program, PacioliFile module) {
		setModule(module);
		program.addTypeDefinition(this, module);
	}
	
    @Override
    public void printText(PrintWriter out) {
        throw new UnsupportedOperationException("Not supported yet."); //To change body of generated methods, choose Tools | Templates.
    }

    @Override
    public String localName() {
        assert (lhs instanceof TypeApplicationNode);
        return ((TypeApplicationNode) lhs).getName();
    }

    @Override
    public void resolve(Dictionary dictionary) throws PacioliException {
    	resolvedRhs = rhs.resolved(dictionary, this.context);
    	if (lhs instanceof TypeApplicationNode) {
    		TypeApplicationNode app = (TypeApplicationNode) lhs;
    		List<TypeNode> types = new ArrayList<TypeNode>();
    		for (TypeNode arg : app.getArgs()) {
    			types.add(arg.resolved(dictionary, this.context));
    		}
    		resolvedLhs = new TypeApplicationNode(getLocation(), app.getOperator(), types);
    	} else {
            throw new PacioliException(getLocation(), "Left side of typedef is not a type function: %s", lhs.toText());
        }
    }

    @Override
    public Set<Definition> uses() {
        return resolvedRhs.uses();
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
