package pacioli.ast.unit;

import pacioli.ast.Node;
import pacioli.ast.visitors.UnitEvaluator;
import pacioli.types.type.TypeBase;
import uom.DimensionedNumber;

public interface UnitNode extends Node {

    default public DimensionedNumber<TypeBase> evalUnit() {
        UnitEvaluator visitor = new UnitEvaluator();
        return visitor.unitAccept(this);
    }
}
