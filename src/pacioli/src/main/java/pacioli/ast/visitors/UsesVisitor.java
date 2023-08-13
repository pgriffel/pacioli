package pacioli.ast.visitors;

import java.util.HashSet;
import java.util.Set;

import pacioli.ast.IdentityVisitor;
import pacioli.ast.Node;
import pacioli.ast.expression.IdentifierNode;
import pacioli.ast.expression.StatementNode;
import pacioli.ast.unit.UnitIdentifierNode;
import pacioli.compiler.PacioliException;
import pacioli.symboltable.info.Info;
import pacioli.types.ast.TypeIdentifierNode;

public class UsesVisitor extends IdentityVisitor {

    Set<Info> infos = new HashSet<Info>();

    public Set<Info> idsAccept(Node node) {
        node.accept(this);
        return infos;
    }

    @Override
    public void visit(TypeIdentifierNode node) {
        assert (node.info != null);
        assert (node.info.definition().isPresent());
        infos.add(node.info);
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
}
