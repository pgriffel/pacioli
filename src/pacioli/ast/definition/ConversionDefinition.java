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
import java.util.HashMap;
import java.util.HashSet;
import java.util.Map;
import java.util.Set;
import mvm.MVMException;
import pacioli.CompilationSettings;
import pacioli.Dictionary;
import pacioli.Module;
import pacioli.PacioliException;
import pacioli.TypeContext;
import pacioli.ast.expression.ApplicationNode;
import pacioli.ast.expression.ExpressionNode;
import pacioli.ast.expression.IdentifierNode;
import pacioli.ast.expression.MatrixTypeNode;
import pacioli.types.PacioliType;
import pacioli.types.ast.TypeNode;
import pacioli.types.matrix.MatrixType;
import mvm.values.matrix.Matrix;

public class ConversionDefinition extends AbstractDefinition {

    private final IdentifierNode id;
    private final TypeNode typeNode;
    private MatrixTypeNode bang;
    private PacioliType type;
    private Matrix matrix;
    private String jsConverted;
    private String matlabConverted;

    public ConversionDefinition(Module module, IdentifierNode id, TypeNode typeNode) {
        super(module, id.getLocation().join(typeNode.getLocation()));
        this.id = id;
        this.typeNode = typeNode;
        bang = null;
        type = null;
        matrix = null;
    }

    public TypeNode getTypeNode() {
        return typeNode;
    }

    @Override
    public String localName() {
        return id.getName();
    }

    @Override
    public void printText(PrintWriter out) {
        out.format("conversion definition %s :: %s", id.toText(), typeNode.toText());
    }

    @Override
    public void updateDictionary(Dictionary dictionary, boolean reduce) throws PacioliException {
        bang = new MatrixTypeNode(typeNode.getLocation(), typeNode);
        type = typeNode.eval(dictionary, new TypeContext(), reduce);
        if (type instanceof MatrixType) {
            matrix = dictionary.instantiateMatrixType((MatrixType) type);
        } else {
            throw new PacioliException(getLocation(), "conversion must be a matrix");
        }
        try {
            jsConverted = matrix.JSConverted();
            matlabConverted = matrix.MATLABConverted();
        } catch (MVMException ex) {
            throw new PacioliException(ex);
        }
        
        dictionary.putType(id.getName(), type);
    }

    @Override
    public void resolveNames(Dictionary dictionary, Map<String, Module> globals, Set<String> context, Set<String> mutableContext) throws PacioliException {
        ExpressionNode resolved = bang.resolved(dictionary, new HashMap<String, Module>(), new HashSet<String>(), new HashSet<String>());
        assert (resolved instanceof MatrixTypeNode);
        bang = (MatrixTypeNode) resolved;
    }

    @Override
    public Set<Definition> uses() {
        return new HashSet<Definition>();
    }

    @Override
    public String compileToMVM(CompilationSettings settings) {
        assert (bang != null);
        ExpressionNode body = ApplicationNode.newCall(bang.getLocation(), "", "conversion", bang);
        return String.format("\nstore \"%s\" %s;\n", globalName(), body.compileToMVM(settings));
    }

    @Override
    public String compileToJS() {
        //assert (jsConverted != null);
        //return String.format("\nfunction compute_%s() {\n  return %s;\n}\n", globalName(), jsConverted);
        return String.format("\nfunction compute_%s() {\n  return conversionMatrix(%s);\n}\n", globalName(), typeNode.compileToJS());
    }

    @Override
    public String compileToMATLAB() {
        assert (matlabConverted != null);
        return String.format("\nglobal %s = %s;\n", globalName().toLowerCase(), matlabConverted);
    }
}
