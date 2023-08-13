package pacioli.ast.visitors;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import pacioli.ast.Node;
import pacioli.ast.IdentityTransformation;
import pacioli.ast.ProgramNode;
import pacioli.ast.definition.Declaration;
import pacioli.ast.definition.Definition;
import pacioli.ast.definition.MultiDeclaration;
import pacioli.ast.expression.ApplicationNode;
import pacioli.ast.expression.ExpressionNode;
import pacioli.ast.expression.IdListNode;
import pacioli.ast.expression.IdentifierNode;
import pacioli.ast.expression.LambdaNode;
import pacioli.ast.expression.LetBindingNode;
import pacioli.ast.expression.LetFunctionBindingNode;
import pacioli.ast.expression.LetNode;
import pacioli.ast.expression.LetTupleBindingNode;
import pacioli.compiler.PacioliException;

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
                    noMultis.add(new Declaration(decl.location(), id, decl.node, decl.isPublic));
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

        returnNode(new ProgramNode(node.location(), node.includes, node.imports, node.exports, desugared));
    }

    public void visit(IdListNode node) {
        if (node.ids.size() == 1 && node.ids.get(0) instanceof IdentifierNode) {
            returnNode(node.ids.get(0));
        } else {
            throw new RuntimeException("Visit error", new PacioliException(node.location(),
                    "Didn't expect tuple destructuring here. Did you mean tuple(...)? Destructuring a tuple is only possible in a let or comprehension, or by applying a function to the tuple."));
        }
    }

    @Override
    public void visit(LetNode node) {

        // The grammar makes a new LetNode for each binding so the binding is always
        // size 1
        if (node.binding.size() > 1) {
            throw new RuntimeException("Visit error: TODO LetNode with multiple bindings.");
        }

        ExpressionNode desugaredBody = (ExpressionNode) nodeAccept(node.body);
        LetNode.BindingNode binding = node.binding.get(0);

        if (binding instanceof LetTupleBindingNode tup) {
            // The grammar already desugars this, but it is created somewhere else
            ExpressionNode fun = new LambdaNode(tup.vars, desugaredBody, tup.location());
            returnNode(new ApplicationNode(
                    new IdentifierNode("apply", tup.location()),
                    Arrays.asList(fun, (ExpressionNode) nodeAccept(tup.value)),
                    tup.location()));
        } else if (binding instanceof LetFunctionBindingNode) {
            // The grammar already desugars this
            throw new RuntimeException("TODO: desugar function let");
        } else if (binding instanceof LetBindingNode bind) {
            LetBindingNode desugaredBinding = new LetBindingNode(
                    binding.location(),
                    bind.var,
                    (ExpressionNode) nodeAccept(bind.value));
            returnNode(new LetNode(Arrays.asList(desugaredBinding), desugaredBody, node.location()));
        } else {
            throw new RuntimeException("Unexpected binding");
        }

    }
}
