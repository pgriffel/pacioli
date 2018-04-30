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

import java.io.PrintWriter;
import mvm.values.matrix.MatrixDimension;
import pacioli.Location;
import pacioli.ast.Visitor;
import pacioli.types.ast.TypeNode;

public class MatrixTypeNode extends AbstractExpressionNode {

    public final TypeNode typeNode;
    
    private final MatrixDimension rowDim;
    private final MatrixDimension columnDim;
    
    public MatrixTypeNode(Location location, TypeNode typeNode) {
        super(location);
        this.typeNode = typeNode;
        this.rowDim = null;
        this.columnDim = null;
    }

    public MatrixTypeNode(Location location, TypeNode typeNode, 
    		MatrixDimension rowDim, MatrixDimension columnDim) {
        super(location);
        this.typeNode = typeNode;
        this.rowDim = rowDim;
        this.columnDim = columnDim;
    }

    @Override
    public void printText(PrintWriter out) {
        out.print("|");
        typeNode.printText(out);
        out.print("|");
    }
    
    @Override
    public String compileToJS(boolean boxed) {
    	/*
        String row = "[1";
        for (int i = 0; i < nrColumns - 1; i++) {
            row += ",1";
        }
        row += "]";

        String matrix = "[";
        matrix += row;
        for (int i = 0; i < nrRows - 1; i++) {
            matrix += "," + row;
        }
        matrix += "]";

        return matrix;*/
    	//return "Pacioli.oneMatrix(" + typeNode.compileToJS() + ")";
        if (boxed) {
            //throw new RuntimeException("matrix type node ");
            return "Pacioli.oneMatrix(" + typeNode.compileToJS(boxed) + ")";
        } else {
            return "Pacioli.oneNumbers(" + rowDim.size() + ", " + columnDim.size() + ")";
        }
    	
    }
    
    @Override
    public String compileToMATLAB() {
        return String.format("ones(%s, %s)", rowDim.size(), columnDim.size());
    }

	@Override
	public void accept(Visitor visitor) {
		visitor.visit(this);
	}
}
