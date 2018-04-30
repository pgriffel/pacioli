package pacioli.visitors;

import java.util.ArrayList;
import java.util.List;
import java.util.Stack;

import pacioli.ValueContext;
import pacioli.ast.Visitor;
import pacioli.ast.IdentityTransformation;
import pacioli.ast.expression.ApplicationNode;
import pacioli.ast.expression.AssignmentNode;
import pacioli.ast.expression.BranchNode;
import pacioli.ast.expression.ExpressionNode;
import pacioli.ast.expression.IdentifierNode;
import pacioli.ast.expression.IfStatementNode;
import pacioli.ast.expression.LambdaNode;
import pacioli.ast.expression.ReturnNode;
import pacioli.ast.expression.SequenceNode;
import pacioli.ast.expression.StatementNode;
import pacioli.ast.expression.TupleAssignmentNode;
import pacioli.ast.expression.WhileNode;
import pacioli.symboltable.ValueInfo;
import pacioli.Location;
import pacioli.Progam;

public class DesugarStatements extends IdentityTransformation implements Visitor {

    // Issue: place reference can end up in closures. Create a lambda/application
    // pair
    // around closures that derefs the place and puts the value in a lambda param?

    // To inform Return nodes of a statement's result place
    private Stack<IdentifierNode> statementResult = new Stack<IdentifierNode>();

    // Needed for resolving newly created AST nodes
    private Progam prog;

    // -------------------------------------------------------------------------
    // Constructor
    // -------------------------------------------------------------------------

    public DesugarStatements(Progam prog) {
        this.prog = prog;
    }

    // Fixme
    private ApplicationNode newCall(Location loc, String module, String name, ExpressionNode... args) {
        ApplicationNode app = ApplicationNode.newCall(loc, module, name, args);
        app.function.resolve(prog);
        return app;
    };

    // -------------------------------------------------------------------------
    // Visitors
    // -------------------------------------------------------------------------

    @Override
    public void visit(StatementNode node) {

        // Create a list for all variables that must be bound and a list with
        // code for the variables' initial values.
        // THESE NAMES ARE/MUST BE EXACTLY THE NAMES IN THE SYMBOL TABLE!
        // CHECK THAT OR REUSE THE INFO FROM RESOLVING!
        List<String> vars = new ArrayList<String>();
        List<ExpressionNode> values = new ArrayList<ExpressionNode>();

        // Lookup the result place that was created during resolving
        String resultName = "result"; // fixme
        ValueInfo vinfo = node.table.lookup(resultName);
        IdentifierNode resultId = vinfo.resultPlace;
        assert (resultId != null);

        // Create a place for the result
        ExpressionNode resultPlace = newCall(node.getLocation(), "Primitives", "empty_ref");

        // Add the result name and the result place to the lists
        vars.add(resultName);
        values.add(resultPlace);

        // Find all assigned variables
        for (IdentifierNode id : node.body.locallyAssignedVariables()) {

            // Create proper initialization code for each variable
            String name = id.getName();
            Location loc = node.getLocation();
            ExpressionNode ref = newCall(loc, "Primitives", "empty_ref");
            ValueContext context = new ValueContext(); // obsolete
            if (context.containsVar(name)) {
                ExpressionNode cid = IdentifierNode.newLocalVar(name, loc);
                if (context.isRefVar(name)) {
                    ExpressionNode getter = newCall(loc, "Primitives", "ref_get", cid);
                    ref = newCall(loc, "Primitives", "new_ref", getter);
                } else {
                    ref = newCall(loc, "Primitives", "new_ref", cid);
                }
            }

            // Add the variable and the initialization code to the lists
            vars.add(name);
            values.add(ref);
        }

        // Make the result id available for the Return statements and
        // desugar the node's body
        statementResult.push(resultId);
        ExpressionNode body = expAccept(node.body);
        statementResult.pop();

        // Create a catch block around the statement body that uses the result place for
        // the result
        ExpressionNode blockBody = new LambdaNode(new ArrayList<String>(), body, body.getLocation());
        ApplicationNode blockCode = newCall(node.getLocation(), "Primitives", "catch_result", blockBody, resultId);

        // Create a lambda around the block with the variables as parameters
        LambdaNode lambda = new LambdaNode(vars, blockCode, node.getLocation());

        // Put the statement's symbol table in the lambda
        lambda.table = node.table;

        // Create an application that bind the values to the variables
        returnNode(new ApplicationNode(lambda, values, node.getLocation()));
    }

    @Override
    public void visit(AssignmentNode node) {
        returnNode(newCall(node.getLocation(), "Primitives", "ref_set", node.var, expAccept(node.value)));
    }

    @Override
    public void visit(IfStatementNode node) {
        returnNode(new BranchNode(expAccept(node.test), expAccept(node.positive), expAccept(node.negative),
                node.getLocation()));
    }

    @Override
    public void visit(ReturnNode node) {
        returnNode(newCall(node.getLocation(), "Primitives", "throw_result", statementResult.peek(),
                expAccept(node.value)));
    }

    @Override
    public void visit(SequenceNode node) {
        if (node.items.isEmpty()) {
            // todo
            returnNode(newCall(node.getLocation(), "Primitives", "nothing"));
        } else {
            ExpressionNode exp = expAccept(node.items.get(0));
            Location loc = exp.getLocation();
            for (int i = 1; i < node.items.size(); i++) {
                loc = loc.join(node.items.get(i).getLocation());
                exp = newCall(loc, "Primitives", "seq", exp, expAccept(node.items.get(i)));
            }
            returnNode(exp);
        }
    }

    @Override
    public void visit(TupleAssignmentNode tupleAssignmentNode) {
        throw new RuntimeException("Todo: desugar tuple assignment node");
    }

    @Override
    public void visit(WhileNode node) {
        ExpressionNode testCode = new LambdaNode(new ArrayList<String>(), expAccept(node.test),
                node.test.getLocation());
        ExpressionNode bodyCode = new LambdaNode(new ArrayList<String>(), expAccept(node.body),
                node.body.getLocation());
        returnNode(newCall(node.getLocation(), "Primitives", "while_function", testCode, bodyCode));
    }

    @Override
    public void visit(IdentifierNode node) {
        returnNode(node.info.isRef ? newCall(node.getLocation(), "Primitives", "ref_get", node) : node);
    }
}
