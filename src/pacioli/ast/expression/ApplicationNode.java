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
    public void printText(PrintWriter out) {
        function.printText(out);
        out.print('(');
        out.print(Utils.intercalateText(", ", arguments));
        out.print(')');
    }

    @Override
    public String compileToJS(boolean boxed) {

        List<String> compiled = new ArrayList<String>();
        for (Node arg : arguments) {
            compiled.add(arg.compileToJS(boxed));
        }
        String args = Utils.intercalate(", ", compiled);

        // return String.format("%s(%s)", function.compileToJS(), args);
        if (boxed) {
            // return String.format("%s.value.apply(this, global_Primitives_tuple(%s))",
            // function.compileToJS(boxed), args);
            // return String.format("%s.bcall(%s)", function.compileToJS(boxed), args);
            if (function instanceof IdentifierNode && !((IdentifierNode) function).isLocal()) {
                String fullName = ((IdentifierNode) function).fullName();
                if (fullName.equals("global_List_empty_list") || fullName.equals("global_List_loop_list")
                        || fullName.equals("global_List_fold_list") || fullName.equals("global_List_cons")
                        || fullName.equals("global_List_zip") || fullName.equals("global_List_tail")
                        || fullName.equals("global_List_head") || fullName.equals("global_List_add_mut")
                        || fullName.equals("global_List_append") || fullName.equals("global_List_reverse")
                        || fullName.equals("global_Primitives_tuple") || fullName.equals("global_Primitives_new_ref")
                        || fullName.equals("global_Primitives_empty_ref")
                        || fullName.equals("global_Primitives_throw_result")
                        || fullName.equals("global_Primitives_catch_result") || fullName.equals("global_Primitives_seq")
                        || fullName.equals("global_Primitives_ref_set") || fullName.equals("global_Primitives_ref_get")
                        || fullName.equals("global_Primitives_while_function")
                        || fullName.equals("global_Primitives_apply")) {
                    return String.format("Pacioli.%s(%s)", fullName, args);
                } else {
                    return String.format("Pacioli.b_%s(%s)", fullName, args);
                }
            } else {
                return String.format("%s(%s)", function.compileToJS(boxed), args);
            }
        } else {
            if (function instanceof IdentifierNode && !((IdentifierNode) function).isLocal()) {
                return String.format("Pacioli.%s(%s)", ((IdentifierNode) function).fullName(), args);
            } else {
                return String.format("%s(%s)", function.compileToJS(boxed), args);
                // return String.format("%s.apply(this, global_Primitives_tuple(%s))",
                // function.compileToJS(), args);
            }
        }
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
            return id.fullName().toLowerCase() + argsText;
        } else {
            return function.compileToMATLAB() + argsText;
        }
    }

    @Override
    public void accept(Visitor visitor) {
        visitor.visit(this);
    }
}
