package pacioli.symboltable;

import java.io.File;

import pacioli.Location;

public class GenericInfo {
        
    public String name;
    private String module;
    private Location location;
    private Boolean isGlobal;

    public GenericInfo(String name, String module, Boolean isGlobal, Location location) {
        assert(location != null);
        this.name = name;
        this.module = module;
        this.isGlobal = isGlobal;
        this.location = location;
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
}
