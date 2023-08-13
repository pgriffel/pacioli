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

import pacioli.ast.Node;
import pacioli.ast.Visitor;
import pacioli.ast.expression.ExpressionNode;
import pacioli.ast.expression.IdentifierNode;
import pacioli.ast.expression.LambdaNode;
import pacioli.misc.Location;

public class ValueDefinition extends AbstractDefinition {

    public final IdentifierNode id;
    public final boolean isUserDefined;

    // Overwritten by LiftStatements
    public ExpressionNode body;

    public ValueDefinition(Location location, IdentifierNode id, ExpressionNode body, boolean isUserDefined) {
        super(location);
        this.id = id;
        this.body = body;
        this.isUserDefined = isUserDefined;
    }

    public ValueDefinition(Location location, IdentifierNode id, ExpressionNode body) {
        super(location);
        this.id = id;
        this.body = body;
        this.isUserDefined = true;
    }

    public Node transform(ExpressionNode body) {
        return new ValueDefinition(location(), id, body, isUserDefined);
    }

    public boolean isFunction() {
        return (body instanceof LambdaNode);
    }

    @Override
    public String name() {
        return id.name();
    }

    @Override
    public void accept(Visitor visitor) {
        visitor.visit(this);
    }
}
