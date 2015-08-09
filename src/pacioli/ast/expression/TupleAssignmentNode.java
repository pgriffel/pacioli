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
import pacioli.Utils;
import pacioli.ValueContext;
import pacioli.ast.definition.Definition;
import pacioli.ast.definition.ValueDefinition;
import pacioli.types.PacioliType;
import pacioli.types.ParametricType;

public class TupleAssignmentNode extends AbstractExpressionNode {

    private final List<IdentifierNode> vars;
    private final ExpressionNode tuple;

    public TupleAssignmentNode(Location location, List<IdentifierNode> vars, ExpressionNode tuple) {
        super(location);
        this.vars = vars;
        this.tuple = tuple;
    }

    @Override
    public void printText(PrintWriter out) {
        out.print("(");
        out.print(Utils.intercalateText(", ", vars));
        out.print(") :=");
        tuple.printText(out);
    }

    @Override
    public ExpressionNode resolved(Dictionary dictionary, ValueContext context) throws PacioliException {
        List<IdentifierNode> resolvedVars = new ArrayList<IdentifierNode>();
        for (IdentifierNode var : vars) {
            IdentifierNode resolved = IdentifierNode.newLocalMutableVar(var.getName(), var.getLocation());
            resolvedVars.add(resolved);
        }
        ExpressionNode resolvedTuple = tuple.resolved(dictionary, context);
        return new TupleAssignmentNode(getLocation(), resolvedVars, resolvedTuple);
    }

    @Override
    public Set<Definition> uses() {
        return tuple.uses();
    }

    @Override
    public ExpressionNode desugar() {
        //todo: skip underscores

        final List<String> names = new ArrayList<String>();
        for (IdentifierNode id : vars) {
            names.add(id.getName());
        }
        final List<String> freshNames = Utils.freshNames(names);
        final List<ExpressionNode> fresh = new ArrayList<ExpressionNode>();
        for (String name : freshNames) {
            IdentifierNode id = IdentifierNode.newLocalVar(name, getLocation());
            fresh.add(id);
        }

        assert (0 < vars.size());

        ExpressionNode code = ApplicationNode.newCall(getLocation(), "Primitives", "ref_set", vars.get(0), fresh.get(0));
        for (int i = 1; i < vars.size(); i++) {
            ExpressionNode setter = ApplicationNode.newCall(getLocation(), "Primitives", "ref_set", vars.get(i), fresh.get(i));
            Location loc = getLocation().join(vars.get(i).getLocation());
            code = ApplicationNode.newCall(loc, "Primitives", "seq", code, setter);
        }

        LambdaNode lambda = new LambdaNode(freshNames, code, getLocation());
        ExpressionNode tupleCode = tuple.desugar();
        return ApplicationNode.newCall(getLocation(), "Primitives", "apply", lambda, tupleCode);
    }

    @Override
    public Typing inferTyping(Map<String, PacioliType> context) throws PacioliException {

        Typing tupleTyping = tuple.inferTyping(context);

        List<PacioliType> varTypes = new ArrayList<PacioliType>();
        for (IdentifierNode var : vars) {
            assert (context.containsKey(var.getName()));
            varTypes.add(context.get(var.getName()));
        }

        Typing typing = new Typing(new ParametricType("Void", new ArrayList<PacioliType>()));
        typing.addConstraints(tupleTyping);
        typing.addConstraint(new ParametricType("Tuple", varTypes), tupleTyping.getType(), "assigned variables must have proper type");
        return typing;
    }

    @Override
    public Set<IdentifierNode> locallyAssignedVariables() {
        Set<IdentifierNode> assigned = new LinkedHashSet<IdentifierNode>();
        assigned.addAll(vars);
        return assigned;
    }

    @Override
    public String compileToMVM(CompilationSettings settings) {
        return desugar().compileToMVM(settings);
    }

    @Override
    public String compileToJS(boolean boxed) {
        return desugar().compileToJS(boxed);
    }

    @Override
    public String compileToMATLAB() {
        String tmpVar = Utils.freshName();
        String code = tmpVar + " = " + tuple.compileToMATLAB();
        int i = 1;
        for (IdentifierNode var : vars) {
            code += ";\n" + var.toText() + " = " + tmpVar + "{" + i++ + "}";
        }
        return code;
    }

	@Override
	public ExpressionNode liftStatements(PacioliFile module,
			List<ValueDefinition> blocks) {
		// TODO Auto-generated method stub
		return null;
	}
}
