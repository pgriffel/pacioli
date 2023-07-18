package pacioli.ast.expression;

import pacioli.ast.ValueContext;
import pacioli.ast.Visitor;
import pacioli.misc.Location;
import pacioli.symboltable.SymbolTable;
import pacioli.symboltable.ValueInfo;

public class StatementNode extends AbstractExpressionNode {

    public final SequenceNode body;

    // Filled during resolve
    public SymbolTable<ValueInfo> table;
    public SymbolTable<ValueInfo> shadowed;

    // Is the value info for the result place
    public ValueInfo resultInfo;

    public StatementNode(Location location, SequenceNode body) {
        super(location);
        this.body = body;
    }

    private StatementNode(Location location, SequenceNode body, ValueContext context) {
        super(location);
        this.body = body;
    }

    @Override
    public void accept(Visitor visitor) {
        visitor.visit(this);
    }
}
