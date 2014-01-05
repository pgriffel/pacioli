/*
 * Copyright (c) 2013 Paul Griffioen
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
import java.util.HashMap;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;

import pacioli.CompilationSettings;
import pacioli.Dictionary;
import pacioli.Location;
import pacioli.PacioliException;
import pacioli.Typing;
import pacioli.Utils;
import pacioli.ValueContext;
import pacioli.ast.definition.Definition;
import pacioli.types.FunctionType;
import pacioli.types.PacioliType;
import pacioli.types.ParametricType;
import pacioli.types.TypeVar;

public class LambdaNode extends AbstractExpressionNode {

    public final List<String> arguments;
    public final ExpressionNode expression;

    public LambdaNode(List<String> args, ExpressionNode body, Location location) {
        super(location);
        arguments = args;
        expression = body;
    }

    @Override
    public void printText(PrintWriter out) {
        out.print("lambda (");
        out.print(Utils.intercalate(", ", arguments));
        out.print(") ");
        expression.printText(out);
        out.print(" end");
    }

    @Override
    public ExpressionNode resolved(Dictionary dictionary, ValueContext context) throws PacioliException {
        //Set<String> extended = new HashSet<String>(context);
        ValueContext extended = new ValueContext();
        //extended.addAll(arguments);
        extended.addAll(context);
        extended.addVars(arguments);
        ExpressionNode resolvedExpression = expression.resolved(dictionary, extended);
        return new LambdaNode(arguments, resolvedExpression, getLocation());
    }

    @Override
    public String compileToMVM(CompilationSettings settings) {
        List<String> quoted = new ArrayList<String>();
        for (String arg : arguments) {
            quoted.add("\"" + arg + "\"");
        }
        String args = Utils.intercalate(",", quoted);
        return String.format("lambda (%s) %s", args, expression.compileToMVM(settings));
    }

    @Override
    public Typing inferTyping(Map<String, PacioliType> context) throws PacioliException {

        HashMap<String, PacioliType> extended = new HashMap<String, PacioliType>();
        List<PacioliType> argTypes = new ArrayList<PacioliType>();

        extended.putAll(context);
        for (String arg : arguments) {
            PacioliType freshType = new TypeVar("for_type");
            extended.put(arg, freshType);
            argTypes.add(freshType);
        }

        Typing bodyTyping = expression.inferTyping(extended);
        Typing typing = new Typing(new FunctionType(new ParametricType("Tuple", argTypes), bodyTyping.getType()));
        typing.addConstraints(bodyTyping);

        return typing;
    }

    @Override
    public Set<Definition> uses() {
        return expression.uses();
    }

    @Override
    public ExpressionNode transformCalls(CallMap map) {
        return new LambdaNode(arguments, expression.transformCalls(map), getLocation());
    }

    @Override
    public ExpressionNode transformIds(IdMap map) {
        return new LambdaNode(arguments, expression.transformIds(map), getLocation());
    }

    @Override
    public ExpressionNode transformSequences(SequenceMap map) {
        return new LambdaNode(arguments, expression.transformSequences(map), getLocation());
    }

    @Override
    public Set<IdentifierNode> locallyAssignedVariables() {
        return new LinkedHashSet<IdentifierNode>();
    }

    @Override
    public ExpressionNode equivalentFunctionalCode() {
        return new LambdaNode(arguments, expression.equivalentFunctionalCode(), getLocation());
    }

    @Override
    public String compileToJS() {
        return String.format("function (%s) { return %s; }", argsString(), expression.compileToJS());
    }

    public String argsString() {
        return Utils.intercalate(",", arguments);
    }

    @Override
    public String compileToMATLAB() {
        return String.format("(@(%s) %s)", Utils.intercalate(", ", arguments), expression.compileToMATLAB());
    }

}
