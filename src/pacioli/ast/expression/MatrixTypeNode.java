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
import java.util.ArrayList;
import java.util.HashSet;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;

import mvm.values.matrix.MatrixDimension;
import pacioli.CompilationSettings;
import pacioli.Dictionary;
import pacioli.Location;
import pacioli.Module;
import pacioli.PacioliException;
import pacioli.TypeContext;
import pacioli.Typing;
import pacioli.ast.definition.Definition;
import pacioli.types.PacioliType;
import pacioli.types.ast.TypeNode;
import pacioli.types.matrix.BangBase;
import pacioli.types.matrix.DimensionType;
import pacioli.types.matrix.MatrixType;
import pacioli.types.matrix.StringBase;
import uom.Base;
import uom.Unit;

public class MatrixTypeNode extends AbstractExpressionNode {

    private final TypeNode typeNode;
    private final MatrixType type;
    private final Integer nrRows;
    private final Integer nrColumns;

    public MatrixTypeNode(Location location, TypeNode typeNode) {
        super(location);
        this.typeNode = typeNode;
        this.type = null;
        this.nrRows = null;
        this.nrColumns = null;
    }

    private MatrixTypeNode(Location location, TypeNode typeNode, MatrixType type, int nrRows, int nrColumns) {
        super(location);
        this.typeNode = typeNode;
        this.type = type;
        this.nrColumns = nrColumns;
        this.nrRows = nrRows;
    }

    @Override
    public void printText(PrintWriter out) {
        out.print("|");
        typeNode.printText(out);
        out.print("|");
    }

    @Override
    public ExpressionNode resolved(Dictionary dictionary, Map<String, Module> globals, Set<String> context, Set<String> mutableContext) throws PacioliException {

        PacioliType foundType = typeNode.eval(dictionary, new TypeContext(), true);

        if (foundType instanceof MatrixType) {
            
            MatrixType matrixType = (MatrixType) foundType;

            // The matrix type must be closed with known dimensions at compile time.
            assert (matrixType.rowDimension instanceof DimensionType);
            assert (matrixType.columnDimension instanceof DimensionType);
            DimensionType rowDimType = (DimensionType) matrixType.rowDimension;
            DimensionType columnDimType = (DimensionType) matrixType.columnDimension;
            
            // Find the compile time matrix dimensions to determine the matrix size.
        	MatrixDimension rowDim = rowDimType.compileTimeMatrixDimension(dictionary);
        	MatrixDimension columnDim = columnDimType.compileTimeMatrixDimension(dictionary);
        	
        	// Create a resolved clone
            return new MatrixTypeNode(getLocation(), typeNode, matrixType, rowDim.size(), columnDim.size());
            
        } else {
            throw new PacioliException(getLocation(), "A matrix literal expects a matrix type but got %s", foundType.toText());
        }

    }

    @Override
    public Typing inferTyping(Dictionary dictionary, Map<String, PacioliType> context) throws PacioliException {
        assert (type != null);
        return new Typing(type);
    }

    @Override
    public Set<Definition> uses() {
        return new HashSet<Definition>();
    }

    @Override
    public String compileToMVM(CompilationSettings settings) {
        assert (type != null);
        
        // this is reused in MatrixDefinition. todo: reconsider how types 
        // are communicated to the MVM.
        return matrixTypeMVMCode(type);
    }

    private static String matrixTypeMVMCode(MatrixType type) {

        assert (type.rowDimension instanceof DimensionType);
        assert (type.columnDimension instanceof DimensionType);

        String factorText = unitMVMForm(type.factor);

        List<String> rowKroneckerParts = new ArrayList<String>();
        for (Unit unit : type.rowBangUnitList()) {
            rowKroneckerParts.add(unitMVMForm(unit));
        }
        String rowText = buildMVMOperation("global_Matrix_kronecker", rowKroneckerParts);

        List<String> columnKroneckerParts = new ArrayList<String>();
        for (Unit unit : type.columnBangUnitList()) {
            columnKroneckerParts.add(unitMVMForm(unit));
        }
        String columnText = buildMVMOperation("global_Matrix_kronecker", columnKroneckerParts);

        return String.format("application(var(\"global_Matrix_scale\"), %s, application(var(\"global_Matrix_dim_div\"), %s, %s))",
                factorText, rowText, columnText);
    }

    private static String unitMVMForm(Unit unit) {
        List<String> parts = new ArrayList<String>();
        for (Base base : unit.bases()) {
            String text;
            int power = unit.power(base).intValue();
            if (base instanceof BangBase) {
                BangBase bangBase = (BangBase) base;
                if (power < 0) {
                    text = String.format("application(var(\"global_Matrix_reciprocal\"), bang(\"%s\", \"%s\"))", bangBase.indexSetName, bangBase.unitName);
                } else {
                    text = String.format("bang(\"%s\", \"%s\")", bangBase.indexSetName, bangBase.unitName);
                }
            } else if (base instanceof StringBase) {
                if (power < 0) {
                    text = String.format("application(var(\"global_Matrix_reciprocal\"), unit(\"%s\"))", base.toText());
                } else {
                    text = String.format("unit(\"%s\")", base.toText());
                }
            } else {
                throw new RuntimeException("Unexpected unit base for MVM form: " + base.getClass());
            }
            for (int i = 0; i < Math.abs(power); i++) {
                parts.add(text);
            }
        }
        return buildMVMOperation("global_Matrix_multiply", parts);
    }

    private static String buildMVMOperation(String operator, List<String> parts) {
        if (parts.isEmpty()) {
            return "const(\"1\")";
        } else if (parts.size() == 1) {
            return parts.get(0);
        } else {
            String body = parts.get(0);
            for (int i = 1; i < parts.size(); i++) {
                body = String.format("application(var(\"%s\"), %s, %s)", operator, body, parts.get(i));
            }
            return body;
        }
    }

    @Override
    public String compileToJS() {
    	/*
        String row = "[1";
        for (int i = 0; i < nrColumns - 1; i++) {
            row += ",1";
        }
        row += "]";

        String matrix = "[";
        matrix += row;
        for (int i = 0; i < nrRows - 1; i++) {
            matrix += "," + row;
        }
        matrix += "]";

        return matrix;*/
    	return "oneMatrix(" + typeNode.compileToJS() + ")";
    }

    @Override
    public String compileToMATLAB() {
        return String.format("ones(%s, %s)", nrRows, nrColumns);
    }

    @Override
    public ExpressionNode transformCalls(CallMap map) {
        return this;
    }

    @Override
    public ExpressionNode transformIds(IdMap map) {
        return this;
    }

    @Override
    public Set<IdentifierNode> locallyAssignedVariables() {
        return new LinkedHashSet<IdentifierNode>();
    }

    @Override
    public ExpressionNode equivalentFunctionalCode() {
        return this;
    }

    @Override
    public ExpressionNode transformSequences(SequenceMap map) {
        return this;
    }
}
