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
import java.util.HashMap;
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
import pacioli.ast.definition.Definition;
import pacioli.ast.definition.ValueDefinition;
import pacioli.types.PacioliType;
import pacioli.types.ParametricType;
import pacioli.types.TypeVar;

public class SequenceNode extends AbstractExpressionNode {

    private final List<ExpressionNode> items;
    private final IdentifierNode resultPlace;
    private final boolean top;
    private final Set<String> context;
    private final Set<String> mutableContext;

    public SequenceNode(Location location, List<ExpressionNode> items, IdentifierNode resultPlace, boolean top) {
        super(location);
        this.items = items;
        this.resultPlace = resultPlace;
        this.top = top;
        this.context = null;
        this.mutableContext = null;
    }

    private SequenceNode(Location location, List<ExpressionNode> items, IdentifierNode resultPlace, boolean top, Set<String> context, Set<String> mutableContext) {
        super(location);
        this.items = items;
        this.resultPlace = resultPlace;
        this.top = top;
        assert (context != null);
        assert (mutableContext != null);
        this.context = new HashSet<String>(context);
        this.mutableContext = new HashSet<String>(mutableContext);
    }

    public boolean isTopStatement() {
        return top;
    }

    public IdentifierNode getResultPlace() {
        return resultPlace;
    }

    private interface ItemMap {

        public ExpressionNode map(ExpressionNode item) throws PacioliException;
    }

    private List<ExpressionNode> mapItems(ItemMap map) throws PacioliException {
        List<ExpressionNode> mapped = new ArrayList<ExpressionNode>();
        for (ExpressionNode item : items) {
            mapped.add(map.map(item));
        }
        return mapped;
    }

    @Override
    public void printText(PrintWriter out) {
        if (isTopStatement()) {
            out.print("begin ");
        }
        for (ExpressionNode item : items) {
            item.printText(out);
            out.print("; ");
        }
        if (isTopStatement()) {
            out.print("end");
        }
    }

