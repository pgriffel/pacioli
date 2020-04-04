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
import pacioli.ast.Node;
import pacioli.ast.Visitor;
import pacioli.symboltable.SymbolTable;
import pacioli.symboltable.ValueInfo;

public class LetFunctionBindingNode extends AbstractExpressionNode implements LetNode.BindingNode {

    public final String name;
    public final List<String> args;
    public final ExpressionNode body;

    public SymbolTable<ValueInfo> table;

    public LetFunctionBindingNode(Location location, String name, List<String> args, ExpressionNode body) {
        super(location);
        this.name = name;
        this.args = args;
        this.body = body;
    }

    @Override
    public void accept(Visitor visitor) {
        visitor.visit(this);
    }

    public Node transform(ExpressionNode body) {
        return new LetFunctionBindingNode(getLocation(), name, args, body);
    }

}
