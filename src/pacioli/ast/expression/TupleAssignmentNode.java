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

import java.util.List;

import pacioli.Location;
import pacioli.Utils;
import pacioli.ast.Visitor;

public class TupleAssignmentNode extends AbstractExpressionNode {

    public final List<IdentifierNode> vars;
    public final ExpressionNode tuple;

    public TupleAssignmentNode(Location location, List<IdentifierNode> vars, ExpressionNode tuple) {
        super(location);
        this.vars = vars;
        this.tuple = tuple;
    }

    public TupleAssignmentNode(TupleAssignmentNode node, ExpressionNode tuple) {
        super(node.getLocation());
        this.vars = node.vars;
        this.tuple = tuple;
    }

    @Override
    public String compileToMATLAB() {
        String tmpVar = Utils.freshName();
        String code = tmpVar + " = " + tuple.compileToMATLAB();
        int i = 1;
        for (IdentifierNode var : vars) {
            code += ";\n" + var.pretty() + " = " + tmpVar + "{" + i++ + "}";
        }
        return code;
    }

    @Override
    public void accept(Visitor visitor) {
        visitor.visit(this);
    }
}
