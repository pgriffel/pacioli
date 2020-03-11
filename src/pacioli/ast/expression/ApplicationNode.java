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
import java.util.Arrays;
import java.util.List;

import pacioli.Location;
import pacioli.Utils;
import pacioli.ast.Node;
import pacioli.ast.Visitor;

public class ApplicationNode extends AbstractExpressionNode {

    public final ExpressionNode function;
    public final List<ExpressionNode> arguments;

    public ApplicationNode(ExpressionNode fun, List<ExpressionNode> args, Location location) {
        super(location);
        function = fun;
        arguments = args;
    }

    public ApplicationNode(ApplicationNode old, ExpressionNode fun, List<ExpressionNode> args) {
        super(old.getLocation());
        function = fun;
        arguments = args;
    }

    public static ApplicationNode newCall(Location location, String module, String function, ExpressionNode... args) {
        IdentifierNode id = IdentifierNode.newValueIdentifier(module, function, location);
        return new ApplicationNode(id, Arrays.asList(args), location);
    }

    @Override
    public String compileToMATLAB() {
        List<String> compiled = new ArrayList<String>();
        for (Node arg : arguments) {
            compiled.add(arg.compileToMATLAB());
        }
        String argsText = "(" + Utils.intercalate(", ", compiled) + ")";
        if (function instanceof IdentifierNode) {
            IdentifierNode id = (IdentifierNode) function;
            //return id.fullName().toLowerCase() + argsText;
            return "Fixme";
        } else {
            return function.compileToMATLAB() + argsText;
        }
    }

    @Override
    public void accept(Visitor visitor) {
        visitor.visit(this);
    }
}
