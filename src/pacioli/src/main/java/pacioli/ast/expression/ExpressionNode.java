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

import pacioli.ast.Node;
import pacioli.ast.visitors.AssignedVariablesVisitor;
import pacioli.ast.visitors.TypeInference;
import pacioli.compiler.PacioliFile;
import pacioli.symboltable.PacioliTable;
import pacioli.symboltable.info.ParametricInfo;
import pacioli.types.Typing;

public interface ExpressionNode extends Node {

    default public Typing inferTyping(PacioliTable prog, PacioliFile file) {
        HashMap<String, ParametricInfo> defaultTypes = new HashMap<String, ParametricInfo>();

        defaultTypes.put("Void", (ParametricInfo) prog.types().lookup("Void"));
        defaultTypes.put("Tuple", (ParametricInfo) prog.types().lookup("Tuple"));
        defaultTypes.put("Maybe", (ParametricInfo) prog.types().lookup("Maybe"));
        defaultTypes.put("String", (ParametricInfo) prog.types().lookup("String"));
        defaultTypes.put("Boole", (ParametricInfo) prog.types().lookup("Boole"));

        TypeInference visitor = new TypeInference(defaultTypes, file);
        return visitor.typingAccept(this);
    }

    default public Set<IdentifierNode> locallyAssignedVariables() {
        AssignedVariablesVisitor visitor = new AssignedVariablesVisitor();
        return visitor.idsAccept(this);
    }

}
