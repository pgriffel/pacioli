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

    // TODO: do we need to implement this?
    // @Override
    // public void visit(StatementNode node) {
    // node.body.accept(this);
    // for (Info info : node.shadowed.allInfos()) {
    // infos.add(info);
    // }
    // }
}
