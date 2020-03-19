package pacioli.visitors;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

import pacioli.Location;
import pacioli.Pacioli;
import pacioli.PacioliException;
import pacioli.Progam;
import pacioli.ast.IdentityTransformation;
import pacioli.ast.Visitor;
import pacioli.ast.definition.ValueDefinition;
import pacioli.ast.expression.ApplicationNode;
import pacioli.ast.expression.ExpressionNode;
import pacioli.ast.expression.IdentifierNode;
import pacioli.ast.expression.LambdaNode;
import pacioli.ast.expression.StatementNode;
import pacioli.ast.expression.SequenceNode;
import pacioli.symboltable.SymbolInfo;
import pacioli.symboltable.SymbolTable;
import pacioli.symboltable.ValueInfo;

/**
 * Lifts every statement from every definition into a separate definition to ensure that
 * statements are always toplevel.
 * 
 * Introduced for statements in MATLAB. A function with a toplevel statements is compiled
 * to a procedure (a function that allows assignments and returns). Lambdas in MATLAB
 * cannot be procedures.
 * 
 * It requires a resolved program, because it depends on the usedLocals visitor. This visitor
 * requires a resolved program to filter the globals. 
 * 
 * It does not return a properly resolved program. The caller has to resolve the result.
 * Lifting statements before resolving would eliminate resolving twice, but would make
 * finding the used locals harder.   
 */
public class LiftStatements extends IdentityTransformation implements Visitor {

    Progam prog;
    List<ValueDefinition> blocks = new ArrayList<ValueDefinition>();
    
    public class Lifted {
        public ExpressionNode expression;
        public List<ValueDefinition> statements;
    }

    public LiftStatements(Progam progam) {
        this.prog = progam;
    }
    
    // Assumes resolved, does not produce result version:
    
    public void visit(StatementNode node) {

        Location nodeLocation = node.getLocation();
        
        // Lift the body
        //ExpressionNode liftedBody = body.liftStatements(module, blocks);
        ExpressionNode liftedBody = expAccept(node.body);
        ExpressionNode seq = new StatementNode(nodeLocation, (SequenceNode) liftedBody);

        
        // Follows resolve
        //SymbolTable<ValueInfo> lambdaTable = new SymbolTable<ValueInfo>(node.table);
                
        Set<String> assigned = new HashSet<String>();
        for (IdentifierNode id: node.body.locallyAssignedVariables()) {
            assigned.add(id.getName());
        }
        

        Pacioli.logln("Uses:");
        Set<SymbolInfo> uses = new HashSet<SymbolInfo>();
        for (SymbolInfo info: node.uses()) {
            if (!info.isGlobal()) {
                uses.add(info);
                Pacioli.log(" %s", info.name());
            }
        }
        
        Pacioli.logln("In scope:");
        Set<ValueInfo> localsInScope = new HashSet<ValueInfo>();
        for (ValueInfo info: node.table.parent.allInfos()) {
            if (!info.isGlobal() && uses.contains(info)) {
                localsInScope.add(info);
                Pacioli.log(" %s", info.name());
            }
        }
        
        
        // Create the proper context for the lifted statement
        List<String> contextVars = new ArrayList<String>();
        List<ExpressionNode> contextIds = new ArrayList<ExpressionNode>();
        //for (String var : context.vars()) {
        Pacioli.logln("all names: %s", node.table.localNames());
        Pacioli.logln("assigned names: %s", node.body.locallyAssignedVariables());
        Pacioli.logln("assigned : %s", assigned);
        //for (ValueInfo var : node.usesLocals()) {
        //for (IdentifierNode var : node.usesIds()) {
        for (ValueInfo var : localsInScope) {
            //String name = var.getName();
            //if (!var.getInfo().isGlobal() && !contextVars.contains(name) && !assigned.contains(name)) {
            //if (!var.isGlobal()) {
            String name = var.name();
                
            contextVars.add(name);
            Pacioli.logln("LOCAL %s", name);
            //if (context.isRefVar(var)) {
            if (false) {
                //contextIds.add(IdentifierNode.newLocalMutableVar(var, getLocation()));
            } else {
                Location location = var.getLocation();
                IdentifierNode idNode = new IdentifierNode(name, location);
                //ValueInfo info = new ValueInfo(name, prog.getModule(), false, location);
                //idNode.setInfo(var);
                //contextIds.add(IdentifierNode.newLocalVar(var, getLocation()));
                //contextIds.add(IdentifierNode.newLocalVar(var, var.getLocation()));
                contextIds.add(idNode);
                
                //lambdaTable.put(name, var);
            }
            
        }


        // Define a helper function for the lifted statement and replace the sequence 
           // by a call to that function
           String liftedName = node.table.freshSymbolName(); 
           //IdentifierNode fresh = IdentifierNode.newValueIdentifier(module.getName(), Utils.freshName(), getLocation());
           IdentifierNode fresh = new IdentifierNode(liftedName, nodeLocation);
           
           //LambdaNode lambda = new LambdaNode(contextVars, seq, nodeLocation);
           LambdaNode lambda = new LambdaNode(contextVars, node, nodeLocation);
           
           //lambda.table = lambdaTable;


        ValueDefinition vd = new ValueDefinition(nodeLocation, fresh, lambda);
        //vd.setModule(module);
        //blocks.add(vd);
        try {
            //ValueInfo info = new ValueInfo(liftedName, prog.getModule(), true, nodeLocation);
            //info.setDefinition(vd);
            //fresh.setInfo(info);
            //prog.addInfo(info);
            Pacioli.logln("adding fresh %S", liftedName);
            vd.addToProgr(prog);
        } catch (PacioliException e) {
            throw new RuntimeException(e);
        }
        
        returnNode(new ApplicationNode(fresh, contextIds, nodeLocation));
    }
    
