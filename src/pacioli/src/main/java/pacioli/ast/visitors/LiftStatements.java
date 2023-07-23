package pacioli.ast.visitors;

import java.util.ArrayList;
import java.util.List;
import java.util.Set;

import pacioli.ast.IdentityTransformation;
import pacioli.ast.Node;
import pacioli.ast.definition.ValueDefinition;
import pacioli.ast.expression.ApplicationNode;
import pacioli.ast.expression.ExpressionNode;
import pacioli.ast.expression.IdentifierNode;
import pacioli.ast.expression.LambdaNode;
import pacioli.ast.expression.SequenceNode;
import pacioli.ast.expression.StatementNode;
import pacioli.misc.Location;
import pacioli.misc.PacioliException;
import pacioli.misc.Progam;
import pacioli.symboltable.PacioliTable;
import pacioli.symboltable.ValueInfo;

/**
 * Lifts every statement from every definition into a separate definition to
 * ensure that statements are always toplevel.
 * 
 * Introduced for statements in MATLAB. A function with a toplevel statements is
 * compiled to a procedure (a function that allows assignments and returns).
 * Lambdas in MATLAB cannot be procedures.
 * 
 * It requires a resolved program, because it depends on the usedLocals visitor.
 * 
 * This visitor requires a resolved program to filter the globals. It does not
 * return a properly resolved program. The caller has to resolve the result.
 * 
 * Lifting statements before resolving would eliminate resolving twice, but
 * would make finding the used locals harder.
 */
public class LiftStatements extends IdentityTransformation {

    final private Progam program;
    final private PacioliTable pacioliTable;

    public LiftStatements(Progam progam, PacioliTable pacioliTable) {
        this.program = progam;
        this.pacioliTable = pacioliTable;
    }

    // Assumes resolved, does not produce result version:

    public void visit(StatementNode node) {

        Location nodeLocation = node.getLocation();

        // Lift the body's statements
        ExpressionNode rec = new StatementNode(nodeLocation, (SequenceNode) expAccept(node.body));

        // FIXME. Problem with nested statements in loop.pacioli
        // Pacioli.logln("RESOLVING IN LIFTS:\n%s", node.pretty());
        // Pacioli.logln("RESOLVING IN LIFTS:\n%s", rec.pretty());

        // TODO:
        rec.resolve(program.file, pacioliTable);

        // // Determine the used local ids
        // Set<SymbolInfo> uses = new HashSet<SymbolInfo>();
        // for (SymbolInfo info: node.uses()) {
        // if (!info.isGlobal()) {
        // uses.add(info);
        // }
        // }
        //
        // // Determine the ids in scope that are used
        // Set<ValueInfo> localsInScope = new HashSet<ValueInfo>();
        // for (ValueInfo info: node.table.parent.allInfos()) {
        // if (!info.isGlobal() && uses.contains(info)) {
        // localsInScope.add(info);
        // }
        // }
        //
        // Set<ValueInfo> localsInScope = Node.freeVars(node, node.table);
        Set<ValueInfo> localsInScope = Node.freeVars(rec, node.table);

        // Build an arg list for the helper to create. Create an
        // identifier for each used id.
        List<String> args = new ArrayList<String>();
        List<ExpressionNode> argIds = new ArrayList<ExpressionNode>();
        for (ValueInfo var : localsInScope) {
            String name = var.name();
            if (!args.contains(name)) {
                IdentifierNode idNode = new IdentifierNode(name, var.getLocation());
                args.add(name);
                argIds.add(idNode);
            }
        }

        // A fresh id for the helper function
        String liftedName = node.table.freshSymbolName();
        IdentifierNode fresh = new IdentifierNode(liftedName, nodeLocation);

        // Define a helper function for the lifted body
        LambdaNode lambda = new LambdaNode(args, rec, nodeLocation);
        ValueDefinition vd = new ValueDefinition(nodeLocation, fresh, lambda, false);
        try {
            ValueInfo info = ValueInfo.builder()
                    .name(vd.getName())
                    .file(program.file)
                    .isGlobal(true)
                    .isMonomorphic(false)
                    .location(nodeLocation)
                    .isPublic(false)
                    .definition(vd)
                    .build();

            program.values.put(vd.getName(), info);
        } catch (PacioliException e) {
            throw new RuntimeException("Cannot add lifted statement to program", e);
        }

        // Return an application of the helper to the identifiers
        returnNode(new ApplicationNode(fresh, argIds, nodeLocation));
    }
}