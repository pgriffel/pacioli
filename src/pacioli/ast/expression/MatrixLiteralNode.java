package pacioli.ast.expression;

import java.io.PrintWriter;
import java.util.ArrayList;
import java.util.List;
import mvm.values.matrix.MatrixDimension;

import pacioli.Location;
import pacioli.Utils;
import pacioli.ast.Visitor;
import pacioli.types.ast.TypeNode;

public class MatrixLiteralNode extends AbstractExpressionNode {

    public final TypeNode typeNode;

    // Replace by two lists?
    public final List<ValueDecl> pairs;

    // Set during resolve. Needed to determine indices during code generation.
    public MatrixDimension rowDim;
    public MatrixDimension columnDim;

    // Obsolete
    private final List<Integer> rowIndices = new ArrayList<Integer>();
    private final List<Integer> columnIndices = new ArrayList<Integer>();
    private final List<String> values = new ArrayList<String>();

    // Obsolete? Move to parser if necessary.
    public static class ValueDecl {
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

    @Override
    public String compileToJS(boolean boxed) {

        StringBuilder builder = new StringBuilder();
        String sep = "";
        for (int i = 0; i < values.size(); i++) {
            builder.append(sep);
            builder.append("[");
            builder.append(rowIndices.get(i));
            builder.append(",");
            builder.append(columnIndices.get(i));
            builder.append(",");
            builder.append(values.get(i));
            builder.append("]");
            sep = ",";
        }
        if (boxed) {
            return "Pacioli.initialMatrix(" + typeNode.compileToJS(boxed) + "," + builder.toString() + ")";
            // throw new RuntimeException("matrix literal node ");
        }
        return String.format("Pacioli.initialNumbers(%s, %s, [%s])", rowDim.size(), columnDim.size(),
                builder.toString());

        // return String.format("Pacioli.initialMatrix(%s, [%s])",
        // typeNode.compileToJS(),
        // builder.toString());

    }

    @Override
    public String compileToMATLAB() {
        throw new RuntimeException("todo");
    }

    @Override
    public void printText(PrintWriter out) {
        String sep = "{";
        out.printf("<matrix lit :: %s = ", typeNode.toText());
        for (ValueDecl pair : pairs) {
            out.printf("%s%s -> %s", sep, Utils.intercalate(", ", pair.keys()), pair.value);
            sep = ", ";
        }
        out.print("}>");
    }

    @Override
    public void accept(Visitor visitor) {
        visitor.visit(this);
    }

}
