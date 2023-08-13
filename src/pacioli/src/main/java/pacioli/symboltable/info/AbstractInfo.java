package pacioli.symboltable.info;

import pacioli.misc.Location;
import pacioli.misc.PacioliFile;

public abstract class AbstractInfo implements Info {

    private final GeneralInfo general;

    public AbstractInfo(GeneralInfo general) {
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
    public boolean isGlobal() {
        return general.isGlobal();
    }

    @Override
    public boolean isPublic() {
        return general.isPublic();
    }

    @Override
    public boolean isFromFile(PacioliFile file) {
        return generalInfo().module().equals(file.module());
    }
}
