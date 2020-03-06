package pacioli.ast.expression;

import pacioli.Location;
import pacioli.ValueContext;
import pacioli.ast.Visitor;
import pacioli.symboltable.SymbolTable;
import pacioli.symboltable.ValueInfo;

public class StatementNode extends AbstractExpressionNode {

    public final SequenceNode body;

    // Filled during resolve
    public SymbolTable<ValueInfo> table;

    public StatementNode(Location location, SequenceNode body) {
        super(location);
        this.body = body;
    }

    private StatementNode(Location location, SequenceNode body, ValueContext context) {
        super(location);
        this.body = body;
    }

    public StatementNode resolve(SequenceNode body, ValueContext context) {
        return new StatementNode(getLocation(), body, context);
    }

    @Override
    public String compileToMATLAB() {
        return body.compileToMATLAB();
    }

    @Override
    public void accept(Visitor visitor) {
        visitor.visit(this);
    }
}
