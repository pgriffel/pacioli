/*
* Copyright 2026 Paul Griffioen
*
* Permission is hereby granted, free of charge, to any person obtaining a
copy
* of this software and associated documentation files (the "Software"), to
deal
* in the Software without restriction, including without limitation the
rights
* to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
* copies of the Software, and to permit persons to whom the Software is
* furnished to do so, subject to the following conditions:
*
* The above copyright notice and this permission notice shall be included in
* all copies or substantial portions of the Software.
*
* THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
* IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
* FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
* AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
* LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
FROM,
* OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE
* SOFTWARE.
*/

package pacioli.ast.visitors;

import pacioli.ast.expression.ApplicationNode;
import pacioli.ast.expression.AssignmentNode;
import pacioli.ast.expression.BranchNode;
import pacioli.ast.sugar.ComprehensionNode;
import pacioli.ast.IdentityVisitor;
import pacioli.ast.expression.ConstNode;
import pacioli.ast.expression.ConversionNode;
import pacioli.ast.expression.DataDefinitionNode;
import pacioli.ast.expression.DataQueryNode;
import pacioli.ast.expression.ExpressionNode;
import pacioli.ast.expression.ForNode;
import pacioli.ast.expression.ForTupleNode;
import pacioli.ast.expression.IdentifierNode;
import pacioli.ast.expression.IfStatementNode;
import pacioli.ast.expression.KeyNode;
import pacioli.ast.expression.LambdaNode;
import pacioli.ast.expression.LetBindingNode;
import pacioli.ast.expression.LetNode;
import pacioli.ast.expression.ListLiteralNode;
import pacioli.ast.expression.MatrixLiteralNode;
import pacioli.ast.expression.MatrixTypeNode;
import pacioli.ast.expression.ProjectionNode;
import pacioli.ast.expression.ReturnNode;
import pacioli.ast.expression.ReturnVoidNode;
import pacioli.ast.expression.SequenceNode;
import pacioli.ast.expression.StatementNode;
import pacioli.ast.expression.StringNode;
import pacioli.ast.expression.TupleAssignmentNode;
import pacioli.ast.expression.WhileNode;
import pacioli.ast.sugar.LetFunctionBindingNode;
import pacioli.ast.sugar.LetTupleBindingNode;
import pacioli.symboltable.info.ValueInfo;
import pacioli.types.Substitution;
import pacioli.types.type.TypeObject;

public class TypeInferenceCommitVisitor extends IdentityVisitor {

    private final Substitution substitution;

    public TypeInferenceCommitVisitor(Substitution substitution) {
        this.substitution = substitution;
    }

    private void commit(ValueInfo info) {
        if (info == null || info.inferredType().isEmpty()) {
            return;
        }
        TypeObject updatedType = info.inferredType().get().applySubstitution(substitution)
                .simplify().normalizeMatrixTypes();
        info.replaceInferredType(updatedType);
    }

    // @Override
    // public void visit(IdentifierNode node) {
    // commit(node.info());
    // }

    @Override
    public void visit(LetNode node) {
        if (node.table != null) {
            if (node.binding instanceof LetBindingNode letBinding) {
                commit(node.table.lookup(letBinding.var));
            } else if (node.binding instanceof LetTupleBindingNode letTupleBinding) {
                for (var var : letTupleBinding.vars) {
                    commit(node.table.lookup(var.name()));
                }
            } else if (node.binding instanceof LetFunctionBindingNode letFunctionBinding) {
                commit(node.table.lookup(letFunctionBinding.name.name()));
                if (letFunctionBinding.table != null) {
                    for (var arg : letFunctionBinding.args) {
                        commit(letFunctionBinding.table.lookup(arg.name()));
                    }
                }
            }
        }
        super.visit(node);
    }

    // @Override
    // public void visit(LetFunctionBindingNode node) {
    // if (node.table != null) {
    // commit(node.table.lookup(node.name.name()));
    // for (var arg : node.args) {
    // commit(node.table.lookup(arg.name()));
    // }
    // }
    // super.visit(node);
    // }

    // @Override
    // public void visit(LetTupleBindingNode node) {
    // for (var var : node.vars) {
    // commit(var.info());
    // }
    // super.visit(node);
    // }

    @Override
    public void visit(LambdaNode node) {
        if (node.table != null) {
            for (String arg : node.arguments) {
                commit(node.table.lookup(arg));
            }
        }
        super.visit(node);
    }

    // @Override
    // public void visit(ForNode node) {
    // if (node.table != null && node.var != null) {
    // commit(node.table.lookup(node.var.name()));
    // }
    // super.visit(node);
    // }

    // @Override
    // public void visit(ForTupleNode node) {
    // if (node.table != null) {
    // for (var var : node.vars) {
    // commit(node.table.lookup(var.name()));
    // }
    // }
    // super.visit(node);
    // }

    @Override
    public void visit(StatementNode node) {
        for (var info : node.table.allInfos()) {
            if (!info.isGlobal()) {
                commit(info);
            }
        }
        for (var info : node.shadowed.allInfos()) {
            commit(info);
        }
        commit(node.resultInfo);
        super.visit(node);
    }
}
