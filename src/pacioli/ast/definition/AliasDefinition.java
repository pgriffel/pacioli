package pacioli.ast.definition;

import java.io.PrintWriter;
import java.math.BigDecimal;

import pacioli.Location;
import pacioli.Pacioli;
import pacioli.Progam;
import pacioli.ast.Visitor;
import pacioli.ast.expression.IdentifierNode;
import pacioli.ast.unit.UnitNode;
import pacioli.symboltable.GenericInfo;
import pacioli.symboltable.UnitInfo;
import uom.DimensionedNumber;
import uom.Unit;

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

    public Unit evalBody() {
        DimensionedNumber number = unit.evalUnit();
        if (!number.factor().equals(BigDecimal.ONE)) {
            throw new RuntimeException("Unexpected number in unit alias");
        }
        return number.unit();
    }

    /*
     * public Unit evalBody() { DimensionedNumber number = getBody().evalUnit(); if
     * (!number.factor().equals(BigDecimal.ONE)) { throw new
     * RuntimeException("Unexpected number in unit alias"); } return number.unit();
     * }
     */

    @Override
    public void addToProgr(Progam program, GenericInfo generic) {
        //Pacioli.logln("Todo: store alias generic info for %s", info.name);
        //program.addAliasDefinition(this);
        UnitInfo info = program.ensureUnitRecord(localName());
        info.generic = generic;
        info.definition = this;
        info.symbol = null;
        info.baseDefinition = unit;
    }

}
