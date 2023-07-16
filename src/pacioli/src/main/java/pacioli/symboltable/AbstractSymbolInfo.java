package pacioli.symboltable;

import pacioli.Location;

public abstract class AbstractSymbolInfo implements SymbolInfo {

    private GeneralInfo generic;

    public AbstractSymbolInfo(GeneralInfo generic) {
        this.generic = generic;
    };

    @Override
    public GeneralInfo generic() {
        return generic;
    }

    @Override
    public String name() {
        return generic().name;
    }

    @Override
    public Location getLocation() {
        return generic.location();
    }

    @Override
    public Boolean isGlobal() {
        return generic.isGlobal();
    }
}
