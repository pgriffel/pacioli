package pacioli.symboltable.info;

public sealed abstract class UnitInfo extends AbstractSymbolInfo implements TypeSymbolInfo
        permits VectorBaseInfo, ScalarBaseInfo, AliasInfo {

    public UnitInfo(GeneralInfo info) {
        super(info);
    }

    @Override
    public String globalName() {
        return String.format("unit_%s", name());
    }

    public Boolean isAlias() {
        return false;
    }
}