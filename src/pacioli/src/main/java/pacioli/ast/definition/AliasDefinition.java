package pacioli.ast.definition;

import java.math.BigDecimal;

import pacioli.ast.Visitor;
import pacioli.ast.unit.UnitNode;
import pacioli.compiler.Location;
import pacioli.compiler.PacioliException;
import pacioli.types.ast.TypeIdentifierNode;
import pacioli.types.type.TypeBase;
import uom.DimensionedNumber;
import uom.Unit;

public class AliasDefinition extends AbstractDefinition {

    public final TypeIdentifierNode id;
    public final UnitNode unit;

    public AliasDefinition(Location location, TypeIdentifierNode id, UnitNode unit) {
        super(location);
        this.id = id;
        this.unit = unit;
    }

    @Override
    public void accept(Visitor visitor) {
        visitor.visit(this);
    }

    @Override
    public String name() {
        return id.name();
    }

    public Unit<TypeBase> evalBody() {
        DimensionedNumber<TypeBase> number = unit.evalUnit();
        if (!number.factor().equals(BigDecimal.ONE)) {
            throw new PacioliException(location(), "Unexpected number in unit alias");
            // Pacioli.warn("Unexpected number in unit alias %s: %s", id.getName(),
            // number.factor());
        }
        return number.unit();
    }
}
