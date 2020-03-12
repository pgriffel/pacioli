package pacioli.symboltable;

import java.io.File;

import pacioli.Location;

public class GenericInfo {
        
    public String name;
    private String module;
    public File file;
    private Location location;
    private Boolean isGlobal;

    public GenericInfo(String name, String module, File file, Boolean isGlobal, Location location) {
        this.name = name;
        this.module = module;
        this.file = file;
        this.isGlobal = isGlobal;
        this.location = location;
    }
    
    public Location location() {
        return location;
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
}
