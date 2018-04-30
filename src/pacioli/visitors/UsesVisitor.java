package pacioli.visitors;

import java.util.HashSet;
import java.util.Set;

import pacioli.ast.Node;
import pacioli.ast.Visitor;
import pacioli.ast.IdentityVisitor;
import pacioli.ast.expression.IdentifierNode;
import pacioli.ast.unit.UnitIdentifierNode;
import pacioli.symboltable.SymbolInfo;
import pacioli.types.ast.TypeIdentifierNode;

public class UsesVisitor extends IdentityVisitor implements Visitor {

    Set<SymbolInfo> infos = new HashSet<SymbolInfo>();

    public Set<SymbolInfo> idsAccept(Node node) {
        node.accept(this);
        return infos;
    }

    @Override
    public void visit(TypeIdentifierNode node) {
        assert (node.info != null);
        assert (node.info.getDefinition() != null);
        infos.add(node.info);
    }

    @Override
    public void visit(IdentifierNode node) {
        assert (node.info != null);
        assert (node.info.getDefinition() != null || node.info.declaredType != null || !node.info.generic.global);
        infos.add(node.info);
    }

    @Override
    public void visit(UnitIdentifierNode node) {
        assert (node.info != null);
        assert (node.info.getDefinition() != null);
        infos.add(node.info);
    }

}
