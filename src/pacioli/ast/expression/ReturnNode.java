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
import pacioli.Location;
import pacioli.PacioliException;
import pacioli.ast.Visitor;
import pacioli.symboltable.ValueInfo;

public class ReturnNode extends AbstractExpressionNode {

    public final ExpressionNode value;
    
    private final IdentifierNode resultPlace;

	public ValueInfo info;

    public ReturnNode(Location location, ExpressionNode value) {
        super(location);
        this.value = value;
        this.resultPlace = null;
    }
    
    public ExpressionNode transform(ExpressionNode value) {
    	return new ReturnNode(getLocation(), value, resultPlace);
    }
    
    public ExpressionNode resolve(ExpressionNode value, IdentifierNode resultPlace) throws PacioliException {
   		return new ReturnNode(getLocation(), value, resultPlace);
    }
    
    public ReturnNode(Location location, ExpressionNode value, IdentifierNode resultPlace) {
        super(location);
        this.value = value;
        this.resultPlace = resultPlace;
    }

    @Override
    public void printText(PrintWriter out) {
        out.print("return ");
        value.printText(out);
        out.print(";");
    }

    @Override
    public String compileToJS(boolean boxed) {
        throw new UnsupportedOperationException("Not supported yet."); //To change body of generated methods, choose Tools | Templates.
    }
    
    @Override
    public String compileToMATLAB() {
        return resultPlace.toText() + " = " + value.compileToMATLAB() + ";\nreturn";
    }

	@Override
	public void accept(Visitor visitor) {
		visitor.visit(this);
	}
}
