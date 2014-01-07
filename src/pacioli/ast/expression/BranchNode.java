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
import java.util.List;
import java.util.Map;
import java.util.Set;

import pacioli.CompilationSettings;
import pacioli.Dictionary;
import pacioli.Location;
import pacioli.Module;
import pacioli.PacioliException;
import pacioli.Typing;
import pacioli.ValueContext;
import pacioli.ast.definition.Definition;
import pacioli.ast.definition.ValueDefinition;
import pacioli.types.PacioliType;
import pacioli.types.ParametricType;

public class BranchNode extends AbstractExpressionNode {

    private final ExpressionNode test;
    private final ExpressionNode positive;
    private final ExpressionNode negative;

    public BranchNode(ExpressionNode test, ExpressionNode pos, ExpressionNode neg, Location location) {
        super(location);
        this.test = test;
        this.positive = pos;
        this.negative = neg;
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
    public ExpressionNode resolved(Dictionary dictionary, ValueContext context) throws PacioliException {
        return new BranchNode(
                test.resolved(dictionary, context),
                positive.resolved(dictionary, context),
                negative.resolved(dictionary, context),
                getLocation());
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

        typing.addConstraint(testTyping.getType(), new ParametricType("Boole", new ArrayList<PacioliType>()), String.format("While infering the type of\n%s\nthe test of an if must be Boolean", sourceDescription()));
        typing.addConstraint(posTyping.getType(), negTyping.getType(), String.format("While infering the type of\n%s\nthe branches of an if must have the same type", sourceDescription()));

        return typing;
    }

    @Override
    public String compileToMVM(CompilationSettings settings) {
        return String.format("if(%s,%s,%s)", 
                test.compileToMVM(settings), 
                positive.compileToMVM(settings),
                negative.compileToMVM(settings));
    }

    @Override
    public String compileToJS() {
        return String.format("(%s ? %s : %s)", test.compileToJS(), positive.compileToJS(), negative.compileToJS());
    }

    @Override
    public String compileToMATLAB() {
        return String.format("_if(%s, @() %s, @() %s)",
                test.compileToMATLAB(),
                positive.compileToMATLAB(),
                negative.compileToMATLAB());
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
    public Set<IdentifierNode> locallyAssignedVariables() {
        return new LinkedHashSet<IdentifierNode>();
    }

    @Override
    public ExpressionNode desugar() {
        return new BranchNode(
                test.desugar(),
                positive.desugar(),
                negative.desugar(),
                getLocation());
    }

	@Override
	public ExpressionNode liftStatements(Module module,
			List<ValueDefinition> blocks) {
		// TODO Auto-generated method stub
		return null;
	}
}
