package pacioli.types;

import pacioli.CompilationSettings;
import uom.Base;
import uom.PowerProduct;
import uom.Unit;

public interface TypeBase extends Base<TypeBase> {
    
    public final static Unit<TypeBase> ONE = new PowerProduct<TypeBase>();
    
    public String compileToJS();

    public String compileToMVM(CompilationSettings settings);
    
}
