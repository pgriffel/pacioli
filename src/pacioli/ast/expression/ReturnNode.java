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
import java.util.HashSet;
import java.util.LinkedHashSet;
import java.util.Map;
import java.util.Set;
import pacioli.CompilationSettings;
import pacioli.Dictionary;
import pacioli.Location;
import pacioli.Module;
import pacioli.PacioliException;
import pacioli.Typing;
import pacioli.ast.definition.Definition;
import pacioli.types.PacioliType;
import pacioli.types.ParametricType;

/**
 *
 * @author Administrator
 */
public class ReturnNode extends AbstractExpressionNode {

    private final ExpressionNode value;
    private final IdentifierNode resultPlace;

    public ReturnNode(Location location, IdentifierNode resultPlace, ExpressionNode value) {
        super(location);
        this.resultPlace = resultPlace;
        this.value = value;
    }

    @Override
    public void printText(PrintWriter out) {
        out.print("return ");
        value.printText(out);
    }

    @Override
    public ExpressionNode resolved(Dictionary dictionary, Map<String, Module> globals, Set<String> context, Set<String> mutableContext) throws PacioliException {
        Set<String> varContext = new HashSet<String>();
        varContext.add(resultPlace.getName());
        ExpressionNode resolvedResultPlace = resultPlace.resolved(dictionary, globals, context, varContext);
        ExpressionNode resolvedValue = value.resolved(dictionary, globals, context, mutableContext);
        assert (resolvedResultPlace instanceof IdentifierNode);
        return new ReturnNode(getLocation(), (IdentifierNode) resolvedResultPlace, resolvedValue);
    }

    @Override
    public Set<Definition> uses() {
        return value.uses();
    }

    @Override
    public String compileToMVM(CompilationSettings settings) {
        return equivalentFunctionalCode().compileToMVM(settings);
    }

    @Override
    public ExpressionNode equivalentFunctionalCode() {
        ExpressionNode valueCode = value.equivalentFunctionalCode();
        return ApplicationNode.newCall(getLocation(), "Primitives", "throw_result", resultPlace, valueCode);
    }

    @Override
    public String compileToJS() {
        throw new UnsupportedOperationException("Not supported yet."); //To change body of generated methods, choose Tools | Templates.
    }

    @Override
    public String compileToMATLAB() {
        return resultPlace.toText() + " = " + value.compileToMATLAB() + ";\nreturn";
    }

    @Override
    public Typing inferTyping(Dictionary dictionary, Map<String, PacioliType> context) throws PacioliException {
        String result = resultPlace.getName();
        assert (context.containsKey(result));
        PacioliType voidType = new ParametricType("Void", new ArrayList<PacioliType>());
        Typing valueTyping = value.inferTyping(dictionary, context);
        Typing typing = new Typing(voidType);
        typing.addConstraints(valueTyping);
        typing.addConstraint(context.get(result), valueTyping.getType(), "the types of returned values must agree");
        return typing;
    }

    @Override
    public ExpressionNode transformCalls(CallMap map) {
        return new ReturnNode(getLocation(), resultPlace, value.transformCalls(map));
    }

    @Override
    public ExpressionNode transformIds(IdMap map) {
        return new ReturnNode(getLocation(), resultPlace, value.transformIds(map));
    }

    @Override
    public Set<IdentifierNode> locallyAssignedVariables() {
        return new LinkedHashSet<IdentifierNode>();
    }

    @Override
    public ExpressionNode transformSequences(SequenceMap map) {
        return new ReturnNode(getLocation(), resultPlace, value.transformSequences(map));
    }
}
