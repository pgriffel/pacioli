package pacioli.visitors;

import java.util.ArrayList;
import java.util.List;

import pacioli.ast.Node;
import pacioli.ast.Visitor;
import pacioli.ast.IdentityTransformation;
import pacioli.ast.ProgramNode;
import pacioli.ast.definition.Declaration;
import pacioli.ast.definition.Definition;
import pacioli.ast.definition.MultiDeclaration;
import pacioli.ast.expression.IdentifierNode;

public class DesugarVisitor extends IdentityTransformation implements Visitor {

    @Override
    public void visit(ProgramNode node) {
/*
        // Create a copy of the program node
        ProgramNode prog = new ProgramNode(null);

        // Add the includes unaltered
        for (IdentifierNode include : node.includes) {
            prog.addInclude(include);
        }
*/
        // Create single declarations for the multideclarations
        List<Definition> noMultis = new ArrayList<Definition>();
        for (Definition def : node.definitions) {
            if (def instanceof MultiDeclaration) {
                MultiDeclaration decl = (MultiDeclaration) def;
                for (IdentifierNode id : decl.ids) {
                    noMultis.add(new Declaration(decl.getLocation(), id, decl.node));
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
            //prog.addDefinition((Definition) desugared);
            desugared.add((Definition) desugaredNode);
        }

        returnNode(new ProgramNode(node.getLocation(), node.includes, node.imports, desugared));
    }

}
