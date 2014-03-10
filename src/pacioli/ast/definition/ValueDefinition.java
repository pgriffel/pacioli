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
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;

import pacioli.CompilationSettings;
import pacioli.Dictionary;
import pacioli.Location;
import pacioli.PacioliFile;
import pacioli.Pacioli;
import pacioli.PacioliException;
import pacioli.Program;
import pacioli.Typing;
import pacioli.ValueContext;
import pacioli.ast.expression.ExpressionNode;
import pacioli.ast.expression.IdentifierNode;
import pacioli.ast.expression.LambdaNode;
import pacioli.ast.expression.SequenceNode;
import pacioli.types.FunctionType;
import pacioli.types.PacioliType;
import pacioli.types.Schema;

public class ValueDefinition extends AbstractDefinition {

    private final IdentifierNode id;
    private final ExpressionNode body;
    private ExpressionNode resolvedBody;
    private PacioliType type;
	private Declaration declaration;

    public ValueDefinition(Location location, IdentifierNode id, ExpressionNode body) {
        super(location);
        this.id = id;
        this.body = body;
    }
    
    public void addToProgram(Program program, PacioliFile module) {
    	setModule(module);
    	program.addValueDefinition(this, module);
    }
    
    // hack voor seq
    public ValueDefinition(IdentifierNode id, ExpressionNode body, ExpressionNode resolvedBody) {
        super(id.getLocation().join(body.getLocation()));
        this.id = id;
        this.body = body;
        this.resolvedBody = resolvedBody;
    }

    public boolean isFunction() {
        return (body instanceof LambdaNode);
    }

	public PacioliType getType() {
		if (declaration != null) {
			return declaration.getType();
		}
		if (type == null) {
			throw new RuntimeException("Type of '" +  globalName() + "' has not been resolved yet");
		}
		assert(type != null);
		
		return type;
	}
	
    public PacioliType inferType() throws PacioliException {
    	Pacioli.log3("\n\nInferring type of %s", globalName());
    	Typing typing = resolvedBody.inferTyping(new HashMap<String, PacioliType>());
        PacioliType solved =  typing.solve();
        type = solved.simplify().generalize();
        return type;
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
    public void resolve(Dictionary dictionary) throws PacioliException {
        resolvedBody = body.resolved(dictionary, new ValueContext());
        assert (resolvedBody != null);
        if (dictionary.containsDeclaration(globalName())) {
        	declaration = dictionary.getDeclaration(globalName());
        }
    }

    @Override
    public Set<Definition> uses() {
    	assert resolvedBody != null;
        return resolvedBody.uses();
    }

    public void desugar() {
		//throw new RuntimeException("todo");	
	}

    @Override
    public String compileToMVM(CompilationSettings settings) {
        //return String.format("\nstore \"%s\" %s;", globalName(), resolvedBody.transformMutableVarRefs().desugar().compileToMVM(settings));
    	return String.format("\nstore \"%s\" %s;", globalName(), resolvedBody.desugar().compileToMVM(settings));
    }

    @Override
    public String compileToJS() {
        //ExpressionNode transformedBody = resolvedBody.transformMutableVarRefs();
    	ExpressionNode transformedBody = resolvedBody.desugar();
        if (transformedBody instanceof LambdaNode) {
            LambdaNode code = (LambdaNode) transformedBody;
            return String.format("\n" 
            		+ "u_%s = function () {\n"
            		+ "    var args = new Pacioli.Type('tuple', Array.prototype.slice.call(arguments));\n"
            		+ "    var type = %s;\n"
            		+ "    return Pacioli.subs(type.ran(), Pacioli.match(type.dom(), args));\n"
            		+ "}\n"
            		+ "function %s (%s) {\n"
            		+ "    return %s;\n" 
            		+ "}\n",
                    globalName(),
                    type.reduce().compileToJS(),
                    globalName(),
                    code.argsString(),
                    code.expression.compileToJS());
        } else {
            return String.format("\n"
            		+ "function compute_u_%s() {\n"
            		+ "    return %s;\n"
            		+ "}\n"
            		+ "function compute_%s() {\n  return %s;\n}\n",
            		globalName(),
            		type.reduce().compileToJS(), //transformedBody.compileToJSShape(),
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
                "result", //seq.getResultPlace().toText(),
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
