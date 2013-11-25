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

import java.io.PrintWriter;
import java.io.StringWriter;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;

import mvm.values.matrix.MatrixDimension;

import org.codehaus.jparsec.functors.Pair;

import pacioli.CompilationSettings;
import pacioli.Dictionary;
import pacioli.Location;
import pacioli.Module;
import pacioli.PacioliException;
import pacioli.TypeContext;
import pacioli.ast.expression.ConstNode;
import pacioli.ast.expression.ExpressionNode;
import pacioli.ast.expression.IdentifierNode;
import pacioli.ast.expression.MatrixTypeNode;
import pacioli.types.PacioliType;
import pacioli.types.ast.TypeNode;
import pacioli.types.matrix.DimensionType;
import pacioli.types.matrix.MatrixType;

public class MatrixDefinition extends AbstractDefinition {

    private final IdentifierNode id;
    private final TypeNode typeNode;
    private final List<Pair<List<String>, ConstNode>> pairs;
    private MatrixType type;
    private ExpressionNode bangBody;
	private List<Integer> rowIndices;
	private List<Integer> columnIndices;
	private List<String> values;

    public MatrixDefinition(Module module, IdentifierNode id, TypeNode typeNode, List<Pair<List<String>, ConstNode>> pairs, Location location) {
        super(module, location);
        this.id = id;
        this.typeNode = typeNode;
        this.pairs = pairs;
        this.type = null;
        this.bangBody = null;
        this.rowIndices = new ArrayList<Integer>();
        this.columnIndices = new ArrayList<Integer>();
        this.values = new ArrayList<String>();
    }

	public PacioliType getType() {
		assert (type != null);
		return type;
	}
	
    @Override
    public String localName() {
        return id.getName();
    }

    @Override
    public void updateDictionary(Dictionary dictionary, boolean reduce) throws PacioliException {
    	
    	// Determine the node's type
    	PacioliType evaluatedType = typeNode.eval(dictionary, new TypeContext(), reduce);
    	assert(evaluatedType instanceof MatrixType);
    	type = (MatrixType) evaluatedType;
    	
    	// Use the data from the dictionary to create the right data for compilation.
    	// The bang body is a left over from an earlier construction that is needed to
    	// get the type to runtime. It reuses the construction on a MatrixTypeNode (todo: 
    	// remove this construction that at runtime first creates a bang and scales it 
    	// with 0 to get an empty matrix!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!).
    	// The string indices are translated to integers.
    	bangBody  = new MatrixTypeNode(getLocation(), typeNode);
    	setCompileTimeIndices(dictionary);
    	
        // Update the dictionary
        dictionary.putType(localName(), evaluatedType);
    }

    private void setCompileTimeIndices(Dictionary dictionary) throws PacioliException {
    	
    	// Determine the matrix type. This should be a closed type using 
    	// index sets that are known at compile time.
    	if 	(!(type.rowDimension instanceof DimensionType)) {
    		throw new PacioliException(getLocation(), "Expected a closed matrix type but found %s", type.description());
    	}
    	if (!(type.columnDimension instanceof DimensionType)) {
    		throw new PacioliException(getLocation(), "Expected a closed matrix type but found %s", type.description());
    	}
    	DimensionType rowDimType = (DimensionType) type.rowDimension;
    	DimensionType columnDimType = (DimensionType) type.columnDimension;

    	// Find the compile time matrix dimensions containing the literal indices
    	MatrixDimension rowDim = rowDimType.compileTimeMatrixDimension(dictionary);
    	MatrixDimension columnDim = columnDimType.compileTimeMatrixDimension(dictionary);
    	
    	// Translate the matrix data from string indexed to integer indexed.
    	int rowWidth = rowDim.width();
    	int width = rowWidth + columnDim.width();
    	for (Pair<List<String>, ConstNode> pair : pairs) {

    		int rowPos = rowDim.ElementPos(pair.a.subList(0, rowWidth));
    		int columnPos = columnDim.ElementPos(pair.a.subList(rowWidth, width));
    		
    		rowIndices.add(rowPos);
    		columnIndices.add(columnPos);
    		values.add(pair.b.valueString());
    	}
	}

	@Override
    public void printText(PrintWriter out) {
        throw new UnsupportedOperationException("Not supported yet.");
    }

    @Override
    public void resolveNames(Dictionary dictionary, Map<String, Module> globals, Set<String> context, Set<String> mutableContext) throws PacioliException {
        bangBody = bangBody.resolved(dictionary, globals, context, mutableContext);
    }

    @Override
    public Set<Definition> uses() {
        return new HashSet<Definition>();
    }

    @Override
    public String compileToMVM(CompilationSettings settings) {
        
    	assert (type != null);
    	assert (bangBody != null);
        
        StringWriter outputStream = new StringWriter();
        PrintWriter writer = new PrintWriter(outputStream);
        
        for (int i=0; i < values.size(); i++) {
        	writer.print(rowIndices.get(i));
        	writer.print(" ");
        	writer.print(columnIndices.get(i));
        	writer.print(" \"");
        	writer.print(values.get(i));
        	writer.print("\", ");
        }
        
        return String.format("\nstorelit \"%s\" %s %s;\n", globalName(), bangBody.compileToMVM(settings), outputStream.toString());
    }

    @Override
    public String compileToJS() {
        throw new UnsupportedOperationException("Not supported yet.");
    }

    @Override
    public String compileToMATLAB() {
    	// todo: fix using the literal data now available
//        return String.format("\nglobal %s = %s;\n",
//                    globalName().toLowerCase(),
//                    body.compileToMATLAB());
        throw new UnsupportedOperationException("Not supported yet.");
    }
}
