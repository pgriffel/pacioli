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
import java.util.Map;
import java.util.Set;

import pacioli.CompilationSettings;
import pacioli.Dictionary;
import pacioli.Location;
import pacioli.PacioliException;
import pacioli.Typing;
import pacioli.ValueContext;
import pacioli.ast.definition.Definition;
import pacioli.types.PacioliType;
import pacioli.types.ParametricType;


public class WhileNode extends AbstractExpressionNode {

    private final ExpressionNode test;
    private final ExpressionNode body;

    public WhileNode(Location location, ExpressionNode test, ExpressionNode body) {
        super(location);
        this.test = test;
        this.body = body;
    }

    @Override
    public void printText(PrintWriter out) {
        out.print("while ");
        test.printText(out);
        out.print(" do ");
        body.printText(out);
        out.print(" end");
    }

    @Override
    public ExpressionNode resolved(Dictionary dictionary, ValueContext context) throws PacioliException {
        return new WhileNode(
                getLocation(),
                test.resolved(dictionary, context),
                body.resolved(dictionary, context));
    }

    @Override
    public Set<Definition> uses() {
        Set<Definition> set = new HashSet<Definition>();
        set.addAll(test.uses());
        set.addAll(body.uses());
        return set;
    }

    @Override
    public Typing inferTyping(Map<String, PacioliType> context) throws PacioliException {

        Typing testTyping = test.inferTyping(context);
        Typing bodyTyping = body.inferTyping(context);

        Typing typing = new Typing(new ParametricType("Void", new ArrayList<PacioliType>()));
        typing.addConstraints(testTyping);
        typing.addConstraints(bodyTyping);
        typing.addConstraint(testTyping.getType(), new ParametricType("Boole", new ArrayList<PacioliType>()), "the test of a while must be boolean");
        typing.addConstraint(bodyTyping.getType(), new ParametricType("Void", new ArrayList<PacioliType>()), "the body of a while must be a statement");
        return typing;
    }

    @Override
    public ExpressionNode transformCalls(CallMap map) {
        return new WhileNode(getLocation(), test.transformCalls(map), body.transformCalls(map));
    }

    @Override
    public ExpressionNode transformIds(IdMap map) {
        return new WhileNode(getLocation(), test.transformIds(map), body.transformIds(map));
    }

    @Override
    public ExpressionNode transformSequences(SequenceMap map) {
        return new WhileNode(getLocation(), test.transformSequences(map), body.transformSequences(map));
    }

    @Override
    public Set<IdentifierNode> locallyAssignedVariables() {
        return body.locallyAssignedVariables();
    }

    @Override
    public ExpressionNode desugar() {
        ExpressionNode testCode = new LambdaNode(new ArrayList<String>(), test.desugar(), test.getLocation());
        ExpressionNode bodyCode = new LambdaNode(new ArrayList<String>(), body.desugar(), body.getLocation());
        return ApplicationNode.newCall(getLocation(), "Primitives", "while_function", testCode, bodyCode);
    }

    @Override
    public String compileToMVM(CompilationSettings settings) {
        return desugar().compileToMVM(settings);
    }

    @Override
    public String compileToJS() {
        throw new UnsupportedOperationException("Not supported yet."); //To change body of generated methods, choose Tools | Templates.
    }

    @Override
    public String compileToMATLAB() {
        return "while (" + test.compileToMATLAB() + ")" + body.compileToMATLAB() + "endwhile";
    }
}