    // Unresolved version
/*
    public void visit(StatementNode node) {

        Location nodeLocation = node.getLocation();
        
        // Lift the body
        //ExpressionNode liftedBody = body.liftStatements(module, blocks);
        ExpressionNode liftedBody = expAccept(node.body);

        // Create the proper context for the lifted statement
        List<String> contextVars = new ArrayList<String>();
        List<ExpressionNode> contextIds = new ArrayList<ExpressionNode>();
        //for (String var : context.vars()) {
        //Pacioli.logln("all names: %s", node.table.localNames());
        //for (ValueInfo var : node.usesLocals()) {
        for (String var : node.usesNames()) {
            contextVars.add(var);
            Pacioli.logln("LOCAL %s", var);
            //if (context.isRefVar(var)) {
            if (false) {
                //contextIds.add(IdentifierNode.newLocalMutableVar(var, getLocation()));
            } else {
                String name = var;
                Location location = node.getLocation(); // better collect identifierNodes instead of strings and get the location from that
                IdentifierNode idNode = new IdentifierNode(name, location);
                contextIds.add(idNode);
            }
        }


        // Define a helper function for the lifted statement and replace the sequence 
           // by a call to that function
           String liftedName = node.table.freshSymbolName(); 
           //IdentifierNode fresh = IdentifierNode.newValueIdentifier(module.getName(), Utils.freshName(), getLocation());
           IdentifierNode fresh = new IdentifierNode(liftedName, nodeLocation);
           
           //LambdaNode lambda = new LambdaNode(contextVars, seq, nodeLocation);
           LambdaNode lambda = new LambdaNode(contextVars, node, nodeLocation);
           
           
        ValueDefinition vd = new ValueDefinition(nodeLocation, fresh, lambda);
        //vd.setModule(module);
        //blocks.add(vd);
        try {
            //ValueInfo info = new ValueInfo(liftedName, prog.getModule(), true, nodeLocation);
            //info.setDefinition(vd);
            //fresh.setInfo(info);
            
            vd.addToProgr(prog);
        } catch (PacioliException e) {
            throw new RuntimeException(e);
        }
        
        returnNode(new ApplicationNode(fresh, contextIds, nodeLocation));
    }
*/    
    // Resolved version:
    
    /*
    public void visit(StatementNode node) {

        Location nodeLocation = node.getLocation();
        
        // Lift the body
        //ExpressionNode liftedBody = body.liftStatements(module, blocks);
        ExpressionNode liftedBody = expAccept(node.body);
        ExpressionNode seq = new StatementNode(nodeLocation, (SequenceNode) liftedBody);

        
        // Follows resolve
        SymbolTable<ValueInfo> lambdaTable = new SymbolTable<ValueInfo>(node.table);
                
        // Create the proper context for the lifted statement
        List<String> contextVars = new ArrayList<String>();
        List<ExpressionNode> contextIds = new ArrayList<ExpressionNode>();
        //for (String var : context.vars()) {
        Pacioli.logln("all names: %s", node.table.localNames());
        for (ValueInfo var : node.usesLocals()) {
            contextVars.add(var.name());
            Pacioli.logln("LOCAL %s", var.name());
            //if (context.isRefVar(var)) {
            if (false) {
                //contextIds.add(IdentifierNode.newLocalMutableVar(var, getLocation()));
            } else {
                String name = var.name();
                Location location = var.getLocation();
                IdentifierNode idNode = new IdentifierNode(name, location);
                //ValueInfo info = new ValueInfo(name, prog.getModule(), false, location);
                idNode.setInfo(var);
                //contextIds.add(IdentifierNode.newLocalVar(var, getLocation()));
                //contextIds.add(IdentifierNode.newLocalVar(var, var.getLocation()));
                contextIds.add(idNode);
                
                lambdaTable.put(name, var);
            }
        }


        // Define a helper function for the lifted statement and replace the sequence 
           // by a call to that function
           String liftedName = node.table.freshSymbolName(); 
           //IdentifierNode fresh = IdentifierNode.newValueIdentifier(module.getName(), Utils.freshName(), getLocation());
           IdentifierNode fresh = new IdentifierNode(liftedName, nodeLocation);
           
           //LambdaNode lambda = new LambdaNode(contextVars, seq, nodeLocation);
           LambdaNode lambda = new LambdaNode(contextVars, node, nodeLocation);
           
           lambda.table = lambdaTable;


        ValueDefinition vd = new ValueDefinition(nodeLocation, fresh, lambda);
        //vd.setModule(module);
        //blocks.add(vd);
        try {
            ValueInfo info = new ValueInfo(liftedName, prog.getModule(), true, nodeLocation);
            info.setDefinition(vd);
            fresh.setInfo(info);
            prog.addInfo(info);
        } catch (PacioliException e) {
            throw new RuntimeException(e);
        }
        
        returnNode(new ApplicationNode(fresh, contextIds, nodeLocation));
    }*/
}
