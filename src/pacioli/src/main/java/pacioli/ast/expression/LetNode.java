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

import java.util.ArrayList;
import java.util.List;

import pacioli.ast.Node;
import pacioli.ast.Visitor;
import pacioli.misc.Location;
import pacioli.symboltable.SymbolTable;
import pacioli.symboltable.info.ValueInfo;

public class LetNode extends AbstractExpressionNode {

    public final List<BindingNode> binding;
    public final ExpressionNode body;

    public interface BindingNode extends Node {
    };

    public SymbolTable<ValueInfo> table;

    public LetNode(List<BindingNode> bindings, ExpressionNode body, Location location) {
        super(location);
        this.binding = bindings;
        this.body = body;
    }

    // public LetNode(LetNode old, ExpressionNode body) {
    // super(old.getLocation());
    // binding = old.binding;
    // this.body = body;
    // }

    @Override
    public void accept(Visitor visitor) {
        visitor.visit(this);
    }

    public Node transform(List<BindingNode> bindings, ExpressionNode body) {
        LetNode node = new LetNode(bindings, body, location());
        node.table = table;
        return node;
    }

    public ApplicationNode asApplication() {

        List<String> argsNames = new ArrayList<String>();
        List<ExpressionNode> args = new ArrayList<ExpressionNode>();
        ;
        for (BindingNode binding : binding) {
            LetBindingNode letBinding = (LetBindingNode) binding;
            argsNames.add(letBinding.var);
            args.add(letBinding.value);
        }

        LambdaNode fun = new LambdaNode(argsNames, body, body.location());
        fun.table = table;

        return new ApplicationNode(fun, args, location());
    }

}
