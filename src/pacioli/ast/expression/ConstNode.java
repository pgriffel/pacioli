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

import java.io.PrintWriter;
import java.util.HashSet;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;

import pacioli.CompilationSettings;
import pacioli.Dictionary;
import pacioli.Location;
import pacioli.PacioliFile;
import pacioli.PacioliException;
import pacioli.Typing;
import pacioli.ValueContext;
import pacioli.ast.definition.Definition;
import pacioli.ast.definition.ValueDefinition;
import pacioli.types.PacioliType;
import pacioli.types.ParametricType;
import pacioli.types.matrix.MatrixType;

public class ConstNode extends AbstractExpressionNode {

    private final String value;

    public ConstNode(String value, Location location) {
        super(location);
        this.value = value;
    }

    public String valueString() {
        return value;
    }

    @Override
    public void printText(PrintWriter out) {
        out.print(value);
    }

    @Override
    public ExpressionNode resolved(Dictionary dictionary, ValueContext context) {
        return this;
    }

    @Override
    public Typing inferTyping(Map<String, PacioliType> context) throws PacioliException {
        if (value.equals("true") || value.equals("false")) {
            return new Typing(new ParametricType("Boole"));
        } else {
            return new Typing(new MatrixType());
        }
    }

    @Override
    public String compileToMVM(CompilationSettings settings) {
        return String.format("const(\"%s\")", value);
    }

    @Override
    public String compileToJS() {
        if (value.equals("true") || value.equals("false")) {
            return String.format("%s", value);
        } else {
            return String.format("Pacioli.num(%s)", value);
        }
    }

    @Override
    public String compileToMATLAB() {
        return value;
    }

    @Override
    public Set<Definition> uses() {
        return new HashSet<Definition>();
    }

    @Override
    public Set<IdentifierNode> locallyAssignedVariables() {
        return new LinkedHashSet<IdentifierNode>();
    }

    @Override
    public ExpressionNode desugar() {
        return this;
    }

	@Override
	public ExpressionNode liftStatements(PacioliFile module,
			List<ValueDefinition> blocks) {
		// TODO Auto-generated method stub
		return null;
	}

}
