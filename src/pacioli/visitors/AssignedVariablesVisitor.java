package pacioli.visitors;

import java.util.HashSet;
import java.util.Set;
import java.util.Stack;

import pacioli.ast.IdentityVisitor;
import pacioli.ast.Visitor;
import pacioli.ast.expression.AssignmentNode;
import pacioli.ast.expression.ExpressionNode;
import pacioli.ast.expression.IdentifierNode;
import pacioli.ast.expression.StatementNode;

public class AssignedVariablesVisitor extends IdentityVisitor implements Visitor {

    private Stack<Set<IdentifierNode>> typeStack = new Stack<Set<IdentifierNode>>();

    // -------------------------------------------------------------------------
    // Accept and return methods
    // -------------------------------------------------------------------------

    public Set<IdentifierNode> idsAccept(ExpressionNode child) {
        typeStack.push(new HashSet<IdentifierNode>());
        child.accept(this);
        return typeStack.pop();
    }

    // -------------------------------------------------------------------------
    // Visitors
    // -------------------------------------------------------------------------

    @Override
    public void visit(StatementNode node) {
        // Discard nested statements
        typeStack.push(new HashSet<IdentifierNode>());
        node.body.accept(this);
        typeStack.pop();
    }

    @Override
    public void visit(AssignmentNode node) {
        typeStack.peek().add(node.var);
    }
}
