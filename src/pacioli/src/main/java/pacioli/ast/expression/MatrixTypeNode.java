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

package pacioli.ast.expression;

import mvm.values.matrix.MatrixDimension;
import pacioli.ast.Visitor;
import pacioli.compiler.Location;
import pacioli.compiler.PacioliException;
import pacioli.types.ast.TypeNode;
import pacioli.types.matrix.MatrixType;
import pacioli.types.type.TypeObject;

public class MatrixTypeNode extends AbstractExpressionNode {

    public final TypeNode typeNode;

    public MatrixDimension rowDim;
    public MatrixDimension columnDim;

    public MatrixTypeNode(Location location, TypeNode typeNode) {
        super(location);
        assert (typeNode != null);
        this.typeNode = typeNode;
        this.rowDim = null;
        this.columnDim = null;
    }

    public MatrixType evalType() throws PacioliException {
        TypeObject type = typeNode.evalType();
        if (type instanceof MatrixType) {
            return (MatrixType) type;
        } else {
            throw new PacioliException(typeNode.location(), "Expected a matrix type");
        }
    }

    @Override
    public void accept(Visitor visitor) {
        visitor.visit(this);
    }
}
