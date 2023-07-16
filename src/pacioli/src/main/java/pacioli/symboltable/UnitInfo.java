package pacioli.symboltable;

public sealed abstract class UnitInfo extends AbstractSymbolInfo implements TypeSymbolInfo
        permits VectorBaseInfo, ScalarBaseInfo, AliasInfo {

    public UnitInfo(GeneralInfo generic) {
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
