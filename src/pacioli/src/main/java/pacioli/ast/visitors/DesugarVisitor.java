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
import pacioli.ast.expression.LetNode;
import pacioli.ast.sugar.ComprehensionNode;
import pacioli.ast.sugar.ExponentNode;
import pacioli.ast.sugar.LetFunctionBindingNode;
import pacioli.ast.sugar.LetTupleBindingNode;
import pacioli.ast.sugar.RecordDefinition;
import pacioli.compiler.PacioliException;

public class DesugarVisitor extends IdentityTransformation {

    List<Definition> desugared = new ArrayList<>();

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
        for (Definition def : node.definitions()) {
            if (def instanceof MultiDeclaration) {
                MultiDeclaration decl = (MultiDeclaration) def;
                for (IdentifierNode id : decl.ids) {
                    noMultis.add(new Declaration(decl.location(), id, decl.node));
                }
            } else {
                noMultis.add(def);
            }
        }

        // Desugar the definitions.

        for (Definition def : noMultis) {
            Node desugaredNode = nodeAccept(def);
            assert (desugaredNode instanceof Definition);
            // prog.addDefinition((Definition) desugared);
            desugared.add((Definition) desugaredNode);
        }

        returnNode(new ProgramNode(node.location(), node.includes(), node.imports(), node.exports(), desugared));
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

        ExpressionNode desugaredBody = (ExpressionNode) nodeAccept(node.body);

        if (node.binding instanceof LetTupleBindingNode tup) {
            ExpressionNode fun = new LambdaNode(freshUnderscores(idNames(tup.vars)), desugaredBody, tup.location());

            returnNode(new ApplicationNode(
                    new IdentifierNode("apply", tup.location().collapse()),
                    Arrays.asList(fun, expAccept(tup.value)),
                    tup.location()));

        } else if (node.binding instanceof LetFunctionBindingNode nd) {
            List<String> eArgs = freshUnderscores(idNames(nd.args)); // remove fresh underscors
            ExpressionNode eFun = new LambdaNode(eArgs, expAccept(nd.body), nd.location());
            LetBindingNode bind = new LetBindingNode(nd.location(), nd.name.name(), eFun);

            returnNode(new LetNode(bind, expAccept(node.body), node.location()));

        } else if (node.binding instanceof LetBindingNode bind) {
            LetBindingNode desugaredBinding = new LetBindingNode(
                    node.binding.location(),
                    bind.var,
                    expAccept(bind.value));

            returnNode(new LetNode(desugaredBinding, desugaredBody, node.location()));

        } else {
            throw new RuntimeException("Unexpected binding");
        }

    }

    // Copied from grammar.cup. TODO: solve this at one place
    private static List<String> freshUnderscores(List<String> names) {
        List<String> fresh = new ArrayList<String>();
        for (String name : names) {
            if (name.equals("_")) {
                fresh.add(freshUnderscore());
            } else {
                fresh.add(name);
            }
        }
        return fresh;
    }

    private static String freshUnderscore() {
        return "_" + counter++;
    }

    private static int counter = 0;

    private static List<String> idNames(List<IdentifierNode> ids) {
        List<String> names = new ArrayList<String>();
        for (IdentifierNode id : ids) {
            names.add(id.name());
        }
        return names;
    }

    @Override
    public void visit(RecordDefinition node) {

        for (RecordDefinition.FieldDefinition binding : node.fields) {

            this.desugared.add(node.getterDocumentation(binding));
            this.desugared.add(node.getterDeclaration(binding));
            this.desugared.add(node.getterDefinition(binding));

            this.desugared.add(node.setterDocumentation(binding));
            this.desugared.add(node.setterDeclaration(binding));
            this.desugared.add(node.setterDefinition(binding));
        }

        this.desugared.add(node.constructorDocumentation());
        this.desugared.add(node.constructorDeclaration());
        this.desugared.add(node.constructorDefinition());

        returnNode(node.typeDefinition());

    }

    @Override
    public void visit(ExponentNode node) {
        returnNode(node.asProducts());
    }

    @Override
    public void visit(ComprehensionNode node) {
        returnNode(node.asLambdas());
    }
}
