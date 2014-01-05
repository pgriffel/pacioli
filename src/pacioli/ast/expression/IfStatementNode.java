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
import pacioli.PacioliException;
import pacioli.Typing;
import pacioli.ValueContext;
import pacioli.ast.definition.Definition;
import pacioli.types.PacioliType;
import pacioli.types.ParametricType;


public class IfStatementNode extends AbstractExpressionNode {

    private final ExpressionNode test;
    private final ExpressionNode positive;
    private final ExpressionNode negative;

    public IfStatementNode(Location loc, ExpressionNode test, ExpressionNode positive, ExpressionNode negative) {
        super(loc);
        this.test = test;
        this.positive = positive;
        this.negative = negative;
    }

    @Override
    public void printText(PrintWriter out) {
        out.print("if ");
        test.printText(out);
        out.print(" then ");
        positive.printText(out);
        out.print(" else ");
        negative.printText(out);
        out.print(" end");
    }

    @Override
    public Set<Definition> uses() {
        Set<Definition> set = new HashSet<Definition>();
        set.addAll(test.uses());
        set.addAll(positive.uses());
        set.addAll(negative.uses());
        return set;

    }

    @Override
    public ExpressionNode transformCalls(CallMap map) {
        return new IfStatementNode(
                getLocation(),
                test.transformCalls(map),
                positive.transformCalls(map),
                negative.transformCalls(map));
    }

    @Override
    public ExpressionNode transformIds(IdMap map) {
        return new IfStatementNode(
                getLocation(),
                test.transformIds(map),
                positive.transformIds(map),
                negative.transformIds(map));
    }

    @Override
    public ExpressionNode transformSequences(SequenceMap map) {
        return new IfStatementNode(
                getLocation(),
                test.transformSequences(map),
                positive.transformSequences(map),
                negative.transformSequences(map));
    }

    @Override
    public ExpressionNode resolved(Dictionary dictionary, ValueContext context) throws PacioliException {
        return new IfStatementNode(
                getLocation(),
                test.resolved(dictionary, context),
                positive.resolved(dictionary, context),
                negative.resolved(dictionary, context));
    }

    @Override
    public Typing inferTyping(Map<String, PacioliType> context) throws PacioliException {
        Typing testTyping = test.inferTyping(context);
        Typing posTyping = positive.inferTyping(context);
        Typing negTyping = negative.inferTyping(context);

        Typing typing = new Typing(posTyping.getType());

        typing.addConstraints(testTyping);
        typing.addConstraints(posTyping);
        typing.addConstraints(negTyping);

        PacioliType voidType = new ParametricType("Void", new ArrayList<PacioliType>());
        
        typing.addConstraint(testTyping.getType(), new ParametricType("Boole", new ArrayList<PacioliType>()), String.format("While infering the type of\n%s\nthe test of an if must be Boolean", sourceDescription()));
        typing.addConstraint(posTyping.getType(), voidType, String.format("While infering the type of\n%s\nthe then branche of an if must be a statement", sourceDescription()));
        typing.addConstraint(negTyping.getType(), voidType, String.format("While infering the type of\n%s\nthe else branche of an if must be a statement", sourceDescription()));

        return typing;
    }

    @Override
    public Set<IdentifierNode> locallyAssignedVariables() {
        Set<IdentifierNode> vars = new LinkedHashSet<IdentifierNode>();
        vars.addAll(positive.locallyAssignedVariables());
        vars.addAll(negative.locallyAssignedVariables());
        return vars;
    }

    @Override
    public ExpressionNode equivalentFunctionalCode() {
        return new BranchNode(
                test.equivalentFunctionalCode(),
                positive.equivalentFunctionalCode(),
                negative.equivalentFunctionalCode(),
                getLocation());
    }

    @Override
    public String compileToMVM(CompilationSettings settings) {
        throw new UnsupportedOperationException("Not supported yet."); //To change body of generated methods, choose Tools | Templates.
    }

    @Override
    public String compileToJS() {
        throw new UnsupportedOperationException("Not supported yet."); //To change body of generated methods, choose Tools | Templates.
    }

    @Override
    public String compileToMATLAB() {
        String code = "if (";
        code += test.compileToMATLAB();
        code += ") ";
        code += positive.compileToMATLAB() + ";";
        code += " else ";
        code += negative.compileToMATLAB() + ";";
        code += " endif";
        return code;
    }
}
