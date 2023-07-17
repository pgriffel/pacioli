package pacioli.visitors;

import pacioli.ast.IdentityVisitor;
import pacioli.ast.Node;
import pacioli.ast.expression.AssignmentNode;
import pacioli.ast.expression.ConstNode;
import pacioli.ast.expression.IdentifierNode;
import pacioli.ast.expression.KeyNode;
import pacioli.ast.expression.LetNode;
import pacioli.ast.expression.StringNode;
import pacioli.ast.expression.TupleAssignmentNode;
import pacioli.ast.expression.BranchNode;

public class CountNodes extends IdentityVisitor {

    private int count = 0;

    // -------------------------------------------------------------------------
    // Accept and return methods
    // -------------------------------------------------------------------------

    public int accept(Node child) {
        child.accept(this);
        return count;
    }

    // -------------------------------------------------------------------------
    // Visitors
    // -------------------------------------------------------------------------

    @Override
    public void visit(AssignmentNode node) {
        count++;
        node.value.accept(this);
    }

    @Override
    public void visit(TupleAssignmentNode node) {
        count++;
        node.tuple.accept(this);
    }

    @Override
    public void visit(BranchNode node) {
        count += 5;
        super.visit(node);
    }

    @Override
    public void visit(LetNode node) {
        count += 5;
        super.visit(node);
    }

    @Override
    public void visit(ConstNode node) {
        count++;
    }

    @Override
    public void visit(IdentifierNode node) {
        count++;
    }

    @Override
    public void visit(KeyNode node) {
        count++;
    }

    @Override
    public void visit(StringNode node) {
        count++;
    }

}
