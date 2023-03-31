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

import java.util.ArrayList;
import java.util.List;

import pacioli.Location;
import pacioli.Pacioli;
import pacioli.PacioliException;
import pacioli.Progam;
import pacioli.TypeConstraint;
import pacioli.TypeContext;
import pacioli.ast.Visitor;
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

            //PacioliType lhsType = new ParametricType(app.getName(), types);
            PacioliType lhsType = new ParametricType((TypeInfo) app.op.info, types);

            PacioliType rhsType = rhs.evalType(true);
            //PacioliType rhsType = resolvedRhs.evalType(true);
            if (lhsType instanceof ParametricType) {
                constraint = new TypeConstraint(app, rhsType);
            } else {
                throw new PacioliException(getLocation(), "Left side of typedef is not a type function: %s",
                        lhsType.pretty());
            }
        } else {
            throw new PacioliException(getLocation(), "Left side of typedef is not a type function: %s", lhs.pretty());
        }

        assert (constraint != null);
        if (!reduce) {
            throw new RuntimeException("todo: contraint when reduce is false");
        }
        return constraint;
    }

    @Override
    public String localName() {
        assert (lhs instanceof TypeApplicationNode);
        return ((TypeApplicationNode) lhs).getName();
    }

    @Override
    public void accept(Visitor visitor) {
        visitor.visit(this);
    }

    @Override
    public void addToProgr(Progam program, boolean fromProgram) throws PacioliException {
        //Pacioli.logln("Adding type %s to %s %s", this.localName(), program.getFile(), rhs);
        TypeInfo info = new TypeInfo(localName(), program.file, program.getModule(), true, getLocation(), fromProgram);
        info.typeAST = rhs;
        info.setDefinition(this);
        program.addInfo(info);
    }

}
