package pacioli.visitors;

import java.util.ArrayList;
import java.util.List;

import pacioli.ast.IdentityTransformation;
import pacioli.ast.Node;
import pacioli.ast.ProgramNode;
import pacioli.ast.Visitor;
import pacioli.ast.definition.Declaration;
import pacioli.ast.definition.Definition;
import pacioli.ast.definition.MultiDeclaration;
import pacioli.ast.definition.ValueDefinition;
import pacioli.ast.expression.ExpressionNode;
import pacioli.ast.expression.IdentifierNode;
import pacioli.ast.expression.SequenceNode;
import pacioli.ast.expression.StatementNode;

public class LiftStatements extends IdentityTransformation implements Visitor {

    List<ValueDefinition> blocks = new ArrayList<ValueDefinition>();
    
    public class Lifted {
        public ExpressionNode expression;
        public List<ValueDefinition> statements;
    }

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

    public void visit(StatementNode node) {

        // Lift the body
        //ExpressionNode liftedBody = body.liftStatements(module, blocks);
        ExpressionNode liftedBody = expAccept(node.body);
        ExpressionNode seq = new StatementNode(node.getLocation(), (SequenceNode) liftedBody);
/*
        // Create the proper context for the lifted statement
        List<String> contextVars = new ArrayList<String>();
        List<ExpressionNode> contextIds = new ArrayList<ExpressionNode>();
        //for (String var : context.vars()) {
        for (SymbolInfo var : node.uses()) {
            contextVars.add(var.name());
            //if (context.isRefVar(var)) {
            if (false) {
                //contextIds.add(IdentifierNode.newLocalMutableVar(var, getLocation()));
            } else {
                //contextIds.add(IdentifierNode.newLocalVar(var, getLocation()));
                contextIds.add(IdentifierNode.newLocalVar(var, var.getLocation()));
            }
        }

        // Define a helper function for the lifted statement and replace the sequence 
        // by a call to that function
        IdentifierNode fresh = IdentifierNode.newValueIdentifier(module.getName(), Utils.freshName(), getLocation());
        
        LambdaNode lambda = new LambdaNode(contextVars, seq, getLocation());
        
        // Follows resolve
        node.table = new SymbolTable<ValueInfo>(node.table);
        
        ValueDefinition vd = new ValueDefinition(fresh, lambda, lambda);
        vd.setModule(module);
        blocks.add(vd);
        return new ApplicationNode(fresh, contextIds, getLocation());

  */      
        returnNode(node);
    }
}
