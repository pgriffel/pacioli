package pacioli.ast.visitors;

import java.util.ArrayList;
import java.util.List;
import pacioli.ast.IdentityVisitor;
import pacioli.ast.Node;
import pacioli.ast.expression.IdentifierNode;
import pacioli.ast.unit.UnitIdentifierNode;
import pacioli.compiler.PacioliException;
import pacioli.types.ast.TypeIdentifierNode;

/**
 * Quick copy from usesVisitor for the language server. Collects all identifers
 * in an AST.
 */
public class AllIdentifiersVisitor extends IdentityVisitor {

    public class AllIdentifiers {
        public List<IdentifierNode> values = new ArrayList<>();
        public List<TypeIdentifierNode> types = new ArrayList<>();
        public List<UnitIdentifierNode> units = new ArrayList<>();
    }

    AllIdentifiers identifiers = new AllIdentifiers();

    public AllIdentifiers idsAccept(Node node) {
        node.accept(this);
        return identifiers;
    }

    @Override
    public void visit(TypeIdentifierNode node) {
        assert (node.info != null);
        assert (node.info.definition().isPresent());
        identifiers.types.add(node);
    }

    @Override
    public void visit(IdentifierNode node) {
        if (node.name().equals("nmode") || node.info().definition().isPresent()
                || node.info().declaredType().isPresent() || !node.info().isGlobal()) {
            identifiers.values.add(node);
        } else {
            throw new RuntimeException("Visit error", new PacioliException(node.location(),
                    "Definition or declaration missing for '%s'", node.name()));
        }
    }

    @Override
    public void visit(UnitIdentifierNode node) {
        assert (node.info != null);
        assert (node.info.definition().isPresent());
        identifiers.units.add(node);
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
