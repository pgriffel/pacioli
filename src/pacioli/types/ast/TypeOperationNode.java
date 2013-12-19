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

package pacioli.types.ast;

import java.io.PrintWriter;
import pacioli.Dictionary;
import pacioli.Location;
import pacioli.PacioliException;
import pacioli.TypeContext;
import pacioli.types.PacioliType;
import pacioli.types.matrix.MatrixType;
import pacioli.types.matrix.StringBase;

public class TypeOperationNode extends AbstractTypeNode {

    private final String operation;
    private final TypeNode left;
    private final TypeNode right;

    public TypeOperationNode(Location location, String operation, TypeNode left, TypeNode right) {
        super(location);
        this.operation = operation;
        this.left = left;
        this.right = right;
    }

    @Override
    public void printText(PrintWriter out) {
        out.format("%s%s%s", left, operation, right);
    }

    @Override
    public PacioliType eval(Dictionary dictionary, TypeContext context, boolean reduce) throws PacioliException {

        PacioliType leftType = left.eval(dictionary, context, reduce);
        PacioliType rightType = right.eval(dictionary, context, reduce);

        if (!(leftType instanceof MatrixType)) {
            throw new PacioliException(getLocation(), "Matrix type left operand is not a matrix but a %s", leftType.description());
        }
        
        if (!(rightType instanceof MatrixType)) {
            throw new PacioliException(getLocation(), "Matrix type right operand is not a matrix but a %s", rightType.description());
        }
        
        MatrixType matrixLeft = (MatrixType) leftType;
        MatrixType matrixRight = (MatrixType) rightType;

        if (operation.equals("multiply")) {
            if (matrixLeft.singleton()) {
                return matrixLeft.scale(matrixRight);
            } else if (matrixRight.singleton()) {
            	return matrixRight.scale(matrixLeft);
            } else {
                assert (matrixLeft.multiplyable(matrixRight));
                return matrixLeft.multiply(matrixRight);
            }
        } else if (operation.equals("divide")) {
            if (matrixLeft.singleton()) {
                return matrixLeft.scale(matrixRight.reciprocal());
            } else if (matrixRight.singleton()) { 
            	return matrixRight.reciprocal().scale(matrixLeft);
            } else {
                //assert (matrixLeft.multiplyable(matrixRight));
                if (matrixLeft.multiplyable(matrixRight)) {
                	return matrixLeft.multiply(matrixRight.reciprocal());
                } else {
                	throw new RuntimeException(String.format("Cannot divide %s by %s", matrixLeft.toText(), matrixRight.toText()));
                }
            }
        } else if (operation.equals("per")) {
            return matrixLeft.join(matrixRight.transpose().reciprocal());
        } else if (operation.equals("scale")) {
        	TypeIdentifierNode leftId = (TypeIdentifierNode) left; 
        	TypeIdentifierNode rightId = (TypeIdentifierNode) right;
            return new MatrixType(new StringBase(leftId.name, rightId.name));
            
        } else if (operation.equals("kronecker")) {
            return matrixLeft.kronecker(matrixRight);
        } else {
            throw new RuntimeException(String.format("Type operator %s unknown", operation));
        }
    }
}
