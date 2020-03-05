package pacioli.ast.unit;

import pacioli.ast.Node;
import pacioli.types.TypeBase;
import uom.DimensionedNumber;

public interface UnitNode extends Node {

    public DimensionedNumber<TypeBase> evalUnit();

}
