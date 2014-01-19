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
import pacioli.PacioliFile;
import pacioli.PacioliException;
import pacioli.Typing;
import pacioli.ValueContext;
import pacioli.ast.definition.Definition;
import pacioli.ast.definition.ValueDefinition;
import pacioli.types.PacioliType;
import pacioli.types.ParametricType;

public class ReturnNode extends AbstractExpressionNode {

    private final ExpressionNode value;
    private final IdentifierNode resultPlace;

    public ReturnNode(Location location, ExpressionNode value) {
        super(location);
        this.value = value;
        this.resultPlace = null;
    }
    
    public ReturnNode(Location location, ExpressionNode value, IdentifierNode resultPlace) {
        super(location);
        this.value = value;
        this.resultPlace = resultPlace;
    }

    @Override
    public void printText(PrintWriter out) {
        out.print("return ");
        value.printText(out);
    }

    @Override
    public ExpressionNode resolved(Dictionary dictionary, ValueContext context) throws PacioliException {
    	if (context.getStatementResult() == null) {
    		throw new RuntimeException("No result place for return");
    	} else {
    		IdentifierNode result = IdentifierNode.newLocalMutableVar(context.getStatementResult(), getLocation());
    		return new ReturnNode(getLocation(), value.resolved(dictionary, context), result);
    	}
    }

    @Override
    public Set<Definition> uses() {
        return value.uses();
    }

    @Override
    public String compileToMVM(CompilationSettings settings) {
        return desugar().compileToMVM(settings);
    }

    @Override
    public ExpressionNode desugar() {
        return ApplicationNode.newCall(getLocation(), "Primitives", "throw_result", resultPlace, value.desugar());
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
    public Typing inferTyping(Map<String, PacioliType> context) throws PacioliException {
        String result = resultPlace.getName();
        assert (context.containsKey(result));
        PacioliType voidType = new ParametricType("Void", new ArrayList<PacioliType>());
        Typing valueTyping = value.inferTyping(context);
        Typing typing = new Typing(voidType);
        typing.addConstraints(valueTyping);
        typing.addConstraint(context.get(result), valueTyping.getType(), "the types of returned values must agree");
        return typing;
    }

    @Override
    public Set<IdentifierNode> locallyAssignedVariables() {
        return new LinkedHashSet<IdentifierNode>();
    }

	@Override
	public ExpressionNode liftStatements(PacioliFile module,
			List<ValueDefinition> blocks) {
		// TODO Auto-generated method stub
		return null;
	}
}
