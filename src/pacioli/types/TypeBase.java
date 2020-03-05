package pacioli.types;

import uom.Base;
import uom.BaseUnit;
import uom.PowerProduct;
import uom.Unit;

//public interface TypeBase extends Unit<TypeBase> {
//public abstract class TypeBase extends BaseUnit<TypeBase>  {
//public abstract class TypeBase extends BaseUnit<TypeBase> {
public interface TypeBase extends Base<TypeBase> {
    
    public final static Unit<TypeBase> ONE = new PowerProduct<TypeBase>();
    
    public String compileToJS();

    public String compileToMVM();
}
