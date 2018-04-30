package pacioli.ast.definition;

import java.io.PrintWriter;
import pacioli.Location;
import pacioli.Pacioli;
import pacioli.Progam;
import pacioli.ast.Visitor;
import pacioli.ast.expression.IdentifierNode;
import pacioli.ast.unit.UnitNode;
import pacioli.symboltable.GenericInfo;

public class AliasDefinition extends AbstractDefinition {

	public final IdentifierNode id;
	public final UnitNode unit;

	public AliasDefinition(Location location, IdentifierNode id, UnitNode unit) {
		super(location);
		this.id = id;
		this.unit = unit;
	}
	
	@Override
	public void accept(Visitor visitor) {
		visitor.visit(this);
	}

	@Override
	public String localName() {
		return id.getName();
	}

	@Override
	public void printText(PrintWriter out) {
		throw new RuntimeException("todo");
	}

	@Override
	public String compileToJS(boolean boxed) {
		throw new RuntimeException("todo");	
	}

	@Override
	public String compileToMATLAB() {
		throw new RuntimeException("todo");	
	}

   /* public Unit evalBody() {
        DimensionedNumber number = getBody().evalUnit();
        if (!number.factor().equals(BigDecimal.ONE)) {
            throw new RuntimeException("Unexpected number in unit alias");
        }
        return number.unit();
	}*/

	@Override
	public void addToProgr(Progam program, GenericInfo info) {
		Pacioli.logln("IGNORING ALIAS");
	}

}
