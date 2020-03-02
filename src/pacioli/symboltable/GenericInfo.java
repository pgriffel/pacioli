package pacioli.symboltable;

import java.io.File;

import pacioli.Location;

public class GenericInfo {
    
    public enum Scope {LOCAL, FILE, IMPORTED};
    
    public String name;
    public String module;
    public File file;
    public Scope scope;
    private Location location;

    public GenericInfo(String name, String module, File file, Scope scope, Location location) {
        this.name = name;
        this.module = module;
        this.file = file;
        this.scope = scope;
        this.location = location;
    }
    
    public Location location() {
        return location;
    }
    
    public Boolean isGlobal() {
        return scope == Scope.FILE || scope == Scope.IMPORTED;
    }
    
    public Boolean isExternal() {
        return scope == Scope.IMPORTED;
    }

    public Boolean isLocal() {
        return scope == Scope.LOCAL;
    }
}
