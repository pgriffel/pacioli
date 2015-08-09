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
import pacioli.ValueContext;
import pacioli.ast.definition.Definition;
import pacioli.ast.definition.ValueDefinition;
import pacioli.types.PacioliType;
import pacioli.types.ParametricType;

public class SequenceNode extends AbstractExpressionNode {

    private final List<ExpressionNode> items;

    public SequenceNode(Location location, List<ExpressionNode> items) {
        super(location);
        this.items = items;
    }

    @Override
    public void printText(PrintWriter out) {
        for (ExpressionNode item : items) {
            item.printText(out);
            out.print(" ");
        }
    }

    @Override
    public ExpressionNode resolved(final Dictionary dictionary, final ValueContext context) throws PacioliException {
    	List<ExpressionNode> resolved = new ArrayList<ExpressionNode>();
        for (ExpressionNode item : items) {
        	resolved.add(item.resolved(dictionary, context));
        }
        return new SequenceNode(getLocation(), resolved);
    }

    @Override
    public Set<Definition> uses() {
        Set<Definition> cumulative = new LinkedHashSet<Definition>();
        for (ExpressionNode item : items) {
            cumulative.addAll(item.uses());
        }
        return cumulative;
    }

    @Override
    public Typing inferTyping(Map<String, PacioliType> context) throws PacioliException {
        PacioliType voidType = new ParametricType("Void", new ArrayList<PacioliType>());
        Typing typing = new Typing(voidType);
        for (ExpressionNode item : items) {
            Typing itemTyping = item.inferTyping(context);
            typing.addConstraint(voidType, itemTyping.getType(), "A statement must have type Void()");
            typing.addConstraints(itemTyping);
        }
        return typing;
    }

    @Override
    public Set<IdentifierNode> locallyAssignedVariables() {
        Set<IdentifierNode> vars = new LinkedHashSet<IdentifierNode>();
        for (ExpressionNode item : items) {
            vars.addAll(item.locallyAssignedVariables());
        }
        return vars;
    }

    @Override
    public ExpressionNode liftStatements(PacioliFile module, List<ValueDefinition> blocks) {
        List<ExpressionNode> liftedItems = new ArrayList<ExpressionNode>();
        for (ExpressionNode item : items) {
            liftedItems.add(item.liftStatements(module, blocks));
        }
        return new SequenceNode(getLocation(), liftedItems);
    }

    @Override
    public ExpressionNode desugar() {
    	if (items.isEmpty()) {
    		// todo
    		return ApplicationNode.newCall(getLocation(), "Primitives", "nothing");
    	} else {
    		ExpressionNode node = items.get(0).desugar();
    		Location loc = node.getLocation();
    		for (int i = 1; i < items.size(); i++) {
    			loc = loc.join(items.get(i).getLocation());
    			node = ApplicationNode.newCall(loc, "Primitives", "seq", node, items.get(i).desugar());
    		}
    		return node;
    	}
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
        String code = "";
        for (ExpressionNode item : items) {
            code += "\n" + item.compileToMATLAB() + ";";
        }
        return code;
    }
}
