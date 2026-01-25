/*
 * Copyright 2026 Paul Griffioen
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

package pacioli.ast.expression;

import mvm.values.matrix.MatrixDimension;
import pacioli.ast.AbstractNode;
import pacioli.ast.Node;
import pacioli.ast.Visitor;
import pacioli.compiler.Location;
import pacioli.compiler.PacioliException;
import pacioli.types.ast.TypeNode;
import pacioli.types.matrix.MatrixType;
import pacioli.types.type.TypeObject;

public class ConversionNode extends AbstractNode implements ExpressionNode {

    // Set during contruction
    public final TypeNode typeNode;

    // Set during resolve. Needed to determine indices during code generation.
    public MatrixDimension rowDim;
    public MatrixDimension columnDim;

    // Is this used?
    private MatrixTypeNode bang;
    public TypeObject type;

    public ConversionNode(Location location, TypeNode typeNode) {
        super(location);
        this.typeNode = typeNode;
    }

    public ConversionNode(ConversionNode old) {
        super(old.location());
        this.typeNode = old.typeNode;
    }

    private ConversionNode(Location location, TypeNode typeNode, MatrixTypeNode bang, TypeObject type) {
        super(location);
        this.typeNode = typeNode;
        this.bang = bang;
        this.type = type;
    }

    public Node transform(TypeNode typeNode) {
        ConversionNode copy = new ConversionNode(location(), typeNode, bang, type);
        copy.rowDim = rowDim;
        copy.columnDim = columnDim;
        return copy;
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
