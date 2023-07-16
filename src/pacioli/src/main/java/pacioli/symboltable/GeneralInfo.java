package pacioli.symboltable;

import java.io.File;

import pacioli.Location;
import pacioli.PacioliFile;

public class GeneralInfo {

    public final String name;
    private final PacioliFile file;
    private final Location location;
    private final Boolean isGlobal;

    public GeneralInfo(String name, PacioliFile file, Boolean isGlobal, Location location) {
        assert (location != null);
        this.name = name;
        this.file = file;
        this.isGlobal = isGlobal;
        this.location = location;
    }

    public Location location() {
        return location;
    }

    public File getFile() {
        return file.getFile();
    }

    public String getModule() {
        return file.getModule();
    }

    public Boolean isGlobal() {
        return isGlobal;
    }

    public Boolean isLocal() {
        return !isGlobal;
    }
}
