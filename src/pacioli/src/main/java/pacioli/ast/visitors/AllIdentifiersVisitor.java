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

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import pacioli.ast.IdentityVisitor;
import pacioli.ast.Node;
import pacioli.ast.expression.IdentifierNode;
import pacioli.ast.unit.UnitIdentifierNode;
import pacioli.compiler.Location;
import pacioli.compiler.PacioliException;
import pacioli.symboltable.info.Info;
import pacioli.types.ast.TypeIdentifierNode;

/**
 * Quick copy from usesVisitor for the language server. Collects all identifers
 * in an AST.
 */
public class AllIdentifiersVisitor extends IdentityVisitor {

    public static class IdentifierInfo {
        public final Node identifier;

        public IdentifierInfo(IdentifierNode identifier) {
            this.identifier = identifier;
        }

        public IdentifierInfo(TypeIdentifierNode identifier) {
            this.identifier = identifier;
        }

        public IdentifierInfo(UnitIdentifierNode identifier) {
            this.identifier = identifier;
        }

        /**
         * The Info for the identifier. Although the AST must have been resolved, some
         * identifers never get an Info, for example the identifiers in the definition
         * nodes.
         * 
         * @return The node's Info if it exists.
         */
        public Optional<Info> info() {
            if (this.identifier instanceof IdentifierNode n) {
                return Optional.ofNullable(n.info);
            } else if (this.identifier instanceof TypeIdentifierNode n) {
                return Optional.ofNullable(n.info);
            } else if (this.identifier instanceof UnitIdentifierNode n) {
                return Optional.ofNullable(n.info);
            } else {
                throw new RuntimeException("Unexpected identifier node type");
            }
        }

        public Location location() {
            return this.identifier.location();
        }

        public String name() {
            if (this.identifier instanceof IdentifierNode n) {
                return n.name();
            } else if (this.identifier instanceof TypeIdentifierNode n) {
                return n.name();
            } else if (this.identifier instanceof UnitIdentifierNode n) {
                return n.name();
            } else {
                throw new RuntimeException("Unexpected identifier node type");
            }
        }
    }

    List<IdentifierInfo> identifiers = new ArrayList<>();

    public List<IdentifierInfo> idsAccept(Node node) {
        node.accept(this);
        return identifiers;
    }

    @Override
    public void visit(TypeIdentifierNode node) {
        assert (node.info != null);
        assert (node.info.definition().isPresent());
        identifiers.add(new IdentifierInfo(node));
    }

    @Override
    public void visit(IdentifierNode node) {
        if (node.name().equals("nmode") || node.info().definition().isPresent()
                || node.info().declaredType().isPresent() || !node.info().isGlobal()) {
            identifiers.add(new IdentifierInfo(node));
        } else {
            throw new RuntimeException("Visit error", new PacioliException(node.location(),
                    "Definition or declaration missing for '%s'", node.name()));
        }
    }

    @Override
    public void visit(UnitIdentifierNode node) {
        assert (node.info != null);
        assert (node.info.definition().isPresent());
        identifiers.add(new IdentifierInfo(node));
    }
}
