/*
 * Copyright (c) 2013 Paul Griffioen
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

package pacioli.ast.expression;

import java.util.List;
import pacioli.Location;
import pacioli.Module;
import pacioli.ast.AbstractASTNode;
import pacioli.ast.definition.ValueDefinition;

public abstract class AbstractExpressionNode extends AbstractASTNode implements ExpressionNode {

    public AbstractExpressionNode(Location location) {
        super(location);
    }

    @Override
    public ExpressionNode liftStatements(final Module module, final List<ValueDefinition> blocks) {
        ExpressionNode transformed = transformSequences(new ExpressionNode.SequenceMap() {
            @Override
            public ExpressionNode transform(SequenceNode node) {
                return node.liftStatements(module, blocks);
            }
        });
        return transformed;
    }
    
    @Override
    public ExpressionNode transformMutableVarRefs() {
        return transformIds(new ExpressionNode.IdMap() {
            @Override
            public ExpressionNode transform(IdentifierNode node) {
                if (node.isMutableVar()) {
                    return ApplicationNode.newCall(node.getLocation(), "Primitives", "ref_get", node);
                } else {
                    return node;
                }
            }
        });
    }
}
