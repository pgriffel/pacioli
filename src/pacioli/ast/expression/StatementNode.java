package pacioli.ast.expression;

import java.io.PrintWriter;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;

import pacioli.CompilationSettings;
import pacioli.Dictionary;
import pacioli.Location;
import pacioli.PacioliFile;
import pacioli.Pacioli;
import pacioli.PacioliException;
import pacioli.Utils;
import pacioli.Typing;
import pacioli.ValueContext;
import pacioli.ast.definition.Definition;
import pacioli.ast.definition.ValueDefinition;
import pacioli.types.PacioliType;
import pacioli.types.ParametricType;
import pacioli.types.TypeVar;

public class StatementNode extends AbstractExpressionNode {

	private final SequenceNode body;
	private final ValueContext context;

	public StatementNode(Location location, SequenceNode body) {
		super(location);
		this.body = body;
		this.context = null;
	}

	private StatementNode(Location location, SequenceNode body, ValueContext context) {
		super(location);
		this.body = body;
		this.context = context;
	}

	@Override
	public ExpressionNode resolved(Dictionary dictionary, ValueContext context)
			throws PacioliException {

        final ValueContext altContext = new ValueContext();
 
        Set<String> assignedNames = new HashSet<String>();
        for (IdentifierNode id : locallyAssignedVariables()) {
        	Pacioli.logln3("resolved op StatementNode: %s", id.getName());
            assignedNames.add(id.getName());
            altContext.addRefVar(id.getName());
        }

        for (String name : context.vars()) {
            if (!assignedNames.contains(name)) {
            	if (context.isRefVar(name)) {
            		altContext.addRefVar(name);
            	} else {
            		altContext.addVar(name);
            	}
            }
        }
        
        altContext.setStatementResult("result");

        ExpressionNode resolvedBody = body.resolved(dictionary, altContext);
        
        return new StatementNode(getLocation(), (SequenceNode) resolvedBody, context);
	}

	@Override
	public Typing inferTyping(Map<String, PacioliType> context)
			throws PacioliException {

        Map<String, PacioliType> statementContext = new HashMap<String, PacioliType>(context);
        for (IdentifierNode id : locallyAssignedVariables()) {
        	String varName = id.getName();
        	if (context.containsKey(varName)) {
        		statementContext.put(varName, context.get(varName));
        	} else {
        		statementContext.put(varName, new TypeVar("for_type"));
        	}
        }

        PacioliType resultType = new TypeVar("for_type");
        statementContext.put("result", resultType);

        PacioliType voidType = new ParametricType("Void", new ArrayList<PacioliType>());
        Typing typing = new Typing(resultType);
        Typing itemTyping = body.inferTyping(statementContext);
        typing.addConstraint(voidType, itemTyping.getType(), "A statement must have type Void()");
        typing.addConstraints(itemTyping);
        return typing;
    }
	
    @Override
    public ExpressionNode liftStatements(PacioliFile module, List<ValueDefinition> blocks) {

        // Lift the body
        ExpressionNode liftedBody = body.liftStatements(module, blocks);
        ExpressionNode seq = new StatementNode(getLocation(), (SequenceNode) liftedBody, context);

        // Create the proper context for the lifted statement
        List<String> contextVars = new ArrayList<String>();
        List<ExpressionNode> contextIds = new ArrayList<ExpressionNode>();
        for (String var : context.vars()) {
        	contextVars.add(var);
        	if (context.isRefVar(var)) {
        		contextIds.add(IdentifierNode.newLocalMutableVar(var, getLocation()));
        	} else {
        		contextIds.add(IdentifierNode.newLocalVar(var, getLocation()));
        	}
        }

        // Define a helper function for the lifted statement and replace the sequence 
        // by a call to that function
        IdentifierNode fresh = IdentifierNode.newValueIdentifier(module.getName(), Utils.freshName(), getLocation());
        LambdaNode lambda = new LambdaNode(contextVars, seq, getLocation());
        ValueDefinition vd = new ValueDefinition(fresh, lambda, lambda);
        vd.setModule(module);
        blocks.add(vd);
        return new ApplicationNode(fresh, contextIds, getLocation());
    }

	@Override
	public Set<IdentifierNode> locallyAssignedVariables() {
		return body.locallyAssignedVariables();
	}

    @Override
    public ExpressionNode desugar() {

        assert (context != null);

        // Build equivalent functional code for possibly nested block in the 
        // expressions of each statement in this block
        ExpressionNode node = body.desugar();
        String resultPlace = "result";
        IdentifierNode result = IdentifierNode.newLocalMutableVar(resultPlace, getLocation());
        
        // Create a catch around the block with a reference allocated for the result
        ExpressionNode blockBody = new LambdaNode(new ArrayList<String>(), node, node.getLocation());
        ExpressionNode blockCode = ApplicationNode.newCall(getLocation(), "Primitives", "catch_result", blockBody, result);
        ExpressionNode resultLambda = new LambdaNode(Arrays.asList(resultPlace), blockCode, getLocation());
        ExpressionNode resultRef = ApplicationNode.newCall(getLocation(), "Primitives", "empty_ref");
        ExpressionNode seqCode = new ApplicationNode(resultLambda, Arrays.asList(resultRef), getLocation());

        // Create code to allocate all assigned references
        for (IdentifierNode id : locallyAssignedVariables()) {
        	String name = id.getName();
        	ExpressionNode ref = ApplicationNode.newCall(getLocation(), "Primitives", "empty_ref");
        	if (context.containsVar(name)) {
        		ExpressionNode cid = IdentifierNode.newLocalVar(name, getLocation());
        		if (context.isRefVar(name)) {
        			ExpressionNode getter = ApplicationNode.newCall(getLocation(), "Primitives", "ref_get", cid);
        			ref = ApplicationNode.newCall(getLocation(), "Primitives", "new_ref", getter);	
        		} else {
        			ref = ApplicationNode.newCall(getLocation(), "Primitives", "new_ref", cid);
        		}
        	}
        	ExpressionNode lambda = new LambdaNode(Arrays.asList(name), seqCode, getLocation());
        	seqCode = new ApplicationNode(lambda, Arrays.asList(ref), getLocation());
        }

        return seqCode;

    }


	@Override
	public Set<Definition> uses() {
		return body.uses();
	}

	@Override
	public String compileToMVM(CompilationSettings settings) {
		return desugar().compileToMVM(settings);
	}

	@Override
	public String compileToJS() {
		return desugar().compileToJS();
	}

	@Override
	public String compileToMATLAB() {
		return body.compileToMATLAB();
	}

	@Override
	public void printText(PrintWriter out) {
		out.print("begin ");
		body.printText(out);
		out.print("end");
	}
}
