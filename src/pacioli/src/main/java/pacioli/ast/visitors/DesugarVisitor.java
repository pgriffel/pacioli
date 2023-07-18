package pacioli.ast.visitors;

import java.util.ArrayList;
import java.util.List;

import pacioli.ast.Node;
import pacioli.ast.IdentityTransformation;
import pacioli.ast.ProgramNode;
import pacioli.ast.definition.Declaration;
import pacioli.ast.definition.Definition;
import pacioli.ast.definition.MultiDeclaration;
import pacioli.ast.expression.IdListNode;
import pacioli.ast.expression.IdentifierNode;
import pacioli.misc.PacioliException;

public class DesugarVisitor extends IdentityTransformation {

    @Override
    public void visit(ProgramNode node) {
        /*
         * // Create a copy of the program node
         * ProgramNode prog = new ProgramNode(null);
         * 
         * // Add the includes unaltered
         * for (IdentifierNode include : node.includes) {
         * prog.addInclude(include);
         * }
         */
        // Create single declarations for the multideclarations
        List<Definition> noMultis = new ArrayList<Definition>();
        for (Definition def : node.definitions) {
            if (def instanceof MultiDeclaration) {
                MultiDeclaration decl = (MultiDeclaration) def;
                for (IdentifierNode id : decl.ids) {
                    noMultis.add(new Declaration(decl.getLocation(), id, decl.node, decl.isPublic));
                }
            } else {
                noMultis.add(def);
            }
        }

        // Desugar the definitions.
        List<Definition> desugared = new ArrayList<Definition>();
        for (Definition def : noMultis) {
            Node desugaredNode = nodeAccept(def);
            assert (desugaredNode instanceof Definition);
            // prog.addDefinition((Definition) desugared);
            desugared.add((Definition) desugaredNode);
        }

        returnNode(new ProgramNode(node.getLocation(), node.includes, node.imports, desugared));
    }

    public void visit(IdListNode node) {
        if (node.ids.size() == 1 && node.ids.get(0) instanceof IdentifierNode) {
            returnNode(node.ids.get(0));
        } else {
            throw new RuntimeException("Visit error", new PacioliException(node.getLocation(),
                    "Didn't expect tuple destructuring here. Did you mean tuple(...)? Destructuring a tuple is only possible in a let or comprehension, or by applying a function to the tuple."));
        }
    }
}
