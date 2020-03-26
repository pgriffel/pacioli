package pacioli.ast.expression;

import java.util.ArrayList;
import java.util.List;

import pacioli.Location;
import pacioli.Utils;
import pacioli.ast.Visitor;
import pacioli.types.ast.TypeNode;
import pacioli.types.matrix.MatrixType;

public class ProjectionNode extends AbstractExpressionNode {

    public final List<ConstNode> columns;
    public final ExpressionNode body;
    //private final TypeNode hardType;
    public MatrixType type;

    public ProjectionNode(List<ConstNode> columns, TypeNode hardType, ExpressionNode body, Location location) {
        super(location);
        this.columns = columns;
        this.body = body;
        //this.hardType = hardType;
    }

    private ProjectionNode(List<ConstNode> columns, TypeNode hardType, ExpressionNode body, MatrixType type,
            Location location) {
        super(location);
        this.columns = columns;
        this.body = body;
        //this.hardType = hardType;
        this.type = type;
    }

    public String numString() {
        List<String> columns = new ArrayList<String>();
        for (ConstNode node : this.columns) {
            columns.add(node.valueString());
        }
        return Utils.intercalate(",", columns);
    }

    @Override
    public void accept(Visitor visitor) {
        visitor.visit(this);
    }

}
