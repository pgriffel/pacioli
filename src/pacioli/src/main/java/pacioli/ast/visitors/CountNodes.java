/*
 * Copyright (c) 2013 - 2025 Paul Griffioen
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

package pacioli.ast.visitors;

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
