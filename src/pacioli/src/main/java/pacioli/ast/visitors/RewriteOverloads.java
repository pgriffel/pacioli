package pacioli.ast.visitors;

import pacioli.Pacioli;
import pacioli.ast.IdentityVisitor;
import pacioli.ast.expression.ApplicationNode;

public class RewriteOverloads extends IdentityVisitor {

    public void visit(ApplicationNode node) {
        if (node.hasId()) {
            if (node.id().info().typeClass().isPresent()) {
                Pacioli.logIf(Pacioli.Options.showClassRewriting,
                        "Rewriting call to overloaded function %s of class %s. Type is %s", node.id().name(),
                        node.id().info().typeClass().get().name(),
                        node.id().info().publicType().pretty());
            }
        }
        // returnNode(node);
    }
}
