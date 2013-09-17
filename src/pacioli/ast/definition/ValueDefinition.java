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

package pacioli.ast.definition;

import pacioli.ast.expression.IdentifierNode;
import pacioli.ast.expression.LambdaNode;
import java.io.PrintWriter;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Set;
import pacioli.CompilationSettings;
import pacioli.Dictionary;
import pacioli.Pacioli;
import pacioli.Module;
import pacioli.PacioliException;
import pacioli.Typing;
import pacioli.ast.expression.ExpressionNode;
import pacioli.ast.expression.SequenceNode;
import pacioli.types.PacioliType;

public class ValueDefinition extends AbstractDefinition {

    private final IdentifierNode id;
    private final ExpressionNode body;
    private ExpressionNode resolvedBody;
    private PacioliType type;

    public ValueDefinition(Module module, IdentifierNode id, ExpressionNode body) {
        super(module, id.getLocation().join(body.getLocation()));
        this.id = id;
        this.body = body;
    }
    
    // hack voor seq
    public ValueDefinition(Module module, IdentifierNode id, ExpressionNode body, ExpressionNode resolvedBody) {
        super(module, id.getLocation().join(body.getLocation()));
        this.id = id;
        this.body = body;
        this.resolvedBody = resolvedBody;
    }

    public boolean isFunction() {
        return (body instanceof LambdaNode);
    }

    public PacioliType inferType(Dictionary dictionary, Map<String, PacioliType> context) throws PacioliException {
        Typing typing = resolvedBody.inferTyping(dictionary, context);
        Pacioli.log3("\n%s", typing.toText());
        return typing.solve().simplify();
    }

    @Override
    public String localName() {
        return id.getName();
    }

    @Override
    public void printText(PrintWriter out) {
        if (type != null) {
            out.format("\n%s :: %s;\n", localName(), type.unfresh().toText());
        }
        out.format("define %s = %s;\n", localName(), body.toText());
    }

    @Override
    public void updateDictionary(Dictionary dictionary, boolean reduce) throws PacioliException {
    }

    @Override
    public void resolveNames(Dictionary dictionary, Map<String, Module> globals, Set<String> context, Set<String> mutableContext) throws PacioliException {
        resolvedBody = body.resolved(dictionary, globals, context, mutableContext);
    }

    @Override
    public Set<Definition> uses() {
        return resolvedBody.uses();
    }

    @Override
    public String compileToMVM(CompilationSettings settings) {
        return String.format("\nstore \"%s\" %s;", globalName(), resolvedBody.transformMutableVarRefs().compileToMVM(settings));
    }

    @Override
    public String compileToJS() {
        ExpressionNode transformedBody = resolvedBody.transformMutableVarRefs();
        if (transformedBody instanceof LambdaNode) {
            LambdaNode code = (LambdaNode) transformedBody;
            return String.format("\nfunction %s (%s) {\n  return %s;\n}",
                    globalName(),
                    code.argsString(),
                    code.expression.compileToJS());
        } else {
            return String.format("\nfunction g_%s() {\n  return %s;\n}",
                    globalName(),
                    transformedBody.compileToJS());
        }
    }

    public String compileStatementToMATLAB() {
        assert (resolvedBody instanceof LambdaNode);
        LambdaNode lambda = (LambdaNode) resolvedBody;
        assert (lambda.expression instanceof SequenceNode);
        SequenceNode seq = (SequenceNode) lambda.expression;

        return String.format("\nfunction %s = %s (%s)\n %s\nendfunction;\n",
                seq.getResultPlace().toText(),
                globalName().toLowerCase(),
                lambda.argsString(),
                seq.compileToMATLAB());
    }

    @Override
    public String compileToMATLAB() {

        final List<ValueDefinition> blocks = new ArrayList<ValueDefinition>();
        String blocksCode = "";
        ExpressionNode transformed = resolvedBody.liftStatements(module, blocks);
        for (ValueDefinition def : blocks) {
            blocksCode += def.compileStatementToMATLAB();
        }

        if (transformed instanceof LambdaNode) {
            LambdaNode code = (LambdaNode) transformed;
            return blocksCode + String.format("\nfunction retval = %s (%s)\n retval = %s;\nendfunction;\n",
                    globalName().toLowerCase(),
                    code.argsString(),
                    code.expression.compileToMATLAB());
        } else {
            return blocksCode + String.format("\nglobal %s = %s;\n",
                    globalName().toLowerCase(),
                    transformed.compileToMATLAB());
        }
    }
}
