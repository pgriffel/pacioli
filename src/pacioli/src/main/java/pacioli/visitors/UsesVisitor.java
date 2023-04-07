package pacioli.visitors;

import java.util.HashSet;
import java.util.Set;

import pacioli.PacioliException;
import pacioli.ast.IdentityVisitor;
import pacioli.ast.Node;
import pacioli.ast.expression.IdentifierNode;
import pacioli.ast.expression.StatementNode;
import pacioli.ast.unit.UnitIdentifierNode;
import pacioli.symboltable.SymbolInfo;
import pacioli.types.ast.TypeIdentifierNode;

public class UsesVisitor extends IdentityVisitor {
    
    Set<SymbolInfo> infos = new HashSet<SymbolInfo>();

    public Set<SymbolInfo> idsAccept(Node node) {
        node.accept(this);
        return infos;
    }

    @Override
    public void visit(TypeIdentifierNode node) {
        assert (node.info != null);
        assert (node.info.getDefinition().isPresent());
        infos.add(node.info);
    }

    @Override
    public void visit(IdentifierNode node) {
        if (node.getInfo().getDefinition().isPresent() || node.getInfo().getDeclaredType().isPresent() || !node.getInfo().isGlobal()) {        
            infos.add(node.getInfo());
        } else {
            throw new RuntimeException("Visit error", new PacioliException(node.getLocation(), "%s unknown", node.getName()));
        }
    }

    @Override
    public void visit(UnitIdentifierNode node) {
        assert (node.info != null);
        assert (node.info.getDefinition().isPresent());
        infos.add(node.info);
    }

    @Override
    public void visit(StatementNode node) {
        node.body.accept(this);
        for (SymbolInfo info: node.shadowed.allInfos()) {
            infos.add(info);
        }
    }
}
