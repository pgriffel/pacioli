/*
 * Copyright (c) 2013 - 2025 Paul Griffioen
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of
 * this software and associated documentation files (the "Software"), to deal in
 * the Software without restriction, including without limitation the rights to
 * use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of
 * the Software, and to permit persons to whom the Software is furnished to do so,
 * subject to the following conditions:
 * 
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS
 * FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
 * COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER
 * IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
 * CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

package pacioli.types.type;

import pacioli.compiler.CompilationSettings;
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

    // UNITTODO
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
