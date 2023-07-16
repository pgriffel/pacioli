package pacioli.symboltable;

import pacioli.Location;

public abstract class AbstractSymbolInfo implements SymbolInfo {

    private GeneralInfo general;

    public AbstractSymbolInfo(GeneralInfo general) {
        this.general = general;
    };

    @Override
    public GeneralInfo generalInfo() {
        return general;
    }

    @Override
    public String name() {
        return generalInfo().name;
    }

    @Override
    public Location getLocation() {
        return general.location();
    }

    @Override
    public Boolean isGlobal() {
        return general.isGlobal();
    }
}
