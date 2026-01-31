/*
 * Copyright 2026 Paul Griffioen
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
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
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

package pacioli.ast.visitors;

import java.util.HashSet;
import java.util.Set;

import pacioli.ast.IdentityVisitor;
import pacioli.ast.Node;
import pacioli.ast.definition.UnitDefinition;
import pacioli.ast.expression.IdentifierNode;
import pacioli.ast.expression.StatementNode;
import pacioli.ast.unit.UnitIdentifierNode;
import pacioli.compiler.PacioliException;
import pacioli.symboltable.info.Info;
import pacioli.types.ast.QuantNode;
import pacioli.types.ast.TypeIdentifierNode;
import pacioli.types.ast.TypePredicateNode;

public class UsesVisitor extends IdentityVisitor {

    Set<Info> infos = new HashSet<Info>();

    public Set<Info> idsAccept(Node node) {
        node.accept(this);
        return infos;
    }

    @Override
    public void visit(TypeIdentifierNode node) {
        assert (node.info != null);
        // assert (node.info.definition().isPresent());
        if (node.info.definition().isPresent()) {
            infos.add(node.info);
        }
    }

    @Override
    public void visit(IdentifierNode node) {
        if (node.name().equals("nmode") || node.info().definition().isPresent()
                || node.info().declaredType().isPresent() || !node.info().isGlobal()) {
            infos.add(node.info());
        } else {
            throw new RuntimeException("Visit error", new PacioliException(node.location(),
                    "Definition or declaration missing for '%s'", node.name()));
        }
    }

    @Override
    public void visit(UnitDefinition node) {
        if (node.body.isPresent()) {
            node.body.get().accept(this);
        }
    }

    @Override
    public void visit(UnitIdentifierNode node) {
        assert (node.info != null);
        assert (node.info.definition().isPresent());
        infos.add(node.info);
    }

    @Override
    public void visit(StatementNode node) {
        node.body.accept(this);
        for (Info info : node.shadowed.allInfos()) {
            infos.add(info);
        }
    }

    @Override
    public void accept(QuantNode node) {
        // Skip the ids
        for (TypePredicateNode condition : node.conditions) {
            condition.accept(this);
        }
    }
}
