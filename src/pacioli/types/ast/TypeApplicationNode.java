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

package pacioli.types.ast;

import java.io.PrintWriter;
import java.util.List;
import pacioli.Location;
import pacioli.Utils;
import pacioli.ast.Visitor;

public class TypeApplicationNode extends AbstractTypeNode {

    public final TypeIdentifierNode op;
    public final List<TypeNode> args;

    public TypeApplicationNode(Location location, TypeIdentifierNode name, List<TypeNode> args) {
        super(location);
        this.op = name;
        this.args = args;
    }

    public TypeNode transform(TypeIdentifierNode name, List<TypeNode> args) {
		return new TypeApplicationNode(getLocation(), name, args);
	}

	@Override
    public void printText(PrintWriter out) {
		op.printText(out);
        out.print("(");
        out.print(Utils.intercalateText(", ", args));
        out.print(")");
    }

    public TypeIdentifierNode getOperator() {
    	return op;
    }
    
    public String getName() {
    	return op.getName();
    }
    
    public List<TypeNode> getArgs() {
    	return args;
    }

	@Override
	public void accept(Visitor visitor) {
		visitor.visit(this);
	}

}
