/*
 * Copyright (c) 2013 - 2014 Paul Griffioen
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

import java.io.File;
import java.io.PrintStream;
import java.math.BigDecimal;
import java.text.DecimalFormat;
import java.util.ArrayList;
import java.util.Collections;
import java.util.Comparator;
import java.util.HashMap;
import java.util.Iterator;
import java.util.LinkedList;
import java.util.List;

import mvm.ast.Instruction;
import mvm.ast.expression.Expression;
import mvm.values.Boole;
import mvm.values.Callable;
import mvm.values.PacioliList;
import mvm.values.PacioliArray;
import mvm.values.PacioliString;
import mvm.values.PacioliTuple;
import mvm.values.PacioliValue;
import mvm.values.Primitive;
import mvm.values.Reference;
import mvm.values.matrix.IndexSet;
import mvm.values.matrix.Key;
import mvm.values.matrix.Matrix;
import mvm.values.matrix.MatrixBase;
import mvm.values.matrix.MatrixShape;
import mvm.values.matrix.UnitVector;
// import pacioli.Pacioli;
import uom.Prefix;
import uom.Unit;
import uom.UnitSystem;

public class Machine {

    public final Environment store;
    public final UnitSystem<MatrixBase> unitSystem;
    public final HashMap<String, IndexSet> indexSets;
    public final HashMap<String, UnitVector> unitVectors;
    private static final LinkedList<String> debugStack = new LinkedList<String>();
    private static boolean atLineStart = false;
    private final List<File> loadedFiles;

    public Machine() {
        store = new Environment(this);
        unitSystem = makeSI();
        indexSets = new HashMap<String, IndexSet>();
        unitVectors = new HashMap<String, UnitVector>();
        loadedFiles = new ArrayList<File>();
    }

    public static void pushFrame(String frame) {
        debugStack.push(frame);
    }

    public static void popFrame() {
        debugStack.pop();
    }

    public void storeCode(String name, Expression code) {
        store.putCode(name, code);
    }

    public void storeValue(String name, PacioliValue value) {
        store.put(name, value);
    }

    public void storeUnit(String name, Unit<MatrixBase> unit) {
        unitSystem.addUnit(name, unit);
    }

    public void storeBaseValue(String name, PacioliValue primitive) {
        storeValue("glbl_base_base_" + name, primitive);
    }
    
    public void init() throws MVMException {

        // //////////////////////////////////////////////////////////////////////////////
        // System Functions

        store.put("conversion", new Primitive("conversion") {
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

        // //////////////////

        storeBaseValue("true", new Boole(true));

        storeBaseValue("false", new Boole(false));

        storeBaseValue("nothing", null);

        storeBaseValue("tuple", new Primitive("tuple") {
            public PacioliValue apply(List<PacioliValue> params) throws MVMException {
                return new PacioliTuple(params);
            }
        });

        storeBaseValue("apply", new Primitive("apply") {
            public PacioliValue apply(List<PacioliValue> params) throws MVMException {
                Callable function = (Callable) params.get(0);
                PacioliTuple tuple = (PacioliTuple) params.get(1);
                return function.apply(tuple.items());
            }
        });

        storeBaseValue("equal", new Primitive("equal") {
            public PacioliValue apply(List<PacioliValue> params) throws MVMException {
                return new Boole(params.get(0).equals(params.get(1)));
            }
        });

        storeBaseValue("not_equal", new Primitive("not_equal") {
            public PacioliValue apply(List<PacioliValue> params) throws MVMException {
                return new Boole(!params.get(0).equals(params.get(1)));
            }
        });

        storeBaseValue("not", new Primitive("not") {
            public PacioliValue apply(List<PacioliValue> params) throws MVMException {
                Boole x = (Boole) params.get(0);
                return new Boole(!x.positive());
            }
        });

        storeBaseValue("_printed", new Primitive("_printed") {
            public PacioliValue apply(List<PacioliValue> params) throws MVMException {
                PacioliValue value = params.get(0);
                if (value != null) { // void value of statements
                    log("%s\n", value.toText());
                }
                return value;
            }
        });

        storeBaseValue("_print", new Primitive("_print") {
            public PacioliValue apply(List<PacioliValue> params) throws MVMException {
                PacioliValue value = params.get(0);
                if (value != null) { // void value of statements
                    log("%s\n", value.toText());
                }
                return null;
            }
        });

        storeBaseValue("_write", new Primitive("_write") {
            public PacioliValue apply(List<PacioliValue> params) throws MVMException {
                PacioliValue value = params.get(0);
                if (value != null) { // void value of statements
                    log("%s", value.toText());
                }
                return null;
            }
        });

        storeBaseValue("_skip", new Primitive("_skip") {
            public PacioliValue apply(List<PacioliValue> params) throws MVMException {
                // return null;
                return new Matrix(-1);
            }
        });

        storeBaseValue("identity", new Primitive("identity") {
            public PacioliValue apply(List<PacioliValue> params) throws MVMException {
                return params.get(0);
            }
        });

        storeBaseValue("_empty_ref", new Primitive("_empty_ref") {
            public PacioliValue apply(List<PacioliValue> params) throws MVMException {
                return new Reference();
            }
        });

        storeBaseValue("_new_ref", new Primitive("_new_ref") {
            public PacioliValue apply(List<PacioliValue> params) throws MVMException {
                return new Reference(params.get(0));
            }
        });

        storeBaseValue("_ref_get", new Primitive("_ref_get") {
            public PacioliValue apply(List<PacioliValue> params) throws MVMException {
                Reference ref = (Reference) params.get(0);
                return ref.getValue();
            }
        });

        storeBaseValue("_ref_set", new Primitive("_ref_set") {
            public PacioliValue apply(List<PacioliValue> params) throws MVMException {
                Reference ref = (Reference) params.get(0);
                PacioliValue value = params.get(1);
                ref.setValue(value);
                return ref;
            }
        });

        storeBaseValue("_seq", new Primitive("_seq") {
            public PacioliValue apply(List<PacioliValue> params) throws MVMException {
                return params.get(1);
            }
        });

        storeBaseValue("_while", new Primitive("_while") {
            public PacioliValue apply(List<PacioliValue> params) throws MVMException {
                Callable first = (Callable) params.get(0);
                Callable second = (Callable) params.get(1);
                Boole test = (Boole) first.apply(new ArrayList<PacioliValue>());
                PacioliValue result = null;
                while (test.positive()) {
                    result = second.apply(new ArrayList<PacioliValue>());
                    test = (Boole) first.apply(new ArrayList<PacioliValue>());
                }
                return result;
            }
        });

        storeBaseValue("_throw_result", new Primitive("_throw_result") {
            public PacioliValue apply(List<PacioliValue> params) throws MVMException {
                Reference first = (Reference) params.get(0);
                first.setValue(params.get(1));
                throw new ControlTransfer();
            }
        });

        storeBaseValue("_catch_result", new Primitive("_catch_result") {
            public PacioliValue apply(List<PacioliValue> params) throws MVMException {
                Callable body = (Callable) params.get(0);
                Reference place = (Reference) params.get(1);
                try {
                    body.apply(new ArrayList<PacioliValue>());
                    return null;
                } catch (ControlTransfer ex) {
                    return place.getValue();
                }
            }
        });
        // //////////////////////////////////////////////////////////////////////////////
        // Matrix

        storeBaseValue("_", new Key());

        storeBaseValue("solve", new Primitive("solve") {
            public PacioliValue apply(List<PacioliValue> params) throws MVMException {
                Matrix x = (Matrix) params.get(0);
                Matrix y = (Matrix) params.get(1);
                return x.solve(y);
            }
        });

        storeBaseValue("plu", new Primitive("plu") {
            public PacioliValue apply(List<PacioliValue> params) throws MVMException {
                Matrix x = (Matrix) params.get(0);
                return x.plu();
            }
        });

        storeBaseValue("svd", new Primitive("svd") {
            public PacioliValue apply(List<PacioliValue> params) throws MVMException {
                Matrix x = (Matrix) params.get(0);
                return x.svdNonZero();
            }
        });

        storeBaseValue("qr", new Primitive("qr") {
            public PacioliValue apply(List<PacioliValue> params) throws MVMException {
                Matrix x = (Matrix) params.get(0);
                return x.qrZeroSub();
            }
        });

        storeBaseValue("unit_factor", new Primitive("unit_factor") {
            public PacioliValue apply(List<PacioliValue> params) throws MVMException {
                Matrix matrix = (Matrix) params.get(0);
                return new Matrix(matrix.shape.getFactor());
            }
        });

        storeBaseValue("row_unit", new Primitive("row_unit") {
            public PacioliValue apply(List<PacioliValue> params) throws MVMException {
                Matrix matrix = (Matrix) params.get(0);
                return matrix.rowUnitVector();
            }
        });

        storeBaseValue("column_unit", new Primitive("column_unit") {
            public PacioliValue apply(List<PacioliValue> params) throws MVMException {
                Matrix matrix = (Matrix) params.get(0);
                return matrix.columnUnitVector();
            }
        });

        storeBaseValue("make_matrix", new Primitive("make_matrix") {
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

                    MatrixShape type = new MatrixShape(value.shape.getFactor(), rowKey.dimension(),
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

        storeBaseValue("gcd", new Primitive("gcd") {
            public PacioliValue apply(List<PacioliValue> params) throws MVMException {
                Matrix x = (Matrix) params.get(0);
                Matrix y = (Matrix) params.get(1);
                return x.gcd(y);
            }
        });

        storeBaseValue("min", new Primitive("min") {
            public PacioliValue apply(List<PacioliValue> params) throws MVMException {
                Matrix x = (Matrix) params.get(0);
                Matrix y = (Matrix) params.get(1);
                return x.min(y);
            }
        });

        storeBaseValue("max", new Primitive("max") {
            public PacioliValue apply(List<PacioliValue> params) throws MVMException {
                Matrix x = (Matrix) params.get(0);
                Matrix y = (Matrix) params.get(1);
                return x.max(y);
            }
        });

        storeBaseValue("sqrt", new Primitive("sqrt") {
            public PacioliValue apply(List<PacioliValue> params) throws MVMException {
                Matrix x = (Matrix) params.get(0);
                return x.sqrt();
            }
        });

        storeBaseValue("sum", new Primitive("sum") {
            public PacioliValue apply(List<PacioliValue> params) throws MVMException {
                Matrix x = (Matrix) params.get(0);
                Matrix y = (Matrix) params.get(1);
                return x.sum(y);
            }
        });

        storeBaseValue("minus", new Primitive("minus") {
            public PacioliValue apply(List<PacioliValue> params) throws MVMException {
                Matrix x = (Matrix) params.get(0);
                Matrix y = (Matrix) params.get(1);
                return x.sum(y.negative());
            }
        });

        storeBaseValue("magnitude", new Primitive("magnitude") {
            public PacioliValue apply(List<PacioliValue> params) throws MVMException {
                Matrix x = (Matrix) params.get(0);
                return x.magnitude();
            }
        });

        storeBaseValue("divide", new Primitive("divide") {
            public PacioliValue apply(List<PacioliValue> params) throws MVMException {
                Matrix x = (Matrix) params.get(0);
                Matrix y = (Matrix) params.get(1);
                return x.multiply(y.reciprocal());
            }
        });

        storeBaseValue("left_divide", new Primitive("left_divide") {
            public PacioliValue apply(List<PacioliValue> params) throws MVMException {
                Matrix x = (Matrix) params.get(0);
                Matrix y = (Matrix) params.get(1);
                return x.reciprocal().multiply(y);
            }
        });

        storeBaseValue("div", new Primitive("div") {
            public PacioliValue apply(List<PacioliValue> params) throws MVMException {
                Matrix x = (Matrix) params.get(0);
                Matrix y = (Matrix) params.get(1);
                return x.div(y);
            }
        });

        storeBaseValue("mod", new Primitive("mod") {
            public PacioliValue apply(List<PacioliValue> params) throws MVMException {
                Matrix x = (Matrix) params.get(0);
                Matrix y = (Matrix) params.get(1);
                return x.mod(y);
            }
        });

        storeBaseValue("less", new Primitive("less") {
            public PacioliValue apply(List<PacioliValue> params) throws MVMException {
                Matrix x = (Matrix) params.get(0);
                Matrix y = (Matrix) params.get(1);
                return new Boole(x.less(y));
            }
        });

        storeBaseValue("less_eq", new Primitive("less_eq") {
            public PacioliValue apply(List<PacioliValue> params) throws MVMException {
                Matrix x = (Matrix) params.get(0);
                Matrix y = (Matrix) params.get(1);
                return new Boole(x.lessEq(y));
            }
        });

        storeBaseValue("greater", new Primitive("greater") {
            public PacioliValue apply(List<PacioliValue> params) throws MVMException {
                Matrix x = (Matrix) params.get(0);
                Matrix y = (Matrix) params.get(1);
                return new Boole(y.less(x));
            }
        });

        storeBaseValue("greater_eq", new Primitive("greater_eq") {
            public PacioliValue apply(List<PacioliValue> params) throws MVMException {
                Matrix x = (Matrix) params.get(0);
                Matrix y = (Matrix) params.get(1);
                return new Boole(y.lessEq(x));
            }
        });

        storeBaseValue("is_zero", new Primitive("is_zero") {
            public PacioliValue apply(List<PacioliValue> params) throws MVMException {
                Matrix x = (Matrix) params.get(0);
                return new Boole(x.isZero());
            }
        });

        storeBaseValue("get", new Primitive("get") {
            public PacioliValue apply(List<PacioliValue> params) throws MVMException {
                Matrix x = (Matrix) params.get(0);
                Key row = (Key) params.get(1);
                Key column = (Key) params.get(2);
                return x.get(row, column);
            }
        });

        storeBaseValue("get_num", new Primitive("get_num") {
            public PacioliValue apply(List<PacioliValue> params) throws MVMException {
                Matrix x = (Matrix) params.get(0);
                Key row = (Key) params.get(1);
                Key column = (Key) params.get(2);
                return x.get_num(row, column);
            }
        });

        storeBaseValue("set", new Primitive("set") {
            public PacioliValue apply(List<PacioliValue> params) throws MVMException {
                //Key row = (Key) params.get(0);
                //Key column = (Key) params.get(1);
                //Matrix x = (Matrix) params.get(2);
                // TODO: fix
                // return x.set(row,column,x);
                throw new MVMException("set is not implemented");
            }
        });

        storeBaseValue("isolate", new Primitive("isolate") {
            public PacioliValue apply(List<PacioliValue> params) throws MVMException {
                Matrix x = (Matrix) params.get(0);
                Key row = (Key) params.get(1);
                Key column = (Key) params.get(2);
                return x.isolate(row, column);
            }
        });

        storeBaseValue("multiply", new Primitive("multiply") {
            public PacioliValue apply(List<PacioliValue> params) throws MVMException {
                Matrix x = (Matrix) params.get(0);
                Matrix y = (Matrix) params.get(1);
                return x.multiply(y);
            }
        });

        storeBaseValue("loop_matrix", new Primitive("loop_matrix") {
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

        storeBaseValue("column", new Primitive("column") {
            public PacioliValue apply(List<PacioliValue> params) throws MVMException {
                Matrix matrix = (Matrix) params.get(0);
                Key key = (Key) params.get(1);
                return matrix.column(key);
            }
        });

        storeBaseValue("project", new Primitive("project") {
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

        storeBaseValue("row", new Primitive("row") {
            public PacioliValue apply(List<PacioliValue> params) throws MVMException {
                Matrix matrix = (Matrix) params.get(0);
                Key key = (Key) params.get(1);
                return matrix.row(key);
            }
        });

        storeBaseValue("column_domain", new Primitive("column_domain") {
            public PacioliValue apply(List<PacioliValue> params) throws MVMException {
                Matrix matrix = (Matrix) params.get(0);
                return matrix.columnDomain();
            }
        });

        storeBaseValue("row_domain", new Primitive("row_domain") {
            public PacioliValue apply(List<PacioliValue> params) throws MVMException {
                Matrix matrix = (Matrix) params.get(0);
                return matrix.rowDomain();
            }
        });

        storeBaseValue("mmult", new Primitive("mmult") {
            public PacioliValue apply(List<PacioliValue> params) throws MVMException {
                Matrix x = (Matrix) params.get(0);
                Matrix y = (Matrix) params.get(1);
                return x.join(y);
            }
        });

        storeBaseValue("kronecker", new Primitive("kronecker") {
            public PacioliValue apply(List<PacioliValue> params) throws MVMException {
                Matrix x = (Matrix) params.get(0);
                Matrix y = (Matrix) params.get(1);
                return x.kronecker(y);
            }
        });

        storeBaseValue("scale", new Primitive("scale") {
            public PacioliValue apply(List<PacioliValue> params) throws MVMException {
                Matrix x = (Matrix) params.get(0);
                Matrix y = (Matrix) params.get(1);
                return x.scale(y);
            }
        });

        storeBaseValue("rscale", new Primitive("rscale") {
            public PacioliValue apply(List<PacioliValue> params) throws MVMException {
                Matrix x = (Matrix) params.get(0);
                Matrix y = (Matrix) params.get(1);
                return y.scale(x);
            }
        });

        storeBaseValue("scale_down", new Primitive("scale_down") {
            public PacioliValue apply(List<PacioliValue> params) throws MVMException {
                Matrix x = (Matrix) params.get(0);
                Matrix y = (Matrix) params.get(1);
                return y.reciprocal().scale(x);
            }
        });

        storeBaseValue("lscale_down", new Primitive("lscale_down") {
            public PacioliValue apply(List<PacioliValue> params) throws MVMException {
                Matrix x = (Matrix) params.get(0);
                Matrix y = (Matrix) params.get(1);
                return x.scale(y.reciprocal());
            }
        });

        storeBaseValue("total", new Primitive("total") {
            public PacioliValue apply(List<PacioliValue> params) throws MVMException {
                Matrix x = (Matrix) params.get(0);
                return x.total();
            }
        });

        storeBaseValue("left_identity", new Primitive("left_identity") {
            public PacioliValue apply(List<PacioliValue> params) throws MVMException {
                Matrix x = (Matrix) params.get(0);
                return x.leftIdentity();
            }
        });

        storeBaseValue("support", new Primitive("support") {
            public PacioliValue apply(List<PacioliValue> params) throws MVMException {
                Matrix x = (Matrix) params.get(0);
                return x.posSupport().sum(x.negSupport());
            }
        });

        storeBaseValue("positive_support", new Primitive("positive_support") {
            public PacioliValue apply(List<PacioliValue> params) throws MVMException {
                Matrix x = (Matrix) params.get(0);
                return x.posSupport();
            }
        });

        storeBaseValue("negative_support", new Primitive("negative_support") {
            public PacioliValue apply(List<PacioliValue> params) throws MVMException {
                Matrix x = (Matrix) params.get(0);
                return x.negSupport();
            }
        });

        storeBaseValue("signum", new Primitive("signum") {
            public PacioliValue apply(List<PacioliValue> params) throws MVMException {
                Matrix x = (Matrix) params.get(0);
                return x.posSupport().sum(x.negSupport().negative());
            }
        });

        storeBaseValue("random", new Primitive("random") {
            public PacioliValue apply(List<PacioliValue> params) throws MVMException {
                return new Matrix(Math.random());
            }
        });

        storeBaseValue("top", new Primitive("top") {
            public PacioliValue apply(List<PacioliValue> params) throws MVMException {
                Matrix n = (Matrix) params.get(0);
                Matrix x = (Matrix) params.get(1);
                return x.top((int) n.SingletonNumber());
            }
        });

        storeBaseValue("bottom", new Primitive("bottom") {
            public PacioliValue apply(List<PacioliValue> params) throws MVMException {
                Matrix n = (Matrix) params.get(0);
                Matrix x = (Matrix) params.get(1);
                return x.bottom((int) n.SingletonNumber());
            }
        });

        storeBaseValue("right_identity", new Primitive("right_identity") {
            public PacioliValue apply(List<PacioliValue> params) throws MVMException {
                Matrix x = (Matrix) params.get(0);
                return x.rightIdentity();
            }
        });

        storeBaseValue("transpose", new Primitive("transpose") {
            public PacioliValue apply(List<PacioliValue> params) throws MVMException {
                Matrix x = (Matrix) params.get(0);
                return x.transpose();
            }
        });

        storeBaseValue("reciprocal", new Primitive("reciprocal") {
            public PacioliValue apply(List<PacioliValue> params) throws MVMException {
                Matrix x = (Matrix) params.get(0);
                return x.reciprocal();
            }
        });

        storeBaseValue("dim_inv", new Primitive("dim_inv") {
            public PacioliValue apply(List<PacioliValue> params) throws MVMException {
                Matrix x = (Matrix) params.get(0);
                return x.reciprocal().transpose();
            }
        });

        storeBaseValue("dim_div", new Primitive("dim_div") {
            public PacioliValue apply(List<PacioliValue> params) throws MVMException {
                Matrix x = (Matrix) params.get(0);
                Matrix y = (Matrix) params.get(1);
                return x.join(y.transpose().reciprocal());
            }
        });

        storeBaseValue("negative", new Primitive("negative") {
            public PacioliValue apply(List<PacioliValue> params) throws MVMException {
                Matrix x = (Matrix) params.get(0);
                return x.negative();
            }
        });

        storeBaseValue("abs", new Primitive("abs") {
            public PacioliValue apply(List<PacioliValue> params) throws MVMException {
                Matrix x = (Matrix) params.get(0);
                return x.abs();
            }
        });

        storeBaseValue("index_less", new Primitive("index_less") {
            public PacioliValue apply(List<PacioliValue> params) throws MVMException {
                Key row = (Key) params.get(0);
                Key column = (Key) params.get(1);
                return new Boole(row.position() < column.position());
            }
        });

        storeBaseValue("sin", new Primitive("sin") {
            public PacioliValue apply(List<PacioliValue> params) throws MVMException {
                Matrix x = (Matrix) params.get(0);
                return x.sin();
            }
        });

        storeBaseValue("cos", new Primitive("cos") {
            public PacioliValue apply(List<PacioliValue> params) throws MVMException {
                Matrix x = (Matrix) params.get(0);
                return x.cos();
            }
        });

        storeBaseValue("tan", new Primitive("tan") {
            public PacioliValue apply(List<PacioliValue> params) throws MVMException {
                Matrix x = (Matrix) params.get(0);
                return x.tan();
            }
        });

        storeBaseValue("_asin", new Primitive("_asin") {
            public PacioliValue apply(List<PacioliValue> params) throws MVMException {
                Matrix x = (Matrix) params.get(0);
                return x.asin();
            }
        });

        storeBaseValue("_acos", new Primitive("_acos") {
            public PacioliValue apply(List<PacioliValue> params) throws MVMException {
                Matrix x = (Matrix) params.get(0);
                return x.acos();
            }
        });

        storeBaseValue("_atan", new Primitive("_atan") {
            public PacioliValue apply(List<PacioliValue> params) throws MVMException {
                Matrix x = (Matrix) params.get(0);
                return x.atan();
            }
        });

        storeBaseValue("_atan2", new Primitive("_atan2") {
            public PacioliValue apply(List<PacioliValue> params) throws MVMException {
                Matrix x = (Matrix) params.get(0);
                Matrix y = (Matrix) params.get(1);
                return x.atan2(y);
            }
        });

        storeBaseValue("ln", new Primitive("ln") {
            public PacioliValue apply(List<PacioliValue> params) throws MVMException {
                Matrix x = (Matrix) params.get(0);
                return x.ln();
            }
        });

        storeBaseValue("exp", new Primitive("exp") {
            public PacioliValue apply(List<PacioliValue> params) throws MVMException {
                Matrix x = (Matrix) params.get(0);
                return x.exp();
            }
        });

        storeBaseValue("expt", new Primitive("expt") {
            public PacioliValue apply(List<PacioliValue> params) throws MVMException {
                Matrix x = (Matrix) params.get(0);
                Matrix y = (Matrix) params.get(1);
                return x.expt(y);
            }
        });

        storeBaseValue("mexpt", new Primitive("mexpt") {
            public PacioliValue apply(List<PacioliValue> params) throws MVMException {
                Matrix x = (Matrix) params.get(0);
                Matrix y = (Matrix) params.get(1);
                return x.power(y);
            }
        });

        storeBaseValue("log", new Primitive("log") {
            public PacioliValue apply(List<PacioliValue> params) throws MVMException {
                Matrix x = (Matrix) params.get(0);
                Matrix y = (Matrix) params.get(1);
                return x.log(y);
            }
        });

        // //////////////////////////////////////////////////////////////////////////////
        // List

        storeBaseValue("loop_list", new Primitive("loop_list") {
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

        storeBaseValue("map_list", new Primitive("map_list") {
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

        storeBaseValue("sort_list", new Primitive("sort_list") {
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
                            Boole result1 = (Boole) fun.apply(args);
                            args.set(0, o2);
                            args.set(1, o1);
                            Boole result2 = (Boole) fun.apply(args);
                            if (!result1.positive() && result2.positive()) {
                                return 1;
                            } else if (result1.positive() && !result2.positive()) {
                                return -1;
                            } else {
                                return 0;
                            }

                        } catch (MVMException ex) {
                            throw new RuntimeException(ex);
                        }
                    }

                });

                return new PacioliList(newItems);
            }
        });

        storeBaseValue("fold_list", new Primitive("fold_list") {
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

        storeBaseValue("nth", new Primitive("nth") {
            public PacioliValue apply(List<PacioliValue> params) throws MVMException {
                Matrix n = (Matrix) params.get(0);
                PacioliList list = (PacioliList) params.get(1);
                return list.nth((int) n.SingletonNumber());
                // int n = (int) ((Matrix) params.get(0)).SingletonNumber();
                // List<PacioliValue> list = ((PacioliList)
                // params.get(1)).items();
                // //return list.get((int) n.SingletonNumber());
                // if (n < list.size()) {
                // return list.get(n);
                // } else {
                // throw new
                // MVMException("Index %s for function 'nth' out of bounds. List size is %s",
                // n, list.size());
                // }
            }
        });

        storeBaseValue("empty_list", new Primitive("empty_list") {
            public PacioliValue apply(List<PacioliValue> params) throws MVMException {
                return new PacioliList();
            }
        });

        storeBaseValue("naturals", new Primitive("naturals") {
            public PacioliValue apply(List<PacioliValue> params) throws MVMException {
                Matrix n = (Matrix) params.get(0);
                // ArrayList<PacioliValue> list = new ArrayList<PacioliValue>();
                PacioliList list = new PacioliList();
                for (int i = 0; i < n.SingletonNumber(); i++) {
                    list.addMut(new Matrix(i));
                }
                return list;
            }
        });

        storeBaseValue("_add_mut", new Primitive("_add_mut") {
            public PacioliValue apply(List<PacioliValue> params) throws MVMException {
                PacioliList x = (PacioliList) params.get(0);
                PacioliValue y = params.get(1);
                return x.addMut(y);
            }
        });

        storeBaseValue("cons", new Primitive("cons") {
            public PacioliValue apply(List<PacioliValue> params) throws MVMException {
                PacioliValue x = params.get(0);
                PacioliList y = (PacioliList) params.get(1);
                return y.cons(x, y);
            }
        });

        storeBaseValue("append", new Primitive("append") {
            public PacioliValue apply(List<PacioliValue> params) throws MVMException {
                PacioliList x = (PacioliList) params.get(0);
                PacioliList y = (PacioliList) params.get(1);
                return x.append(y);
            }
        });

        storeBaseValue("reverse", new Primitive("reverse") {
            public PacioliValue apply(List<PacioliValue> params) throws MVMException {
                PacioliList x = (PacioliList) params.get(0);
                return x.reverse();
            }
        });

        storeBaseValue("head", new Primitive("head") {
            public PacioliValue apply(List<PacioliValue> params) throws MVMException {
                PacioliList x = (PacioliList) params.get(0);
                if (x.items().isEmpty()) {
                    throw new MVMException("function 'head' called on empty list");
                }
                return x.items().get(0);
            }
        });

        storeBaseValue("tail", new Primitive("tail") {
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

        storeBaseValue("singleton_list", new Primitive("singleton_list") {
            public PacioliValue apply(List<PacioliValue> params) throws MVMException {
                return new PacioliList(params.get(0));
            }
        });

        storeBaseValue("zip", new Primitive("zip") {
            public PacioliValue apply(List<PacioliValue> params) throws MVMException {
                PacioliList x = (PacioliList) params.get(0);
                PacioliList y = (PacioliList) params.get(1);
                return x.zip(y);
            }
        });

        storeBaseValue("list_size", new Primitive("list_size") {
            public PacioliValue apply(List<PacioliValue> params) throws MVMException {
                PacioliList x = (PacioliList) params.get(0);
                return new Matrix(x.items().size());
            }
        });

        storeBaseValue("contains", new Primitive("contains") {
            public PacioliValue apply(List<PacioliValue> params) throws MVMException {
                PacioliList list = (PacioliList) params.get(0);
                PacioliValue item = params.get(1);
                return new Boole(list.items().contains(item));
            }
        });

        storeBaseValue("string_compare", new Primitive("string_compare") {
            public PacioliValue apply(List<PacioliValue> params) throws MVMException {
                PacioliString string1 = (PacioliString) params.get(0);
                PacioliString string2 = (PacioliString) params.get(1);
                return new Matrix(string1.toText().compareTo(string2.toText()));
            }
        });

        storeBaseValue("text", new Primitive("text") {
            public PacioliValue apply(List<PacioliValue> params) throws MVMException {
                PacioliValue value = params.get(0);
                if (value == null) {
                    return new PacioliString("VOID!");
                } else {
                    return new PacioliString(value.toText());
                }
            }
        });

        storeBaseValue("get_unit_text", new Primitive("get_unit_text") {
            public PacioliValue apply(List<PacioliValue> params) throws MVMException {
                Matrix x = (Matrix) params.get(0);
                Key row = (Key) params.get(1);
                Key column = (Key) params.get(2);
                return new PacioliString(x.get_unit(row, column).pretty());
            }
        });

        storeBaseValue("concatenate", new Primitive("concatenate") {
            public PacioliValue apply(List<PacioliValue> params) throws MVMException {
                PacioliString string1 = (PacioliString) params.get(0);
                PacioliString string2 = (PacioliString) params.get(1);
                return new PacioliString(string1.toText().concat(string2.toText()));
            }
        });

        storeBaseValue("num2string", new Primitive("num2string") {
            public PacioliValue apply(List<PacioliValue> params) throws MVMException {
                Matrix num = (Matrix) params.get(0);
                Matrix n = (Matrix) params.get(1);
                int d = (int) n.SingletonNumber();
                DecimalFormat format = new DecimalFormat();
                format.setMinimumIntegerDigits(1);
                format.setMaximumFractionDigits(d);
                format.setMinimumFractionDigits(d);
                format.setGroupingUsed(false);
                return new PacioliString(format.format(num.SingletonNumber()));
            }
        });
        
        storeBaseValue("split_string", new Primitive("split_string") {
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

        storeBaseValue("trim", new Primitive("trim") {
            public PacioliValue apply(List<PacioliValue> params) throws MVMException {
                PacioliString string = (PacioliString) params.get(0);
                return new PacioliString(string.toText().trim());
            }
        });

        storeBaseValue("parse_num", new Primitive("parse_num") {
            public PacioliValue apply(List<PacioliValue> params) throws MVMException {
                PacioliString string = (PacioliString) params.get(0);
                Double value = Double.parseDouble(string.toText());
                return new Matrix(value);
            }
        });

        storeBaseValue("format", new Primitive("format") {
            public PacioliValue apply(List<PacioliValue> params) throws MVMException {
                if (params.isEmpty()) {
                    return new PacioliString("No format string found. The first argument to format must be a string.");
                } else {
                    checkStringArg(params, 0);
                    PacioliString formatString = (PacioliString) params.get(0);
                    //List<String> paramStrings = new ArrayList<String>();
                    Object[] paramStrings = new String[params.size() - 1];
                    for (int i = 0; i < params.size() - 1; i++) {
                        //paramStrings.add(value.toText());
                        paramStrings[i] = params.get(i + 1).toText();
                    }
                    String text = String.format(formatString.toText(), paramStrings);
                    //String text = String.format("yo %s", "delo");
                    return new PacioliString(text);
                }
            }
        });

        storeBaseValue("error", new Primitive("error") {
            public PacioliValue apply(List<PacioliValue> params) throws MVMException {
                PacioliString string = (PacioliString) params.get(0);
                throw new MVMException(string.toText());
            }
        });

        storeBaseValue("_three_question_marks", new Primitive("_three_question_marks") {
            public PacioliValue apply(List<PacioliValue> params) throws MVMException {
                throw new MVMException("Not yet implemented");
            }
        });

        storeBaseValue("make_array", new Primitive("make_array") {
            public PacioliValue apply(List<PacioliValue> params) throws MVMException {
                Matrix n = (Matrix) params.get(0);
                int d = (int) n.SingletonNumber();
                return new PacioliArray(d);
            }
        });
        
        storeBaseValue("array_put", new Primitive("array_put") {
            public PacioliValue apply(List<PacioliValue> params) throws MVMException {
                PacioliArray array = (PacioliArray) params.get(0);
                Matrix index = (Matrix) params.get(1);
                array.put((int) index.SingletonNumber(), params.get(2));
                return array;
            }
        });

        storeBaseValue("array_get", new Primitive("array_get") {
            public PacioliValue apply(List<PacioliValue> params) throws MVMException {
                PacioliArray array = (PacioliArray) params.get(0);
                Matrix index = (Matrix) params.get(1);
                return array.get((int) index.SingletonNumber());
            }
        });

        storeBaseValue("array_size", new Primitive("array_size") {
            public PacioliValue apply(List<PacioliValue> params) throws MVMException {
                PacioliArray array = (PacioliArray) params.get(0);
                return new Matrix(array.size());
            }
        });

        storeBaseValue("_system_time", new Primitive("_system_time") {
            public PacioliValue apply(List<PacioliValue> params) throws MVMException {
                return new Matrix(System.nanoTime()/1000000.0);
            }
        });
    }

    /*
     * Utilities
     */
    public static void log(String string, Object... args) {

        String text = String.format(string, args);

        if (!text.isEmpty()) {
            atLineStart = false;
        }

        if (System.console() == null) {
            System.out.print(text);
            System.out.flush();
        } else {
            System.console().format("%s", text);
            System.console().flush();
        }
    }

    public static void logln(String string, Object... args) {

        if (!atLineStart) {
            // System.out.println();
            log("\n");
            atLineStart = true;
        }

        log(string, args);
    }

    public void dumpTypes() {
        logln("Store signature:");
        for (java.util.Map.Entry<String, PacioliValue> entry : store.entrySet()) {
            if (entry.getValue() instanceof Matrix) {
                logln("%s :: %s", entry.getKey(), ((Matrix) entry.getValue()).shape.toText());
            }

        }
    }

    public void dumpState() {
        logln("Store contents:");
        for (java.util.Map.Entry<String, PacioliValue> entry : store.entrySet()) {
            if (entry.getValue() instanceof Matrix) {
                logln("%s =%s", entry.getKey(), entry.getValue().toText());
            }
        }
        logln("\nStack:");
        int i = 1;
        for (Iterator<String> it = debugStack.descendingIterator(); it.hasNext();) {
            logln("\n%s) %s", i++, it.next());
        }
    }

    static public UnitSystem<MatrixBase> makeSI() {
        UnitSystem<MatrixBase> si = new UnitSystem<MatrixBase>();
        si.addPrefix("giga", new Prefix("G", new BigDecimal("1000000000")));
        si.addPrefix("mega", new Prefix("M", new BigDecimal("1000000")));
        si.addPrefix("kilo", new Prefix("k", new BigDecimal("1000")));
        si.addPrefix("hecto", new Prefix("h", new BigDecimal("100")));
        si.addPrefix("deca", new Prefix("da", new BigDecimal("10")));
        si.addPrefix("deci", new Prefix("d", new BigDecimal("0.1")));
        si.addPrefix("centi", new Prefix("c", new BigDecimal("0.01")));
        si.addPrefix("milli", new Prefix("m", new BigDecimal("0.001")));
        si.addPrefix("micro", new Prefix("μ", new BigDecimal("0.000001")));
        si.addPrefix("nano", new Prefix("n", new BigDecimal("0.000000001")));
        return si;
    }

    public void run(File file, PrintStream out, List<File> libs) throws Exception {
   ////     for (String include : PacioliFile.defaultIncludes) {
   ///         runRec(PacioliFile.findFile(include + ".mvm", libs, file.getParentFile()), out, libs);
   ////     }
        runRec(file, out, libs);
    }

    public void runRec(File file, PrintStream out, List<File> libs) throws Exception {

        // Check if the file was already loaded
        if (!loadedFiles.contains(file)) {

            // Make sure the file is not loaded more than once
            loadedFiles.add(file);

            // Load the file
            mvm.ast.Program code = mvm.parser.Parser.parseFile(file);

            // Run the requires
            for (String require : code.requires) {
                //runRec(PacioliFile.findFile(require + ".mvm", libs, file.getParentFile()), out, libs);
            }
            ;

            // Run the file itself
            // Pacioli.logln2("Running MVM file %s", file);
            for (Instruction instruction : code.instructions) {
                instruction.eval(this);
            }
        }
    }
}
