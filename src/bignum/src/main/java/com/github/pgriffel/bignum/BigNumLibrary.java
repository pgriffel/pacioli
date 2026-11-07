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

package com.github.pgriffel.bignum;

import java.util.ArrayList;
import java.util.List;

import com.github.pgriffel.mvm_api.MVMException;
import com.github.pgriffel.mvm_api.PrimitiveProvider;
import com.github.pgriffel.mvm_api.values.PacioliString;
import com.github.pgriffel.mvm_api.values.PacioliValue;
import com.github.pgriffel.mvm_api.values.Primitive;
import com.github.pgriffel.mvm_api.values.TheVoid;
import com.github.pgriffel.mvm_api.values.matrix.Matrix;

/**
 * Primitives for Pacioli's bignum library.
 */
public class BigNumLibrary implements PrimitiveProvider {

    // Duplicate!
    static TheVoid VOID = new TheVoid();

    @Override
    public List<Primitive> primitives() {
        var bignumPrimitives = new ArrayList<Primitive>();

        bignumPrimitives.add(new Primitive("make_bignum") {
            public PacioliValue apply(List<PacioliValue> params) throws MVMException {
                PacioliString input = (PacioliString) params.get(0);
                return new PacioliBigNum(input.value());
            }
        });

        bignumPrimitives.add(new Primitive("bignum_sqrt") {
            public PacioliValue apply(List<PacioliValue> params) throws MVMException {
                PacioliBigNum input = (PacioliBigNum) params.get(0);
                return input.sqrt(PacioliBigNum.precision);
            }
        });

        bignumPrimitives.add(new Primitive("bignum_add") {
            public PacioliValue apply(List<PacioliValue> params) throws MVMException {
                PacioliBigNum x = (PacioliBigNum) params.get(0);
                PacioliBigNum y = (PacioliBigNum) params.get(1);

                return x.add(y);
            }
        });

        bignumPrimitives.add(new Primitive("bignum_subtract") {
            public PacioliValue apply(List<PacioliValue> params) throws MVMException {
                PacioliBigNum x = (PacioliBigNum) params.get(0);
                PacioliBigNum y = (PacioliBigNum) params.get(1);

                return x.subtract(y);
            }
        });

        bignumPrimitives.add(new Primitive("bignum_multiply") {
            public PacioliValue apply(List<PacioliValue> params) throws MVMException {
                PacioliBigNum x = (PacioliBigNum) params.get(0);
                PacioliBigNum y = (PacioliBigNum) params.get(1);

                return x.multiply(y);
            }
        });

        bignumPrimitives.add(new Primitive("bignum_divide") {
            public PacioliValue apply(List<PacioliValue> params) throws MVMException {
                PacioliBigNum x = (PacioliBigNum) params.get(0);
                PacioliBigNum y = (PacioliBigNum) params.get(1);

                return x.divide(y, PacioliBigNum.precision);
            }
        });

        bignumPrimitives.add(new Primitive("bignum_power") {
            public PacioliValue apply(List<PacioliValue> params) throws MVMException {
                PacioliBigNum x = (PacioliBigNum) params.get(0);
                Matrix n = (Matrix) params.get(1);

                int d = (int) n.SingletonNumber();

                return x.power(d);
            }
        });

        bignumPrimitives.add(new Primitive("bignum_compare") {
            public PacioliValue apply(List<PacioliValue> params) throws MVMException {
                PacioliBigNum x = (PacioliBigNum) params.get(0);
                PacioliBigNum y = (PacioliBigNum) params.get(1);
                int val = x.value.compareTo(y.value);
                return new Matrix(val);
            }
        });

        bignumPrimitives.add(new Primitive("_bignum_precision") {
            public PacioliValue apply(List<PacioliValue> params) throws MVMException {
                return new Matrix(PacioliBigNum.precision);
            }
        });

        bignumPrimitives.add(new Primitive("_set_bignum_precision") {
            public PacioliValue apply(List<PacioliValue> params) throws MVMException {
                Matrix n = (Matrix) params.get(0);
                PacioliBigNum.precision = (int) n.SingletonNumber();
                return VOID;
            }
        });

        return bignumPrimitives;
    }
}
