/*
 * Copyright (c) 2013 - 2014 Paul Griffioen
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

import java.util.HashMap;
import java.util.Set;

import pacioli.Location;
import pacioli.Progam;
import pacioli.Typing;
import pacioli.ast.AbstractNode;
import pacioli.symboltable.TypeInfo;
import pacioli.visitors.AssignedVariablesVisitor;
import pacioli.visitors.TypeInference;

public abstract class AbstractExpressionNode extends AbstractNode implements ExpressionNode {

    public AbstractExpressionNode(Location location) {
        super(location);
    }

    @Override
    public Typing inferTyping(Progam prog) {
        HashMap<String, TypeInfo> defaultTypes = new HashMap<String, TypeInfo>();
        
        defaultTypes.put("Void", (TypeInfo) prog.typess.lookup("Void"));
        defaultTypes.put("Tuple", (TypeInfo) prog.typess.lookup("Tuple"));
        defaultTypes.put("String", (TypeInfo) prog.typess.lookup("String"));
        defaultTypes.put("Boole", (TypeInfo) prog.typess.lookup("Boole"));
        
        TypeInference visitor = new TypeInference(defaultTypes);
        return visitor.typingAccept(this);
    }

    @Override
    public Set<IdentifierNode> locallyAssignedVariables() {
        AssignedVariablesVisitor visitor = new AssignedVariablesVisitor();
        return visitor.idsAccept(this);
    }
}
