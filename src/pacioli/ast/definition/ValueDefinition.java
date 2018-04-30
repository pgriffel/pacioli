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

package pacioli.ast.definition;

import java.io.PrintWriter;
import java.util.ArrayList;
import java.util.List;
import pacioli.Location;
import pacioli.Progam;
import pacioli.ast.Node;
import pacioli.ast.Visitor;
import pacioli.ast.expression.ExpressionNode;
import pacioli.ast.expression.IdentifierNode;
import pacioli.ast.expression.LambdaNode;
import pacioli.ast.expression.SequenceNode;
import pacioli.symboltable.GenericInfo;
import pacioli.symboltable.ValueInfo;

public class ValueDefinition extends AbstractDefinition {

    public final IdentifierNode id;
    public ExpressionNode body;

    public ValueDefinition(Location location, IdentifierNode id, ExpressionNode body) {
        super(location);
        this.id = id;
        this.body = body;
    }

    public Node transform(ExpressionNode body) {
        return new ValueDefinition(getLocation(), id, body);
    }

    public boolean isFunction() {
        return (body instanceof LambdaNode);
    }

    @Override
    public String localName() {
        return id.getName();
    }

    @Override
    public void printText(PrintWriter out) {
        out.format("define %s = %s;\n", localName(), body.toText());
    }

    @Override
    public String compileToJS(boolean boxed) {
        // ExpressionNode transformedBody = resolvedBody.transformMutableVarRefs();
        ExpressionNode transformedBody = null; // resolvedBody.desugar();
        if (transformedBody instanceof LambdaNode) {
            LambdaNode code = (LambdaNode) transformedBody;
            return String.format("\n" + "Pacioli.u_%s = function () {\n"
                    + "    var args = new Pacioli.Type('tuple', Array.prototype.slice.call(arguments));\n"
                    + "    var type = %s;\n" + "    return Pacioli.subs(type.ran(), Pacioli.match(type.dom(), args));\n"
                    + "}\n" + "Pacioli.b_%s = function (%s) {\n" + "    return %s;\n" + "}\n"
                    + "Pacioli.%s = function (%s) {\n" + "    return %s;\n" + "}\n", globalName(),
                    "fixme:: type.reduce().compileToJS()", globalName(), code.argsString(),
                    code.expression.compileToJS(true), globalName(), code.argsString(),
                    code.expression.compileToJS(false));
        } else {
            return String.format(
                    "\n" + "Pacioli.compute_u_%s = function () {\n" + "    return %s;\n" + "}\n"
                            + "Pacioli.compute_%s = function () {\n  return %s;\n}\n"
                            + "Pacioli.compute_b_%s = function () {\n  return %s;\n}\n",
                    globalName(), "fixme:  type.reduce().compileToJS()", // transformedBody.compileToJSShape(),
                    globalName(), transformedBody.compileToJS(false), globalName(), transformedBody.compileToJS(true));
        }
    }

    public String compileStatementToMATLAB() {
        Object resolvedBody = null; // fixme
        assert (resolvedBody instanceof LambdaNode);
        LambdaNode lambda = (LambdaNode) resolvedBody;
        assert (lambda.expression instanceof SequenceNode);
        SequenceNode seq = (SequenceNode) lambda.expression;

        return String.format("\nfunction %s = %s (%s)\n %s\nendfunction;\n", "result", // seq.getResultPlace().toText(),
                globalName().toLowerCase(), lambda.argsString(), seq.compileToMATLAB());
    }

    @Override
    public String compileToMATLAB() {

        final List<ValueDefinition> blocks = new ArrayList<ValueDefinition>();
        String blocksCode = "";
        ExpressionNode transformed = null; // resolvedBody.liftStatements(module, blocks);
        for (ValueDefinition def : blocks) {
            blocksCode += def.compileStatementToMATLAB();
        }

        if (transformed instanceof LambdaNode) {
            LambdaNode code = (LambdaNode) transformed;
            return blocksCode + String.format("\nfunction retval = %s (%s)\n retval = %s;\nendfunction;\n",
                    globalName().toLowerCase(), code.argsString(), code.expression.compileToMATLAB());
        } else {
            return blocksCode
                    + String.format("\nglobal %s = %s;\n", globalName().toLowerCase(), transformed.compileToMATLAB());
        }
    }

    @Override
    public void accept(Visitor visitor) {
        visitor.visit(this);
    }

    @Override
    public void addToProgr(Progam program, GenericInfo generic) {
        ValueInfo info = program.ensureValueRecord(id.getName());
        info.generic = generic;
        if (info.generic.local) {
            info.definition = this;
        }
    }

}
