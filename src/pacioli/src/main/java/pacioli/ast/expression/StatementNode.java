package pacioli.ast.expression;

import pacioli.ast.AbstractNode;
import pacioli.ast.ValueContext;
import pacioli.ast.Visitor;
import pacioli.compiler.Location;
import pacioli.symboltable.SymbolTable;
import pacioli.symboltable.info.ValueInfo;

public class StatementNode extends AbstractNode implements ExpressionNode {

    public final SequenceNode body;

    // Filled during resolve
    public SymbolTable<ValueInfo> table;
    public SymbolTable<ValueInfo> shadowed;
    public boolean isVoid;

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
