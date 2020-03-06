package pacioli.ast.expression;

import java.io.PrintWriter;
import java.util.ArrayList;
import java.util.List;
import mvm.values.matrix.MatrixDimension;
import pacioli.AbstractPrintable;
import pacioli.Location;
import pacioli.PacioliException;
import pacioli.Utils;
import pacioli.ast.Visitor;
import pacioli.types.PacioliType;
import pacioli.types.ast.TypeNode;
import pacioli.types.matrix.MatrixType;

public class MatrixLiteralNode extends AbstractExpressionNode {

    public final TypeNode typeNode;

    // Replace by two lists?
    public final List<ValueDecl> pairs;

    // Set during resolve. Needed to determine indices during code generation.
    public MatrixDimension rowDim;
    public MatrixDimension columnDim;

    // Obsolete
    public final List<Integer> rowIndices = new ArrayList<Integer>();
    public final List<Integer> columnIndices = new ArrayList<Integer>();
    public final List<String> values = new ArrayList<String>();

    // Obsolete? Move to parser if necessary.
    public static class ValueDecl extends AbstractPrintable {
        public List<IdentifierNode> key;
        public String value;

        public ValueDecl(List<IdentifierNode> key, String value) {
            this.key = key;
            this.value = value;
        }

        public List<String> keys() {
            List<String> keys = new ArrayList<String>();
            for (IdentifierNode id : key) {
                keys.add(id.name);
            }
            return keys;
        }

        @Override
        public void printText(PrintWriter out) {
            out.printf("%s -> %s", Utils.intercalate(", ", keys()), value);
        }
    }

    public MatrixLiteralNode(Location location, TypeNode typeNode, List<ValueDecl> pairs) {
        super(location);
        this.typeNode = typeNode;
        this.pairs = pairs;
        this.rowDim = null;
        this.columnDim = null;
    }

    public MatrixLiteralNode(MatrixLiteralNode old) {
        super(old.getLocation());
        this.typeNode = old.typeNode;
        this.pairs = old.pairs;
        this.rowDim = old.rowDim;
        this.columnDim = old.columnDim;
    }
    
    public MatrixType evalType(Boolean reduce) throws PacioliException {
        PacioliType type = typeNode.evalType(reduce);
        if (type instanceof MatrixType) {
            return (MatrixType) type;
        } else {
            throw new PacioliException(typeNode.getLocation(), "Expected a matrix type");
        }
    }

    @Override
    public String compileToMATLAB() {
        throw new RuntimeException("todo");
    }

    @Override
    public void accept(Visitor visitor) {
        visitor.visit(this);
    }

}
