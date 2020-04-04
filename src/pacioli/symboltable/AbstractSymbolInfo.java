package pacioli.symboltable;

import pacioli.Location;

public abstract class AbstractSymbolInfo implements SymbolInfo {
    
    private GenericInfo generic;
        
    public AbstractSymbolInfo(GenericInfo generic) {
        this.generic = generic;
    };

    @Override
    public GenericInfo generic() {
        return generic;
    }
    
    @Override
    public String name() {
        return generic().name;
    }

    @Override
    public Location getLocation() {
        return generic.location();
    }

    @Override
    public Boolean isGlobal() {
        return generic.isGlobal();
    }
    
    public Boolean isFromProgram() {
        return generic.isFromProgram();
    };
}
