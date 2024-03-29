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

import pacioli.ast.Visitor;
import pacioli.compiler.Location;

public class IfStatementNode extends AbstractExpressionNode {

    public final ExpressionNode test;
    public final ExpressionNode positive;
    public final ExpressionNode negative;

    public IfStatementNode(Location loc, ExpressionNode test, ExpressionNode positive, ExpressionNode negative) {
        super(loc);
        this.test = test;
        this.positive = positive;
        this.negative = negative;
    }

    public IfStatementNode(IfStatementNode old, ExpressionNode test, ExpressionNode pos, ExpressionNode neg) {
        super(old.location());
        this.test = test;
        this.positive = pos;
        this.negative = neg;
    }

    @Override
    public void accept(Visitor visitor) {
        visitor.visit(this);
    }
}
