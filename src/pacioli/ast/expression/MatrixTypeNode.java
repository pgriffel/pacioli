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
import pacioli.PacioliFile;
import pacioli.PacioliException;
import pacioli.TypeContext;
import pacioli.Typing;
import pacioli.ValueContext;
import pacioli.ast.definition.Definition;
import pacioli.ast.definition.ValueDefinition;
import pacioli.types.PacioliType;
import pacioli.types.ast.TypeNode;
import pacioli.types.matrix.BangBase;
import pacioli.types.matrix.IndexList;
import pacioli.types.matrix.MatrixType;
import pacioli.types.matrix.StringBase;
import uom.Base;
import uom.Unit;

public class MatrixTypeNode extends AbstractExpressionNode {

    private final TypeNode typeNode;
    
    private final MatrixDimension rowDim;
    private final MatrixDimension columnDim;
    
    public MatrixTypeNode(Location location, TypeNode typeNode) {
        super(location);
        this.typeNode = typeNode;
        this.rowDim = null;
        this.columnDim = null;
    }

    private MatrixTypeNode(Location location, TypeNode typeNode, 
    		MatrixDimension rowDim, MatrixDimension columnDim) {
        super(location);
        this.typeNode = typeNode;
        this.rowDim = rowDim;
        this.columnDim = columnDim;
    }

    @Override
    public void printText(PrintWriter out) {
        out.print("|");
        typeNode.printText(out);
        out.print("|");
    }

    @Override
    public ExpressionNode resolved(Dictionary dictionary, ValueContext context) throws PacioliException {
    	TypeNode resolvedType = typeNode.resolved(dictionary, new TypeContext());
    	MatrixDimension rowDim = dictionary.compileTimeRowDimension(resolvedType);
    	MatrixDimension columnDim = dictionary.compileTimeColumnDimension(resolvedType);
        return new MatrixTypeNode(getLocation(), resolvedType, rowDim, columnDim);
    }

    @Override
    public Typing inferTyping(Map<String, PacioliType> context) throws PacioliException {
        assert (typeNode != null);
        return new Typing(typeNode.eval(true));
    }

    @Override
    public Set<Definition> uses() {
        return typeNode.uses();
    }

    @Override
    public String compileToMVM(CompilationSettings settings) {
        
        
    	return String.format("matrix_constructor(\"ones\", %s)", typeNode.compileToMVM(settings));
    	/*
        // this is reused in MatrixDefinition. todo: reconsider how types 
        // are communicated to the MVM.
        try {
			//return matrixTypeMVMCode((MatrixType) typeNode.eval(false));
        	return String.format("matrix_constructor(\"one\", %s)", typeNode.compileToMVM(settings));
		} catch (PacioliException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
			return "Cannot happen!?";
		}*/
    }

    private static String matrixTypeMVMCode(MatrixType type) {

        assert (!type.rowDimension.isVar());
        assert (!type.columnDimension.isVar());

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
    public String compileToJS(boolean boxed) {
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
    	//return "Pacioli.oneMatrix(" + typeNode.compileToJS() + ")";
        if (boxed) {
            //throw new RuntimeException("matrix type node ");
            return "Pacioli.oneMatrix(" + typeNode.compileToJS(boxed) + ")";
        } else {
            return "Pacioli.oneNumbers(" + rowDim.size() + ", " + columnDim.size() + ")";
        }
    	
    }
    
    @Override
    public String compileToMATLAB() {
        return String.format("ones(%s, %s)", rowDim.size(), columnDim.size());
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
