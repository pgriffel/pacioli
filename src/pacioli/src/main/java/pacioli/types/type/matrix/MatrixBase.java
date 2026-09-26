/*
 * Copyright 2026 Paul Griffioen
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

package pacioli.types.type.matrix;

import pacioli.compiler.CompilationSettings;
import uom.Base;
import uom.Fraction;
import uom.Unit;

public interface MatrixBase extends Base {

    default public boolean isVar() {
        return false;
    }

    public final static Unit<MatrixBase> ONE = Unit.one();

    /**
     * The compiler use ScalarBase in unit expressions (defunit) and in type
     * expressions. The JavaScript runtime uses different bases for the two cases.
     * The forType flag indicates whether we are compiling for type expressions or
     * for unit expressions in unit definitions.
     */
    public String asJS(boolean forType);

    public String asMVMUnit(CompilationSettings settings);

    public String asMVMShape(CompilationSettings settings);

    public static <B extends MatrixBase> String compileUnitToMVM(Unit<B> unit, CompilationSettings settings) {
        return unit.fold(new UnitMVMGenerator<B>(settings));
    }

    // UNITTODO
    static public class UnitMVMGenerator<B extends MatrixBase> implements Unit.Fold<B, String> {

        private CompilationSettings settings;

        public UnitMVMGenerator(CompilationSettings settings) {
            this.settings = settings;
        }

        @Override
        public String map(MatrixBase base) {
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

    public static <B extends MatrixBase> String compileUnitToJS(Unit<B> unit) {
        return compileUnitToJSHelper(unit, false);
    }

    public static <B extends MatrixBase> String compileUnitToJSType(Unit<B> unit) {
        return compileUnitToJSHelper(unit, true);
    }

    private static <B extends MatrixBase> String compileUnitToJSHelper(Unit<B> unit, boolean forType) {
        String product = "";
        int n = 0;
        for (B base : unit.bases()) {
            String baseText = base.asJS(forType) + ".expt(" + unit.power(base) + ")";
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
