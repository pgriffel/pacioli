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
import java.util.HashSet;
import java.util.Set;

import pacioli.CompilationSettings;
import pacioli.Dictionary;
import pacioli.Location;
import pacioli.PacioliException;
import pacioli.TypeContext;
import pacioli.ast.definition.Definition;
import pacioli.types.PacioliType;
import pacioli.types.matrix.MatrixType;
import pacioli.types.matrix.StringBase;

public class TypeOperationNode extends AbstractTypeNode {

    private final String operator;
    private final TypeNode left;
    private final TypeNode right;

    public TypeOperationNode(Location location, String operation, TypeNode left, TypeNode right) {
        super(location);
        this.operator = operation;
        this.left = left;
        this.right = right;
    }

    @Override
    public void printText(PrintWriter out) {
        out.format("%s%s%s", left, operator, right);
    }

    @Override
    public PacioliType eval(boolean reduce) throws PacioliException {

        PacioliType leftType = left.eval(reduce);
        PacioliType rightType = right.eval(reduce);

        if (!(leftType instanceof MatrixType)) {
            throw new PacioliException(getLocation(), "Matrix type left operand is not a matrix but a %s", leftType.description());
        }
        
        if (!(rightType instanceof MatrixType)) {
            throw new PacioliException(getLocation(), "Matrix type right operand is not a matrix but a %s", rightType.description());
        }
        
        MatrixType matrixLeft = (MatrixType) leftType;
        MatrixType matrixRight = (MatrixType) rightType;

        if (operator.equals("multiply")) {
            if (matrixLeft.singleton()) {
                return matrixLeft.scale(matrixRight);
            } else if (matrixRight.singleton()) {
            	return matrixRight.scale(matrixLeft);
            } else {
                assert (matrixLeft.multiplyable(matrixRight));
                return matrixLeft.multiply(matrixRight);
            }
        } else if (operator.equals("divide")) {
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
        } else if (operator.equals("per")) {
            return matrixLeft.join(matrixRight.transpose().reciprocal());
        } else if (operator.equals("scale")) {
        	TypeIdentifierNode leftId = (TypeIdentifierNode) left; 
        	TypeIdentifierNode rightId = (TypeIdentifierNode) right;
            return new MatrixType(new StringBase(leftId.getName(), rightId.getName()));
            
        } else if (operator.equals("kronecker")) {
            return matrixLeft.kronecker(matrixRight);
        } else {
            throw new RuntimeException(String.format("Type operator %s unknown", operator));
        }
    }

	@Override
	public String compileToJS() {
		String leftJS = left.compileToJS();
		String rightJS = right.compileToJS();
		if (operator == "multiply") {
			return leftJS + ".mult(" + rightJS + ")";
		} else if (operator == "divide") {
			return leftJS + ".div(" + rightJS + ")";
		} else if (operator == "^") {
			return leftJS + ".expt(" + rightJS + ")";
		} else if (operator == "per") {
			return leftJS + ".per(" + rightJS + ")";
		} else if (operator == "kronecker") {
			return leftJS + ".kron(" + rightJS + ")";
		} else if (operator == "scale") {
			return "scalarShape'(" + left + "$" + right + "')";
		} else {
			throw new RuntimeException("Type operator '" + operator + "' unknown");
		}
	}

	public String compileToMVM(CompilationSettings settings) {
		String leftMVM = left.compileToMVM(settings);
		String rightMVM = right.compileToMVM(settings);
		if (operator == "multiply") {
			return "shape_binop(\"multiply\", " + leftMVM + ", " + rightMVM + ")";
		} else if (operator == "divide") {
			return "shape_binop(\"divide\", " + leftMVM + ", " + rightMVM + ")";
		} else if (operator == "^") {
			return "shape_binop(\"expt\", " + leftMVM + ", " + rightMVM + ")";
		} else if (operator == "per") {
			return "shape_binop(\"per\", " + leftMVM + ", " + rightMVM + ")";
		} else if (operator == "kronecker") {
			return "shape_binop(\"kronecker\", " + leftMVM + ", " + rightMVM + ")";
		} else if (operator == "scale") {
			return "scalar_shape(scaled_unit(\"" + left + "\", \"" + right + "\"))";
		} else {
			throw new RuntimeException("Type operator '" + operator + "' unknown");
		}
	}
	
	@Override
	public Set<Definition> uses() {
		Set<Definition> set = new HashSet<Definition>();
        set.addAll(left.uses());
        set.addAll(right.uses());
        return set;
	}

	@Override
	public TypeNode resolved(Dictionary dictionary, TypeContext context)
			throws PacioliException {
		return new TypeOperationNode(
				getLocation(),
				operator,
				left.resolved(dictionary, context),
				right.resolved(dictionary, context));
	}
}
