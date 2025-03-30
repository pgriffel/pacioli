/*
 * Copyright (c) 2013 - 2025 Paul Griffioen
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of
 * this software and associated documentation files (the "Software"), to deal in
 * the Software without restriction, including without limitation the rights to
 * use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of
 * the Software, and to permit persons to whom the Software is furnished to do so,
 * subject to the following conditions:
 * 
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS
 * FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
 * COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER
 * IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
 * CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

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
import pacioli.compiler.Location;
import pacioli.compiler.PacioliException;
import pacioli.compiler.PacioliFile;
import pacioli.symboltable.PacioliTable;
import pacioli.symboltable.info.ValueInfo;

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

    // final private Progam program;
    final private PacioliFile file;
    final private PacioliTable program;
    final private PacioliTable environment;

    public LiftStatements(PacioliFile file, PacioliTable program, PacioliTable env) {
        this.file = file;
        this.program = program;
        this.environment = env;
    }

    // Assumes resolved, does not produce result version:

    public void visit(StatementNode node) {

        Location nodeLocation = node.location();

        // Lift the body's statements
        ExpressionNode rec = new StatementNode(nodeLocation, (SequenceNode) expAccept(node.body));

        // FIXME. Problem with nested statements in loop.pacioli
        // Pacioli.logln("RESOLVING IN LIFTS:\n%s", node.pretty());
        // Pacioli.logln("RESOLVING IN LIFTS:\n%s", rec.pretty());

        // TODO:
        rec.resolve(this.file, this.environment);

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
                IdentifierNode idNode = new IdentifierNode(name, var.location());
                args.add(name);
                argIds.add(idNode);
            }
        }

        Location dummyLoc = nodeLocation.collapse();

        // A fresh id for the helper function
        String liftedName = node.table.freshSymbolName();
        IdentifierNode fresh = new IdentifierNode(liftedName, dummyLoc);

        // Define a helper function for the lifted body
        LambdaNode lambda = new LambdaNode(args, rec, dummyLoc);
        ValueDefinition vd = new ValueDefinition(nodeLocation, fresh, lambda, false);
        try {
            ValueInfo info = ValueInfo.builder()
                    .name(vd.name())
                    .file(this.file)
                    .isGlobal(true)
                    .isMonomorphic(false)
                    .location(nodeLocation)
                    .isPublic(false)
                    .definition(vd)
                    .build();

            program.values().put(vd.name(), info);
        } catch (PacioliException e) {
            throw new RuntimeException("Cannot add lifted statement to program", e);
        }

        // Return an application of the helper to the identifiers
        returnNode(new ApplicationNode(fresh, argIds, nodeLocation));
    }
}
