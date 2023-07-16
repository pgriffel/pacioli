package pacioli.types;

import pacioli.CompilationSettings;
import uom.Base;
import uom.Fraction;
import uom.PowerProduct;
import uom.Unit;
import uom.UnitFold;

public interface TypeBase extends Base<TypeBase> {

    public final static Unit<TypeBase> ONE = new PowerProduct<TypeBase>();

    public String asJS();

    public String asMVMUnit(CompilationSettings settings);

    public String asMVMShape(CompilationSettings settings);

    public static String compileUnitToMVM(Unit<TypeBase> unit, CompilationSettings settings) {
        return unit.fold(new UnitMVMGenerator(settings));
    }

    static public class UnitMVMGenerator implements UnitFold<TypeBase, String> {

        private CompilationSettings settings;

        public UnitMVMGenerator(CompilationSettings settings) {
            this.settings = settings;
        }

        @Override
        public String map(TypeBase base) {
            return base.asMVMShape(settings);
        }

        @Override
        public String mult(String x, String y) {
            return String.format("shape_binop(\"multiply\", %s, %s)", x, y);
        }

        @Override
        public String expt(String x, Fraction n) {
            return String.format("shape_expt(%s, %s)", x, n);
        }

        @Override
        public String one() {
            return "";
        }
    }

    public static String compileUnitToJS(Unit<TypeBase> unit) {
        String product = "";
        int n = 0;
        for (TypeBase base : unit.bases()) {
            TypeBase typeBase = (TypeBase) base;
            String baseText = typeBase.asJS() + ".expt(" + unit.power(base) + ")";
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
            String baseText = typeBase.asJS() + ".expt(" + unit.power(base) + ")";
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
