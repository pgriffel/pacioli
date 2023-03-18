package pacioli.symboltable;

import java.io.File;

import pacioli.Location;

public class GenericInfo {
        
    public final String name;
    private final String module;
    private final Location location;
    private final Boolean isGlobal;
    private final Boolean isFromProgram;

    public GenericInfo(String name, String module, Boolean isGlobal, Location location, Boolean isFromProgram) {
        assert(location != null);
        this.name = name;
        this.module = module;
        this.isGlobal = isGlobal;
        this.location = location;
        this.isFromProgram = isFromProgram;
    }
    
    public Location location() {
        return location;
    }
    
    public File getFile() {
        return location.getFile();
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
        return new GenericInfo(name, module, isGlobal, location, isFromProgram);
    }
}
