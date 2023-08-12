package pacioli.symboltable.info;

import java.io.File;
import java.util.Optional;

import pacioli.misc.Location;
import pacioli.misc.PacioliFile;

public class GeneralInfo {

    public final String name;
    public final PacioliFile file;
    private final Location location;
    private final Boolean isGlobal;
    private String documentation;

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

    public void setDocumentation(String documentation) {
        this.documentation = documentation;
    }

    public Optional<String> getDocumentation() {
        return Optional.ofNullable(this.documentation);
    }
}
