package pacioli.ast.definition;

import pacioli.Location;
import pacioli.Progam;
import pacioli.ast.Visitor;
import pacioli.ast.expression.ExpressionNode;

public class Toplevel extends AbstractDefinition {

    public ExpressionNode body;

    public Toplevel(Location location, ExpressionNode body) {
        super(location);
        this.body = body;
    }

    @Override
    public String localName() {
        return null;
    }

    @Override
    public String compileToMATLAB() {
        throw new RuntimeException("todo");
    }

    @Override
    public void accept(Visitor visitor) {
        visitor.visit(this);
    }

    @Override
    public void addToProgr(Progam program) {
        program.addToplevel(this);
    }

}
