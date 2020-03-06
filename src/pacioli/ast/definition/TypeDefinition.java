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
import java.util.List;

import pacioli.Location;
import pacioli.PacioliException;
import pacioli.Progam;
import pacioli.TypeConstraint;
import pacioli.TypeContext;
import pacioli.ast.Visitor;
import pacioli.symboltable.GenericInfo;
import pacioli.symboltable.TypeInfo;
import pacioli.types.PacioliType;
import pacioli.types.ParametricType;
import pacioli.types.ast.BangTypeNode;
import pacioli.types.ast.TypeApplicationNode;
import pacioli.types.ast.TypeIdentifierNode;
import pacioli.types.ast.TypeNode;

public class TypeDefinition extends AbstractDefinition {

    public final TypeContext context;
    public final TypeNode lhs;
    public final TypeNode rhs;
    //private TypeApplicationNode resolvedLhs;
    //private TypeNode resolvedRhs;
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
            //TypeApplicationNode app = resolvedLhs;
            TypeApplicationNode app = (TypeApplicationNode) lhs;

            List<PacioliType> types = new ArrayList<PacioliType>();
            for (TypeNode arg : app.getArgs()) {
                if (arg instanceof TypeIdentifierNode) {
                    types.add(arg.evalType(reduce));
                } else if (arg instanceof BangTypeNode) {
                    types.add(arg.evalType(reduce));
                } else {
                    throw new PacioliException(arg.getLocation(),
                            "Type definition's lhs must be a unit variable or vector %s", arg.getClass());
                }
            }

            PacioliType lhsType = new ParametricType(app.getName(), types);

            PacioliType rhsType = rhs.evalType(true);
            //PacioliType rhsType = resolvedRhs.evalType(true);
            if (lhsType instanceof ParametricType) {
                constraint = new TypeConstraint(app, rhsType);
            } else {
                throw new PacioliException(getLocation(), "Left side of typedef is not a type function: %s",
                        lhsType.toText());
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
    public void printText(PrintWriter out) {
        out.print("todo: print type definition;\n");
    }

    @Override
    public String localName() {
        assert (lhs instanceof TypeApplicationNode);
        return ((TypeApplicationNode) lhs).getName();
    }

    @Override
    public String compileToMATLAB() {
        throw new UnsupportedOperationException("Not supported yet."); // To change body of generated methods, choose
                                                                       // Tools | Templates.
    }

    @Override
    public void accept(Visitor visitor) {
        visitor.visit(this);
    }

    @Override
    public void addToProgr(Progam program, GenericInfo.Scope scope) throws PacioliException {
        GenericInfo generic = new GenericInfo(localName(), program.program.module.name, 
                program.file, scope, getLocation());       
        TypeInfo info = new TypeInfo(generic);
        info.typeAST = rhs;
        info.definition = this;
        program.addInfo(info);
    }

}
