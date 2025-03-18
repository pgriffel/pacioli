package pacioli.ast.expression;

import java.util.List;

import pacioli.ast.AbstractNode;
import pacioli.ast.Visitor;
import pacioli.compiler.Location;

public class DataQueryNode extends AbstractNode implements ExpressionNode {

    public final List<ExpressionNode> contraDims;
    public final List<ExpressionNode> coDims;
    public final IdentifierNode source;
    public final ExpressionNode condition;

    public DataQueryNode(
            List<ExpressionNode> contraDims,
            List<ExpressionNode> coDims,
            IdentifierNode source,
            ExpressionNode condition,
            Location location) {
        super(location);
        this.contraDims = contraDims;
        this.coDims = coDims;
        this.source = source;
        this.condition = condition;
    }

    @Override
    public void accept(Visitor visitor) {
        visitor.visit(this);
    }
}
