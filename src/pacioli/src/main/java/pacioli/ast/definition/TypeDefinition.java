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

import pacioli.ast.Visitor;
import pacioli.compiler.Location;
import pacioli.compiler.PacioliException;
import pacioli.symboltable.info.ParametricInfo;
import pacioli.types.TypeContext;
import pacioli.types.ast.BangTypeNode;
import pacioli.types.ast.QuantNode;
import pacioli.types.ast.TypeApplicationNode;
import pacioli.types.ast.TypeConstraint;
import pacioli.types.ast.TypeIdentifierNode;
import pacioli.types.ast.TypeNode;
import pacioli.types.type.OperatorConst;
import pacioli.types.type.ParametricType;
import pacioli.types.type.TypeIdentifier;
import pacioli.types.type.TypeObject;

public class TypeDefinition extends AbstractDefinition {

    public final List<QuantNode> quantNodes;
    public final TypeNode lhs;
    public final TypeNode rhs;

    public TypeDefinition(Location location, List<QuantNode> quantNodes, TypeNode lhs, TypeNode rhs) {
        super(location);
        this.quantNodes = quantNodes;
        this.lhs = lhs;
        this.rhs = rhs;
    }

    @Override
    public String name() {
        if (lhs instanceof TypeApplicationNode node) {
            return node.name();
        } else {
            throw new RuntimeException("Expected a TypeApplicationNode");
        }
    }

    @Override
    public void accept(Visitor visitor) {
        visitor.visit(this);
    }

    public TypeContext createContext() {
        return TypeContext.fromQuantNodes(quantNodes);
    }

    public TypeConstraint constaint() throws PacioliException {

        TypeConstraint constraint;

        TypeContext totalContext = new TypeContext();
        totalContext.addAll(this.createContext());

        if (lhs instanceof TypeApplicationNode app) {

            List<TypeObject> types = new ArrayList<TypeObject>();
            for (TypeNode arg : app.arguments()) {
                if (arg instanceof TypeIdentifierNode) {
                    types.add(arg.evalType());
                } else if (arg instanceof BangTypeNode) {
                    types.add(arg.evalType());
                } else {
                    throw new PacioliException(arg.location(),
                            "Type definition's lhs must be a unit variable or vector %s", arg.getClass());
                }
            }

            TypeObject lhsType = new ParametricType(app.location(),
                    new OperatorConst(new TypeIdentifier(app.op.info.generalInfo().module(), app.op.name()),
                            (ParametricInfo) app.op.info),
                    types);

            TypeObject rhsType = rhs.evalType();
            if (lhsType instanceof ParametricType) {
                constraint = new TypeConstraint(app, rhsType);
            } else {
                throw new PacioliException(location(), "Left side of typedef is not a type function: %s",
                        lhsType.pretty());
            }
        } else {
            throw new PacioliException(location(), "Left side of typedef is not a type function: %s", lhs.pretty());
        }

        assert (constraint != null);

        return constraint;
    }
}
