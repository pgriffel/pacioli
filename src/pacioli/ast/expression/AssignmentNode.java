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

public class AssignmentNode extends AbstractExpressionNode {

    private final IdentifierNode var;
    private final ExpressionNode value;

    public AssignmentNode(Location location, IdentifierNode var, ExpressionNode value) {
        super(location);
        this.var = var;
        this.value = value;
    }

    @Override
    public void printText(PrintWriter out) {
        var.printText(out);
        out.print(" := ");
        value.printText(out);
    }

    @Override
    public ExpressionNode resolved(Dictionary dictionary, ValueContext context) throws PacioliException {
        Set<String> varContext = new HashSet<String>();
        varContext.add(var.getName());
        ExpressionNode resolvedVar = var.resolved(dictionary, context);
        assert(resolvedVar instanceof IdentifierNode);
        return new AssignmentNode(
                getLocation(),
                (IdentifierNode) resolvedVar,
                value.resolved(dictionary, context));
    }

    @Override
    public Set<Definition> uses() {
        return value.uses();
    }

    @Override
    public ExpressionNode desugar() {
        return ApplicationNode.newCall(getLocation(), "Primitives", "ref_set", var, value.desugar());
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
        return var.getName() + " = " + value.compileToMATLAB();
    }

    @Override
    public Typing inferTyping(Map<String, PacioliType> context) throws PacioliException {
        if (!context.containsKey(var.getName())) {
            throw new RuntimeException(String.format("assigned var %s does not exists in context!!!", var.getName()));
        }
        assert (context.containsKey(var.getName()));
        PacioliType voidType = new ParametricType("Void", new ArrayList<PacioliType>());
        Typing valueTyping = value.inferTyping(context);
        Typing typing = new Typing(voidType);
        typing.addConstraints(valueTyping);
        typing.addConstraint(context.get(var.getName()), valueTyping.getType(), "assigned variable must have proper type");
        return typing;
    }

    @Override
    public ExpressionNode transformCalls(CallMap map) {
        return new AssignmentNode(getLocation(), var, value.transformCalls(map));
    }

    @Override
    public ExpressionNode transformIds(IdMap map) {
        return new AssignmentNode(getLocation(), var, value.transformIds(map));
    }

    @Override
    public Set<IdentifierNode> locallyAssignedVariables() {
        Set<IdentifierNode> vars = new LinkedHashSet<IdentifierNode>();
        vars.add(var);
        return vars;
    }

    @Override
    public ExpressionNode transformSequences(SequenceMap map) {
        return new AssignmentNode(getLocation(), var, value.transformSequences(map));
    }
}
