package pacioli.symboltable;

import java.io.File;

public class GenericInfo {
    
    public enum Scope {LOCAL, FILE, IMPORTED};
    
    public String name;
    public String module;
    public File file;
    public Scope scope;

    public GenericInfo(String name, String module, File file, Scope scope) {
        this.name = name;
        this.module = module;
        this.file = file;
        this.scope = scope;
    }
    
    public Boolean isGlobal() {
        return scope == Scope.FILE || scope == Scope.IMPORTED;
    }
    
    public Boolean isImported() {
        return scope == Scope.IMPORTED;
    }

    public Boolean isLocal() {
        return scope == Scope.LOCAL;
    }
}
