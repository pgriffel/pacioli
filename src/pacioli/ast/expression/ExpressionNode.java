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
import java.util.Map;
import java.util.Set;
import pacioli.Dictionary;
import pacioli.Module;
import pacioli.PacioliException;
import pacioli.Typing;
import pacioli.ast.ASTNode;
import pacioli.ast.definition.ValueDefinition;
import pacioli.types.PacioliType;

public interface ExpressionNode extends ASTNode {

    public interface CallMap {

        public ExpressionNode transform(ApplicationNode node);
    }

    public interface IdMap {

        public ExpressionNode transform(IdentifierNode node);
    }

    public interface SequenceMap {

        public ExpressionNode transform(SequenceNode node);
    }

    public ExpressionNode transformCalls(CallMap map);

    public ExpressionNode transformIds(IdMap map);

    public ExpressionNode transformSequences(SequenceMap map);

    public ExpressionNode resolved(Dictionary dictionary, Map<String, Module> globals, Set<String> context, Set<String> mutableContext) throws PacioliException;

    public Typing inferTyping(Dictionary dictionary, Map<String, PacioliType> context) throws PacioliException;

    public Set<IdentifierNode> locallyAssignedVariables();

    public ExpressionNode equivalentFunctionalCode();
    
    public ExpressionNode liftStatements(Module module, List<ValueDefinition> blocks);
    
    public ExpressionNode transformMutableVarRefs();
}
