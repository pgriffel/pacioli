package pacioli.ast.visitors;

import pacioli.Pacioli;
import pacioli.ast.IdentityVisitor;
import pacioli.ast.expression.ApplicationNode;

public class RewriteOverloads extends IdentityVisitor {

    public void visit(ApplicationNode node) {
        if (node.hasId()) {
            if (node.getId().getInfo().typeClass().isPresent()) {
                Pacioli.logIf(Pacioli.Options.showClassRewriting,
                        "Rewriting call to overloaded function %s of class %s. Type is %s", node.getId().getName(),
                        node.getId().getInfo().typeClass().get().name(),
                        node.getId().getInfo().getType().pretty());
            }
        }
        // returnNode(node);
    }
}
