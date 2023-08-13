package pacioli.symboltable.info;

import pacioli.misc.Location;
import pacioli.misc.PacioliFile;

public abstract class AbstractSymbolInfo implements SymbolInfo {

    private final GeneralInfo general;

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
    public Location location() {
        return general.location();
    }

    @Override
    public Boolean isGlobal() {
        return general.isGlobal();
    }

    @Override
    public boolean isFromFile(PacioliFile file) {
        return generalInfo().getModule().equals(file.getModule());
    }
}
