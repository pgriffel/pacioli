package pacioli.types;

import pacioli.CompilationSettings;
import uom.Base;
import uom.PowerProduct;
import uom.Unit;

public interface TypeBase extends Base<TypeBase> {

    public final static Unit<TypeBase> ONE = new PowerProduct<TypeBase>();

    public String compileToJS();

    public String compileToMVM(CompilationSettings settings);

    public static String compileUnitToJS(Unit<TypeBase> unit) {
        String product = "";
        int n = 0;
        for (TypeBase base : unit.bases()) {
            TypeBase typeBase = (TypeBase) base;
            String baseText = typeBase.compileToJS() + ".expt(" + unit.power(base) + ")";
            product = n == 0 ? baseText : baseText + ".mult(" + product + ")";
            n++;
        }
        if (n == 0) {
            return "Pacioli.ONE";
        } else {
            return product;
        }
    }

    /**
     * Compiles to uom-ts definition format. Replaces compileUnitToJS above.
     * 
     * @param unit
     * @return
     */
    public static String compileUnitToJSON(Unit<TypeBase> unit) {
        String product = "";
        int n = 0;
        for (TypeBase base : unit.bases()) {
            TypeBase typeBase = (TypeBase) base;
            String baseText = typeBase.compileToJS() + ".expt(" + unit.power(base) + ")";
            product = n == 0 ? baseText : baseText + ".mult(" + product + ")";
            n++;
        }
        if (n == 0) {
            return "Pacioli.ONE";
        } else {
            return product;
        }
    }
}
