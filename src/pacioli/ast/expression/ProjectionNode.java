package pacioli.ast.expression;

import java.io.PrintWriter;
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
    private final TypeNode hardType;
    private MatrixType type;

    public ProjectionNode(List<ConstNode> columns, TypeNode hardType, ExpressionNode body, Location location) {
        super(location);
        this.columns = columns;
        this.body = body;
        this.hardType = hardType;
    }

    private ProjectionNode(List<ConstNode> columns, TypeNode hardType, ExpressionNode body, MatrixType type,
            Location location) {
        super(location);
        this.columns = columns;
        this.body = body;
        this.hardType = hardType;
        this.type = type;
    }

    @Override
    public void printText(PrintWriter out) {
        out.print("project ");
        out.print(numString());
        out.print(" from ");
        body.printText(out);
        out.print(" end");
    }

    @Override
    public String compileToJS(boolean boxed) {
        assert (type != null);
        return String.format("Pacioli.projectNumbers(%s, %s.param, [%s])", body.compileToJS(boxed), type.compileToJS(),
                numString());
    }

    public String numString() {
        List<String> columns = new ArrayList<String>();
        for (ConstNode node : this.columns) {
            columns.add(node.valueString());
        }
        return Utils.intercalate(",", columns);
    }

    @Override
    public String compileToMATLAB() {
        return String.format("(@(%s) %s)", numString(), body.compileToMATLAB());
    }

    @Override
    public void accept(Visitor visitor) {
        visitor.visit(this);
    }

}
