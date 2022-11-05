package pacioli.ast.expression;

import java.io.PrintWriter;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;

import mvm.values.matrix.MatrixDimension;
import pacioli.AbstractPrintable;
import pacioli.Location;
import pacioli.Pacioli;
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
                keys.add(id.getName());
            }
            return keys;
        }

        @Override
        public void printPretty(PrintWriter out) {
            out.printf("%s -> %s", Utils.intercalate(", ", keys()), value);
        }
    }
    
    /**
     * Combines a ValueDecl with the matrix position of the value. Only
     * applicable to closed types. For types whose size is not known at
     * compile time this needs to be done at runtime.
     *
     */
    public static class PositionedValueDecl  {
        public Integer row;
        public Integer column;
        public ValueDecl valueDecl;
        
        public PositionedValueDecl(Integer row, Integer column, ValueDecl decl) {
            this.row = row;
            this.column = column;
            this.valueDecl = decl;
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
    public void accept(Visitor visitor) {
        visitor.visit(this);
    }

    public List<PositionedValueDecl> positionedValueDecls() {
        
        List<PositionedValueDecl> decls = new ArrayList<PositionedValueDecl>(); 

        // The matrix type's row and column dimension should have been set
        // during resolving
        assert (rowDim != null && columnDim != null);

        // Write the elements. Table check stores all found indices to check for
        // doublures.
        Map<Integer, Set<Integer>> check = new HashMap<Integer, Set<Integer>>();
        int rowWidth = rowDim.width();
        int width = rowWidth + columnDim.width();
        boolean locationReported = false;
        for (ValueDecl pair : pairs) {

            // Determine the entry's position
            int rowPos = rowDim.ElementPos(pair.keys().subList(0, rowWidth));
            int columnPos = columnDim.ElementPos(pair.keys().subList(rowWidth, width));

            // Check if this entry was already found
            if (check.containsKey(rowPos)) {
                if (check.get(rowPos).contains(columnPos)) {
                    if (!locationReported) {
                        Pacioli.warn("In %s", getLocation().description());
                        locationReported = true;
                    }
                    Pacioli.warn("Duplicate: %s %s", rowDim.ElementAt(rowPos), columnDim.ElementAt(columnPos));
                } else {
                    check.get(rowPos).add(columnPos);
                }
            } else {
                Set<Integer> set = new HashSet<Integer>();
                set.add(columnPos);
                check.put(rowPos, set);
            }

            // Store the entry
            decls.add(new PositionedValueDecl(rowPos, columnPos, pair));
        }

        // Return the ValueDecl entries
        return decls;
    }

}
