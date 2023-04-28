package pacioli.symboltable;

import java.io.File;

import pacioli.Location;
import pacioli.PacioliFile;

public class GenericInfo {
        
    public final String name;
    private final PacioliFile file;
    private final String module;
    private final Location location;
    private final Boolean isGlobal;

    public GenericInfo(String name, PacioliFile file, String module, Boolean isGlobal, Location location) {
        assert(location != null);
        this.name = name;
        this.file = file;
        this.module = module;
        this.isGlobal = isGlobal;
        this.location = location;
        // if (!file.getModule().equals(module)) {
        //     throw new RuntimeException("yippie");
        // }
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
