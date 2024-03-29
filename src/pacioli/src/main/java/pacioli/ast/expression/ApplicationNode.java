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

import pacioli.ast.Visitor;
import pacioli.compiler.Location;

public class ApplicationNode extends AbstractExpressionNode {

    public final ExpressionNode function;
    public final List<ExpressionNode> arguments;

    // Set during type inference iff hasName("nmode") is true
    public List<Integer> nmodeShape;

    public ApplicationNode(ExpressionNode fun, List<ExpressionNode> args, Location location) {
        super(location);
        function = fun;
        arguments = args;
    }

    public ApplicationNode(ApplicationNode old, ExpressionNode fun, List<ExpressionNode> args) {
        super(old.location());
        function = fun;
        arguments = args;
    }

    @Override
    public void accept(Visitor visitor) {
        visitor.visit(this);
    }

    public Boolean hasId() {
        return function instanceof IdentifierNode;
    }

    public IdentifierNode id() {
        if (function instanceof IdentifierNode) {
            return (IdentifierNode) function;
        } else {
            throw new RuntimeException("Application has no id");
        }
    }

    public Boolean hasName(String name) {
        if (function instanceof IdentifierNode) {
            IdentifierNode id = (IdentifierNode) function;
            return id.name().equals(name);
        } else {
            return false;
        }
    }

    public Boolean isGlobal() {
        if (function instanceof IdentifierNode) {
            IdentifierNode id = (IdentifierNode) function;
            return id.isGlobal();
        } else {
            return false;
        }
    }
}
