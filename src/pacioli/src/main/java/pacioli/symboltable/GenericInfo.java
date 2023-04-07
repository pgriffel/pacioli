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
    private final Boolean isFromProgram;

    public GenericInfo(String name, PacioliFile file, String module, Boolean isGlobal, Location location, Boolean isFromProgram) {
        assert(location != null);
        this.name = name;
        this.file = file;
        this.module = module;
        this.isGlobal = isGlobal;
        this.location = location;
        this.isFromProgram = isFromProgram;
    }
    
    public Location location() {
        return location;
    }
    
    public File getFile() {
        return file.getFile();
    }
    
    public String getModule() {
        return module;
    }
    
    public Boolean isGlobal() {
        return isGlobal;
    }
  
    public Boolean isLocal() {
        return !isGlobal;
    }

    public Boolean isFromProgram() {
        return isFromProgram;
    }

    public GenericInfo withFromProgram(boolean isFromProgram) {
        return new GenericInfo(name, file, module, isGlobal, location, isFromProgram);
    }
}
