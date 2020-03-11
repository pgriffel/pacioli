package pacioli.ast.definition;

import java.math.BigDecimal;

import pacioli.Location;
import pacioli.PacioliException;
import pacioli.Progam;
import pacioli.ast.Visitor;
import pacioli.ast.expression.IdentifierNode;
import pacioli.ast.unit.UnitNode;
import pacioli.symboltable.AliasInfo;
import pacioli.symboltable.GenericInfo;
import pacioli.types.TypeBase;
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
    public String compileToMATLAB() {
        throw new RuntimeException("todo");
    }

    public Unit<TypeBase> evalBody() {
        DimensionedNumber<TypeBase> number = unit.evalUnit();
        if (!number.factor().equals(BigDecimal.ONE)) {
            throw new RuntimeException("Unexpected number in unit alias");
        }
        return number.unit();
    }

    @Override
    public void addToProgr(Progam program, GenericInfo.Scope scope) throws PacioliException {
        //GenericInfo generic = new GenericInfo(localName(), program.program.module.name, 
        GenericInfo generic = new GenericInfo(localName(), program.getModule(),
                program.getFile(), scope, getLocation());
        
        AliasInfo info = new AliasInfo(generic); //program.ensureUnitRecord(localName());
        info.definition = this;
        //info.symbol = null;
        //info.baseDefinition = unit;
        program.addInfo(info);
    }

}
