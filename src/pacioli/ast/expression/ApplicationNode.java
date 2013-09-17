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
import java.util.Arrays;
import java.util.HashSet;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;
import pacioli.CompilationSettings;
import pacioli.Dictionary;
import pacioli.Location;
import pacioli.Module;
import pacioli.PacioliException;
import pacioli.Typing;
import pacioli.Utils;
import pacioli.ast.ASTNode;
import pacioli.ast.definition.Definition;
import pacioli.types.FunctionType;
import pacioli.types.PacioliType;
import pacioli.types.ParametricType;
import pacioli.types.TypeVar;

public class ApplicationNode extends AbstractExpressionNode {

    private final ExpressionNode function;
    private final List<ExpressionNode> arguments;

    public ApplicationNode(ExpressionNode fun, List<ExpressionNode> args, Location location) {
        super(location);
        function = fun;
        arguments = args;
    }

    public static ApplicationNode newCall(Location location, String module, String function, ExpressionNode... args) {
        IdentifierNode id = IdentifierNode.newValueIdentifier(module, function, location);
        return new ApplicationNode(id, Arrays.asList(args), location);
    }

    private interface ArgumentsMap {

        public ExpressionNode map(ExpressionNode argument) throws PacioliException;
    }

    private List<ExpressionNode> mapArguments(ArgumentsMap map) throws PacioliException {
        List<ExpressionNode> mapped = new ArrayList<ExpressionNode>();
        for (ExpressionNode argument : arguments) {
            mapped.add(map.map(argument));
        }
        return mapped;
    }

    @Override
    public void printText(PrintWriter out) {
        function.printText(out);
        out.print('(');
        out.print(Utils.intercalateText(", ", arguments));
        out.print(')');
    }

    @Override
    public ExpressionNode resolved(final Dictionary dictionary, final Map<String, Module> globals, final Set<String> context, final Set<String> mutableContext) throws PacioliException {
        ExpressionNode resolvedFunction = function.resolved(dictionary, globals, context, mutableContext);
        List<ExpressionNode> resolvedArguments = mapArguments(new ArgumentsMap() {
            @Override
            public ExpressionNode map(ExpressionNode argument) throws PacioliException {
                return argument.resolved(dictionary, globals, context, mutableContext);
            }
        });
        return new ApplicationNode(resolvedFunction, resolvedArguments, getLocation());
    }

    @Override
    public Set<Definition> uses() {
        Set<Definition> set = new HashSet<Definition>();
        set.addAll(function.uses());
        for (ASTNode node : arguments) {
            set.addAll(node.uses());
        }
        return set;
    }

    @Override
    public Typing inferTyping(Dictionary dictionary, Map<String, PacioliType> context) throws PacioliException {

        PacioliType resultType = new TypeVar("for_type");
        Typing typing = new Typing(resultType);

        List<PacioliType> argTypes = new ArrayList<PacioliType>();
        for (ExpressionNode arg : arguments) {
            Typing argTyping = arg.inferTyping(dictionary, context);
            argTypes.add(argTyping.getType());
            typing.addConstraints(argTyping);
        }

        Typing funTyping = function.inferTyping(dictionary, context);
        typing.addConstraints(funTyping);

        PacioliType funType = new FunctionType(new ParametricType("Tuple", argTypes), resultType);
        typing.addConstraint(funType, funTyping.getType(), String.format("During inference %s\nthe infered type must match known types", sourceDescription()));

        return typing;
    }

    @Override
    public ExpressionNode transformCalls(CallMap map) {
        return map.transform(this);
    }

    @Override
    public ExpressionNode transformIds(final IdMap map) {
        List<ExpressionNode> mapped = new ArrayList<ExpressionNode>();
        for (ExpressionNode arg : arguments) {
            mapped.add(arg.transformIds(map));
        }
        return new ApplicationNode(function.transformIds(map), mapped, getLocation());
    }

    @Override
    public ExpressionNode transformSequences(SequenceMap map) {
        List<ExpressionNode> mapped = new ArrayList<ExpressionNode>();
        for (ExpressionNode arg : arguments) {
            mapped.add(arg.transformSequences(map));
        }
        return new ApplicationNode(function.transformSequences(map), mapped, getLocation());
    }

    @Override
    public Set<IdentifierNode> locallyAssignedVariables() {
        return new LinkedHashSet<IdentifierNode>();
    }

    @Override
    public ExpressionNode equivalentFunctionalCode() {
        List<ExpressionNode> mapped = new ArrayList<ExpressionNode>();
        for (ExpressionNode arg : arguments) {
            mapped.add(arg.equivalentFunctionalCode());
        }
        return new ApplicationNode(function.equivalentFunctionalCode(), mapped, getLocation());
    }

    @Override
    public String compileToMVM(CompilationSettings settings) {
        String args = "";
        for (ASTNode arg : arguments) {
            args += ", " + arg.compileToMVM(settings);
        }
        if (settings.debug() && function instanceof IdentifierNode) {
            IdentifierNode id = (IdentifierNode) function;
            String stackText = id.getName();
            String fullText = getLocation().description();
            String code = function.compileToMVM(settings);
            //boolean traceOn = settings.trace(id.fullName());
            boolean traceOn = settings.trace(id.getName());
            return String.format("application_debug(\"%s\", \"%s\", \"%s\", %s%s)", stackText, fullText, traceOn, code, args);
        } else {
            return String.format("application(%s%s)", function.compileToMVM(settings), args);
        }
    }

    @Override
    public String compileToJS() {

        List<String> compiled = new ArrayList<String>();
        for (ASTNode arg : arguments) {
            compiled.add(arg.compileToJS());
        }
        String args = Utils.intercalate(", ", compiled);

        if (function instanceof IdentifierNode) {
            return String.format("%s(%s)", ((IdentifierNode) function).fullName(), args);
        } else {
            return String.format("%s.apply(this, user_Primitives_tuple(%s))", function.compileToJS(), args);
        }
    }

    @Override
    public String compileToMATLAB() {
        List<String> compiled = new ArrayList<String>();
        for (ASTNode arg : arguments) {
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
}
