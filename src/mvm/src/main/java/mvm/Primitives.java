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

package mvm;

import java.io.IOException;
import java.util.ArrayList;
import java.util.Collections;
import java.util.Comparator;
import java.util.List;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import mvm.values.Boole;
import mvm.values.Callable;
import mvm.values.FileHandle;
import mvm.values.Maybe;
import mvm.values.PacioliArray;
import mvm.values.PacioliList;
import mvm.values.PacioliMap;
import mvm.values.PacioliString;
import mvm.values.PacioliTuple;
import mvm.values.PacioliValue;
import mvm.values.Primitive;
import mvm.values.Reference;
import mvm.values.TheVoid;
import mvm.values.matrix.Key;
import mvm.values.matrix.Matrix;
import mvm.values.matrix.MatrixShape;

public class Primitives {

    static private String prefix = "$base_";

    static Maybe NOTHING = new Maybe();
    static TheVoid VOID = new TheVoid();

    static void load(Environment store) {

        // //////////////////////////////////////////////////////////////////////////////
        // System Functions (not in the lib_base_base_ namespace)

        store.put("$base_system__runtime_environment", new PacioliString("mvm"));

        store.put("conversion",
                new Primitive("conversion") {
                    public PacioliValue apply(List<PacioliValue> params) throws MVMException {
                        checkNrArgs(params, 1);
                        checkMatrixArg(params, 0);
                        Matrix x = (Matrix) params.get(0);
                        Matrix matrix = new Matrix(x.shape);
                        matrix.createConversion();
                        return matrix;
                    }
                });

        store.put("projection", new Primitive("projection") {
            public PacioliValue apply(List<PacioliValue> params) throws MVMException {
                checkNrArgs(params, 1);
                checkMatrixArg(params, 0);
                Matrix x = (Matrix) params.get(0);
                Matrix matrix = new Matrix(x.shape);
                matrix.createProjection();
                return matrix;
            }
        });

        storePrimitive(store, new Primitive("base_nmode") {
            public PacioliValue apply(List<PacioliValue> params) throws MVMException {
                checkNrArgs(params, 3);
                checkMatrixArg(params, 0);
                checkMatrixArg(params, 1);
                checkMatrixArg(params, 2);
                Matrix x = (Matrix) params.get(0);
                Matrix y = (Matrix) params.get(1);
                Matrix z = (Matrix) params.get(2);
                Matrix matrix = new Matrix(x.shape);
                return matrix;
            }
        });

        // //////////////////

        storeBaseValue(store, "true", new Boole(true));

        storeBaseValue(store, "false", new Boole(false));

        storePrimitive(store, new Primitive("base_nothing") {
            public PacioliValue apply(List<PacioliValue> params) throws MVMException {
                return NOTHING;
            }
        });

        storePrimitive(store, new Primitive("base_just") {
            public PacioliValue apply(List<PacioliValue> params) throws MVMException {
                return new Maybe(params.get(0));
            }
        });

        storePrimitive(store, new Primitive("base_from_just") {
            public PacioliValue apply(List<PacioliValue> params) throws MVMException {
                return ((Maybe) params.get(0)).value;
            }
        });

        storePrimitive(store, new Primitive("base_tuple") {
            public PacioliValue apply(List<PacioliValue> params) throws MVMException {
                return new PacioliTuple(params);
            }
        });

        storePrimitive(store, new Primitive("base_apply") {
            public PacioliValue apply(List<PacioliValue> params) throws MVMException {
                Callable function = (Callable) params.get(0);
                PacioliTuple tuple = (PacioliTuple) params.get(1);
                return function.apply(tuple.items());
            }
        });

        storePrimitive(store, new Primitive("base_equal") {
            public PacioliValue apply(List<PacioliValue> params) throws MVMException {
                return new Boole(params.get(0).equals(params.get(1)));
            }
        });

        storePrimitive(store, new Primitive("base_not_equal") {
            public PacioliValue apply(List<PacioliValue> params) throws MVMException {
                return new Boole(!params.get(0).equals(params.get(1)));
            }
        });

        storePrimitive(store, new Primitive("base_not") {
            public PacioliValue apply(List<PacioliValue> params) throws MVMException {
                Boole x = (Boole) params.get(0);
                return new Boole(!x.positive());
            }
        });

        storePrimitive(store, new Primitive("io_print") {
            public PacioliValue apply(List<PacioliValue> params) throws MVMException {
                PacioliValue value = params.get(0);
                if (value == null) { // void value of statements
                    throw new RuntimeException("Some statement still returning null?");
                }
                Machine.log("%s\n", value.toText());
                return VOID;
            }
        });

        storePrimitive(store, new Primitive("io__write") {
            public PacioliValue apply(List<PacioliValue> params) throws MVMException {
                PacioliValue value = params.get(0);
                if (value == null) { // void value of statements
                    throw new RuntimeException("Some statement still returning null?");
                }
                Machine.log("%s", value.toText());
                return VOID;
            }
        });

        storePrimitive(store, new Primitive("system__skip") {
            public PacioliValue apply(List<PacioliValue> params) throws MVMException {
                // return null;
                return VOID; // new Matrix(-1);
            }
        });

        storePrimitive(store, new Primitive("base_identity") {
            public PacioliValue apply(List<PacioliValue> params) throws MVMException {
                return params.get(0);
            }
        });

        storePrimitive(store, new Primitive("base__empty_ref") {
            public PacioliValue apply(List<PacioliValue> params) throws MVMException {
                return new Reference();
            }
        });

        storePrimitive(store, new Primitive("base__new_ref") {
            public PacioliValue apply(List<PacioliValue> params) throws MVMException {
                return new Reference(params.get(0));
            }
        });

        storePrimitive(store, new Primitive("base__ref_get") {
            public PacioliValue apply(List<PacioliValue> params) throws MVMException {
                Reference ref = (Reference) params.get(0);
                return ref.value();
            }
        });

        storePrimitive(store, new Primitive("base__ref_set") {
            public PacioliValue apply(List<PacioliValue> params) throws MVMException {
                Reference ref = (Reference) params.get(0);
                PacioliValue value = params.get(1);
                ref.setValue(value);
                return ref;
            }
        });

        storePrimitive(store, new Primitive("base__assign") {
            public PacioliValue apply(List<PacioliValue> params) throws MVMException {
                Reference ref = (Reference) params.get(0);
                PacioliValue value = params.get(1);
                ref.setValue(value);
                return VOID;
            }
        });

        storePrimitive(store, new Primitive("base__seq") {
            public PacioliValue apply(List<PacioliValue> params) throws MVMException {
                // return params.get(1);
                return VOID;
            }
        });

        storePrimitive(store, new Primitive("base__while") {
            public PacioliValue apply(List<PacioliValue> params) throws MVMException {
                Callable first = (Callable) params.get(0);
                Callable second = (Callable) params.get(1);

                List<PacioliValue> empty = new ArrayList<>();

                Boole test = (Boole) first.apply(empty);
                while (test.positive()) {
                    second.apply(empty);
                    test = (Boole) first.apply(empty);
                }

                return VOID;
            }
        });

        storePrimitive(store, new Primitive("base__for") {
            public PacioliValue apply(List<PacioliValue> params) throws MVMException {
                PacioliList first = (PacioliList) params.get(0);
                Callable second = (Callable) params.get(1);

                for (PacioliValue value : first.items()) {
                    second.apply(List.of(value));
                }

                return VOID;
            }
        });

        storePrimitive(store, new Primitive("base__throw_result") {
            public PacioliValue apply(List<PacioliValue> params) throws MVMException {
                Reference first = (Reference) params.get(0);
                first.setValue(params.get(1));
                throw new ControlTransfer();
            }
        });

        storePrimitive(store, new Primitive("base__catch_result") {
            public PacioliValue apply(List<PacioliValue> params) throws MVMException {
                Callable body = (Callable) params.get(0);
                Reference place = (Reference) params.get(1);
                var oldStackSize = store.machine().debugStackSize();
                try {
                    body.apply(new ArrayList<PacioliValue>());
                    throw new MVMException("Statement ends without returning a value");
                } catch (ControlTransfer ex) {
                    store.machine().unwindStackTo(oldStackSize);
                    return place.value();
                }
            }
        });

        storePrimitive(store, new Primitive("base__throw_void") {
            public PacioliValue apply(List<PacioliValue> params) throws MVMException {
                Reference first = (Reference) params.get(0);
                first.setValue(params.get(1));
                throw new ControlTransfer();
            }
        });

        storePrimitive(store, new Primitive("base__catch_void") {
            public PacioliValue apply(List<PacioliValue> params) throws MVMException {
                Callable body = (Callable) params.get(0);
                Reference place = (Reference) params.get(1);
                var oldStackSize = store.machine().debugStackSize();
                try {
                    body.apply(new ArrayList<PacioliValue>());
                    return VOID;
                } catch (ControlTransfer ex) {
                    store.machine().unwindStackTo(oldStackSize);
                    return place.value();
                }
            }
        });

        storePrimitive(store, new Primitive("base_try_catch") {
            public PacioliValue apply(List<PacioliValue> params) throws MVMException {
                Callable body = (Callable) params.get(0);
                var oldStackSize = store.machine().debugStackSize();
                try {
                    return body.apply(new ArrayList<PacioliValue>());
                } catch (MVMException ex) {
                    store.machine().unwindStackTo(oldStackSize);

                    Callable handler = (Callable) params.get(1);
                    return handler.apply(List.of(new PacioliString(ex.getMessage())));
                }
            }
        });

        storePrimitive(store, new Primitive("base_is_nothing") {
            public PacioliValue apply(List<PacioliValue> params) throws MVMException {
                Maybe maybe = (Maybe) params.get(0);
                return new Boole(maybe.value == null);
            }
        });

        storePrimitive(store, new Primitive("_void") {
            public PacioliValue apply(List<PacioliValue> params) throws MVMException {
                return VOID;
            }
        });

        // //////////////////////////////////////////////////////////////////////////////
        // Matrix

        storePrimitive(store, new Primitive("matrix_solve") {
            public PacioliValue apply(List<PacioliValue> params) throws MVMException {
                Matrix x = (Matrix) params.get(0);
                Matrix y = (Matrix) params.get(1);
                return x.solve(y);
            }
        });

        storePrimitive(store, new Primitive("matrix_plu") {
            public PacioliValue apply(List<PacioliValue> params) throws MVMException {
                Matrix x = (Matrix) params.get(0);
                return x.plu();
            }
        });

        storePrimitive(store, new Primitive("matrix_svd") {
            public PacioliValue apply(List<PacioliValue> params) throws MVMException {
                Matrix x = (Matrix) params.get(0);
                return x.svd();
                // return x.svdNonZero();
            }
        });

        storePrimitive(store, new Primitive("matrix_qr") {
            public PacioliValue apply(List<PacioliValue> params) throws MVMException {
                Matrix x = (Matrix) params.get(0);
                // return x.qrZeroSub();
                return x.qr();
            }
        });

        storePrimitive(store, new Primitive("matrix_cholesky") {
            public PacioliValue apply(List<PacioliValue> params) throws MVMException {
                Matrix x = (Matrix) params.get(0);
                return x.cholesky();
            }
        });

        storePrimitive(store, new Primitive("matrix_scalar_unit") {
            public PacioliValue apply(List<PacioliValue> params) throws MVMException {
                Matrix matrix = (Matrix) params.get(0);
                return new Matrix(matrix.shape.factor());
            }
        });

        storePrimitive(store, new Primitive("matrix_row_unit") {
            public PacioliValue apply(List<PacioliValue> params) throws MVMException {
                Matrix matrix = (Matrix) params.get(0);
                return matrix.rowUnitVector();
            }
        });

        storePrimitive(store, new Primitive("matrix_column_unit") {
            public PacioliValue apply(List<PacioliValue> params) throws MVMException {
                Matrix matrix = (Matrix) params.get(0);
                return matrix.columnUnitVector();
            }
        });

        storePrimitive(store, new Primitive("matrix_make_matrix") {
            public PacioliValue apply(List<PacioliValue> params) throws MVMException {

                List<PacioliValue> list = ((PacioliList) params.get(0)).items();
                if (list.isEmpty()) {
                    return new Matrix(0);
                } else {

                    // todo: move more checks to debug

                    PacioliValue first = list.get(0);

                    if (!(first instanceof PacioliTuple)) {
                        throw new MVMException("argument to function 'matrix' is not a list of tuples");
                    }

                    List<PacioliValue> tupleItems = ((PacioliTuple) first).items();

                    if (tupleItems.size() != 3) {
                        throw new MVMException("argument to function 'matrix' is not a list of tuples of three items");
                    }

                    if (!(tupleItems.get(0) instanceof Key && tupleItems.get(1) instanceof Key
                            && tupleItems.get(2) instanceof Matrix)) {
                        throw new MVMException(
                                "argument to function 'matrix' is not a list of (key, key, matrix) tuples");
                    }

                    Key rowKey = (Key) tupleItems.get(0);
                    Key columnKey = (Key) tupleItems.get(1);
                    Matrix value = (Matrix) tupleItems.get(2);

                    if (!(first instanceof PacioliTuple)) {
                        throw new MVMException("argument to function 'matrix' is not a list of tuples");
                    }

                    MatrixShape type = new MatrixShape(value.shape.factor(), rowKey.dimension(),
                            columnKey.dimension());
                    Matrix matrix = new Matrix(type);

                    for (PacioliValue tuple : list) {

                        tupleItems = ((PacioliTuple) tuple).items();

                        rowKey = (Key) tupleItems.get(0);
                        columnKey = (Key) tupleItems.get(1);
                        value = (Matrix) tupleItems.get(2);

                        matrix.setMut(rowKey, columnKey, value);
                    }
                    return matrix;
                }
            }
        });

        storePrimitive(store, new Primitive("matrix_gcd") {
            public PacioliValue apply(List<PacioliValue> params) throws MVMException {
                Matrix x = (Matrix) params.get(0);
                Matrix y = (Matrix) params.get(1);
                return x.gcd(y);
            }
        });

        storePrimitive(store, new Primitive("matrix_min") {
            public PacioliValue apply(List<PacioliValue> params) throws MVMException {
                Matrix x = (Matrix) params.get(0);
                Matrix y = (Matrix) params.get(1);
                return x.min(y);
            }
        });

        storePrimitive(store, new Primitive("matrix_max") {
            public PacioliValue apply(List<PacioliValue> params) throws MVMException {
                Matrix x = (Matrix) params.get(0);
                Matrix y = (Matrix) params.get(1);
                return x.max(y);
            }
        });

        storePrimitive(store, new Primitive("matrix_sqrt") {
            public PacioliValue apply(List<PacioliValue> params) throws MVMException {
                Matrix x = (Matrix) params.get(0);
                return x.sqrt();
            }
        });

        storePrimitive(store, new Primitive("matrix_cbrt") {
            public PacioliValue apply(List<PacioliValue> params) throws MVMException {
                Matrix x = (Matrix) params.get(0);
                return x.cbrt();
            }
        });

        storePrimitive(store, new Primitive("matrix_sum") {
            public PacioliValue apply(List<PacioliValue> params) throws MVMException {
                Matrix x = (Matrix) params.get(0);
                Matrix y = (Matrix) params.get(1);
                return x.sum(y);
            }
        });

        storePrimitive(store, new Primitive("matrix_minus") {
            public PacioliValue apply(List<PacioliValue> params) throws MVMException {
                Matrix x = (Matrix) params.get(0);
                Matrix y = (Matrix) params.get(1);
                return x.sum(y.negative());
            }
        });

        storePrimitive(store, new Primitive("matrix_magnitude") {
            public PacioliValue apply(List<PacioliValue> params) throws MVMException {
                Matrix x = (Matrix) params.get(0);
                return x.magnitude();
            }
        });

        storePrimitive(store, new Primitive("matrix_divide") {
            public PacioliValue apply(List<PacioliValue> params) throws MVMException {
                Matrix x = (Matrix) params.get(0);
                Matrix y = (Matrix) params.get(1);
                return x.multiply(y.reciprocal());
            }
        });

        storePrimitive(store, new Primitive("matrix_left_divide") {
            public PacioliValue apply(List<PacioliValue> params) throws MVMException {
                Matrix x = (Matrix) params.get(0);
                Matrix y = (Matrix) params.get(1);
                return x.reciprocal().multiply(y);
            }
        });

        storePrimitive(store, new Primitive("matrix_div") {
            public PacioliValue apply(List<PacioliValue> params) throws MVMException {
                Matrix x = (Matrix) params.get(0);
                Matrix y = (Matrix) params.get(1);
                return x.div(y);
            }
        });

        storePrimitive(store, new Primitive("matrix_rem") {
            public PacioliValue apply(List<PacioliValue> params) throws MVMException {
                Matrix x = (Matrix) params.get(0);
                Matrix y = (Matrix) params.get(1);
                return x.rem(y);
            }
        });

        storePrimitive(store, new Primitive("matrix_mod") {
            public PacioliValue apply(List<PacioliValue> params) throws MVMException {
                Matrix x = (Matrix) params.get(0);
                Matrix y = (Matrix) params.get(1);
                return x.mod(y);
            }
        });

        storePrimitive(store, new Primitive("matrix_abs_min") {
            public PacioliValue apply(List<PacioliValue> params) throws MVMException {
                Matrix x = (Matrix) params.get(0);
                Matrix y = (Matrix) params.get(1);
                return x.absMin(y);
            }
        });

        storePrimitive(store, new Primitive("matrix_less") {
            public PacioliValue apply(List<PacioliValue> params) throws MVMException {
                Matrix x = (Matrix) params.get(0);
                Matrix y = (Matrix) params.get(1);
                return new Boole(x.less(y));
            }
        });

        storePrimitive(store, new Primitive("matrix_less_eq") {
            public PacioliValue apply(List<PacioliValue> params) throws MVMException {
                Matrix x = (Matrix) params.get(0);
                Matrix y = (Matrix) params.get(1);
                return new Boole(x.lessEq(y));
            }
        });

        storePrimitive(store, new Primitive("matrix_greater") {
            public PacioliValue apply(List<PacioliValue> params) throws MVMException {
                Matrix x = (Matrix) params.get(0);
                Matrix y = (Matrix) params.get(1);
                return new Boole(y.less(x));
            }
        });

        storePrimitive(store, new Primitive("matrix_greater_eq") {
            public PacioliValue apply(List<PacioliValue> params) throws MVMException {
                Matrix x = (Matrix) params.get(0);
                Matrix y = (Matrix) params.get(1);
                return new Boole(y.lessEq(x));
            }
        });

        storePrimitive(store, new Primitive("matrix_is_zero") {
            public PacioliValue apply(List<PacioliValue> params) throws MVMException {
                Matrix x = (Matrix) params.get(0);
                return new Boole(x.isZero());
            }
        });

        storePrimitive(store, new Primitive("matrix_get") {
            public PacioliValue apply(List<PacioliValue> params) throws MVMException {
                Matrix x = (Matrix) params.get(0);
                Key row = (Key) params.get(1);
                Key column = (Key) params.get(2);
                return x.get(row, column);
            }
        });

        storePrimitive(store, new Primitive("matrix_get_num") {
            public PacioliValue apply(List<PacioliValue> params) throws MVMException {
                Matrix x = (Matrix) params.get(0);
                Key row = (Key) params.get(1);
                Key column = (Key) params.get(2);
                return x.get_num(row, column);
            }
        });

        storePrimitive(store, new Primitive("matrix_set") {
            public PacioliValue apply(List<PacioliValue> params) throws MVMException {
                // Key row = (Key) params.get(0);
                // Key column = (Key) params.get(1);
                // Matrix x = (Matrix) params.get(2);
                // TODO: fix
                // return x.set(row,column,x);
                throw new MVMException("set is not implemented");
            }
        });

        storePrimitive(store, new Primitive("matrix_isolate") {
            public PacioliValue apply(List<PacioliValue> params) throws MVMException {
                Matrix x = (Matrix) params.get(0);
                Key row = (Key) params.get(1);
                Key column = (Key) params.get(2);
                return x.isolate(row, column);
            }
        });

        storePrimitive(store, new Primitive("matrix_multiply") {
            public PacioliValue apply(List<PacioliValue> params) throws MVMException {
                Matrix x = (Matrix) params.get(0);
                Matrix y = (Matrix) params.get(1);
                return x.multiply(y);
            }
        });

        storePrimitive(store, new Primitive("matrix_loop_matrix") {
            public PacioliValue apply(List<PacioliValue> params) throws MVMException {
                PacioliValue zero = params.get(0);
                Callable merge = (Callable) params.get(1);
                Matrix matrix = (Matrix) params.get(2);
                PacioliValue accu = zero;
                for (Key rowKey : matrix.rowKeys()) {
                    for (Key columnKey : matrix.columnKeys()) {
                        accu = applyToThree(merge, accu, rowKey, columnKey);
                    }
                }
                return accu;
            }
        });

        storePrimitive(store, new Primitive("matrix_column") {
            public PacioliValue apply(List<PacioliValue> params) throws MVMException {
                Matrix matrix = (Matrix) params.get(0);
                Key key = (Key) params.get(1);
                return matrix.column(key);
            }
        });

        storePrimitive(store, new Primitive("matrix_project") {
            public PacioliValue apply(List<PacioliValue> params) throws MVMException {
                PacioliList columns = (PacioliList) params.get(0);
                Matrix matrix = (Matrix) params.get(1);
                List<Integer> cols = new ArrayList<Integer>();
                for (PacioliValue column : columns.items()) {
                    assert (column instanceof Matrix);
                    Matrix col = (Matrix) column;
                    cols.add((int) col.SingletonNumber());
                }
                return matrix.project(cols);
            }
        });

        storePrimitive(store, new Primitive("matrix_row") {
            public PacioliValue apply(List<PacioliValue> params) throws MVMException {
                Matrix matrix = (Matrix) params.get(0);
                Key key = (Key) params.get(1);
                return matrix.row(key);
            }
        });

        storePrimitive(store, new Primitive("matrix_column_domain") {
            public PacioliValue apply(List<PacioliValue> params) throws MVMException {
                Matrix matrix = (Matrix) params.get(0);
                return matrix.columnDomain();
            }
        });

        storePrimitive(store, new Primitive("matrix_row_domain") {
            public PacioliValue apply(List<PacioliValue> params) throws MVMException {
                Matrix matrix = (Matrix) params.get(0);
                return matrix.rowDomain();
            }
        });

        storePrimitive(store, new Primitive("matrix_mmult") {
            public PacioliValue apply(List<PacioliValue> params) throws MVMException {
                Matrix x = (Matrix) params.get(0);
                Matrix y = (Matrix) params.get(1);
                return x.join(y);
            }
        });

        storePrimitive(store, new Primitive("matrix_kronecker") {
            public PacioliValue apply(List<PacioliValue> params) throws MVMException {
                Matrix x = (Matrix) params.get(0);
                Matrix y = (Matrix) params.get(1);
                return x.kronecker(y);
            }
        });

        storePrimitive(store, new Primitive("matrix_scale") {
            public PacioliValue apply(List<PacioliValue> params) throws MVMException {
                Matrix x = (Matrix) params.get(0);
                Matrix y = (Matrix) params.get(1);
                return x.scale(y);
            }
        });

        storePrimitive(store, new Primitive("matrix_rscale") {
            public PacioliValue apply(List<PacioliValue> params) throws MVMException {
                Matrix x = (Matrix) params.get(0);
                Matrix y = (Matrix) params.get(1);
                return y.scale(x);
            }
        });

        storePrimitive(store, new Primitive("matrix_scale_down") {
            public PacioliValue apply(List<PacioliValue> params) throws MVMException {
                Matrix x = (Matrix) params.get(0);
                Matrix y = (Matrix) params.get(1);
                return y.reciprocal().scale(x);
            }
        });

        storePrimitive(store, new Primitive("matrix_lscale_down") {
            public PacioliValue apply(List<PacioliValue> params) throws MVMException {
                Matrix x = (Matrix) params.get(0);
                Matrix y = (Matrix) params.get(1);
                return x.scale(y.reciprocal());
            }
        });

        storePrimitive(store, new Primitive("matrix_total") {
            public PacioliValue apply(List<PacioliValue> params) throws MVMException {
                Matrix x = (Matrix) params.get(0);
                return x.total();
            }
        });

        storePrimitive(store, new Primitive("matrix_left_identity") {
            public PacioliValue apply(List<PacioliValue> params) throws MVMException {
                Matrix x = (Matrix) params.get(0);
                return x.leftIdentity();
            }
        });

        storePrimitive(store, new Primitive("matrix_support") {
            public PacioliValue apply(List<PacioliValue> params) throws MVMException {
                Matrix x = (Matrix) params.get(0);
                return x.posSupport().sum(x.negSupport());
            }
        });

        storePrimitive(store, new Primitive("matrix_positive_support") {
            public PacioliValue apply(List<PacioliValue> params) throws MVMException {
                Matrix x = (Matrix) params.get(0);
                return x.posSupport();
            }
        });

        storePrimitive(store, new Primitive("matrix_negative_support") {
            public PacioliValue apply(List<PacioliValue> params) throws MVMException {
                Matrix x = (Matrix) params.get(0);
                return x.negSupport();
            }
        });

        storePrimitive(store, new Primitive("matrix_signum") {
            public PacioliValue apply(List<PacioliValue> params) throws MVMException {
                Matrix x = (Matrix) params.get(0);
                return x.posSupport().sum(x.negSupport().negative());
            }
        });

        storePrimitive(store, new Primitive("matrix_random") {
            public PacioliValue apply(List<PacioliValue> params) throws MVMException {
                return new Matrix(Math.random());
            }
        });

        storePrimitive(store, new Primitive("matrix_top") {
            public PacioliValue apply(List<PacioliValue> params) throws MVMException {
                Matrix n = (Matrix) params.get(0);
                Matrix x = (Matrix) params.get(1);
                return x.top((int) n.SingletonNumber());
            }
        });

        storePrimitive(store, new Primitive("matrix_bottom") {
            public PacioliValue apply(List<PacioliValue> params) throws MVMException {
                Matrix n = (Matrix) params.get(0);
                Matrix x = (Matrix) params.get(1);
                return x.bottom((int) n.SingletonNumber());
            }
        });

        storePrimitive(store, new Primitive("matrix_right_identity") {
            public PacioliValue apply(List<PacioliValue> params) throws MVMException {
                Matrix x = (Matrix) params.get(0);
                return x.rightIdentity();
            }
        });

        storePrimitive(store, new Primitive("matrix_transpose") {
            public PacioliValue apply(List<PacioliValue> params) throws MVMException {
                Matrix x = (Matrix) params.get(0);
                return x.transpose();
            }
        });

        storePrimitive(store, new Primitive("matrix_reciprocal") {
            public PacioliValue apply(List<PacioliValue> params) throws MVMException {
                Matrix x = (Matrix) params.get(0);
                return x.reciprocal();
            }
        });

        storePrimitive(store, new Primitive("matrix_dim_inv") {
            public PacioliValue apply(List<PacioliValue> params) throws MVMException {
                Matrix x = (Matrix) params.get(0);
                return x.reciprocal().transpose();
            }
        });

        storePrimitive(store, new Primitive("matrix_dim_div") {
            public PacioliValue apply(List<PacioliValue> params) throws MVMException {
                Matrix x = (Matrix) params.get(0);
                Matrix y = (Matrix) params.get(1);
                return x.join(y.transpose().reciprocal());
            }
        });

        storePrimitive(store, new Primitive("matrix_negative") {
            public PacioliValue apply(List<PacioliValue> params) throws MVMException {
                Matrix x = (Matrix) params.get(0);
                return x.negative();
            }
        });

        storePrimitive(store, new Primitive("matrix_abs") {
            public PacioliValue apply(List<PacioliValue> params) throws MVMException {
                Matrix x = (Matrix) params.get(0);
                return x.abs();
            }
        });

        storePrimitive(store, new Primitive("matrix_index_less") {
            public PacioliValue apply(List<PacioliValue> params) throws MVMException {
                Key row = (Key) params.get(0);
                Key column = (Key) params.get(1);
                return new Boole(row.position() < column.position());
            }
        });

        storePrimitive(store, new Primitive("matrix_sin") {
            public PacioliValue apply(List<PacioliValue> params) throws MVMException {
                Matrix x = (Matrix) params.get(0);
                return x.sin();
            }
        });

        storePrimitive(store, new Primitive("matrix_cos") {
            public PacioliValue apply(List<PacioliValue> params) throws MVMException {
                Matrix x = (Matrix) params.get(0);
                return x.cos();
            }
        });

        storePrimitive(store, new Primitive("matrix_tan") {
            public PacioliValue apply(List<PacioliValue> params) throws MVMException {
                Matrix x = (Matrix) params.get(0);
                return x.tan();
            }
        });

        storePrimitive(store, new Primitive("system__asin") {
            public PacioliValue apply(List<PacioliValue> params) throws MVMException {
                Matrix x = (Matrix) params.get(0);
                return x.asin();
            }
        });

        storePrimitive(store, new Primitive("system__acos") {
            public PacioliValue apply(List<PacioliValue> params) throws MVMException {
                Matrix x = (Matrix) params.get(0);
                return x.acos();
            }
        });

        storePrimitive(store, new Primitive("system__atan") {
            public PacioliValue apply(List<PacioliValue> params) throws MVMException {
                Matrix x = (Matrix) params.get(0);
                return x.atan();
            }
        });

        storePrimitive(store, new Primitive("system__atan2") {
            public PacioliValue apply(List<PacioliValue> params) throws MVMException {
                Matrix x = (Matrix) params.get(0);
                Matrix y = (Matrix) params.get(1);
                return x.atan2(y);
            }
        });

        storePrimitive(store, new Primitive("matrix_ln") {
            public PacioliValue apply(List<PacioliValue> params) throws MVMException {
                Matrix x = (Matrix) params.get(0);
                return x.ln();
            }
        });

        storePrimitive(store, new Primitive("matrix_exp") {
            public PacioliValue apply(List<PacioliValue> params) throws MVMException {
                Matrix x = (Matrix) params.get(0);
                return x.exp();
            }
        });

        storePrimitive(store, new Primitive("matrix_expt") {
            public PacioliValue apply(List<PacioliValue> params) throws MVMException {
                Matrix x = (Matrix) params.get(0);
                Matrix y = (Matrix) params.get(1);
                return x.expt(y);
            }
        });

        storePrimitive(store, new Primitive("matrix_mexpt") {
            public PacioliValue apply(List<PacioliValue> params) throws MVMException {
                Matrix x = (Matrix) params.get(0);
                Matrix y = (Matrix) params.get(1);
                return x.power(y);
            }
        });

        storePrimitive(store, new Primitive("matrix_log") {
            public PacioliValue apply(List<PacioliValue> params) throws MVMException {
                Matrix x = (Matrix) params.get(0);
                Matrix y = (Matrix) params.get(1);
                return x.log(y);
            }
        });

        storePrimitive(store, new Primitive("matrix_floor") {
            public PacioliValue apply(List<PacioliValue> params) throws MVMException {
                Matrix x = (Matrix) params.get(0);
                return x.floor();
            }
        });

        storePrimitive(store, new Primitive("matrix_ceiling") {
            public PacioliValue apply(List<PacioliValue> params) throws MVMException {
                Matrix x = (Matrix) params.get(0);
                return x.ceiling();
            }
        });

        storePrimitive(store, new Primitive("matrix_truncate") {
            public PacioliValue apply(List<PacioliValue> params) throws MVMException {
                Matrix x = (Matrix) params.get(0);
                return x.truncate();
            }
        });

        storePrimitive(store, new Primitive("matrix_round") {
            public PacioliValue apply(List<PacioliValue> params) throws MVMException {
                Matrix x = (Matrix) params.get(0);
                return x.round();
            }
        });

        storePrimitive(store, new Primitive("system__precision") {
            public PacioliValue apply(List<PacioliValue> params) throws MVMException {
                return new Matrix(Matrix.precision);
            }
        });

        storePrimitive(store, new Primitive("system__set_precision") {
            public PacioliValue apply(List<PacioliValue> params) throws MVMException {
                Matrix n = (Matrix) params.get(0);
                Matrix.precision = (int) n.SingletonNumber();
                return VOID;
            }
        });

        // //////////////////////////////////////////////////////////////////////////////
        // List

        storePrimitive(store, new Primitive("list_loop_list") {
            public PacioliValue apply(List<PacioliValue> params) throws MVMException {
                PacioliValue zero = params.get(0);
                Callable merge = (Callable) params.get(1);
                List<PacioliValue> list = ((PacioliList) params.get(2)).items();
                PacioliValue accu = zero;
                for (PacioliValue value : list) {
                    accu = applyToTwo(merge, accu, value);
                }
                return accu;
            }
        });

        storePrimitive(store, new Primitive("list_map_list") {
            public PacioliValue apply(List<PacioliValue> params) throws MVMException {
                Callable fun = (Callable) params.get(0);
                List<PacioliValue> list = ((PacioliList) params.get(1)).items();
                PacioliList newList = new PacioliList();
                ArrayList<PacioliValue> arg = new ArrayList<PacioliValue>();
                arg.add(null);
                for (PacioliValue value : list) {
                    arg.set(0, value);
                    newList.addMut(fun.apply(arg));
                }
                return newList;
            }
        });

        storePrimitive(store, new Primitive("list_sort_list") {
            public PacioliValue apply(List<PacioliValue> params) throws MVMException {
                List<PacioliValue> items = ((PacioliList) params.get(0)).items();
                final Callable fun = (Callable) params.get(1);

                // Clumsy way to make a final array of two elements to be used in the compare
                ArrayList<PacioliValue> dummyArgs = new ArrayList<PacioliValue>();
                dummyArgs.add(null);
                dummyArgs.add(null);
                final ArrayList<PacioliValue> args = new ArrayList<PacioliValue>(dummyArgs);

                List<PacioliValue> newItems = new ArrayList<PacioliValue>(items);
                Collections.sort(newItems, new Comparator<PacioliValue>() {

                    @Override
                    public int compare(PacioliValue o1, PacioliValue o2) {
                        try {
                            args.set(0, o1);
                            args.set(1, o2);
                            Matrix n = (Matrix) fun.apply(args);
                            return (int) n.SingletonNumber();
                        } catch (MVMException ex) {
                            throw new RuntimeException(ex);
                        }
                    }

                });

                return new PacioliList(newItems);
            }
        });

        storePrimitive(store, new Primitive("list_fold_list") {
            public PacioliValue apply(List<PacioliValue> params) throws MVMException {

                Callable merge = (Callable) params.get(0);
                List<PacioliValue> list = ((PacioliList) params.get(1)).items();

                if (list.isEmpty()) {
                    throw new MVMException(String.format("Cannot fold an empty list"));
                }

                PacioliValue accu = list.get(0);
                for (int i = 1; i < list.size(); i++) {
                    accu = applyToTwo(merge, accu, list.get(i));
                }
                return accu;
            }
        });

        storePrimitive(store, new Primitive("list_nth") {
            public PacioliValue apply(List<PacioliValue> params) throws MVMException {
                Matrix n = (Matrix) params.get(0);
                PacioliList list = (PacioliList) params.get(1);
                return list.nth((int) n.SingletonNumber());
            }
        });

        storePrimitive(store, new Primitive("list_empty_list") {
            public PacioliValue apply(List<PacioliValue> params) throws MVMException {
                return new PacioliList();
            }
        });

        storePrimitive(store, new Primitive("list_naturals") {
            public PacioliValue apply(List<PacioliValue> params) throws MVMException {
                Matrix n = (Matrix) params.get(0);
                PacioliList list = new PacioliList();
                for (int i = 0; i < n.SingletonNumber(); i++) {
                    list.addMut(new Matrix(i));
                }
                return list;
            }
        });

        storePrimitive(store, new Primitive("system__add_mut") {
            public PacioliValue apply(List<PacioliValue> params) throws MVMException {
                PacioliList x = (PacioliList) params.get(0);
                PacioliValue y = params.get(1);
                return x.addMut(y);
            }
        });

        storePrimitive(store, new Primitive("list_cons") {
            public PacioliValue apply(List<PacioliValue> params) throws MVMException {
                PacioliValue x = params.get(0);
                PacioliList y = (PacioliList) params.get(1);
                return y.cons(x, y);
            }
        });

        storePrimitive(store, new Primitive("list_append") {
            public PacioliValue apply(List<PacioliValue> params) throws MVMException {
                PacioliList x = (PacioliList) params.get(0);
                PacioliList y = (PacioliList) params.get(1);
                return x.append(y);
            }
        });

        storePrimitive(store, new Primitive("list_reverse") {
            public PacioliValue apply(List<PacioliValue> params) throws MVMException {
                PacioliList x = (PacioliList) params.get(0);
                return x.reverse();
            }
        });

        storePrimitive(store, new Primitive("list_head") {
            public PacioliValue apply(List<PacioliValue> params) throws MVMException {
                PacioliList x = (PacioliList) params.get(0);
                if (x.items().isEmpty()) {
                    throw new MVMException("function 'head' called on empty list");
                }
                return x.items().get(0);
            }
        });

        storePrimitive(store, new Primitive("list_tail") {
            public PacioliValue apply(List<PacioliValue> params) throws MVMException {
                PacioliList x = (PacioliList) params.get(0);
                if (x.items().isEmpty()) {
                    throw new MVMException("function 'tail' called on empty list");
                }
                PacioliList items = new PacioliList();
                for (int i = 1; i < x.items().size(); i++) {
                    items.addMut(x.items().get(i));
                }
                return items;
            }
        });

        storePrimitive(store, new Primitive("list_singleton_list") {
            public PacioliValue apply(List<PacioliValue> params) throws MVMException {
                return new PacioliList(params.get(0));
            }
        });

        storePrimitive(store, new Primitive("list_zip") {
            public PacioliValue apply(List<PacioliValue> params) throws MVMException {
                PacioliList x = (PacioliList) params.get(0);
                PacioliList y = (PacioliList) params.get(1);
                return x.zip(y);
            }
        });

        storePrimitive(store, new Primitive("list_list_size") {
            public PacioliValue apply(List<PacioliValue> params) throws MVMException {
                PacioliList x = (PacioliList) params.get(0);
                return new Matrix(x.items().size());
            }
        });

        storePrimitive(store, new Primitive("list_contains") {
            public PacioliValue apply(List<PacioliValue> params) throws MVMException {
                PacioliList list = (PacioliList) params.get(0);
                PacioliValue item = params.get(1);
                return new Boole(list.items().contains(item));
            }
        });

        storePrimitive(store, new Primitive("string_compare_string") {
            public PacioliValue apply(List<PacioliValue> params) throws MVMException {
                PacioliString string1 = (PacioliString) params.get(0);
                PacioliString string2 = (PacioliString) params.get(1);
                return new Matrix(string1.toText().compareTo(string2.toText()));
            }
        });

        storePrimitive(store, new Primitive("string_char_at") {
            public PacioliValue apply(List<PacioliValue> params) throws MVMException {
                PacioliString stringParam = (PacioliString) params.get(0);
                Matrix posParam = (Matrix) params.get(1);

                String string = stringParam.toText();
                int n = string.length();

                if (n == 0) {
                    throw new MVMException("char_at called on empty string");
                }

                int pos = (int) posParam.SingletonNumber();

                int s = pos % n;

                return new PacioliString(Character.toString(string.charAt(s < 0 ? s + n : s)));
            }
        });

        storePrimitive(store, new Primitive("string_string_length") {
            public PacioliValue apply(List<PacioliValue> params) throws MVMException {
                PacioliString string = (PacioliString) params.get(0);
                return new Matrix(string.toText().length());
            }
        });

        storePrimitive(store, new Primitive("string_text") {
            public PacioliValue apply(List<PacioliValue> params) throws MVMException {
                PacioliValue value = params.get(0);
                return new PacioliString(value.toText());
            }
        });

        storePrimitive(store, new Primitive("string_get_unit_text") {
            public PacioliValue apply(List<PacioliValue> params) throws MVMException {
                Matrix x = (Matrix) params.get(0);
                Key row = (Key) params.get(1);
                Key column = (Key) params.get(2);
                return new PacioliString(x.get_unit(row, column).pretty());
            }
        });

        storePrimitive(store, new Primitive("string_concatenate") {
            public PacioliValue apply(List<PacioliValue> params) throws MVMException {
                PacioliString string1 = (PacioliString) params.get(0);
                PacioliString string2 = (PacioliString) params.get(1);
                return new PacioliString(string1.toText().concat(string2.toText()));
            }
        });

        storePrimitive(store, new Primitive("string_pad") {
            public PacioliValue apply(List<PacioliValue> params) throws MVMException {
                PacioliString left = (PacioliString) params.get(0);
                PacioliString right = (PacioliString) params.get(1);
                Matrix n = (Matrix) params.get(2);
                PacioliString sub = (PacioliString) params.get(3);

                int size = (int) n.SingletonNumber();
                String str = left.toText();
                String rightStr = right.toText();
                String subs = sub.toText();

                return new PacioliString(pad(str, rightStr, size, subs));
            }
        });

        storePrimitive(store, new Primitive("string_unit2string") {
            public PacioliValue apply(List<PacioliValue> params) throws MVMException {
                // Just ignore the unit in the third parameter. The MVM is already typed.
                // The unit is for targets that compute with numbers only.
                Matrix num = (Matrix) params.get(0);
                PacioliString string = new PacioliString(num.unitAt(0, 0).pretty());
                return string;
            }
        });

        storePrimitive(store, new Primitive("system__num2string") {
            public PacioliValue apply(List<PacioliValue> params) throws MVMException {
                // Just ignore the unit in the third parameter. The MVM is already typed.
                // The unit is for targets that compute with numbers only.
                Matrix num = (Matrix) params.get(0);
                Matrix n = (Matrix) params.get(1);
                int nrDecs = Matrix.nrDecimals;
                Matrix.nrDecimals = (int) n.SingletonNumber();
                PacioliString string = new PacioliString(num.toText());
                Matrix.nrDecimals = nrDecs;
                return string;
            }
        });

        storePrimitive(store, new Primitive("system__nr_decimals") {
            public PacioliValue apply(List<PacioliValue> params) throws MVMException {
                return new Matrix(Matrix.nrDecimals);
            }
        });

        storePrimitive(store, new Primitive("system__set_nr_decimals") {
            public PacioliValue apply(List<PacioliValue> params) throws MVMException {
                Matrix n = (Matrix) params.get(0);
                Matrix.nrDecimals = (int) n.SingletonNumber();
                return VOID;
            }
        });

        storePrimitive(store, new Primitive("system__show_zeros") {
            public PacioliValue apply(List<PacioliValue> params) throws MVMException {
                return new Boole(Matrix.showZeros);
            }
        });

        storePrimitive(store, new Primitive("system__set_show_zeros") {
            public PacioliValue apply(List<PacioliValue> params) throws MVMException {
                Boole show = (Boole) params.get(0);
                Matrix.showZeros = show.positive();
                return VOID;
            }
        });

        storePrimitive(store, new Primitive("string_split_string") {
            public PacioliValue apply(List<PacioliValue> params) throws MVMException {
                PacioliString string = (PacioliString) params.get(0);
                PacioliString splitter = (PacioliString) params.get(1);
                String[] parts = string.toText().split("[" + splitter.toText() + "]");
                PacioliList list = new PacioliList();
                for (int i = 0; i < parts.length; i++) {
                    list.addMut(new PacioliString(parts[i]));
                }
                return list;
            }
        });

        storePrimitive(store, new Primitive("string_trim") {
            public PacioliValue apply(List<PacioliValue> params) throws MVMException {
                PacioliString string = (PacioliString) params.get(0);
                return new PacioliString(string.toText().trim());
            }
        });

        storePrimitive(store, new Primitive("string_parse_num") {
            public PacioliValue apply(List<PacioliValue> params) throws MVMException {
                PacioliString string = (PacioliString) params.get(0);
                Double value = Double.parseDouble(string.toText());
                return new Matrix(value);
            }
        });

        storePrimitive(store, new Primitive("string_format") {

            Pattern DECIMAL_PATTERN = Pattern.compile("^%([0-9]*)d");
            Pattern FLOAT_PATTERN = Pattern.compile("^%([0-9]*)([.]?)([0-9]*)f");

            public PacioliValue apply(List<PacioliValue> params) throws MVMException {
                if (params.isEmpty()) {
                    throw new MVMException(
                            "No format string found. The format function cannot be called without arguments.");

                } else if (params.get(0) instanceof PacioliString str) {

                    String formatString = str.toText();
                    int nrCharacters = formatString.length();

                    try {

                        var builder = new StringBuilder();

                        int position = 0;
                        int argumentIndex = 1;

                        while (position < nrCharacters) {

                            char firstChar = formatString.charAt(position);

                            if (firstChar == '%') {

                                if (position + 1 == nrCharacters) {
                                    throw new MVMException("unfinished format directive at end of format string %s",
                                            formatString);
                                }

                                char secondChar = formatString.charAt(position + 1);

                                if (secondChar == '%') {

                                    builder.append("%");
                                    position += 2;

                                } else if (secondChar == 's') {

                                    // Very permissive
                                    builder.append(params.get(argumentIndex++).toText());
                                    position += 2;

                                } else if (secondChar == 'n') {

                                    builder.append(System.lineSeparator());
                                    position += 2;

                                } else {

                                    Matcher matcher = DECIMAL_PATTERN.matcher(formatString);

                                    if (matcher.region(position, nrCharacters).find()) {

                                        var value = params.get(argumentIndex++);

                                        if (value instanceof Matrix mat) {

                                            Integer size;
                                            try {
                                                size = Integer.parseInt(matcher.group(1));
                                            } catch (Exception e) {
                                                size = null;
                                            }

                                            String val = mat.toText(0);
                                            var pd = size == null ? val : pad("", val, size, " ");

                                            builder.append(pd);
                                            position += matcher.end() - matcher.start();

                                        } else {
                                            throw new MVMException(
                                                    "argument %s to decimal directive at position %s is not a number",
                                                    value.toText(),
                                                    position);
                                        }

                                    } else {
                                        Matcher floatMatcher = FLOAT_PATTERN.matcher(formatString);

                                        if (floatMatcher.region(position, nrCharacters).find()) {

                                            var value = params.get(argumentIndex++);

                                            if (value instanceof Matrix mat) {

                                                Integer size;
                                                Integer nrDecimals;

                                                try {
                                                    size = Integer.parseInt(floatMatcher.group(1));
                                                } catch (Exception e) {
                                                    size = null;
                                                }

                                                try {
                                                    nrDecimals = Integer.parseInt(floatMatcher.group(3));
                                                } catch (Exception e) {
                                                    nrDecimals = null;
                                                }

                                                String val = nrDecimals == null ? mat.toText() : mat.toText(nrDecimals);

                                                builder.append(size == null ? val : pad("", val, size, " "));
                                                position += floatMatcher.end() - floatMatcher.start();

                                            } else {
                                                throw new MVMException(
                                                        "argument %s to float directive at position %s is not a number",
                                                        value.toText(),
                                                        position);
                                            }

                                        } else {
                                            throw new RuntimeException(
                                                    String.format(
                                                            "invalid format directive at position %s: %s",
                                                            position, formatString.substring(position)));
                                        }
                                    }

                                }

                            } else {
                                builder.append(firstChar);
                                position++;
                            }

                        }

                        return new PacioliString(builder.toString());

                    } catch (Exception ex) {
                        throw new MVMException(
                                String.format("Unexpected error while formatting string \"%s\": %s",
                                        str.toText(),
                                        ex.getMessage()));
                    }
                } else {
                    throw new MVMException(
                            "Illegal format string. The first argument to format must be a string. Found: \n\n%s",
                            params.get(0).toText());
                }
            }
        });

        storePrimitive(store, new Primitive("base_error") {
            public PacioliValue apply(List<PacioliValue> params) throws MVMException {
                PacioliString string = (PacioliString) params.get(0);
                throw new MVMException(string.toText());
            }
        });

        storePrimitive(store, new Primitive("system__three_question_marks") {
            public PacioliValue apply(List<PacioliValue> params) throws MVMException {
                throw new MVMException("Not yet implemented");
            }
        });

        storePrimitive(store, new Primitive("array_make_array") {
            public PacioliValue apply(List<PacioliValue> params) throws MVMException {
                Matrix n = (Matrix) params.get(0);
                int d = (int) n.SingletonNumber();
                return new PacioliArray(d);
            }
        });

        storePrimitive(store, new Primitive("array_array_put") {
            public PacioliValue apply(List<PacioliValue> params) throws MVMException {
                PacioliArray array = (PacioliArray) params.get(0);
                Matrix index = (Matrix) params.get(1);
                array.put((int) index.SingletonNumber(), params.get(2));
                return array;
            }
        });

        storePrimitive(store, new Primitive("array_array_get") {
            public PacioliValue apply(List<PacioliValue> params) throws MVMException {
                PacioliArray array = (PacioliArray) params.get(0);
                Matrix index = (Matrix) params.get(1);
                return array.get((int) index.SingletonNumber());
            }
        });

        storePrimitive(store, new Primitive("array_array_size") {
            public PacioliValue apply(List<PacioliValue> params) throws MVMException {
                PacioliArray array = (PacioliArray) params.get(0);
                return new Matrix(array.size());
            }
        });

        storePrimitive(store, new Primitive("map_empty_map") {
            public PacioliValue apply(List<PacioliValue> params) throws MVMException {
                return new PacioliMap();
            }
        });

        storePrimitive(store, new Primitive("map_store") {
            public PacioliValue apply(List<PacioliValue> params) throws MVMException {
                if (params.get(2) instanceof PacioliMap map) {
                    map.put(params.get(0), params.get(1));
                    return VOID;
                } else {
                    throw new MVMException("Function store expects a map");
                }
            }
        });

        storePrimitive(store, new Primitive("map_lookup") {
            public PacioliValue apply(List<PacioliValue> params) throws MVMException {
                if (params.get(1) instanceof PacioliMap map) {
                    return map.get(params.get(0)).map(x -> new Maybe(x)).orElse(NOTHING);
                } else {
                    throw new MVMException("Function lookup expects a map");
                }
            }
        });

        storePrimitive(store, new Primitive("map_keys") {
            public PacioliValue apply(List<PacioliValue> params) throws MVMException {
                if (params.get(0) instanceof PacioliMap map) {
                    return new PacioliList(new ArrayList<>(map.keys()));
                } else {
                    throw new MVMException("Function keys expects a map");
                }
            }
        });

        storePrimitive(store, new Primitive("map_map_size") {
            public PacioliValue apply(List<PacioliValue> params) throws MVMException {
                if (params.get(0) instanceof PacioliMap map) {
                    return new Matrix(map.size());
                } else {
                    throw new MVMException("Function map_size expects a map");
                }

            }
        });

        storePrimitive(store, new Primitive("system__system_time") {
            public PacioliValue apply(List<PacioliValue> params) throws MVMException {
                return new Matrix(System.nanoTime() / 1000000.0);
            }
        });

        storePrimitive(store, new Primitive("io_with_output_file") {
            public PacioliValue apply(List<PacioliValue> params) throws MVMException {
                PacioliString path = (PacioliString) params.get(0);
                Callable fun = (Callable) params.get(1);
                try (FileHandle handle = new FileHandle(path.toText(), Machine.CHARSET)) {
                    fun.apply(List.of(handle));
                } catch (IOException exception) {
                    throw new MVMException(exception.getLocalizedMessage());
                }
                return VOID;

            }
        });

        storePrimitive(store, new Primitive("io_write_string") {
            public PacioliValue apply(List<PacioliValue> params) throws MVMException {
                FileHandle handle = (FileHandle) params.get(0);
                PacioliString text = (PacioliString) params.get(1);
                handle.write(text);
                return VOID;
            }
        });
    }

    private static void storeBaseValue(Environment store, String name, PacioliValue primitive) {
        store.put(prefix + name, primitive);
    }

    private static void storePrimitive(Environment store, Primitive primitive) {
        storeBaseValue(store, primitive.name(), primitive);
    }

    /**
     * Concatenates the left and right string, padding it in the middle to make the
     * result
     * at least the asked size.
     * 
     * pad("foo", "12.34", 15, ".") yields
     * 
     * "foo.......12.34"
     * 
     * pad("", "12.34", 10, "_") yields
     * 
     * "_____12.34"
     * 
     * @param left
     * @param right
     * @param size
     * @param subs
     * @return
     */
    static String pad(String left, String right, int size, String subs) {

        int mod = subs.length();
        double missing = size - left.length() - right.length();

        StringBuilder padded = new StringBuilder(left);

        int i = 0;
        while (i < missing) {
            padded.append(subs.charAt(i++ % mod));
        }

        padded.append(right);

        return padded.toString();
    }
}
