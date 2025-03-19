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

package pacioli.ast.sugar;

import java.util.List;

import pacioli.ast.AbstractNode;
import pacioli.ast.Node;
import pacioli.ast.Visitor;
import pacioli.ast.expression.ExpressionNode;
import pacioli.ast.expression.IdentifierNode;
import pacioli.ast.expression.LetNode;
import pacioli.compiler.Location;
import pacioli.symboltable.SymbolTable;
import pacioli.symboltable.info.ValueInfo;

/**
 * Syntactic sugar. Gets desugared into a normal LetBindingNode bound to a
 * LambdaNode.
 */
public class LetFunctionBindingNode extends AbstractNode implements ExpressionNode, LetNode.BindingNode {

    public final IdentifierNode name;
    public final List<IdentifierNode> args;
    public final ExpressionNode body;

    public SymbolTable<ValueInfo> table;

    public LetFunctionBindingNode(Location location, IdentifierNode name, List<IdentifierNode> args,
            ExpressionNode body) {
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
        return new LetFunctionBindingNode(location(), name, args, body);
    }

}
