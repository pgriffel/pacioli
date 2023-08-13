package pacioli.symboltable.info;

import java.io.File;
import java.util.Optional;

import pacioli.misc.Location;
import pacioli.misc.PacioliFile;

public class GeneralInfo {

    public final String name;
    public final PacioliFile file;
    private final Location location;
    private final boolean isGlobal;
    private final boolean isPublic;
    private final String documentation;

    public GeneralInfo(String name, PacioliFile file, boolean isGlobal, boolean isPublic, Location location,
            String documentation) {
        assert (location != null);
        this.name = name;
        this.file = file;
        this.isGlobal = isGlobal;
        this.isPublic = isPublic;
        this.location = location;
        this.documentation = documentation;
    }

    public GeneralInfo(String name, PacioliFile file, boolean isGlobal, boolean isPublic, Location location) {
        assert (location != null);
        this.name = name;
        this.file = file;
        this.isGlobal = isGlobal;
        this.isPublic = isPublic;
        this.location = location;
        this.documentation = null;
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

    public boolean isGlobal() {
        return isGlobal;
    }

    public boolean isPublic() {
        return isGlobal;
    }

    public boolean isLocal() {
        return !isGlobal;
    }

    public GeneralInfo withDocumentation(String documentation) {
        return new GeneralInfo(this.name, this.file, this.isGlobal, this.isPublic, this.location, documentation);
    }

    public Optional<String> documentation() {
        return Optional.ofNullable(this.documentation);
    }
}
