/*
 * Copyright 2026 Paul Griffioen
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

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
import pacioli.compiler.PacioliException;

/**
 * Syntactic desugaring. Desugaring that is immediately applied to the parsed
 * AST.
 * 
 * These desugarings should not result in unreadable code. For transpilation we
 * sometimes want to maintain the original code as much as possile.
 * 
 * See the LoweringVisitor for further simplifications later on.
 */
public class DesugarVisitor extends IdentityTransformation {

    @Override
    public void visit(ProgramNode node) {

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

        List<Definition> desugared = new ArrayList<>();

        // Desugar the definitions.
        for (Definition def : noMultis) {
            Node desugaredNode = nodeAccept(def);
            assert (desugaredNode instanceof Definition);
            desugared.add((Definition) desugaredNode);
        }

        returnNode(new ProgramNode(node.location(), node.includes(), node.imports(), node.exports(), desugared));
    }

    /**
     * Special syntax for parenthesis around an expression. See the grammar. This
     * construction is needed to resolve the ambiguity of singleton tuples.
     *
     */
    public void visit(IdListNode node) {
        if (node.ids.size() == 1 && node.ids.get(0) instanceof IdentifierNode) {
            returnNode(node.ids.get(0));
        } else {
            throw new RuntimeException("Visit error", new PacioliException(node.location(),
                    "Didn't expect tuple destructuring here. Did you mean tuple(...)? Destructuring a tuple is only possible in a let or comprehension, or by applying a function to the tuple."));
        }
    }

}
