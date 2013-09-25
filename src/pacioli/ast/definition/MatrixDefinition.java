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

import pacioli.ast.expression.MatrixTypeNode;
import pacioli.ast.expression.KeyNode;
import pacioli.ast.expression.IdentifierNode;
import pacioli.ast.expression.ConstNode;
import pacioli.ast.expression.ApplicationNode;
import java.io.PrintWriter;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;
import pacioli.CompilationSettings;
import pacioli.Dictionary;
import pacioli.Location;
import pacioli.Module;
import pacioli.PacioliException;
import pacioli.TypeContext;
import pacioli.ast.expression.ExpressionNode;
import pacioli.types.PacioliType;
import pacioli.types.ast.TypeNode;
import pacioli.types.matrix.DimensionType;
import pacioli.types.matrix.MatrixType;
import org.codehaus.jparsec.functors.Pair;

public class MatrixDefinition extends AbstractDefinition {

    private final IdentifierNode id;
    private final TypeNode typeNode;
    private final List<Pair<List<String>, ConstNode>> pairs;
    private PacioliType type;
    private ExpressionNode body;

    public MatrixDefinition(Module module, IdentifierNode id, TypeNode typeNode, List<Pair<List<String>, ConstNode>> pairs, Location location) {
        super(module, location);
        this.id = id;
        this.typeNode = typeNode;
        this.pairs = pairs;
        this.type = null;
        this.body = null;
    }

    // todo: remove at least one of the following two methods
    public TypeNode getTypeNode() {
        return typeNode;
    }

    private PacioliType type(Dictionary dictionary, TypeContext context, boolean reduce) throws PacioliException {
        if (type == null) {
            type = typeNode.eval(dictionary, context, reduce);
        }
        return type;
    }

    @Override
    public String localName() {
        return id.getName();
    }

    @Override
    public void updateDictionary(Dictionary dictionary, boolean reduce) throws PacioliException {
        body = body(dictionary, new TypeContext());
        dictionary.putType(localName(), type(dictionary, new TypeContext(), true));
    }

    @Override
    public void printText(PrintWriter out) {
        throw new UnsupportedOperationException("Not supported yet."); //To change body of generated methods, choose Tools | Templates.
    }

    @Override
    public void resolveNames(Dictionary dictionary, Map<String, Module> globals, Set<String> context, Set<String> mutableContext) throws PacioliException {
        body = body.resolved(dictionary, globals, context, mutableContext);
    }

    @Override
    public Set<Definition> uses() {
        return new HashSet<Definition>();
    }

    @Override
    public String compileToMVM(CompilationSettings settings) {
        assert (body != null);
        return String.format("\nstore \"%s\" %s;\n", globalName(), body.compileToMVM(settings));
    }

    @Override
    public String compileToJS() {
        throw new UnsupportedOperationException("Not supported yet."); //To change body of generated methods, choose Tools | Templates.
    }

    @Override
    public String compileToMATLAB() {
        return String.format("\nglobal %s = %s;\n",
                    globalName().toLowerCase(),
                    body.compileToMATLAB());
    }

    private ExpressionNode body(Dictionary dictionary, TypeContext context) throws PacioliException {

        PacioliType bodyType = type(dictionary, context, true);

        if (!(bodyType instanceof MatrixType)) {
            throw new PacioliException(getLocation(), "Expected a matrix type but found %s", bodyType.description());
        }
        MatrixType matrixType = (MatrixType) bodyType;

        MatrixTypeNode bang = new MatrixTypeNode(getLocation(), typeNode);

        if (!(matrixType.rowDimension instanceof DimensionType)) {
            throw new PacioliException(getLocation(), "Expected a closed matrix type but found %s", matrixType.description());
        }
        if (!(matrixType.columnDimension instanceof DimensionType)) {
            throw new PacioliException(getLocation(), "Expected a closed matrix type but found %s", matrixType.description());
        }
        DimensionType rowDim = (DimensionType) matrixType.rowDimension;
        DimensionType columnDim = (DimensionType) matrixType.columnDimension;


        List<String> rowIndexSets = rowDim.getIndexSets();
        List<String> columnIndexSets = columnDim.getIndexSets();

        ExpressionNode body;

        if (pairs.isEmpty()) {
            List<ExpressionNode> args = new ArrayList<ExpressionNode>();
            args.add(new ConstNode("0", getLocation()));
            args.add(bang);
            body = new ApplicationNode(new IdentifierNode("scale", getLocation()), args, getLocation());
        } else {
            ExpressionNode list = new ApplicationNode(new IdentifierNode("empty_list", getLocation()), new ArrayList<ExpressionNode>(), getLocation());
            for (Pair<List<String>, ConstNode> pair : pairs) {

                KeyNode rowKey = new KeyNode(getLocation());
                for (int i = 0; i < rowIndexSets.size(); i++) {
                    rowKey = rowKey.merge(new KeyNode(rowIndexSets.get(i), pair.a.get(i), getLocation()));
                }

                KeyNode columnKey = new KeyNode(getLocation());
                int offset = rowIndexSets.size();
                for (int i = 0; i < columnIndexSets.size(); i++) {
                    columnKey = columnKey.merge(new KeyNode(columnIndexSets.get(i), pair.a.get(offset + i), getLocation()));
                }

                List<ExpressionNode> args = new ArrayList<ExpressionNode>();
                args.add(rowKey);
                args.add(columnKey);
                args.add(pair.b);

                List<ExpressionNode> tup = new ArrayList<ExpressionNode>();
                tup.add(list);
                tup.add(new ApplicationNode(new IdentifierNode("tuple", getLocation()), args, getLocation()));
                list = new ApplicationNode(new IdentifierNode("add_mut", getLocation()), tup, getLocation());
            }

            List<ExpressionNode> args = new ArrayList<ExpressionNode>();
            args.add(list);
            body = new ApplicationNode(new IdentifierNode("make_matrix", getLocation()), args, getLocation());

            args = new ArrayList<ExpressionNode>();
            args.add(body);
            args.add(bang);
            body = new ApplicationNode(new IdentifierNode("multiply", getLocation()), args, getLocation());

        }

        return body;
    }
}
