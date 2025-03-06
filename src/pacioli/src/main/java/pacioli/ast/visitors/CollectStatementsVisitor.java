package pacioli.ast.visitors;

import java.util.ArrayList;
import java.util.List;
import java.util.Stack;

import pacioli.ast.Node;
import pacioli.ast.IdentityVisitor;
import pacioli.ast.expression.ApplicationNode;
import pacioli.ast.expression.AssignmentNode;
import pacioli.ast.expression.ExpressionNode;
import pacioli.ast.expression.IfStatementNode;
import pacioli.ast.expression.ReturnNode;
import pacioli.ast.expression.ReturnVoidNode;
import pacioli.ast.expression.SequenceNode;
import pacioli.ast.expression.StatementNode;
import pacioli.ast.expression.TupleAssignmentNode;
import pacioli.ast.expression.WhileNode;
import pacioli.compiler.PacioliException;

/**
 * Collects the MUTATING statements in the statement tree that is formed by a
 * StatementNode. Not nested StatenmentNodes! All statement that can mutate the
 * vars in the StatementNode's table. Thus, assignments and returns only.
 */
public class CollectStatementsVisitor extends IdentityVisitor {

    private Stack<List<Node>> typeStack = new Stack<List<Node>>();

    // -------------------------------------------------------------------------
    // Accept and return methods
    // -------------------------------------------------------------------------

    public List<Node> nodeAccept(ExpressionNode child) {
        typeStack.push(new ArrayList<Node>());
        child.accept(this);
        return typeStack.pop();
    }

    // -------------------------------------------------------------------------
    // Visitors
    // -------------------------------------------------------------------------

    @Override
    public void visit(StatementNode node) {
    }

    @Override
    public void visit(AssignmentNode node) {
        typeStack.peek().add(node);
    }

    @Override
    public void visit(TupleAssignmentNode node) {
        typeStack.peek().add(node);
    }

    @Override
    public void visit(ReturnNode node) {
        typeStack.peek().add(node);
    }

    @Override
    public void visit(ReturnVoidNode node) {
        typeStack.peek().add(node);
    }

    @Override
    public void visit(SequenceNode node) {
        for (ExpressionNode st : node.items) {
            List<Node> all = nodeAccept(st);
            for (Node n : all) {
                if (!(n instanceof ReturnNode || n instanceof AssignmentNode || n instanceof ReturnVoidNode
                        || n instanceof TupleAssignmentNode)) {
                    throw new PacioliException(node.location(), "huh");
                }
                ;
            }
            typeStack.peek().addAll(all);
        }
    }

    @Override
    public void visit(IfStatementNode node) {
        typeStack.peek().addAll(nodeAccept(node.positive));
        typeStack.peek().addAll(nodeAccept(node.negative));
    }

    @Override
    public void visit(WhileNode node) {
        typeStack.peek().addAll(nodeAccept(node.body));
    }

    @Override
    public void visit(ApplicationNode node) {
    }

}
