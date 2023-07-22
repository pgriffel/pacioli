package pacioli.ast.visitors;

import pacioli.Pacioli;
import pacioli.ast.IdentityVisitor;
import pacioli.ast.expression.ApplicationNode;

public class RewriteOverloads extends IdentityVisitor {

    public void visit(ApplicationNode node) {
        if (node.hasId()) {
            if (node.getId().getInfo().typeClass.isPresent()) {
                Pacioli.log("Rewriting %s :: %s of class %s", node.getId().getName(),
                        node.getId().getInfo().getType().pretty(),
                        node.getId().getInfo().typeClass.get().name());
            }
        }
        // returnNode(node);
    }
}