    @Override
    public ExpressionNode resolved(final Dictionary dictionary, final Map<String, Module> globals, final Set<String> context, final Set<String> mutableContext) throws PacioliException {

        IdentifierNode result = IdentifierNode.newLocalMutableVar(resultPlace.getName(), resultPlace.getLocation());

        final Set<String> altContext = new LinkedHashSet<String>();
        final Set<String> cumulativeContext = new LinkedHashSet<String>(mutableContext);

        Set<String> assignedNames = new HashSet<String>();
        for (IdentifierNode id : locallyAssignedVariables()) {
            assignedNames.add(id.getName());
        }

        for (String name : context) {
            if (assignedNames.contains(name)) {
                cumulativeContext.add(name);
            } else {
                altContext.add(name);
            }
        }

        List<ExpressionNode> resolvedItems = mapItems(new ItemMap() {
            @Override
            public ExpressionNode map(ExpressionNode item) throws PacioliException {
                ExpressionNode resolved = item.resolved(dictionary, globals, altContext, cumulativeContext);
                for (IdentifierNode id : item.locallyAssignedVariables()) {
                    cumulativeContext.add(id.getName());
                }
                return resolved;
            }
        });

        return new SequenceNode(getLocation(), resolvedItems, result, top, context, mutableContext);
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
    public Typing inferTyping(Dictionary dictionary, Map<String, PacioliType> context) throws PacioliException {

        Map<String, PacioliType> statementContext = new HashMap<String, PacioliType>(context);
        if (isTopStatement()) {
            for (IdentifierNode id : locallyAssignedVariables()) {
                String varName = id.getName();
                if (context.containsKey(varName)) {
                    statementContext.put(varName, context.get(varName));
                } else {
                    statementContext.put(varName, new TypeVar("for_type"));
                }
            }
        }

        PacioliType resultType = new TypeVar("for_type");
        statementContext.put(resultPlace.getName(), resultType);

        PacioliType voidType = new ParametricType("Void", new ArrayList<PacioliType>());
        Typing typing = new Typing(resultType);
        for (ExpressionNode item : items) {
            Typing itemTyping = item.inferTyping(dictionary, statementContext);
            typing.addConstraint(voidType, itemTyping.getType(), "A statement must have type Void()");
            typing.addConstraints(itemTyping);
        }
        return typing;
    }

    @Override
    public ExpressionNode transformCalls(CallMap map) {
        List<ExpressionNode> itemNodes = new ArrayList<ExpressionNode>();
        for (ExpressionNode item : items) {
            itemNodes.add(item.transformCalls(map));
        }
        return new SequenceNode(getLocation(), itemNodes, resultPlace, top, context, mutableContext);
    }

    @Override
    public ExpressionNode transformIds(IdMap map) {
        List<ExpressionNode> itemNodes = new ArrayList<ExpressionNode>();
        for (ExpressionNode item : items) {
            itemNodes.add(item.transformIds(map));
        }
        return new SequenceNode(getLocation(), itemNodes, resultPlace, top, context, mutableContext);
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
    public ExpressionNode transformSequences(SequenceMap map) {
        return map.transform(this);
    }

    @Override
    public ExpressionNode liftStatements(Module module, List<ValueDefinition> blocks) {

        // Lift the elements
        List<ExpressionNode> liftedItems = new ArrayList<ExpressionNode>();
        for (ExpressionNode item : items) {
            liftedItems.add(item.liftStatements(module, blocks));
        }
        ExpressionNode seq = new SequenceNode(getLocation(), liftedItems, resultPlace, isTopStatement(), context, mutableContext);

        if (isTopStatement()) {

            // Create the proper context for the lifted statement
            List<String> contextVars = new ArrayList<String>();
            List<ExpressionNode> contextIds = new ArrayList<ExpressionNode>();
            for (String var : context) {
                contextVars.add(var);
                contextIds.add(IdentifierNode.newLocalVar(var, getLocation()));
            }
            for (String var : mutableContext) {
                contextVars.add(var);
                contextIds.add(IdentifierNode.newLocalMutableVar(var, getLocation()));
            }

            // Define a helper function for the lifted statement and replace the sequence 
            // by a call to that function
            IdentifierNode fresh = IdentifierNode.newValueIdentifier(module.name, Utils.freshName(), getLocation());
            LambdaNode lambda = new LambdaNode(contextVars, seq, getLocation());
            blocks.add(new ValueDefinition(module, fresh, lambda, lambda));
            return new ApplicationNode(fresh, contextIds, getLocation());
        } else {
            return seq;
        }
    }

    @Override
    public ExpressionNode equivalentFunctionalCode() {

        assert (context != null); // Names must have been resolved
        assert (mutableContext != null); // Names must have been resolved
        assert (0 < items.size());

        // Build equivalent functional code for possibly nested block in the 
        // expressions of each statement in this block
        ExpressionNode node = items.get(0).equivalentFunctionalCode();
        Location loc = node.getLocation();
        for (int i = 1; i < items.size(); i++) {
            loc = loc.join(items.get(i).getLocation());
            //loc = items.get(i).getLocation();
            node = ApplicationNode.newCall(loc, "Primitives", "seq", node, items.get(i).equivalentFunctionalCode());
        }

        if (!top) {
            return node;
        } else {

            // Create a catch around the block with a reference allocated for the result
            ExpressionNode blockBody = new LambdaNode(new ArrayList<String>(), node, loc);
            ExpressionNode blockCode = ApplicationNode.newCall(loc, "Primitives", "catch_result", blockBody, resultPlace);
            ExpressionNode resultLambda = new LambdaNode(Arrays.asList(resultPlace.getName()), blockCode, loc);
            ExpressionNode resultRef = ApplicationNode.newCall(loc, "Primitives", "new_ref");
            ExpressionNode seqCode = new ApplicationNode(resultLambda, Arrays.asList(resultRef), loc);

            // Create code to allocate all assigned references
            for (IdentifierNode id : locallyAssignedVariables()) {
                String name = id.getName();
                ExpressionNode ref = ApplicationNode.newCall(loc, "Primitives", "new_ref");
                if (context.contains(name)) {
                    ExpressionNode cid = IdentifierNode.newLocalVar(name, getLocation());
                    ref = ApplicationNode.newCall(getLocation(), "Primitives", "ref_set", ref, cid);
                }
                if (mutableContext.contains(name)) {
                    ExpressionNode cid = IdentifierNode.newLocalVar(name, getLocation());
                    ExpressionNode getter = ApplicationNode.newCall(getLocation(), "Primitives", "ref_get", cid);
                    ref = ApplicationNode.newCall(getLocation(), "Primitives", "ref_set", ref, getter);
                }
                ExpressionNode lambda = new LambdaNode(Arrays.asList(name), seqCode, loc);
                seqCode = new ApplicationNode(lambda, Arrays.asList(ref), loc);
            }

            return seqCode;
        }
    }

    @Override
    public String compileToMVM(CompilationSettings settings) {
        return equivalentFunctionalCode().compileToMVM(settings);
    }

    @Override
    public String compileToJS() {
        return equivalentFunctionalCode().compileToJS();
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
