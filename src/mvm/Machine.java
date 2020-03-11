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
import pacioli.Pacioli;
import pacioli.PacioliFile;
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

        store.putGlobal("Primitives", "true", new Boole(true));

        store.putDebug("Primitives", "true", new Boole(true));

        store.putGlobal("Primitives", "false", new Boole(false));

        store.putDebug("Primitives", "false", new Boole(false));

        store.putGlobal("Primitives", "nothing", null);

        store.putDebug("Primitives", "nothing", null);

        store.putGlobal("Primitives", "tuple", new Primitive("tuple") {
            public PacioliValue apply(List<PacioliValue> params) throws MVMException {
                return new PacioliTuple(params);
            }
        });

        store.putDebug("Primitives", "tuple", new Primitive("tuple") {
            public PacioliValue apply(List<PacioliValue> params) throws MVMException {
                Callable fun = (Callable) store.lookup("global_Primitives_tuple");
                PacioliValue result = fun.apply(params);
                return result;
            }
        });

        store.putGlobal("Primitives", "apply", new Primitive("apply") {
            public PacioliValue apply(List<PacioliValue> params) throws MVMException {
                Callable function = (Callable) params.get(0);
                PacioliTuple tuple = (PacioliTuple) params.get(1);
                return function.apply(tuple.items());
            }
        });

        store.putDebug("Primitives", "apply", new Primitive("apply") {
            public PacioliValue apply(List<PacioliValue> params) throws MVMException {
                checkNrArgs(params, 2);
                checkCallableArg(params, 0);
                checkTupleArg(params, 1);
                Callable fun = (Callable) store.lookup("global_Primitives_apply");
                PacioliValue result = fun.apply(params);
                return result;
            }
        });

        store.putGlobal("Primitives", "equal", new Primitive("equal") {
            public PacioliValue apply(List<PacioliValue> params) throws MVMException {
                return new Boole(params.get(0).equals(params.get(1)));
            }
        });

        store.putDebug("Primitives", "equal", new Primitive("equal") {
            public PacioliValue apply(List<PacioliValue> params) throws MVMException {
                checkNrArgs(params, 2);
                Callable fun = (Callable) store.lookup("global_Primitives_equal");
                PacioliValue result = fun.apply(params);
                return result;
            }
        });

        store.putGlobal("Primitives", "not_equal", new Primitive("not_equal") {
            public PacioliValue apply(List<PacioliValue> params) throws MVMException {
                return new Boole(!params.get(0).equals(params.get(1)));
            }
        });

        store.putDebug("Primitives", "not_equal", new Primitive("not_equal") {
            public PacioliValue apply(List<PacioliValue> params) throws MVMException {
                checkNrArgs(params, 2);
                Callable fun = (Callable) store.lookup("global_Primitives_not_equal");
                PacioliValue result = fun.apply(params);
                return result;
            }
        });

        store.putGlobal("Primitives", "not", new Primitive("not") {
            public PacioliValue apply(List<PacioliValue> params) throws MVMException {
                Boole x = (Boole) params.get(0);
                return new Boole(!x.positive());
            }
        });

        store.putDebug("Primitives", "not", new Primitive("not") {
            public PacioliValue apply(List<PacioliValue> params) throws MVMException {
                checkNrArgs(params, 1);
                checkBooleArg(params, 0);
                Callable fun = (Callable) store.lookup("global_Primitives_not");
                PacioliValue result = fun.apply(params);
                return result;
            }
        });

        store.putGlobal("Primitives", "printed", new Primitive("printed") {
            public PacioliValue apply(List<PacioliValue> params) throws MVMException {
                PacioliValue value = params.get(0);
                if (value != null) { // void value of statements
                    logln("%s", value.toText());
                }
                return value;
            }
        });

        store.putDebug("Primitives", "printed", new Primitive("printed") {
            public PacioliValue apply(List<PacioliValue> params) throws MVMException {
                checkNrArgs(params, 1);
                Callable fun = (Callable) store.lookup("global_Primitives_printed");
                PacioliValue result = fun.apply(params);
                return result;
            }
        });

        store.putGlobal("Primitives", "print", new Primitive("print") {
            public PacioliValue apply(List<PacioliValue> params) throws MVMException {
                PacioliValue value = params.get(0);
                if (value != null) { // void value of statements
                    logln("%s", value.toText());
                }
                return null;
            }
        });

        store.putDebug("Primitives", "print", new Primitive("print") {
            public PacioliValue apply(List<PacioliValue> params) throws MVMException {
                checkNrArgs(params, 1);
                Callable fun = (Callable) store.lookup("global_Primitives_print");
                PacioliValue result = fun.apply(params);
                return result;
            }
        });

        store.putGlobal("Primitives", "write", new Primitive("write") {
            public PacioliValue apply(List<PacioliValue> params) throws MVMException {
                PacioliValue value = params.get(0);
                if (value != null) { // void value of statements
                    log(">%s<", value.toText());
                }
                return null;
            }
        });

        store.putDebug("Primitives", "write", new Primitive("write") {
            public PacioliValue apply(List<PacioliValue> params) throws MVMException {
                checkNrArgs(params, 1);
                Callable fun = (Callable) store.lookup("global_Primitives_write");
                PacioliValue result = fun.apply(params);
                return result;
            }
        });

        store.putGlobal("Primitives", "skip", new Primitive("skip") {
            public PacioliValue apply(List<PacioliValue> params) throws MVMException {
                // return null;
                return new Matrix(-1);
            }
        });

        store.putDebug("Primitives", "skip", new Primitive("skip") {
            public PacioliValue apply(List<PacioliValue> params) throws MVMException {
                checkNrArgs(params, 0);
                Callable fun = (Callable) store.lookup("global_Primitives_skip");
                PacioliValue result = fun.apply(params);
                return result;
            }
        });

        store.putGlobal("Primitives", "identity", new Primitive("identity") {
            public PacioliValue apply(List<PacioliValue> params) throws MVMException {
                return params.get(0);
            }
        });

        store.putDebug("Primitives", "identity", new Primitive("identity") {
            public PacioliValue apply(List<PacioliValue> params) throws MVMException {
                checkNrArgs(params, 1);
                Callable fun = (Callable) store.lookup("global_Primitives_identity");
                PacioliValue result = fun.apply(params);
                return result;
            }
        });

        store.putGlobal("Primitives", "empty_ref", new Primitive("empty_ref") {
            public PacioliValue apply(List<PacioliValue> params) throws MVMException {
                return new Reference();
            }
        });

        store.putDebug("Primitives", "empty_ref", new Primitive("empty_ref") {
            public PacioliValue apply(List<PacioliValue> params) throws MVMException {
                checkNrArgs(params, 0);
                Callable fun = (Callable) store.lookup("global_Primitives_empty_ref");
                PacioliValue result = fun.apply(params);
                return result;
            }
        });

        store.putGlobal("Primitives", "new_ref", new Primitive("new_ref") {
            public PacioliValue apply(List<PacioliValue> params) throws MVMException {
                return new Reference(params.get(0));
            }
        });

        store.putDebug("Primitives", "new_ref", new Primitive("new_ref") {
            public PacioliValue apply(List<PacioliValue> params) throws MVMException {
                checkNrArgs(params, 1);
                Callable fun = (Callable) store.lookup("global_Primitives_new_ref");
                PacioliValue result = fun.apply(params);
                return result;
            }
        });

        store.putGlobal("Primitives", "ref_get", new Primitive("ref_get") {
            public PacioliValue apply(List<PacioliValue> params) throws MVMException {
                Reference ref = (Reference) params.get(0);
                return ref.getValue();
            }
        });

        store.putDebug("Primitives", "ref_get", new Primitive("ref_get") {
            public PacioliValue apply(List<PacioliValue> params) throws MVMException {
                checkNrArgs(params, 1);
                checkReferenceArg(params, 0);
                Callable fun = (Callable) store.lookup("global_Primitives_ref_get");
                PacioliValue result = fun.apply(params);
                return result;
            }
        });

        store.putGlobal("Primitives", "ref_set", new Primitive("ref_set") {
            public PacioliValue apply(List<PacioliValue> params) throws MVMException {
                Reference ref = (Reference) params.get(0);
                PacioliValue value = params.get(1);
                ref.setValue(value);
                return ref;
            }
        });

        store.putDebug("Primitives", "ref_set", new Primitive("ref_set") {
            public PacioliValue apply(List<PacioliValue> params) throws MVMException {
                checkNrArgs(params, 2);
                checkReferenceArg(params, 0);
                Callable fun = (Callable) store.lookup("global_Primitives_ref_set");
                PacioliValue result = fun.apply(params);
                return result;
            }
        });

        store.putGlobal("Primitives", "seq", new Primitive("seq") {
            public PacioliValue apply(List<PacioliValue> params) throws MVMException {
                return params.get(1);
            }
        });

        store.putDebug("Primitives", "seq", new Primitive("seq") {
            public PacioliValue apply(List<PacioliValue> params) throws MVMException {
                checkNrArgs(params, 2);
                Callable fun = (Callable) store.lookup("global_Primitives_seq");
                PacioliValue result = fun.apply(params);
                return result;
            }
        });

        store.putGlobal("Primitives", "while_function", new Primitive("seq") {
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

        store.putDebug("Primitives", "while_function", new Primitive("seq") {
            public PacioliValue apply(List<PacioliValue> params) throws MVMException {
                checkNrArgs(params, 2);
                checkCallableArg(params, 0);
                checkCallableArg(params, 1);
                Callable fun = (Callable) store.lookup("global_Primitives_while_function");
                PacioliValue result = fun.apply(params);
                return result;
            }
        });

        store.putGlobal("Primitives", "throw_result", new Primitive("throw_result") {
            public PacioliValue apply(List<PacioliValue> params) throws MVMException {
                Reference first = (Reference) params.get(0);
                first.setValue(params.get(1));
                throw new ControlTransfer();
            }
        });

        store.putDebug("Primitives", "throw_result", new Primitive("throw_result") {
            public PacioliValue apply(List<PacioliValue> params) throws MVMException {
                checkNrArgs(params, 2);
                checkReferenceArg(params, 0);
                Callable fun = (Callable) store.lookup("global_Primitives_throw_result");
                PacioliValue result = fun.apply(params);
                return result;
            }
        });

        store.putGlobal("Primitives", "catch_result", new Primitive("catch_and_return_result") {
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

        store.putDebug("Primitives", "catch_result", new Primitive("catch_and_return_result") {
            public PacioliValue apply(List<PacioliValue> params) throws MVMException {
                checkNrArgs(params, 2);
                checkCallableArg(params, 0);
                checkReferenceArg(params, 1);
                Callable fun = (Callable) store.lookup("global_Primitives_catch_result");
                PacioliValue result = fun.apply(params);
                return result;
            }
        });
        // //////////////////////////////////////////////////////////////////////////////
        // Matrix

        store.putGlobal("Matrix", "_", new Key());

        store.putDebug("Matrix", "_", new Key());

        store.putGlobal("Matrix", "solve", new Primitive("solve") {
            public PacioliValue apply(List<PacioliValue> params) throws MVMException {
                Matrix x = (Matrix) params.get(0);
                Matrix y = (Matrix) params.get(1);
                return x.solve(y);
            }
        });

        store.putDebug("Matrix", "solve", new Primitive("solve") {
            public PacioliValue apply(List<PacioliValue> params) throws MVMException {
                checkNrArgs(params, 2);
                checkMatrixArg(params, 0);
                checkMatrixArg(params, 1);
                Callable fun = (Callable) store.lookup("global_Matrix_solve");
                PacioliValue result = fun.apply(params);
                return result;
            }
        });

        store.putGlobal("Matrix", "plu", new Primitive("plu") {
            public PacioliValue apply(List<PacioliValue> params) throws MVMException {
                Matrix x = (Matrix) params.get(0);
                return x.plu();
            }
        });

        store.putDebug("Matrix", "plu", new Primitive("plu") {
            public PacioliValue apply(List<PacioliValue> params) throws MVMException {
                checkNrArgs(params, 1);
                checkMatrixArg(params, 0);
                Callable fun = (Callable) store.lookup("global_Matrix_plu");
                PacioliValue result = fun.apply(params);
                return result;
            }
        });

        store.putGlobal("Matrix", "svd", new Primitive("svd") {
            public PacioliValue apply(List<PacioliValue> params) throws MVMException {
                Matrix x = (Matrix) params.get(0);
                return x.svdNonZero();
            }
        });

        store.putDebug("Matrix", "svd", new Primitive("svd") {
            public PacioliValue apply(List<PacioliValue> params) throws MVMException {
                checkNrArgs(params, 1);
                checkMatrixArg(params, 0);
                Callable fun = (Callable) store.lookup("global_Matrix_svd");
                PacioliValue result = fun.apply(params);
                return result;
            }
        });

        store.putGlobal("Matrix", "qr", new Primitive("qr") {
            public PacioliValue apply(List<PacioliValue> params) throws MVMException {
                Matrix x = (Matrix) params.get(0);
                return x.qrZeroSub();
            }
        });

        store.putDebug("Matrix", "qr", new Primitive("qr") {
            public PacioliValue apply(List<PacioliValue> params) throws MVMException {
                checkNrArgs(params, 1);
                checkMatrixArg(params, 0);
                Callable fun = (Callable) store.lookup("global_Matrix_qr");
                PacioliValue result = fun.apply(params);
                return result;
            }
        });

        store.putGlobal("Matrix", "unit_factor", new Primitive("unit_factor") {
            public PacioliValue apply(List<PacioliValue> params) throws MVMException {
                Matrix matrix = (Matrix) params.get(0);
                return new Matrix(matrix.shape.getFactor());
            }
        });

        store.putDebug("Matrix", "unit_factor", new Primitive("unit_factor") {
            public PacioliValue apply(List<PacioliValue> params) throws MVMException {
                checkNrArgs(params, 1);
                checkMatrixArg(params, 0);
                Callable fun = (Callable) store.lookup("global_Matrix_unit_factor");
                PacioliValue result = fun.apply(params);
                return result;
            }
        });

        store.putGlobal("Matrix", "row_unit", new Primitive("row_unit") {
            public PacioliValue apply(List<PacioliValue> params) throws MVMException {
                Matrix matrix = (Matrix) params.get(0);
                return matrix.rowUnitVector();
            }
        });

        store.putDebug("Matrix", "row_unit", new Primitive("row_unit") {
            public PacioliValue apply(List<PacioliValue> params) throws MVMException {
                checkNrArgs(params, 1);
                checkMatrixArg(params, 0);
                Callable fun = (Callable) store.lookup("global_Matrix_row_unit");
                PacioliValue result = fun.apply(params);
                return result;
            }
        });

        store.putGlobal("Matrix", "column_unit", new Primitive("column_unit") {
            public PacioliValue apply(List<PacioliValue> params) throws MVMException {
                Matrix matrix = (Matrix) params.get(0);
                return matrix.columnUnitVector();
            }
        });

        store.putDebug("Matrix", "column_unit", new Primitive("column_unit") {
            public PacioliValue apply(List<PacioliValue> params) throws MVMException {
                checkNrArgs(params, 1);
                checkMatrixArg(params, 0);
                Callable fun = (Callable) store.lookup("global_Matrix_column_unit");
                PacioliValue result = fun.apply(params);
                return result;
            }
        });

        store.putGlobal("Matrix", "make_matrix", new Primitive("make_matrix") {
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

        store.putDebug("Matrix", "make_matrix", new Primitive("make_matrix") {
            public PacioliValue apply(List<PacioliValue> params) throws MVMException {
                checkNrArgs(params, 1);
                checkListArg(params, 0);
                Callable fun = (Callable) store.lookup("global_Matrix_make_matrix");
                PacioliValue result = fun.apply(params);
                return result;
            }
        });

        store.putGlobal("Matrix", "gcd", new Primitive("gcd") {
            public PacioliValue apply(List<PacioliValue> params) throws MVMException {
                Matrix x = (Matrix) params.get(0);
                Matrix y = (Matrix) params.get(1);
                return x.gcd(y);
            }
        });

        store.putDebug("Matrix", "gcd", new Primitive("gcd") {
            public PacioliValue apply(List<PacioliValue> params) throws MVMException {
                checkNrArgs(params, 2);
                checkMatrixArg(params, 0);
                checkMatrixArg(params, 1);
                Callable fun = (Callable) store.lookup("global_Matrix_gcd");
                PacioliValue result = fun.apply(params);
                return result;
            }
        });

        store.putGlobal("Matrix", "min", new Primitive("min") {
            public PacioliValue apply(List<PacioliValue> params) throws MVMException {
                Matrix x = (Matrix) params.get(0);
                Matrix y = (Matrix) params.get(1);
                return x.min(y);
            }
        });

        store.putDebug("Matrix", "min", new Primitive("min") {
            public PacioliValue apply(List<PacioliValue> params) throws MVMException {
                checkNrArgs(params, 2);
                checkMatrixArg(params, 0);
                checkMatrixArg(params, 1);
                Callable fun = (Callable) store.lookup("global_Matrix_min");
                PacioliValue result = fun.apply(params);
                return result;
            }
        });

        store.putGlobal("Matrix", "max", new Primitive("max") {
            public PacioliValue apply(List<PacioliValue> params) throws MVMException {
                Matrix x = (Matrix) params.get(0);
                Matrix y = (Matrix) params.get(1);
                return x.max(y);
            }
        });

        store.putDebug("Matrix", "max", new Primitive("max") {
            public PacioliValue apply(List<PacioliValue> params) throws MVMException {
                checkNrArgs(params, 2);
                checkMatrixArg(params, 0);
                checkMatrixArg(params, 1);
                Callable fun = (Callable) store.lookup("global_Matrix_max");
                PacioliValue result = fun.apply(params);
                return result;
            }
        });

        store.putGlobal("Matrix", "sqrt", new Primitive("sqrt") {
            public PacioliValue apply(List<PacioliValue> params) throws MVMException {
                Matrix x = (Matrix) params.get(0);
                return x.sqrt();
            }
        });

        store.putDebug("Matrix", "sqrt", new Primitive("sqrt") {
            public PacioliValue apply(List<PacioliValue> params) throws MVMException {
                checkNrArgs(params, 1);
                checkMatrixArg(params, 0);
                Callable fun = (Callable) store.lookup("global_Matrix_sqrt");
                PacioliValue result = fun.apply(params);
                return result;
            }
        });

        store.putGlobal("Matrix", "sum", new Primitive("sum") {
            public PacioliValue apply(List<PacioliValue> params) throws MVMException {
                Matrix x = (Matrix) params.get(0);
                Matrix y = (Matrix) params.get(1);
                return x.sum(y);
            }
        });

        store.putDebug("Matrix", "sum", new Primitive("sum") {
            public PacioliValue apply(List<PacioliValue> params) throws MVMException {
                checkNrArgs(params, 2);
                checkMatrixArg(params, 0);
                checkMatrixArg(params, 1);
                Callable fun = (Callable) store.lookup("global_Matrix_sum");
                PacioliValue result = fun.apply(params);
                return result;
            }
        });

        store.putGlobal("Matrix", "minus", new Primitive("minus") {
            public PacioliValue apply(List<PacioliValue> params) throws MVMException {
                Matrix x = (Matrix) params.get(0);
                Matrix y = (Matrix) params.get(1);
                return x.sum(y.negative());
            }
        });

        store.putDebug("Matrix", "minus", new Primitive("minus") {
            public PacioliValue apply(List<PacioliValue> params) throws MVMException {
                checkNrArgs(params, 2);
                checkMatrixArg(params, 0);
                checkMatrixArg(params, 1);
                Callable fun = (Callable) store.lookup("global_Matrix_minus");
                PacioliValue result = fun.apply(params);
                return result;
            }
        });

        store.putGlobal("Matrix", "magnitude", new Primitive("magnitude") {
            public PacioliValue apply(List<PacioliValue> params) throws MVMException {
                Matrix x = (Matrix) params.get(0);
                return x.magnitude();
            }
        });

        store.putDebug("Matrix", "magnitude", new Primitive("magnitude") {
            public PacioliValue apply(List<PacioliValue> params) throws MVMException {
                checkNrArgs(params, 1);
                checkMatrixArg(params, 0);
                Callable fun = (Callable) store.lookup("global_Matrix_magnitude");
                PacioliValue result = fun.apply(params);
                return result;
            }
        });

        store.putGlobal("Matrix", "divide", new Primitive("divide") {
            public PacioliValue apply(List<PacioliValue> params) throws MVMException {
                Matrix x = (Matrix) params.get(0);
                Matrix y = (Matrix) params.get(1);
                return x.multiply(y.reciprocal());
            }
        });

        store.putDebug("Matrix", "divide", new Primitive("divide") {
            public PacioliValue apply(List<PacioliValue> params) throws MVMException {
                checkNrArgs(params, 2);
                checkMatrixArg(params, 0);
                checkMatrixArg(params, 1);
                Callable fun = (Callable) store.lookup("global_Matrix_divide");
                PacioliValue result = fun.apply(params);
                return result;
            }
        });

        store.putGlobal("Matrix", "left_divide", new Primitive("left_divide") {
            public PacioliValue apply(List<PacioliValue> params) throws MVMException {
                Matrix x = (Matrix) params.get(0);
                Matrix y = (Matrix) params.get(1);
                return x.reciprocal().multiply(y);
            }
        });

        store.putDebug("Matrix", "left_divide", new Primitive("left_divide") {
            public PacioliValue apply(List<PacioliValue> params) throws MVMException {
                checkNrArgs(params, 2);
                checkMatrixArg(params, 0);
                checkMatrixArg(params, 1);
                Callable fun = (Callable) store.lookup("global_Matrix_left_divide");
                PacioliValue result = fun.apply(params);
                return result;
            }
        });

        store.putGlobal("Matrix", "div", new Primitive("div") {
            public PacioliValue apply(List<PacioliValue> params) throws MVMException {
                Matrix x = (Matrix) params.get(0);
                Matrix y = (Matrix) params.get(1);
                return x.div(y);
            }
        });

        store.putDebug("Matrix", "div", new Primitive("div") {
            public PacioliValue apply(List<PacioliValue> params) throws MVMException {
                checkNrArgs(params, 2);
                checkMatrixArg(params, 0);
                checkMatrixArg(params, 1);
                Callable fun = (Callable) store.lookup("global_Matrix_div");
                PacioliValue result = fun.apply(params);
                return result;
            }
        });

        store.putGlobal("Matrix", "mod", new Primitive("mod") {
            public PacioliValue apply(List<PacioliValue> params) throws MVMException {
                Matrix x = (Matrix) params.get(0);
                Matrix y = (Matrix) params.get(1);
                return x.mod(y);
            }
        });

        store.putDebug("Matrix", "mod", new Primitive("mod") {
            public PacioliValue apply(List<PacioliValue> params) throws MVMException {
                checkNrArgs(params, 2);
                checkMatrixArg(params, 0);
                checkMatrixArg(params, 1);
                Callable fun = (Callable) store.lookup("global_Matrix_mod");
                PacioliValue result = fun.apply(params);
                return result;
            }
        });

        store.putGlobal("Matrix", "less", new Primitive("less") {
            public PacioliValue apply(List<PacioliValue> params) throws MVMException {
                Matrix x = (Matrix) params.get(0);
                Matrix y = (Matrix) params.get(1);
                return new Boole(x.less(y));
            }
        });

        store.putDebug("Matrix", "less", new Primitive("less") {
            public PacioliValue apply(List<PacioliValue> params) throws MVMException {
                checkNrArgs(params, 2);
                checkMatrixArg(params, 0);
                checkMatrixArg(params, 1);
                Callable fun = (Callable) store.lookup("global_Matrix_less");
                PacioliValue result = fun.apply(params);
                return result;
            }
        });

        store.putGlobal("Matrix", "less_eq", new Primitive("less_eq") {
            public PacioliValue apply(List<PacioliValue> params) throws MVMException {
                Matrix x = (Matrix) params.get(0);
                Matrix y = (Matrix) params.get(1);
                return new Boole(x.lessEq(y));
            }
        });

        store.putDebug("Matrix", "less_eq", new Primitive("less_eq") {
            public PacioliValue apply(List<PacioliValue> params) throws MVMException {
                checkNrArgs(params, 2);
                checkMatrixArg(params, 0);
                checkMatrixArg(params, 1);
                Callable fun = (Callable) store.lookup("global_Matrix_less_eq");
                PacioliValue result = fun.apply(params);
                return result;
            }
        });

        store.putGlobal("Matrix", "greater", new Primitive("greater") {
            public PacioliValue apply(List<PacioliValue> params) throws MVMException {
                Matrix x = (Matrix) params.get(0);
                Matrix y = (Matrix) params.get(1);
                return new Boole(y.less(x));
            }
        });

        store.putDebug("Matrix", "greater", new Primitive("greater") {
            public PacioliValue apply(List<PacioliValue> params) throws MVMException {
                checkNrArgs(params, 2);
                checkMatrixArg(params, 0);
                checkMatrixArg(params, 1);
                Callable fun = (Callable) store.lookup("global_Matrix_greater");
                PacioliValue result = fun.apply(params);
                return result;
            }
        });

        store.putGlobal("Matrix", "greater_eq", new Primitive("greater_eq") {
            public PacioliValue apply(List<PacioliValue> params) throws MVMException {
                Matrix x = (Matrix) params.get(0);
                Matrix y = (Matrix) params.get(1);
                return new Boole(y.lessEq(x));
            }
        });

        store.putDebug("Matrix", "greater_eq", new Primitive("greater_eq") {
            public PacioliValue apply(List<PacioliValue> params) throws MVMException {
                checkNrArgs(params, 2);
                checkMatrixArg(params, 0);
                checkMatrixArg(params, 1);
                Callable fun = (Callable) store.lookup("global_Matrix_greater_eq");
                PacioliValue result = fun.apply(params);
                return result;
            }
        });

        store.putGlobal("Matrix", "is_zero", new Primitive("is_zero") {
            public PacioliValue apply(List<PacioliValue> params) throws MVMException {
                Matrix x = (Matrix) params.get(0);
                return new Boole(x.isZero());
            }
        });

        store.putDebug("Matrix", "is_zero", new Primitive("is_zero") {
            public PacioliValue apply(List<PacioliValue> params) throws MVMException {
                checkNrArgs(params, 1);
                checkMatrixArg(params, 0);
                Callable fun = (Callable) store.lookup("global_Matrix_is_zero");
                PacioliValue result = fun.apply(params);
                return result;
            }
        });

        store.putGlobal("Matrix", "get", new Primitive("get") {
            public PacioliValue apply(List<PacioliValue> params) throws MVMException {
                Matrix x = (Matrix) params.get(0);
                Key row = (Key) params.get(1);
                Key column = (Key) params.get(2);
                return x.get(row, column);
            }
        });

        store.putDebug("Matrix", "get", new Primitive("get") {
            public PacioliValue apply(List<PacioliValue> params) throws MVMException {
                checkNrArgs(params, 3);
                checkMatrixArg(params, 0);
                checkKeyArg(params, 1);
                checkKeyArg(params, 2);
                Callable fun = (Callable) store.lookup("global_Matrix_get");
                PacioliValue result = fun.apply(params);
                return result;
            }
        });

        store.putGlobal("Matrix", "get_num", new Primitive("get_num") {
            public PacioliValue apply(List<PacioliValue> params) throws MVMException {
                Matrix x = (Matrix) params.get(0);
                Key row = (Key) params.get(1);
                Key column = (Key) params.get(2);
                return x.get_num(row, column);
            }
        });

        store.putDebug("Matrix", "get_num", new Primitive("get_num") {
            public PacioliValue apply(List<PacioliValue> params) throws MVMException {
                checkNrArgs(params, 3);
                checkMatrixArg(params, 0);
                checkKeyArg(params, 1);
                checkKeyArg(params, 2);
                Callable fun = (Callable) store.lookup("global_Matrix_get_num");
                PacioliValue result = fun.apply(params);
                return result;
            }
        });

        store.putGlobal("Matrix", "set", new Primitive("set") {
            public PacioliValue apply(List<PacioliValue> params) throws MVMException {
                //Key row = (Key) params.get(0);
                //Key column = (Key) params.get(1);
                //Matrix x = (Matrix) params.get(2);
                // TODO: fix
                // return x.set(row,column,x);
                throw new MVMException("set is not implemented");
            }
        });

        store.putDebug("Matrix", "set", new Primitive("set") {
            public PacioliValue apply(List<PacioliValue> params) throws MVMException {
                checkNrArgs(params, 3);
                checkKeyArg(params, 0);
                checkKeyArg(params, 1);
                checkMatrixArg(params, 2);
                Callable fun = (Callable) store.lookup("global_Matrix_set");
                PacioliValue result = fun.apply(params);
                return result;
            }
        });

        store.putGlobal("Matrix", "isolate", new Primitive("isolate") {
            public PacioliValue apply(List<PacioliValue> params) throws MVMException {
                Matrix x = (Matrix) params.get(0);
                Key row = (Key) params.get(1);
                Key column = (Key) params.get(2);
                return x.isolate(row, column);
            }
        });

        store.putDebug("Matrix", "isolate", new Primitive("isolate") {
            public PacioliValue apply(List<PacioliValue> params) throws MVMException {
                checkNrArgs(params, 3);
                checkMatrixArg(params, 0);
                checkKeyArg(params, 1);
                checkKeyArg(params, 2);
                Callable fun = (Callable) store.lookup("global_Matrix_isolate");
                PacioliValue result = fun.apply(params);
                return result;
            }
        });

        store.putGlobal("Matrix", "multiply", new Primitive("multiply") {
            public PacioliValue apply(List<PacioliValue> params) throws MVMException {
                Matrix x = (Matrix) params.get(0);
                Matrix y = (Matrix) params.get(1);
                return x.multiply(y);
            }
        });

        store.putDebug("Matrix", "multiply", new Primitive("multiply") {
            public PacioliValue apply(List<PacioliValue> params) throws MVMException {
                checkNrArgs(params, 2);
                checkMatrixArg(params, 0);
                checkMatrixArg(params, 1);
                Callable fun = (Callable) store.lookup("global_Matrix_multiply");
                PacioliValue result = fun.apply(params);
                return result;
            }
        });

        store.putGlobal("Matrix", "loop_matrix", new Primitive("loop_matrix") {
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

        store.putDebug("Matrix", "loop_matrix", new Primitive("loop_matrix") {
            public PacioliValue apply(List<PacioliValue> params) throws MVMException {
                checkNrArgs(params, 3);
                checkCallableArg(params, 1);
                checkMatrixArg(params, 2);
                Callable fun = (Callable) store.lookup("global_Matrix_loop_matrix");
                PacioliValue result = fun.apply(params);
                return result;
            }
        });

        store.putGlobal("Matrix", "column", new Primitive("column") {
            public PacioliValue apply(List<PacioliValue> params) throws MVMException {
                Matrix matrix = (Matrix) params.get(0);
                Key key = (Key) params.get(1);
                return matrix.column(key);
            }
        });

        store.putDebug("Matrix", "column", new Primitive("column") {
            public PacioliValue apply(List<PacioliValue> params) throws MVMException {
                checkNrArgs(params, 2);
                checkMatrixArg(params, 0);
                checkKeyArg(params, 1);
                Callable fun = (Callable) store.lookup("global_Matrix_column");
                PacioliValue result = fun.apply(params);
                return result;
            }
        });

        store.putGlobal("Matrix", "project", new Primitive("project") {
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

        store.putDebug("Matrix", "project", new Primitive("project") {
            public PacioliValue apply(List<PacioliValue> params) throws MVMException {
                checkNrArgs(params, 2);
                checkListArg(params, 0);
                checkMatrixArg(params, 1);
                Callable fun = (Callable) store.lookup("global_Matrix_project");
                PacioliValue result = fun.apply(params);
                return result;
            }
        });

        store.putGlobal("Matrix", "row", new Primitive("row") {
            public PacioliValue apply(List<PacioliValue> params) throws MVMException {
                Matrix matrix = (Matrix) params.get(0);
                Key key = (Key) params.get(1);
                return matrix.row(key);
            }
        });

        store.putDebug("Matrix", "row", new Primitive("row") {
            public PacioliValue apply(List<PacioliValue> params) throws MVMException {
                checkNrArgs(params, 2);
                checkMatrixArg(params, 0);
                checkKeyArg(params, 1);
                Callable fun = (Callable) store.lookup("global_Matrix_row");
                PacioliValue result = fun.apply(params);
                return result;
            }
        });

        store.putGlobal("Matrix", "column_domain", new Primitive("column_domain") {
            public PacioliValue apply(List<PacioliValue> params) throws MVMException {
                Matrix matrix = (Matrix) params.get(0);
                return matrix.columnDomain();
            }
        });

        store.putDebug("Matrix", "column_domain", new Primitive("column_domain") {
            public PacioliValue apply(List<PacioliValue> params) throws MVMException {
                checkNrArgs(params, 1);
                checkMatrixArg(params, 0);
                Callable fun = (Callable) store.lookup("global_Matrix_column_domain");
                PacioliValue result = fun.apply(params);
                return result;
            }
        });

        store.putGlobal("Matrix", "row_domain", new Primitive("row_domain") {
            public PacioliValue apply(List<PacioliValue> params) throws MVMException {
                Matrix matrix = (Matrix) params.get(0);
                return matrix.rowDomain();
            }
        });

        store.putDebug("Matrix", "row_domain", new Primitive("row_domain") {
            public PacioliValue apply(List<PacioliValue> params) throws MVMException {
                checkNrArgs(params, 1);
                checkMatrixArg(params, 0);
                Callable fun = (Callable) store.lookup("global_Matrix_row_domain");
                PacioliValue result = fun.apply(params);
                return result;
            }
        });

        store.putGlobal("Matrix", "dot", new Primitive("dot") {
            public PacioliValue apply(List<PacioliValue> params) throws MVMException {
                Matrix x = (Matrix) params.get(0);
                Matrix y = (Matrix) params.get(1);
                return x.join(y);
            }
        });

        store.putDebug("Matrix", "dot", new Primitive("dot") {
            public PacioliValue apply(List<PacioliValue> params) throws MVMException {
                checkNrArgs(params, 2);
                checkMatrixArg(params, 0);
                checkMatrixArg(params, 1);
                Callable fun = (Callable) store.lookup("global_Matrix_dot");
                PacioliValue result = fun.apply(params);
                return result;
            }
        });

        store.putGlobal("Matrix", "kronecker", new Primitive("kronecker") {
            public PacioliValue apply(List<PacioliValue> params) throws MVMException {
                Matrix x = (Matrix) params.get(0);
                Matrix y = (Matrix) params.get(1);
                return x.kronecker(y);
            }
        });

        store.putDebug("Matrix", "kronecker", new Primitive("kronecker") {
            public PacioliValue apply(List<PacioliValue> params) throws MVMException {
                checkNrArgs(params, 2);
                checkMatrixArg(params, 0);
                checkMatrixArg(params, 1);
                Callable fun = (Callable) store.lookup("global_Matrix_kronecker");
                PacioliValue result = fun.apply(params);
                return result;
            }
        });

        store.putGlobal("Matrix", "scale", new Primitive("scale") {
            public PacioliValue apply(List<PacioliValue> params) throws MVMException {
                Matrix x = (Matrix) params.get(0);
                Matrix y = (Matrix) params.get(1);
                return x.scale(y);
            }
        });

        store.putDebug("Matrix", "scale", new Primitive("scale") {
            public PacioliValue apply(List<PacioliValue> params) throws MVMException {
                checkNrArgs(params, 2);
                checkMatrixArg(params, 0);
                checkMatrixArg(params, 1);
                Callable fun = (Callable) store.lookup("global_Matrix_scale");
                PacioliValue result = fun.apply(params);
                return result;
            }
        });

        store.putGlobal("Matrix", "rscale", new Primitive("rscale") {
            public PacioliValue apply(List<PacioliValue> params) throws MVMException {
                Matrix x = (Matrix) params.get(0);
                Matrix y = (Matrix) params.get(1);
                return y.scale(x);
            }
        });

        store.putDebug("Matrix", "rscale", new Primitive("rscale") {
            public PacioliValue apply(List<PacioliValue> params) throws MVMException {
                checkNrArgs(params, 2);
                checkMatrixArg(params, 0);
                checkMatrixArg(params, 1);
                Callable fun = (Callable) store.lookup("global_Matrix_rscale");
                PacioliValue result = fun.apply(params);
                return result;
            }
        });

        store.putGlobal("Matrix", "scale_down", new Primitive("scale_down") {
            public PacioliValue apply(List<PacioliValue> params) throws MVMException {
                Matrix x = (Matrix) params.get(0);
                Matrix y = (Matrix) params.get(1);
                return y.reciprocal().scale(x);
            }
        });

        store.putDebug("Matrix", "scale_down", new Primitive("scale_down") {
            public PacioliValue apply(List<PacioliValue> params) throws MVMException {
                checkNrArgs(params, 2);
                checkMatrixArg(params, 0);
                checkMatrixArg(params, 1);
                Callable fun = (Callable) store.lookup("global_Matrix_scale_down");
                PacioliValue result = fun.apply(params);
                return result;
            }
        });

        store.putGlobal("Matrix", "lscale_down", new Primitive("lscale_down") {
            public PacioliValue apply(List<PacioliValue> params) throws MVMException {
                Matrix x = (Matrix) params.get(0);
                Matrix y = (Matrix) params.get(1);
                return x.scale(y.reciprocal());
            }
        });

        store.putDebug("Matrix", "lscale_down", new Primitive("lscale_down") {
            public PacioliValue apply(List<PacioliValue> params) throws MVMException {
                checkNrArgs(params, 2);
                checkMatrixArg(params, 0);
                checkMatrixArg(params, 1);
                Callable fun = (Callable) store.lookup("global_Matrix_lscale_down");
                PacioliValue result = fun.apply(params);
                return result;
            }
        });

        store.putGlobal("Matrix", "total", new Primitive("total") {
            public PacioliValue apply(List<PacioliValue> params) throws MVMException {
                Matrix x = (Matrix) params.get(0);
                return x.total();
            }
        });

        store.putDebug("Matrix", "total", new Primitive("total") {
            public PacioliValue apply(List<PacioliValue> params) throws MVMException {
                checkNrArgs(params, 1);
                checkMatrixArg(params, 0);
                Callable fun = (Callable) store.lookup("global_Matrix_total");
                PacioliValue result = fun.apply(params);
                return result;
            }
        });

        store.putGlobal("Matrix", "left_identity", new Primitive("left_identity") {
            public PacioliValue apply(List<PacioliValue> params) throws MVMException {
                Matrix x = (Matrix) params.get(0);
                return x.leftIdentity();
            }
        });

        store.putDebug("Matrix", "left_identity", new Primitive("left_identity") {
            public PacioliValue apply(List<PacioliValue> params) throws MVMException {
                checkNrArgs(params, 1);
                checkMatrixArg(params, 0);
                Callable fun = (Callable) store.lookup("global_Matrix_left_identity");
                PacioliValue result = fun.apply(params);
                return result;
            }
        });

        store.putGlobal("Matrix", "support", new Primitive("support") {
            public PacioliValue apply(List<PacioliValue> params) throws MVMException {
                Matrix x = (Matrix) params.get(0);
                return x.posSupport().sum(x.negSupport());
            }
        });

        store.putDebug("Matrix", "support", new Primitive("support") {
            public PacioliValue apply(List<PacioliValue> params) throws MVMException {
                checkNrArgs(params, 1);
                checkMatrixArg(params, 0);
                Callable fun = (Callable) store.lookup("global_Matrix_support");
                PacioliValue result = fun.apply(params);
                return result;
            }
        });

        store.putGlobal("Matrix", "positive_support", new Primitive("positive_support") {
            public PacioliValue apply(List<PacioliValue> params) throws MVMException {
                Matrix x = (Matrix) params.get(0);
                return x.posSupport();
            }
        });

        store.putDebug("Matrix", "positive_support", new Primitive("positive_support") {
            public PacioliValue apply(List<PacioliValue> params) throws MVMException {
                checkNrArgs(params, 1);
                checkMatrixArg(params, 0);
                Callable fun = (Callable) store.lookup("global_Matrix_positive_support");
                PacioliValue result = fun.apply(params);
                return result;
            }
        });

        store.putGlobal("Matrix", "negative_support", new Primitive("negative_support") {
            public PacioliValue apply(List<PacioliValue> params) throws MVMException {
                Matrix x = (Matrix) params.get(0);
                return x.negSupport();
            }
        });

        store.putDebug("Matrix", "negative_support", new Primitive("negative_support") {
            public PacioliValue apply(List<PacioliValue> params) throws MVMException {
                checkNrArgs(params, 1);
                checkMatrixArg(params, 0);
                Callable fun = (Callable) store.lookup("global_Matrix_negative_support");
                PacioliValue result = fun.apply(params);
                return result;
            }
        });

        store.putGlobal("Matrix", "signum", new Primitive("signum") {
            public PacioliValue apply(List<PacioliValue> params) throws MVMException {
                Matrix x = (Matrix) params.get(0);
                return x.posSupport().sum(x.negSupport().negative());
            }
        });

        store.putDebug("Matrix", "signum", new Primitive("signum") {
            public PacioliValue apply(List<PacioliValue> params) throws MVMException {
                checkNrArgs(params, 1);
                checkMatrixArg(params, 0);
                Callable fun = (Callable) store.lookup("global_Matrix_signum");
                PacioliValue result = fun.apply(params);
                return result;
            }
        });

        store.putGlobal("Matrix", "random", new Primitive("random") {
            public PacioliValue apply(List<PacioliValue> params) throws MVMException {
                return new Matrix(Math.random());
            }
        });

        store.putDebug("Matrix", "random", new Primitive("random") {
            public PacioliValue apply(List<PacioliValue> params) throws MVMException {
                checkNrArgs(params, 1);
                checkMatrixArg(params, 0);
                Callable fun = (Callable) store.lookup("global_Matrix_random");
                PacioliValue result = fun.apply(params);
                return result;
            }
        });

        store.putGlobal("Matrix", "top", new Primitive("top") {
            public PacioliValue apply(List<PacioliValue> params) throws MVMException {
                Matrix n = (Matrix) params.get(0);
                Matrix x = (Matrix) params.get(1);
                return x.top((int) n.SingletonNumber());
            }
        });

        store.putDebug("Matrix", "top", new Primitive("top") {
            public PacioliValue apply(List<PacioliValue> params) throws MVMException {
                checkNrArgs(params, 2);
                checkMatrixArg(params, 0);
                checkMatrixArg(params, 1);
                Callable fun = (Callable) store.lookup("global_Matrix_top");
                PacioliValue result = fun.apply(params);
                return result;
            }
        });

        store.putGlobal("Matrix", "bottom", new Primitive("bottom") {
            public PacioliValue apply(List<PacioliValue> params) throws MVMException {
                Matrix n = (Matrix) params.get(0);
                Matrix x = (Matrix) params.get(1);
                return x.bottom((int) n.SingletonNumber());
            }
        });

        store.putDebug("Matrix", "bottom", new Primitive("bottom") {
            public PacioliValue apply(List<PacioliValue> params) throws MVMException {
                checkNrArgs(params, 2);
                checkMatrixArg(params, 0);
                checkMatrixArg(params, 1);
                Callable fun = (Callable) store.lookup("global_Matrix_bottom");
                PacioliValue result = fun.apply(params);
                return result;
            }
        });

        store.putGlobal("Matrix", "right_identity", new Primitive("right_identity") {
            public PacioliValue apply(List<PacioliValue> params) throws MVMException {
                Matrix x = (Matrix) params.get(0);
                return x.rightIdentity();
            }
        });

        store.putDebug("Matrix", "right_identity", new Primitive("right_identity") {
            public PacioliValue apply(List<PacioliValue> params) throws MVMException {
                checkNrArgs(params, 1);
                checkMatrixArg(params, 0);
                Callable fun = (Callable) store.lookup("global_Matrix_right_identity");
                PacioliValue result = fun.apply(params);
                return result;
            }
        });

        store.putGlobal("Matrix", "transpose", new Primitive("transpose") {
            public PacioliValue apply(List<PacioliValue> params) throws MVMException {
                Matrix x = (Matrix) params.get(0);
                return x.transpose();
            }
        });

        store.putDebug("Matrix", "transpose", new Primitive("transpose") {
            public PacioliValue apply(List<PacioliValue> params) throws MVMException {
                checkNrArgs(params, 1);
                checkMatrixArg(params, 0);
                Callable fun = (Callable) store.lookup("global_Matrix_transpose");
                PacioliValue result = fun.apply(params);
                return result;
            }
        });

        store.putGlobal("Matrix", "reciprocal", new Primitive("reciprocal") {
            public PacioliValue apply(List<PacioliValue> params) throws MVMException {
                Matrix x = (Matrix) params.get(0);
                return x.reciprocal();
            }
        });

        store.putDebug("Matrix", "reciprocal", new Primitive("reciprocal") {
            public PacioliValue apply(List<PacioliValue> params) throws MVMException {
                checkNrArgs(params, 1);
                checkMatrixArg(params, 0);
                Callable fun = (Callable) store.lookup("global_Matrix_reciprocal");
                PacioliValue result = fun.apply(params);
                return result;
            }
        });

        store.putGlobal("Matrix", "dim_inv", new Primitive("dim_inv") {
            public PacioliValue apply(List<PacioliValue> params) throws MVMException {
                Matrix x = (Matrix) params.get(0);
                return x.reciprocal().transpose();
            }
        });

        store.putDebug("Matrix", "dim_inv", new Primitive("dim_inv") {
            public PacioliValue apply(List<PacioliValue> params) throws MVMException {
                checkNrArgs(params, 1);
                checkMatrixArg(params, 0);
                Callable fun = (Callable) store.lookup("global_Matrix_dim_inv");
                PacioliValue result = fun.apply(params);
                return result;
            }
        });

        store.putGlobal("Matrix", "dim_div", new Primitive("dim_div") {
            public PacioliValue apply(List<PacioliValue> params) throws MVMException {
                Matrix x = (Matrix) params.get(0);
                Matrix y = (Matrix) params.get(1);
                return x.join(y.transpose().reciprocal());
            }
        });

        store.putDebug("Matrix", "dim_div", new Primitive("dim_div") {
            public PacioliValue apply(List<PacioliValue> params) throws MVMException {
                checkNrArgs(params, 2);
                checkMatrixArg(params, 0);
                checkMatrixArg(params, 1);
                Callable fun = (Callable) store.lookup("global_Matrix_dim_div");
                PacioliValue result = fun.apply(params);
                return result;
            }
        });

        store.putGlobal("Matrix", "negative", new Primitive("negative") {
            public PacioliValue apply(List<PacioliValue> params) throws MVMException {
                Matrix x = (Matrix) params.get(0);
                return x.negative();
            }
        });

        store.putDebug("Matrix", "negative", new Primitive("negative") {
            public PacioliValue apply(List<PacioliValue> params) throws MVMException {
                checkNrArgs(params, 1);
                checkMatrixArg(params, 0);
                Callable fun = (Callable) store.lookup("global_Matrix_negative");
                PacioliValue result = fun.apply(params);
                return result;
            }
        });

        store.putGlobal("Matrix", "abs", new Primitive("abs") {
            public PacioliValue apply(List<PacioliValue> params) throws MVMException {
                Matrix x = (Matrix) params.get(0);
                return x.abs();
            }
        });

        store.putDebug("Matrix", "abs", new Primitive("abs") {
            public PacioliValue apply(List<PacioliValue> params) throws MVMException {
                checkNrArgs(params, 1);
                checkMatrixArg(params, 0);
                Callable fun = (Callable) store.lookup("global_Matrix_abs");
                PacioliValue result = fun.apply(params);
                return result;
            }
        });

        store.putGlobal("Matrix", "index_less", new Primitive("index_less") {
            public PacioliValue apply(List<PacioliValue> params) throws MVMException {
                Key row = (Key) params.get(0);
                Key column = (Key) params.get(1);
                return new Boole(row.position() < column.position());
            }
        });

        store.putDebug("Matrix", "index_less", new Primitive("index_less") {
            public PacioliValue apply(List<PacioliValue> params) throws MVMException {
                checkNrArgs(params, 2);
                checkKeyArg(params, 0);
                checkKeyArg(params, 1);
                Callable fun = (Callable) store.lookup("global_Matrix_index_less");
                PacioliValue result = fun.apply(params);
                return result;
            }
        });

        store.putGlobal("Matrix", "sin", new Primitive("sin") {
            public PacioliValue apply(List<PacioliValue> params) throws MVMException {
                Matrix x = (Matrix) params.get(0);
                return x.sin();
            }
        });

        store.putDebug("Matrix", "sin", new Primitive("sin") {
            public PacioliValue apply(List<PacioliValue> params) throws MVMException {
                checkNrArgs(params, 1);
                checkMatrixArg(params, 0);
                Callable fun = (Callable) store.lookup("global_Matrix_sin");
                PacioliValue result = fun.apply(params);
                return result;
            }
        });

        store.putGlobal("Matrix", "cos", new Primitive("cos") {
            public PacioliValue apply(List<PacioliValue> params) throws MVMException {
                Matrix x = (Matrix) params.get(0);
                return x.cos();
            }
        });

        store.putDebug("Matrix", "cos", new Primitive("cos") {
            public PacioliValue apply(List<PacioliValue> params) throws MVMException {
                checkNrArgs(params, 1);
                checkMatrixArg(params, 0);
                Callable fun = (Callable) store.lookup("global_Matrix_cos");
                PacioliValue result = fun.apply(params);
                return result;
            }
        });

        store.putGlobal("Matrix", "tan", new Primitive("cos") {
            public PacioliValue apply(List<PacioliValue> params) throws MVMException {
                Matrix x = (Matrix) params.get(0);
                return x.tan();
            }
        });

        store.putDebug("Matrix", "tan", new Primitive("cos") {
            public PacioliValue apply(List<PacioliValue> params) throws MVMException {
                checkNrArgs(params, 1);
                checkMatrixArg(params, 0);
                Callable fun = (Callable) store.lookup("global_Matrix_tan");
                PacioliValue result = fun.apply(params);
                return result;
            }
        });

        store.putGlobal("Matrix", "asin", new Primitive("sin") {
            public PacioliValue apply(List<PacioliValue> params) throws MVMException {
                Matrix x = (Matrix) params.get(0);
                return x.asin();
            }
        });

        store.putDebug("Matrix", "asin", new Primitive("sin") {
            public PacioliValue apply(List<PacioliValue> params) throws MVMException {
                checkNrArgs(params, 1);
                checkMatrixArg(params, 0);
                Callable fun = (Callable) store.lookup("global_Matrix_asin");
                PacioliValue result = fun.apply(params);
                return result;
            }
        });

        store.putGlobal("Matrix", "acos", new Primitive("cos") {
            public PacioliValue apply(List<PacioliValue> params) throws MVMException {
                Matrix x = (Matrix) params.get(0);
                return x.acos();
            }
        });

        store.putDebug("Matrix", "acos", new Primitive("cos") {
            public PacioliValue apply(List<PacioliValue> params) throws MVMException {
                checkNrArgs(params, 1);
                checkMatrixArg(params, 0);
                Callable fun = (Callable) store.lookup("global_Matrix_acos");
                PacioliValue result = fun.apply(params);
                return result;
            }
        });

        store.putGlobal("Matrix", "atan", new Primitive("cos") {
            public PacioliValue apply(List<PacioliValue> params) throws MVMException {
                Matrix x = (Matrix) params.get(0);
                return x.atan();
            }
        });

        store.putDebug("Matrix", "atan", new Primitive("cos") {
            public PacioliValue apply(List<PacioliValue> params) throws MVMException {
                checkNrArgs(params, 1);
                checkMatrixArg(params, 0);
                Callable fun = (Callable) store.lookup("global_Matrix_atan");
                PacioliValue result = fun.apply(params);
                return result;
            }
        });

        store.putGlobal("Matrix", "atan2", new Primitive("cos") {
            public PacioliValue apply(List<PacioliValue> params) throws MVMException {
                Matrix x = (Matrix) params.get(0);
                Matrix y = (Matrix) params.get(1);
                return x.atan2(y);
            }
        });

        store.putDebug("Matrix", "atan2", new Primitive("cos") {
            public PacioliValue apply(List<PacioliValue> params) throws MVMException {
                checkNrArgs(params, 2);
                checkMatrixArg(params, 0);
                checkMatrixArg(params, 1);
                Callable fun = (Callable) store.lookup("global_Matrix_atan2");
                PacioliValue result = fun.apply(params);
                return result;
            }
        });

        store.putGlobal("Matrix", "ln", new Primitive("ln") {
            public PacioliValue apply(List<PacioliValue> params) throws MVMException {
                Matrix x = (Matrix) params.get(0);
                return x.ln();
            }
        });

        store.putDebug("Matrix", "ln", new Primitive("ln") {
            public PacioliValue apply(List<PacioliValue> params) throws MVMException {
                checkNrArgs(params, 1);
                checkMatrixArg(params, 0);
                Callable fun = (Callable) store.lookup("global_Matrix_ln");
                PacioliValue result = fun.apply(params);
                return result;
            }
        });

        store.putGlobal("Matrix", "exp", new Primitive("exp") {
            public PacioliValue apply(List<PacioliValue> params) throws MVMException {
                Matrix x = (Matrix) params.get(0);
                return x.exp();
            }
        });

        store.putDebug("Matrix", "exp", new Primitive("exp") {
            public PacioliValue apply(List<PacioliValue> params) throws MVMException {
                checkNrArgs(params, 1);
                checkMatrixArg(params, 0);
                Callable fun = (Callable) store.lookup("global_Matrix_exp");
                PacioliValue result = fun.apply(params);
                return result;
            }
        });

        store.putGlobal("Matrix", "expt", new Primitive("expt") {
            public PacioliValue apply(List<PacioliValue> params) throws MVMException {
                Matrix x = (Matrix) params.get(0);
                Matrix y = (Matrix) params.get(1);
                return x.expt(y);
            }
        });

        store.putDebug("Matrix", "expt", new Primitive("expt") {
            public PacioliValue apply(List<PacioliValue> params) throws MVMException {
                checkNrArgs(params, 2);
                checkMatrixArg(params, 0);
                checkMatrixArg(params, 1);
                Callable fun = (Callable) store.lookup("global_Matrix_expt");
                PacioliValue result = fun.apply(params);
                return result;
            }
        });

        store.putGlobal("Matrix", "power", new Primitive("power") {
            public PacioliValue apply(List<PacioliValue> params) throws MVMException {
                Matrix x = (Matrix) params.get(0);
                Matrix y = (Matrix) params.get(1);
                return x.power(y);
            }
        });

        store.putDebug("Matrix", "power", new Primitive("power") {
            public PacioliValue apply(List<PacioliValue> params) throws MVMException {
                checkNrArgs(params, 2);
                checkMatrixArg(params, 0);
                checkMatrixArg(params, 1);
                Callable fun = (Callable) store.lookup("global_Matrix_power");
                PacioliValue result = fun.apply(params);
                return result;
            }
        });

        store.putGlobal("Matrix", "log", new Primitive("log") {
            public PacioliValue apply(List<PacioliValue> params) throws MVMException {
                Matrix x = (Matrix) params.get(0);
                Matrix y = (Matrix) params.get(1);
                return x.log(y);
            }
        });

        store.putDebug("Matrix", "log", new Primitive("log") {
            public PacioliValue apply(List<PacioliValue> params) throws MVMException {
                checkNrArgs(params, 2);
                checkMatrixArg(params, 0);
                checkMatrixArg(params, 1);
                Callable fun = (Callable) store.lookup("global_Matrix_log");
                PacioliValue result = fun.apply(params);
                return result;
            }
        });

        // //////////////////////////////////////////////////////////////////////////////
        // List

        store.putGlobal("List", "loop_list", new Primitive("loop_list") {
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

        store.putDebug("List", "loop_list", new Primitive("loop_list") {
            public PacioliValue apply(List<PacioliValue> params) throws MVMException {
                checkNrArgs(params, 3);
                checkCallableArg(params, 1);
                checkListArg(params, 2);
                Callable fun = (Callable) store.lookup("global_List_loop_list");
                PacioliValue result = fun.apply(params);
                return result;
            }
        });

        store.putGlobal("List", "map_list", new Primitive("map_list") {
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

        store.putDebug("List", "map_list", new Primitive("map_list") {
            public PacioliValue apply(List<PacioliValue> params) throws MVMException {
                checkNrArgs(params, 2);
                checkCallableArg(params, 0);
                checkListArg(params, 1);
                Callable fun = (Callable) store.lookup("global_List_map_list");
                PacioliValue result = fun.apply(params);
                return result;
            }
        });

        store.putGlobal("List", "sort_list", new Primitive("sort_list") {
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

        store.putDebug("List", "sort_list", new Primitive("sort_list") {
            public PacioliValue apply(List<PacioliValue> params) throws MVMException {
                checkNrArgs(params, 2);
                checkListArg(params, 0);
                checkCallableArg(params, 1);
                Callable fun = (Callable) store.lookup("global_List_sort_list");
                PacioliValue result = fun.apply(params);
                return result;
            }
        });

        store.putGlobal("List", "fold_list", new Primitive("fold_list") {
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

        store.putDebug("List", "fold_list", new Primitive("fold_list") {
            public PacioliValue apply(List<PacioliValue> params) throws MVMException {
                checkNrArgs(params, 2);
                checkCallableArg(params, 0);
                checkListArg(params, 1);
                Callable fun = (Callable) store.lookup("global_List_fold_list");
                PacioliValue result = fun.apply(params);
                return result;
            }
        });

        store.putGlobal("List", "nth", new Primitive("nth") {
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

        store.putDebug("List", "nth", new Primitive("nth") {
            public PacioliValue apply(List<PacioliValue> params) throws MVMException {
                checkNrArgs(params, 2);
                checkMatrixArg(params, 0);
                checkListArg(params, 1);
                Callable fun = (Callable) store.lookup("global_List_nth");
                PacioliValue result = fun.apply(params);
                return result;
            }
        });

        store.putGlobal("List", "empty_list", new Primitive("empty_list") {
            public PacioliValue apply(List<PacioliValue> params) throws MVMException {
                return new PacioliList();
            }
        });

        store.putDebug("List", "empty_list", new Primitive("empty_list") {
            public PacioliValue apply(List<PacioliValue> params) throws MVMException {
                checkNrArgs(params, 0);
                Callable fun = (Callable) store.lookup("global_List_empty_list");
                PacioliValue result = fun.apply(params);
                return result;
            }
        });

        store.putGlobal("List", "naturals", new Primitive("naturals") {
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

        store.putDebug("List", "naturals", new Primitive("naturals") {
            public PacioliValue apply(List<PacioliValue> params) throws MVMException {
                checkNrArgs(params, 1);
                checkMatrixArg(params, 0);
                Callable fun = (Callable) store.lookup("global_List_naturals");
                PacioliValue result = fun.apply(params);
                return result;
            }
        });

        store.putGlobal("List", "add_mut", new Primitive("add_mut") {
            public PacioliValue apply(List<PacioliValue> params) throws MVMException {
                PacioliList x = (PacioliList) params.get(0);
                PacioliValue y = params.get(1);
                return x.addMut(y);
            }
        });

        store.putDebug("List", "add_mut", new Primitive("add_mut") {
            public PacioliValue apply(List<PacioliValue> params) throws MVMException {
                checkNrArgs(params, 2);
                checkListArg(params, 0);
                Callable fun = (Callable) store.lookup("global_List_add_mut");
                PacioliValue result = fun.apply(params);
                return result;
            }
        });

        store.putGlobal("List", "cons", new Primitive("cons") {
            public PacioliValue apply(List<PacioliValue> params) throws MVMException {
                PacioliValue x = params.get(0);
                PacioliList y = (PacioliList) params.get(1);
                return y.cons(x, y);
            }
        });

        store.putDebug("List", "cons", new Primitive("cons") {
            public PacioliValue apply(List<PacioliValue> params) throws MVMException {
                checkNrArgs(params, 2);
                checkListArg(params, 1);
                Callable fun = (Callable) store.lookup("global_List_cons");
                PacioliValue result = fun.apply(params);
                return result;
            }
        });

        store.putGlobal("List", "append", new Primitive("append") {
            public PacioliValue apply(List<PacioliValue> params) throws MVMException {
                PacioliList x = (PacioliList) params.get(0);
                PacioliList y = (PacioliList) params.get(1);
                return x.append(y);
            }
        });

        store.putDebug("List", "append", new Primitive("append") {
            public PacioliValue apply(List<PacioliValue> params) throws MVMException {
                checkNrArgs(params, 2);
                checkListArg(params, 0);
                checkListArg(params, 1);
                Callable fun = (Callable) store.lookup("global_List_append");
                PacioliValue result = fun.apply(params);
                return result;
            }
        });

        store.putGlobal("List", "reverse", new Primitive("reverse") {
            public PacioliValue apply(List<PacioliValue> params) throws MVMException {
                PacioliList x = (PacioliList) params.get(0);
                return x.reverse();
            }
        });

        store.putDebug("List", "reverse", new Primitive("reverse") {
            public PacioliValue apply(List<PacioliValue> params) throws MVMException {
                checkNrArgs(params, 1);
                checkListArg(params, 0);
                Callable fun = (Callable) store.lookup("global_List_reverse");
                PacioliValue result = fun.apply(params);
                return result;
            }
        });

        store.putGlobal("List", "head", new Primitive("head") {
            public PacioliValue apply(List<PacioliValue> params) throws MVMException {
                PacioliList x = (PacioliList) params.get(0);
                if (x.items().isEmpty()) {
                    throw new MVMException("function 'head' called on empty list");
                }
                return x.items().get(0);
            }
        });

        store.putDebug("List", "head", new Primitive("head") {
            public PacioliValue apply(List<PacioliValue> params) throws MVMException {
                checkNrArgs(params, 1);
                checkListArg(params, 0);
                Callable fun = (Callable) store.lookup("global_List_head");
                PacioliValue result = fun.apply(params);
                return result;
            }
        });

        store.putGlobal("List", "tail", new Primitive("tail") {
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

        store.putDebug("List", "tail", new Primitive("tail") {
            public PacioliValue apply(List<PacioliValue> params) throws MVMException {
                checkNrArgs(params, 1);
                checkListArg(params, 0);
                Callable fun = (Callable) store.lookup("global_List_tail");
                PacioliValue result = fun.apply(params);
                return result;
            }
        });

        store.putGlobal("List", "singleton_list", new Primitive("singleton_list") {
            public PacioliValue apply(List<PacioliValue> params) throws MVMException {
                return new PacioliList(params.get(0));
            }
        });

        store.putDebug("List", "singleton_list", new Primitive("singleton_list") {
            public PacioliValue apply(List<PacioliValue> params) throws MVMException {
                checkNrArgs(params, 1);
                Callable fun = (Callable) store.lookup("global_List_singleton_list");
                PacioliValue result = fun.apply(params);
                return result;
            }
        });

        store.putGlobal("List", "zip", new Primitive("zip") {
            public PacioliValue apply(List<PacioliValue> params) throws MVMException {
                PacioliList x = (PacioliList) params.get(0);
                PacioliList y = (PacioliList) params.get(1);
                return x.zip(y);
            }
        });

        store.putDebug("List", "zip", new Primitive("zip") {
            public PacioliValue apply(List<PacioliValue> params) throws MVMException {
                checkNrArgs(params, 2);
                checkListArg(params, 0);
                checkListArg(params, 1);
                Callable fun = (Callable) store.lookup("global_List_zip");
                PacioliValue result = fun.apply(params);
                return result;
            }
        });

        store.putGlobal("List", "list_size", new Primitive("list_size") {
            public PacioliValue apply(List<PacioliValue> params) throws MVMException {
                PacioliList x = (PacioliList) params.get(0);
                return new Matrix(x.items().size());
            }
        });

        store.putDebug("List", "list_size", new Primitive("list_size") {
            public PacioliValue apply(List<PacioliValue> params) throws MVMException {
                checkNrArgs(params, 1);
                checkListArg(params, 0);
                Callable fun = (Callable) store.lookup("global_List_list_size");
                PacioliValue result = fun.apply(params);
                return result;
            }
        });

        store.putGlobal("List", "contains", new Primitive("contains") {
            public PacioliValue apply(List<PacioliValue> params) throws MVMException {
                PacioliList list = (PacioliList) params.get(0);
                PacioliValue item = params.get(1);
                return new Boole(list.items().contains(item));
            }
        });

        store.putDebug("List", "contains", new Primitive("contains") {
            public PacioliValue apply(List<PacioliValue> params) throws MVMException {
                checkNrArgs(params, 2);
                checkListArg(params, 0);
                Callable fun = (Callable) store.lookup("global_List_contains");
                PacioliValue result = fun.apply(params);
                return result;
            }
        });

        store.putGlobal("String", "string_compare", new Primitive("string_compare") {
            public PacioliValue apply(List<PacioliValue> params) throws MVMException {
                PacioliString string1 = (PacioliString) params.get(0);
                PacioliString string2 = (PacioliString) params.get(1);
                return new Matrix(string1.toText().compareTo(string2.toText()));
            }
        });

        store.putDebug("String", "string_compare", new Primitive("string_compare") {
            public PacioliValue apply(List<PacioliValue> params) throws MVMException {
                checkNrArgs(params, 2);
                checkStringArg(params, 0);
                checkStringArg(params, 1);
                Callable fun = (Callable) store.lookup("global_String_string_compare");
                PacioliValue result = fun.apply(params);
                return result;
            }
        });

        store.putGlobal("String", "text", new Primitive("text") {
            public PacioliValue apply(List<PacioliValue> params) throws MVMException {
                PacioliValue value = params.get(0);
                if (value == null) {
                    return new PacioliString("VOID!");
                } else {
                    return new PacioliString(value.toText());
                }
            }
        });

        store.putDebug("String", "text", new Primitive("text") {
            public PacioliValue apply(List<PacioliValue> params) throws MVMException {
                checkNrArgs(params, 1);
                Callable fun = (Callable) store.lookup("global_String_text");
                PacioliValue result = fun.apply(params);
                return result;
            }
        });

        store.putGlobal("String", "get_unit_text", new Primitive("get_unit_text") {
            public PacioliValue apply(List<PacioliValue> params) throws MVMException {
                Matrix x = (Matrix) params.get(0);
                Key row = (Key) params.get(1);
                Key column = (Key) params.get(2);
                return new PacioliString(x.get_unit(row, column).pretty());
            }
        });

        store.putDebug("String", "get_unit_text", new Primitive("get_unit_text") {
            public PacioliValue apply(List<PacioliValue> params) throws MVMException {
                checkNrArgs(params, 3);
                checkMatrixArg(params, 0);
                checkKeyArg(params, 1);
                checkKeyArg(params, 2);
                Callable fun = (Callable) store.lookup("global_String_get_unit_text");
                PacioliValue result = fun.apply(params);
                return result;
            }
        });

        store.putGlobal("String", "concatenate", new Primitive("concatenate") {
            public PacioliValue apply(List<PacioliValue> params) throws MVMException {
                PacioliString string1 = (PacioliString) params.get(0);
                PacioliString string2 = (PacioliString) params.get(1);
                return new PacioliString(string1.toText().concat(string2.toText()));
            }
        });

        store.putDebug("String", "concatenate", new Primitive("concatenate") {
            public PacioliValue apply(List<PacioliValue> params) throws MVMException {
                checkNrArgs(params, 2);
                checkStringArg(params, 0);
                checkStringArg(params, 1);
                Callable fun = (Callable) store.lookup("global_String_concatenate");
                PacioliValue result = fun.apply(params);
                return result;
            }
        });

        store.putGlobal("String", "num2string", new Primitive("num2string") {
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

        store.putDebug("String", "num2string", new Primitive("num2string") {
            public PacioliValue apply(List<PacioliValue> params) throws MVMException {
                checkNrArgs(params, 2);
                checkMatrixArg(params, 0);
                checkMatrixArg(params, 1);
                Callable fun = (Callable) store.lookup("global_String_num2string");
                PacioliValue result = fun.apply(params);
                return result;
            }
        });
        
        store.putGlobal("String", "format", new Primitive("format") {
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

        store.putDebug("String", "format", new Primitive("format") {
            public PacioliValue apply(List<PacioliValue> params) throws MVMException {
                Callable fun = (Callable) store.lookup("global_String_format");
                PacioliValue result = fun.apply(params);
                return result;
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
        si.addPrefix("micro", new Prefix("µ", new BigDecimal("0.000001")));
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
            mvm.ast.Program code = mvm.parser.Parser.parseFile(file.getAbsolutePath());

            // Run the requires
            for (String require : code.requires) {
                //runRec(PacioliFile.findFile(require + ".mvm", libs, file.getParentFile()), out, libs);
            }
            ;

            // Run the file itself
            Pacioli.logln2("Running MVM file %s", file);
            for (Instruction instruction : code.instructions) {
                instruction.eval(this);
            }
        }
    }
}
