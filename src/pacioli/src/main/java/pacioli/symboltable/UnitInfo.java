package pacioli.symboltable;

public sealed abstract class UnitInfo<T extends UnitInfo<T>> extends AbstractSymbolInfo<T> implements TypeSymbolInfo permits VectorUnitInfo, ScalarUnitInfo, AliasInfo {

    public UnitInfo(GenericInfo generic) {
        super(generic);
    }
    
    @Override
    public String globalName() {
        return String.format("unit_%s", name());
    }
    
    public Boolean isAlias() {
        return false;
    }
}
