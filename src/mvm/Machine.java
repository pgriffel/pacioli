/*
 * Copyright (c) 2013 Paul Griffioen
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

import java.io.PrintStream;
import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.Iterator;
import java.util.LinkedList;
import java.util.List;
import java.util.Map;
import mvm.ast.Application;
import mvm.ast.ApplicationDebug;
import mvm.ast.Branch;
import mvm.ast.Const;
import mvm.ast.Expression;
import mvm.ast.Identifier;
import mvm.ast.Lambda;
import mvm.values.Boole;
import mvm.values.Callable;
import mvm.values.PacioliList;
import mvm.values.PacioliTuple;
import mvm.values.PacioliValue;
import mvm.values.Primitive;
import mvm.values.Reference;
import mvm.values.matrix.IndexSet;
import mvm.values.matrix.Key;
import mvm.values.matrix.Matrix;
import mvm.values.matrix.MatrixBase;
import mvm.values.matrix.MatrixDimension;
import mvm.values.matrix.MatrixShape;
import mvm.values.matrix.UnitVector;
import org.codehaus.jparsec.Parser;
import org.codehaus.jparsec.Parsers;
import org.codehaus.jparsec.Scanners;
import org.codehaus.jparsec.Terminals;
import org.codehaus.jparsec.Token;
import org.codehaus.jparsec.error.ParseErrorDetails;
import org.codehaus.jparsec.error.ParserException;
import org.codehaus.jparsec.functors.Pair;
import uom.Fraction;
import uom.NamedUnit;
import uom.Prefix;
import uom.Unit;
import uom.UnitSystem;

public class Machine {

    private final Environment store;
    private final UnitSystem unitSystem;
    private final HashMap<String, IndexSet> indexSets;
    private final HashMap<String, UnitVector> unitVectors;
    private static final LinkedList<String> debugStack = new LinkedList<String>();
    private static boolean atLineStart = false;
    
    public Machine() {
        store = new Environment();
        unitSystem = makeSI();
        indexSets = new HashMap<String, IndexSet>();
        unitVectors = new HashMap<String, UnitVector>();
    }

    public static void pushFrame(String frame) {
        debugStack.push(frame);
    }

    public static void popFrame() {
        debugStack.pop();
    }

    public void init() throws MVMException {


        ////////////////////////////////////////////////////////////////////////////////
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

        ////////////////////

        store.put("user_Primitives_true", new Boole(true));

        store.put("debug_Primitives_true", new Boole(true));

        store.put("user_Primitives_false", new Boole(false));

        store.put("debug_Primitives_false", new Boole(false));

        store.put("user_Primitives_nothing", null);

        store.put("debug_Primitives_nothing", null);

        store.put("user_Primitives_tuple", new Primitive("tuple") {
            public PacioliValue apply(List<PacioliValue> params) throws MVMException {
                return new PacioliTuple(params);
            }
        });

        store.put("debug_Primitives_tuple", new Primitive("tuple") {
            public PacioliValue apply(List<PacioliValue> params) throws MVMException {
                Callable fun = (Callable) store.lookup("user_Primitives_tuple");
                PacioliValue result = fun.apply(params);
                return result;
            }
        });

        store.put("user_Primitives_apply", new Primitive("apply") {
            public PacioliValue apply(List<PacioliValue> params) throws MVMException {
                Callable function = (Callable) params.get(0);
                PacioliTuple tuple = (PacioliTuple) params.get(1);
                return function.apply(tuple.items());
            }
        });

        store.put("debug_Primitives_apply", new Primitive("apply") {
            public PacioliValue apply(List<PacioliValue> params) throws MVMException {
                checkNrArgs(params, 2);
                checkCallableArg(params, 0);
                checkTupleArg(params, 1);
                Callable fun = (Callable) store.lookup("user_Primitives_apply");
                PacioliValue result = fun.apply(params);
                return result;
            }
        });

        store.put("user_Primitives_equal", new Primitive("equal") {
            public PacioliValue apply(List<PacioliValue> params) throws MVMException {
                return new Boole(params.get(0).equals(params.get(1)));
            }
        });

        store.put("debug_Primitives_equal", new Primitive("equal") {
            public PacioliValue apply(List<PacioliValue> params) throws MVMException {
                checkNrArgs(params, 2);
                Callable fun = (Callable) store.lookup("user_Primitives_equal");
                PacioliValue result = fun.apply(params);
                return result;
            }
        });

        store.put("user_Primitives_not", new Primitive("not") {
            public PacioliValue apply(List<PacioliValue> params) throws MVMException {
                Boole x = (Boole) params.get(0);
                return new Boole(!x.positive());
            }
        });

        store.put("debug_Primitives_not", new Primitive("not") {
            public PacioliValue apply(List<PacioliValue> params) throws MVMException {
                checkNrArgs(params, 1);
                checkBooleArg(params, 0);
                Callable fun = (Callable) store.lookup("user_Primitives_not");
                PacioliValue result = fun.apply(params);
                return result;
            }
        });

        store.put("user_Primitives_print", new Primitive("print") {
            public PacioliValue apply(List<PacioliValue> params) throws MVMException {
                PacioliValue value = params.get(0);
                logln(value.toText());
                return value;
            }
        });

        store.put("debug_Primitives_print", new Primitive("print") {
            public PacioliValue apply(List<PacioliValue> params) throws MVMException {
                checkNrArgs(params, 1);
                Callable fun = (Callable) store.lookup("user_Primitives_print");
                PacioliValue result = fun.apply(params);
                return result;
            }
        });
        
        store.put("user_Primitives_display", new Primitive("display") {
            public PacioliValue apply(List<PacioliValue> params) throws MVMException {
            	PacioliValue value = params.get(0);
                logln(value.toText());
                return null;
            }
        });

        store.put("debug_Primitives_display", new Primitive("display") {
            public PacioliValue apply(List<PacioliValue> params) throws MVMException {
                checkNrArgs(params, 1);
                Callable fun = (Callable) store.lookup("user_Primitives_display");
                PacioliValue result = fun.apply(params);
                return result;
            }
        });

        store.put("user_Primitives_skip", new Primitive("skip") {
            public PacioliValue apply(List<PacioliValue> params) throws MVMException {
                //return null;
                return new Matrix(-1);
            }
        });

        store.put("debug_Primitives_skip", new Primitive("skip") {
            public PacioliValue apply(List<PacioliValue> params) throws MVMException {
                checkNrArgs(params, 0);
                Callable fun = (Callable) store.lookup("user_Primitives_skip");
                PacioliValue result = fun.apply(params);
                return result;
            }
        });

        store.put("user_Primitives_identity", new Primitive("identity") {
            public PacioliValue apply(List<PacioliValue> params) throws MVMException {
                return params.get(0);
            }
        });

        store.put("debug_Primitives_identity", new Primitive("identity") {
            public PacioliValue apply(List<PacioliValue> params) throws MVMException {
                checkNrArgs(params, 1);
                Callable fun = (Callable) store.lookup("user_Primitives_identity");
                PacioliValue result = fun.apply(params);
                return result;
            }
        });

        store.put("user_Primitives_new_ref", new Primitive("new_ref") {
            public PacioliValue apply(List<PacioliValue> params) throws MVMException {
                return new Reference();
            }
        });

        store.put("debug_Primitives_new_ref", new Primitive("new_ref") {
            public PacioliValue apply(List<PacioliValue> params) throws MVMException {
                checkNrArgs(params, 0);
                Callable fun = (Callable) store.lookup("user_Primitives_new_ref");
                PacioliValue result = fun.apply(params);
                return result;
            }
        });

        store.put("user_Primitives_ref_get", new Primitive("ref_get") {
            public PacioliValue apply(List<PacioliValue> params) throws MVMException {
                Reference ref = (Reference) params.get(0);
                return ref.getValue();
            }
        });

        store.put("debug_Primitives_ref_get", new Primitive("ref_get") {
            public PacioliValue apply(List<PacioliValue> params) throws MVMException {
                checkNrArgs(params, 1);
                checkReferenceArg(params, 0);
                Callable fun = (Callable) store.lookup("user_Primitives_ref_get");
                PacioliValue result = fun.apply(params);
                return result;
            }
        });

        store.put("user_Primitives_ref_set", new Primitive("ref_set") {
            public PacioliValue apply(List<PacioliValue> params) throws MVMException {
                Reference ref = (Reference) params.get(0);
                PacioliValue value = params.get(1);
                ref.setValue(value);
                return ref;
            }
        });

        store.put("debug_Primitives_ref_set", new Primitive("ref_set") {
            public PacioliValue apply(List<PacioliValue> params) throws MVMException {
                checkNrArgs(params, 2);
                checkReferenceArg(params, 0);
                Callable fun = (Callable) store.lookup("user_Primitives_ref_set");
                PacioliValue result = fun.apply(params);
                return result;
            }
        });

        store.put("user_Primitives_seq", new Primitive("seq") {
            public PacioliValue apply(List<PacioliValue> params) throws MVMException {
                return params.get(1);
            }
        });

        store.put("debug_Primitives_seq", new Primitive("seq") {
            public PacioliValue apply(List<PacioliValue> params) throws MVMException {
                checkNrArgs(params, 2);
                Callable fun = (Callable) store.lookup("user_Primitives_seq");
                PacioliValue result = fun.apply(params);
                return result;
            }
        });

        store.put("user_Primitives_while_function", new Primitive("seq") {
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

        store.put("debug_Primitives_while_function", new Primitive("seq") {
            public PacioliValue apply(List<PacioliValue> params) throws MVMException {
                checkNrArgs(params, 2);
                checkCallableArg(params, 0);
                checkCallableArg(params, 1);
                Callable fun = (Callable) store.lookup("user_Primitives_while_function");
                PacioliValue result = fun.apply(params);
                return result;
            }
        });

        store.put("user_Primitives_throw_result", new Primitive("throw_result") {
            public PacioliValue apply(List<PacioliValue> params) throws MVMException {
                Reference first = (Reference) params.get(0);
                first.setValue(params.get(1));
                throw new ControlTransfer();
            }
        });

        store.put("debug_Primitives_throw_result", new Primitive("throw_result") {
            public PacioliValue apply(List<PacioliValue> params) throws MVMException {
                checkNrArgs(params, 2);
                checkReferenceArg(params, 0);
                Callable fun = (Callable) store.lookup("user_Primitives_throw_result");
                PacioliValue result = fun.apply(params);
                return result;
            }
        });

        store.put("user_Primitives_catch_result", new Primitive("catch_and_return_result") {
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

        store.put("debug_Primitives_catch_result", new Primitive("catch_and_return_result") {
            public PacioliValue apply(List<PacioliValue> params) throws MVMException {
                checkNrArgs(params, 2);
                checkCallableArg(params, 0);
                checkReferenceArg(params, 1);
                Callable fun = (Callable) store.lookup("user_Primitives_catch_result");
                PacioliValue result = fun.apply(params);
                return result;
            }
        });
        ////////////////////////////////////////////////////////////////////////////////
        // Matrix

        store.put("user_Matrix__", new Key());

        store.put("debug_Matrix__", new Key());

        store.put("user_Matrix_solve", new Primitive("solve") {
            public PacioliValue apply(List<PacioliValue> params) throws MVMException {
                Matrix x = (Matrix) params.get(0);
                Matrix y = (Matrix) params.get(1);
                return x.solve(y);
            }
        });

        store.put("debug_Matrix_solve", new Primitive("solve") {
            public PacioliValue apply(List<PacioliValue> params) throws MVMException {
                checkNrArgs(params, 2);
                checkMatrixArg(params, 0);
                checkMatrixArg(params, 1);
                Callable fun = (Callable) store.lookup("user_Matrix_solve");
                PacioliValue result = fun.apply(params);
                return result;
            }
        });

        store.put("user_Matrix_plu", new Primitive("plu") {
            public PacioliValue apply(List<PacioliValue> params) throws MVMException {
                Matrix x = (Matrix) params.get(0);
                return x.plu();
            }
        });

        store.put("debug_Matrix_plu", new Primitive("plu") {
            public PacioliValue apply(List<PacioliValue> params) throws MVMException {
                checkNrArgs(params, 1);
                checkMatrixArg(params, 0);
                Callable fun = (Callable) store.lookup("user_Matrix_plu");
                PacioliValue result = fun.apply(params);
                return result;
            }
        });

        store.put("user_Matrix_svd", new Primitive("svd") {
            public PacioliValue apply(List<PacioliValue> params) throws MVMException {
                Matrix x = (Matrix) params.get(0);
                return x.svd();
            }
        });

        store.put("debug_Matrix_svd", new Primitive("svd") {
            public PacioliValue apply(List<PacioliValue> params) throws MVMException {
                checkNrArgs(params, 1);
                checkMatrixArg(params, 0);
                Callable fun = (Callable) store.lookup("user_Matrix_svd");
                PacioliValue result = fun.apply(params);
                return result;
            }
        });

        store.put("user_Matrix_unit_factor", new Primitive("unit_factor") {
            public PacioliValue apply(List<PacioliValue> params) throws MVMException {
                Matrix matrix = (Matrix) params.get(0);
                return new Matrix(matrix.shape.getFactor());
            }
        });

        store.put("debug_Matrix_unit_factor", new Primitive("unit_factor") {
            public PacioliValue apply(List<PacioliValue> params) throws MVMException {
                checkNrArgs(params, 1);
                checkMatrixArg(params, 0);
                Callable fun = (Callable) store.lookup("user_Matrix_unit_factor");
                PacioliValue result = fun.apply(params);
                return result;
            }
        });

        store.put("user_Matrix_row_units", new Primitive("row_units") {
            public PacioliValue apply(List<PacioliValue> params) throws MVMException {
                Matrix matrix = (Matrix) params.get(0);
                return matrix.rowUnitVector();
            }
        });

        store.put("debug_Matrix_row_units", new Primitive("row_units") {
            public PacioliValue apply(List<PacioliValue> params) throws MVMException {
                checkNrArgs(params, 1);
                checkMatrixArg(params, 0);
                Callable fun = (Callable) store.lookup("user_Matrix_row_units");
                PacioliValue result = fun.apply(params);
                return result;
            }
        });

        store.put("user_Matrix_column_units", new Primitive("column_units") {
            public PacioliValue apply(List<PacioliValue> params) throws MVMException {
                Matrix matrix = (Matrix) params.get(0);
                return matrix.columnUnitVector();
            }
        });

        store.put("debug_Matrix_column_units", new Primitive("column_units") {
            public PacioliValue apply(List<PacioliValue> params) throws MVMException {
                checkNrArgs(params, 1);
                checkMatrixArg(params, 0);
                Callable fun = (Callable) store.lookup("user_Matrix_column_units");
                PacioliValue result = fun.apply(params);
                return result;
            }
        });

        store.put("user_Matrix_make_matrix", new Primitive("make_matrix") {
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

                    if (!(tupleItems.get(0) instanceof Key
                            && tupleItems.get(1) instanceof Key
                            && tupleItems.get(2) instanceof Matrix)) {
                        throw new MVMException("argument to function 'matrix' is not a list of (key, key, matrix) tuples");
                    }

                    Key rowKey = (Key) tupleItems.get(0);
                    Key columnKey = (Key) tupleItems.get(1);
                    Matrix value = (Matrix) tupleItems.get(2);

                    if (!(first instanceof PacioliTuple)) {
                        throw new MVMException("argument to function 'matrix' is not a list of tuples");
                    }

                    MatrixShape type = new MatrixShape(value.shape.getFactor(), rowKey.dimension(), columnKey.dimension());
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

        store.put("debug_Matrix_make_matrix", new Primitive("make_matrix") {
            public PacioliValue apply(List<PacioliValue> params) throws MVMException {
                checkNrArgs(params, 1);
                checkListArg(params, 0);
                Callable fun = (Callable) store.lookup("user_Matrix_make_matrix");
                PacioliValue result = fun.apply(params);
                return result;
            }
        });

        store.put("user_Matrix_gcd", new Primitive("gcd") {
            public PacioliValue apply(List<PacioliValue> params) throws MVMException {
                Matrix x = (Matrix) params.get(0);
                Matrix y = (Matrix) params.get(1);
                return x.gcd(y);
            }
        });

        store.put("debug_Matrix_gcd", new Primitive("gcd") {
            public PacioliValue apply(List<PacioliValue> params) throws MVMException {
                checkNrArgs(params, 2);
                checkMatrixArg(params, 0);
                checkMatrixArg(params, 1);
                Callable fun = (Callable) store.lookup("user_Matrix_gcd");
                PacioliValue result = fun.apply(params);
                return result;
            }
        });

        store.put("user_Matrix_sqrt", new Primitive("sqrt") {
            public PacioliValue apply(List<PacioliValue> params) throws MVMException {
                Matrix x = (Matrix) params.get(0);
                return x.sqrt();
            }
        });

        store.put("debug_Matrix_sqrt", new Primitive("sqrt") {
            public PacioliValue apply(List<PacioliValue> params) throws MVMException {
                checkNrArgs(params, 1);
                checkMatrixArg(params, 0);
                Callable fun = (Callable) store.lookup("user_Matrix_sqrt");
                PacioliValue result = fun.apply(params);
                return result;
            }
        });

        store.put("user_Matrix_sum", new Primitive("sum") {
            public PacioliValue apply(List<PacioliValue> params) throws MVMException {
                Matrix x = (Matrix) params.get(0);
                Matrix y = (Matrix) params.get(1);
                return x.sum(y);
            }
        });

        store.put("debug_Matrix_sum", new Primitive("sum") {
            public PacioliValue apply(List<PacioliValue> params) throws MVMException {
                checkNrArgs(params, 2);
                checkMatrixArg(params, 0);
                checkMatrixArg(params, 1);
                Callable fun = (Callable) store.lookup("user_Matrix_sum");
                PacioliValue result = fun.apply(params);
                return result;
            }
        });

        store.put("user_Matrix_magnitude", new Primitive("magnitude") {
            public PacioliValue apply(List<PacioliValue> params) throws MVMException {
                Matrix x = (Matrix) params.get(0);
                return x.magnitude();
            }
        });

        store.put("debug_Matrix_magnitude", new Primitive("magnitude") {
            public PacioliValue apply(List<PacioliValue> params) throws MVMException {
                checkNrArgs(params, 1);
                checkMatrixArg(params, 0);
                Callable fun = (Callable) store.lookup("user_Matrix_magnitude");
                PacioliValue result = fun.apply(params);
                return result;
            }
        });

        store.put("user_Matrix_divide", new Primitive("divide") {
            public PacioliValue apply(List<PacioliValue> params) throws MVMException {
                Matrix x = (Matrix) params.get(0);
                Matrix y = (Matrix) params.get(1);
                return x.div(y);
            }
        });

        store.put("debug_Matrix_divide", new Primitive("divide") {
            public PacioliValue apply(List<PacioliValue> params) throws MVMException {
                checkNrArgs(params, 2);
                checkMatrixArg(params, 0);
                checkMatrixArg(params, 1);
                Callable fun = (Callable) store.lookup("user_Matrix_divide");
                PacioliValue result = fun.apply(params);
                return result;
            }
        });

        store.put("user_Matrix_mod", new Primitive("mod") {
            public PacioliValue apply(List<PacioliValue> params) throws MVMException {
                Matrix x = (Matrix) params.get(0);
                Matrix y = (Matrix) params.get(1);
                return x.mod(y);
            }
        });

        store.put("debug_Matrix_mod", new Primitive("mod") {
            public PacioliValue apply(List<PacioliValue> params) throws MVMException {
                checkNrArgs(params, 2);
                checkMatrixArg(params, 0);
                checkMatrixArg(params, 1);
                Callable fun = (Callable) store.lookup("user_Matrix_mod");
                PacioliValue result = fun.apply(params);
                return result;
            }
        });

        store.put("user_Matrix_less", new Primitive("less") {
            public PacioliValue apply(List<PacioliValue> params) throws MVMException {
                Matrix x = (Matrix) params.get(0);
                Matrix y = (Matrix) params.get(1);
                return new Boole(x.less(y));
            }
        });

        store.put("debug_Matrix_less", new Primitive("less") {
            public PacioliValue apply(List<PacioliValue> params) throws MVMException {
                checkNrArgs(params, 2);
                checkMatrixArg(params, 0);
                checkMatrixArg(params, 1);
                Callable fun = (Callable) store.lookup("user_Matrix_less");
                PacioliValue result = fun.apply(params);
                return result;
            }
        });

        store.put("user_Matrix_less_eq", new Primitive("less_eq") {
            public PacioliValue apply(List<PacioliValue> params) throws MVMException {
                Matrix x = (Matrix) params.get(0);
                Matrix y = (Matrix) params.get(1);
                return new Boole(x.lessEq(y));
            }
        });

        store.put("debug_Matrix_less_eq", new Primitive("less_eq") {
            public PacioliValue apply(List<PacioliValue> params) throws MVMException {
                checkNrArgs(params, 2);
                checkMatrixArg(params, 0);
                checkMatrixArg(params, 1);
                Callable fun = (Callable) store.lookup("user_Matrix_less_eq");
                PacioliValue result = fun.apply(params);
                return result;
            }
        });

        store.put("user_Matrix_get", new Primitive("get") {
            public PacioliValue apply(List<PacioliValue> params) throws MVMException {
                Matrix x = (Matrix) params.get(0);
                Key row = (Key) params.get(1);
                Key column = (Key) params.get(2);
                return x.get(row, column);
            }
        });

        store.put("debug_Matrix_get", new Primitive("get") {
            public PacioliValue apply(List<PacioliValue> params) throws MVMException {
                checkNrArgs(params, 3);
                checkMatrixArg(params, 0);
                checkKeyArg(params, 1);
                checkKeyArg(params, 2);
                Callable fun = (Callable) store.lookup("user_Matrix_get");
                PacioliValue result = fun.apply(params);
                return result;
            }
        });

        store.put("user_Matrix_set", new Primitive("set") {
            public PacioliValue apply(List<PacioliValue> params) throws MVMException {
                Key row = (Key) params.get(0);
                Key column = (Key) params.get(1);
                Matrix x = (Matrix) params.get(2);
                // TODO: fix
                //return x.set(row,column,x);
                throw new MVMException("set is not implemented");
            }
        });

        store.put("debug_Matrix_set", new Primitive("set") {
            public PacioliValue apply(List<PacioliValue> params) throws MVMException {
                checkNrArgs(params, 3);
                checkKeyArg(params, 0);
                checkKeyArg(params, 1);
                checkMatrixArg(params, 2);
                Callable fun = (Callable) store.lookup("user_Matrix_set");
                PacioliValue result = fun.apply(params);
                return result;
            }
        });

        store.put("user_Matrix_isolate", new Primitive("isolate") {
            public PacioliValue apply(List<PacioliValue> params) throws MVMException {
                Matrix x = (Matrix) params.get(0);
                Key row = (Key) params.get(1);
                Key column = (Key) params.get(2);
                return x.isolate(row, column);
            }
        });

        store.put("debug_Matrix_isolate", new Primitive("isolate") {
            public PacioliValue apply(List<PacioliValue> params) throws MVMException {
                checkNrArgs(params, 3);
                checkMatrixArg(params, 0);
                checkKeyArg(params, 1);
                checkKeyArg(params, 2);
                Callable fun = (Callable) store.lookup("user_Matrix_isolate");
                PacioliValue result = fun.apply(params);
                return result;
            }
        });

        store.put("user_Matrix_multiply", new Primitive("multiply") {
            public PacioliValue apply(List<PacioliValue> params) throws MVMException {
                Matrix x = (Matrix) params.get(0);
                Matrix y = (Matrix) params.get(1);
                return x.multiply(y);
            }
        });

        store.put("debug_Matrix_multiply", new Primitive("multiply") {
            public PacioliValue apply(List<PacioliValue> params) throws MVMException {
                checkNrArgs(params, 2);
                checkMatrixArg(params, 0);
                checkMatrixArg(params, 1);
                Callable fun = (Callable) store.lookup("user_Matrix_multiply");
                PacioliValue result = fun.apply(params);
                return result;
            }
        });

        store.put("user_Matrix_loop_matrix", new Primitive("loop_matrix") {
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

        store.put("debug_Matrix_loop_matrix", new Primitive("loop_matrix") {
            public PacioliValue apply(List<PacioliValue> params) throws MVMException {
                checkNrArgs(params, 3);
                checkCallableArg(params, 1);
                checkMatrixArg(params, 2);
                Callable fun = (Callable) store.lookup("user_Matrix_loop_matrix");
                PacioliValue result = fun.apply(params);
                return result;
            }
        });

        store.put("user_Matrix_column", new Primitive("column") {
            public PacioliValue apply(List<PacioliValue> params) throws MVMException {
                Matrix matrix = (Matrix) params.get(0);
                Key key = (Key) params.get(1);
                return matrix.column(key);
            }
        });

        store.put("debug_Matrix_column", new Primitive("column") {
            public PacioliValue apply(List<PacioliValue> params) throws MVMException {
                checkNrArgs(params, 2);
                checkMatrixArg(params, 0);
                checkKeyArg(params, 1);
                Callable fun = (Callable) store.lookup("user_Matrix_column");
                PacioliValue result = fun.apply(params);
                return result;
            }
        });

        store.put("user_Matrix_row", new Primitive("row") {
            public PacioliValue apply(List<PacioliValue> params) throws MVMException {
                Matrix matrix = (Matrix) params.get(0);
                Key key = (Key) params.get(1);
                return matrix.row(key);
            }
        });

        store.put("debug_Matrix_row", new Primitive("row") {
            public PacioliValue apply(List<PacioliValue> params) throws MVMException {
                checkNrArgs(params, 2);
                checkMatrixArg(params, 0);
                checkKeyArg(params, 1);
                Callable fun = (Callable) store.lookup("user_Matrix_row");
                PacioliValue result = fun.apply(params);
                return result;
            }
        });

        store.put("user_Matrix_column_domain", new Primitive("column_domain") {
            public PacioliValue apply(List<PacioliValue> params) throws MVMException {
                Matrix matrix = (Matrix) params.get(0);
                return matrix.columnDomain();
            }
        });

        store.put("debug_Matrix_column_domain", new Primitive("column_domain") {
            public PacioliValue apply(List<PacioliValue> params) throws MVMException {
                checkNrArgs(params, 1);
                checkMatrixArg(params, 0);
                Callable fun = (Callable) store.lookup("user_Matrix_column_domain");
                PacioliValue result = fun.apply(params);
                return result;
            }
        });

        store.put("user_Matrix_row_domain", new Primitive("row_domain") {
            public PacioliValue apply(List<PacioliValue> params) throws MVMException {
                Matrix matrix = (Matrix) params.get(0);
                return matrix.rowDomain();
            }
        });

        store.put("debug_Matrix_row_domain", new Primitive("row_domain") {
            public PacioliValue apply(List<PacioliValue> params) throws MVMException {
                checkNrArgs(params, 1);
                checkMatrixArg(params, 0);
                Callable fun = (Callable) store.lookup("user_Matrix_row_domain");
                PacioliValue result = fun.apply(params);
                return result;
            }
        });

        store.put("user_Matrix_dot", new Primitive("dot") {
            public PacioliValue apply(List<PacioliValue> params) throws MVMException {
                Matrix x = (Matrix) params.get(0);
                Matrix y = (Matrix) params.get(1);
                return x.join(y);
            }
        });

        store.put("debug_Matrix_dot", new Primitive("dot") {
            public PacioliValue apply(List<PacioliValue> params) throws MVMException {
                checkNrArgs(params, 2);
                checkMatrixArg(params, 0);
                checkMatrixArg(params, 1);
                Callable fun = (Callable) store.lookup("user_Matrix_dot");
                PacioliValue result = fun.apply(params);
                return result;
            }
        });

        store.put("user_Matrix_kronecker", new Primitive("kronecker") {
            public PacioliValue apply(List<PacioliValue> params) throws MVMException {
                Matrix x = (Matrix) params.get(0);
                Matrix y = (Matrix) params.get(1);
                return x.kronecker(y);
            }
        });

        store.put("debug_Matrix_kronecker", new Primitive("kronecker") {
            public PacioliValue apply(List<PacioliValue> params) throws MVMException {
                checkNrArgs(params, 2);
                checkMatrixArg(params, 0);
                checkMatrixArg(params, 1);
                Callable fun = (Callable) store.lookup("user_Matrix_kronecker");
                PacioliValue result = fun.apply(params);
                return result;
            }
        });

        store.put("user_Matrix_scale", new Primitive("scale") {
            public PacioliValue apply(List<PacioliValue> params) throws MVMException {
                Matrix x = (Matrix) params.get(0);
                Matrix y = (Matrix) params.get(1);
                return x.scale(y);
            }
        });

        store.put("debug_Matrix_scale", new Primitive("scale") {
            public PacioliValue apply(List<PacioliValue> params) throws MVMException {
                checkNrArgs(params, 2);
                checkMatrixArg(params, 0);
                checkMatrixArg(params, 1);
                Callable fun = (Callable) store.lookup("user_Matrix_scale");
                PacioliValue result = fun.apply(params);
                return result;
            }
        });

        store.put("user_Matrix_total", new Primitive("total") {
            public PacioliValue apply(List<PacioliValue> params) throws MVMException {
                Matrix x = (Matrix) params.get(0);
                return x.total();
            }
        });

        store.put("debug_Matrix_total", new Primitive("total") {
            public PacioliValue apply(List<PacioliValue> params) throws MVMException {
                checkNrArgs(params, 1);
                checkMatrixArg(params, 0);
                Callable fun = (Callable) store.lookup("user_Matrix_total");
                PacioliValue result = fun.apply(params);
                return result;
            }
        });

        store.put("user_Matrix_transpose", new Primitive("transpose") {
            public PacioliValue apply(List<PacioliValue> params) throws MVMException {
                Matrix x = (Matrix) params.get(0);
                return x.transpose();
            }
        });

        store.put("debug_Matrix_transpose", new Primitive("transpose") {
            public PacioliValue apply(List<PacioliValue> params) throws MVMException {
                checkNrArgs(params, 1);
                checkMatrixArg(params, 0);
                Callable fun = (Callable) store.lookup("user_Matrix_transpose");
                PacioliValue result = fun.apply(params);
                return result;
            }
        });

        store.put("user_Matrix_reciprocal", new Primitive("reciprocal") {
            public PacioliValue apply(List<PacioliValue> params) throws MVMException {
                Matrix x = (Matrix) params.get(0);
                return x.reciprocal();
            }
        });

        store.put("debug_Matrix_reciprocal", new Primitive("reciprocal") {
            public PacioliValue apply(List<PacioliValue> params) throws MVMException {
                checkNrArgs(params, 1);
                checkMatrixArg(params, 0);
                Callable fun = (Callable) store.lookup("user_Matrix_reciprocal");
                PacioliValue result = fun.apply(params);
                return result;
            }
        });

        store.put("user_Matrix_negative", new Primitive("negative") {
            public PacioliValue apply(List<PacioliValue> params) throws MVMException {
                Matrix x = (Matrix) params.get(0);
                return x.negative();
            }
        });

        store.put("debug_Matrix_negative", new Primitive("negative") {
            public PacioliValue apply(List<PacioliValue> params) throws MVMException {
                checkNrArgs(params, 1);
                checkMatrixArg(params, 0);
                Callable fun = (Callable) store.lookup("user_Matrix_negative");
                PacioliValue result = fun.apply(params);
                return result;
            }
        });

        store.put("user_Matrix_abs", new Primitive("abs") {
            public PacioliValue apply(List<PacioliValue> params) throws MVMException {
                Matrix x = (Matrix) params.get(0);
                return x.abs();
            }
        });

        store.put("debug_Matrix_abs", new Primitive("abs") {
            public PacioliValue apply(List<PacioliValue> params) throws MVMException {
                checkNrArgs(params, 1);
                checkMatrixArg(params, 0);
                Callable fun = (Callable) store.lookup("user_Matrix_abs");
                PacioliValue result = fun.apply(params);
                return result;
            }
        });

        store.put("user_Matrix_index_less", new Primitive("index_less") {
            public PacioliValue apply(List<PacioliValue> params) throws MVMException {
                Key row = (Key) params.get(0);
                Key column = (Key) params.get(1);
                return new Boole(row.dimension().ElementPos(row.names) < column.dimension().ElementPos(column.names));
            }
        });

        store.put("debug_Matrix_index_less", new Primitive("index_less") {
            public PacioliValue apply(List<PacioliValue> params) throws MVMException {
                checkNrArgs(params, 2);
                checkKeyArg(params, 0);
                checkKeyArg(params, 1);
                Callable fun = (Callable) store.lookup("user_Matrix_index_less");
                PacioliValue result = fun.apply(params);
                return result;
            }
        });

        store.put("user_Matrix_sin", new Primitive("sin") {
            public PacioliValue apply(List<PacioliValue> params) throws MVMException {
                Matrix x = (Matrix) params.get(0);
                return x.sin();
            }
        });

        store.put("debug_Matrix_sin", new Primitive("sin") {
            public PacioliValue apply(List<PacioliValue> params) throws MVMException {
                checkNrArgs(params, 1);
                checkMatrixArg(params, 0);
                Callable fun = (Callable) store.lookup("user_Matrix_sin");
                PacioliValue result = fun.apply(params);
                return result;
            }
        });

        store.put("user_Matrix_cos", new Primitive("cos") {
            public PacioliValue apply(List<PacioliValue> params) throws MVMException {
                Matrix x = (Matrix) params.get(0);
                return x.cos();
            }
        });

        store.put("debug_Matrix_cos", new Primitive("cos") {
            public PacioliValue apply(List<PacioliValue> params) throws MVMException {
                checkNrArgs(params, 1);
                checkMatrixArg(params, 0);
                Callable fun = (Callable) store.lookup("user_Matrix_cos");
                PacioliValue result = fun.apply(params);
                return result;
            }
        });

        store.put("user_Matrix_tan", new Primitive("cos") {
            public PacioliValue apply(List<PacioliValue> params) throws MVMException {
                Matrix x = (Matrix) params.get(0);
                return x.tan();
            }
        });

        store.put("debug_Matrix_tan", new Primitive("cos") {
            public PacioliValue apply(List<PacioliValue> params) throws MVMException {
                checkNrArgs(params, 1);
                checkMatrixArg(params, 0);
                Callable fun = (Callable) store.lookup("user_Matrix_tan");
                PacioliValue result = fun.apply(params);
                return result;
            }
        });

        store.put("user_Matrix_asin", new Primitive("sin") {
            public PacioliValue apply(List<PacioliValue> params) throws MVMException {
                Matrix x = (Matrix) params.get(0);
                return x.asin();
            }
        });

        store.put("debug_Matrix_asin", new Primitive("sin") {
            public PacioliValue apply(List<PacioliValue> params) throws MVMException {
                checkNrArgs(params, 1);
                checkMatrixArg(params, 0);
                Callable fun = (Callable) store.lookup("user_Matrix_asin");
                PacioliValue result = fun.apply(params);
                return result;
            }
        });

        store.put("user_Matrix_acos", new Primitive("cos") {
            public PacioliValue apply(List<PacioliValue> params) throws MVMException {
                Matrix x = (Matrix) params.get(0);
                return x.acos();
            }
        });

        store.put("debug_Matrix_acos", new Primitive("cos") {
            public PacioliValue apply(List<PacioliValue> params) throws MVMException {
                checkNrArgs(params, 1);
                checkMatrixArg(params, 0);
                Callable fun = (Callable) store.lookup("user_Matrix_acos");
                PacioliValue result = fun.apply(params);
                return result;
            }
        });

        store.put("user_Matrix_atan", new Primitive("cos") {
            public PacioliValue apply(List<PacioliValue> params) throws MVMException {
                Matrix x = (Matrix) params.get(0);
                return x.atan();
            }
        });

        store.put("debug_Matrix_atan", new Primitive("cos") {
            public PacioliValue apply(List<PacioliValue> params) throws MVMException {
                checkNrArgs(params, 1);
                checkMatrixArg(params, 0);
                Callable fun = (Callable) store.lookup("user_Matrix_atan");
                PacioliValue result = fun.apply(params);
                return result;
            }
        });

        store.put("user_Matrix_atan2", new Primitive("cos") {
            public PacioliValue apply(List<PacioliValue> params) throws MVMException {
                Matrix x = (Matrix) params.get(0);
                Matrix y = (Matrix) params.get(1);
                return x.atan2(y);
            }
        });

        store.put("debug_Matrix_atan2", new Primitive("cos") {
            public PacioliValue apply(List<PacioliValue> params) throws MVMException {
                checkNrArgs(params, 2);
                checkMatrixArg(params, 0);
                checkMatrixArg(params, 1);
                Callable fun = (Callable) store.lookup("user_Matrix_atan2");
                PacioliValue result = fun.apply(params);
                return result;
            }
        });

        store.put("user_Matrix_ln", new Primitive("ln") {
            public PacioliValue apply(List<PacioliValue> params) throws MVMException {
                Matrix x = (Matrix) params.get(0);
                return x.ln();
            }
        });

        store.put("debug_Matrix_ln", new Primitive("ln") {
            public PacioliValue apply(List<PacioliValue> params) throws MVMException {
                checkNrArgs(params, 1);
                checkMatrixArg(params, 0);
                Callable fun = (Callable) store.lookup("user_Matrix_ln");
                PacioliValue result = fun.apply(params);
                return result;
            }
        });

        store.put("user_Matrix_exp", new Primitive("exp") {
            public PacioliValue apply(List<PacioliValue> params) throws MVMException {
                Matrix x = (Matrix) params.get(0);
                return x.exp();
            }
        });

        store.put("debug_Matrix_exp", new Primitive("exp") {
            public PacioliValue apply(List<PacioliValue> params) throws MVMException {
                checkNrArgs(params, 1);
                checkMatrixArg(params, 0);
                Callable fun = (Callable) store.lookup("user_Matrix_exp");
                PacioliValue result = fun.apply(params);
                return result;
            }
        });

        store.put("user_Matrix_expt", new Primitive("expt") {
            public PacioliValue apply(List<PacioliValue> params) throws MVMException {
                Matrix x = (Matrix) params.get(0);
                Matrix y = (Matrix) params.get(1);
                return x.expt(y);
            }
        });

        store.put("debug_Matrix_expt", new Primitive("expt") {
            public PacioliValue apply(List<PacioliValue> params) throws MVMException {
                checkNrArgs(params, 2);
                checkMatrixArg(params, 0);
                checkMatrixArg(params, 1);
                Callable fun = (Callable) store.lookup("user_Matrix_expt");
                PacioliValue result = fun.apply(params);
                return result;
            }
        });

        store.put("user_Matrix_log", new Primitive("log") {
            public PacioliValue apply(List<PacioliValue> params) throws MVMException {
                Matrix x = (Matrix) params.get(0);
                Matrix y = (Matrix) params.get(1);
                return x.log(y);
            }
        });

        store.put("debug_Matrix_log", new Primitive("log") {
            public PacioliValue apply(List<PacioliValue> params) throws MVMException {
                checkNrArgs(params, 2);
                checkMatrixArg(params, 0);
                checkMatrixArg(params, 1);
                Callable fun = (Callable) store.lookup("user_Matrix_log");
                PacioliValue result = fun.apply(params);
                return result;
            }
        });

        ////////////////////////////////////////////////////////////////////////////////
        // List

        store.put("user_List_loop_list", new Primitive("loop_list") {
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

        store.put("debug_List_loop_list", new Primitive("loop_list") {
            public PacioliValue apply(List<PacioliValue> params) throws MVMException {
                checkNrArgs(params, 3);
                checkCallableArg(params, 1);
                checkListArg(params, 2);
                Callable fun = (Callable) store.lookup("user_List_loop_list");
                PacioliValue result = fun.apply(params);
                return result;
            }
        });

        store.put("user_List_fold_list", new Primitive("fold_list") {
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

        store.put("debug_List_fold_list", new Primitive("fold_list") {
            public PacioliValue apply(List<PacioliValue> params) throws MVMException {
                checkNrArgs(params, 2);
                checkCallableArg(params, 0);
                checkListArg(params, 1);
                Callable fun = (Callable) store.lookup("user_List_fold_list");
                PacioliValue result = fun.apply(params);
                return result;
            }
        });

        store.put("user_List_nth", new Primitive("nth") {
            public PacioliValue apply(List<PacioliValue> params) throws MVMException {
                Matrix n = (Matrix) params.get(0);
                PacioliList list = (PacioliList) params.get(1);
                return list.nth((int) n.SingletonNumber());
//                int n = (int) ((Matrix) params.get(0)).SingletonNumber();
//                List<PacioliValue> list = ((PacioliList) params.get(1)).items();
//                //return list.get((int) n.SingletonNumber());
//                if (n < list.size()) {
//                    return list.get(n);
//                } else {
//                    throw new MVMException("Index %s for function 'nth' out of bounds. List size is %s", n, list.size());
//                }
            }
        });

        store.put("debug_List_nth", new Primitive("nth") {
            public PacioliValue apply(List<PacioliValue> params) throws MVMException {
                checkNrArgs(params, 2);
                checkMatrixArg(params, 0);
                checkListArg(params, 1);
                Callable fun = (Callable) store.lookup("user_List_nth");
                PacioliValue result = fun.apply(params);
                return result;
            }
        });

        store.put("user_List_empty_list", new Primitive("empty_list") {
            public PacioliValue apply(List<PacioliValue> params) throws MVMException {
                return new PacioliList();
            }
        });

        store.put("debug_List_empty_list", new Primitive("empty_list") {
            public PacioliValue apply(List<PacioliValue> params) throws MVMException {
                checkNrArgs(params, 0);
                Callable fun = (Callable) store.lookup("user_List_empty_list");
                PacioliValue result = fun.apply(params);
                return result;
            }
        });

        store.put("user_List_naturals", new Primitive("naturals") {
            public PacioliValue apply(List<PacioliValue> params) throws MVMException {
                Matrix n = (Matrix) params.get(0);
                //ArrayList<PacioliValue> list = new ArrayList<PacioliValue>();
                PacioliList list = new PacioliList();
                for (int i = 0; i < n.SingletonNumber(); i++) {
                    list.addMut(new Matrix(i));
                }
                return list;
            }
        });

        store.put("debug_List_naturals", new Primitive("naturals") {
            public PacioliValue apply(List<PacioliValue> params) throws MVMException {
                checkNrArgs(params, 1);
                checkMatrixArg(params, 0);
                Callable fun = (Callable) store.lookup("user_List_naturals");
                PacioliValue result = fun.apply(params);
                return result;
            }
        });

        store.put("user_List_add_mut", new Primitive("add_mut") {
            public PacioliValue apply(List<PacioliValue> params) throws MVMException {
                PacioliList x = (PacioliList) params.get(0);
                PacioliValue y = params.get(1);
                return x.addMut(y);
            }
        });

        store.put("debug_List_add_mut", new Primitive("add_mut") {
            public PacioliValue apply(List<PacioliValue> params) throws MVMException {
                checkNrArgs(params, 2);
                checkListArg(params, 0);
                Callable fun = (Callable) store.lookup("user_List_add_mut");
                PacioliValue result = fun.apply(params);
                return result;
            }
        });

        store.put("user_List_cons", new Primitive("cons") {
            public PacioliValue apply(List<PacioliValue> params) throws MVMException {
                PacioliValue x = params.get(0);
                PacioliList y = (PacioliList) params.get(1);
                return y.cons(x, y);
            }
        });

        store.put("debug_List_cons", new Primitive("cons") {
            public PacioliValue apply(List<PacioliValue> params) throws MVMException {
                checkNrArgs(params, 2);
                checkListArg(params, 1);
                Callable fun = (Callable) store.lookup("user_List_cons");
                PacioliValue result = fun.apply(params);
                return result;
            }
        });

        store.put("user_List_append", new Primitive("append") {
            public PacioliValue apply(List<PacioliValue> params) throws MVMException {
                PacioliList x = (PacioliList) params.get(0);
                PacioliList y = (PacioliList) params.get(1);
                return x.append(y);
            }
        });

        store.put("debug_List_append", new Primitive("append") {
            public PacioliValue apply(List<PacioliValue> params) throws MVMException {
                checkNrArgs(params, 2);
                checkListArg(params, 0);
                checkListArg(params, 1);
                Callable fun = (Callable) store.lookup("user_List_append");
                PacioliValue result = fun.apply(params);
                return result;
            }
        });

        store.put("user_List_head", new Primitive("head") {
            public PacioliValue apply(List<PacioliValue> params) throws MVMException {
                PacioliList x = (PacioliList) params.get(0);
                if (x.items().isEmpty()) {
                    throw new MVMException("function 'head' called on empty list");
                }
                return x.items().get(0);
            }
        });

        store.put("debug_List_head", new Primitive("head") {
            public PacioliValue apply(List<PacioliValue> params) throws MVMException {
                checkNrArgs(params, 1);
                checkListArg(params, 0);
                Callable fun = (Callable) store.lookup("user_List_head");
                PacioliValue result = fun.apply(params);
                return result;
            }
        });

        store.put("user_List_tail", new Primitive("tail") {
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

        store.put("debug_List_tail", new Primitive("tail") {
            public PacioliValue apply(List<PacioliValue> params) throws MVMException {
                checkNrArgs(params, 1);
                checkListArg(params, 0);
                Callable fun = (Callable) store.lookup("user_List_tail");
                PacioliValue result = fun.apply(params);
                return result;
            }
        });

        store.put("user_List_singleton_list", new Primitive("singleton_list") {
            public PacioliValue apply(List<PacioliValue> params) throws MVMException {
                return new PacioliList(params.get(0));
            }
        });

        store.put("debug_List_singleton_list", new Primitive("singleton_list") {
            public PacioliValue apply(List<PacioliValue> params) throws MVMException {
                checkNrArgs(params, 1);
                Callable fun = (Callable) store.lookup("user_List_singleton_list");
                PacioliValue result = fun.apply(params);
                return result;
            }
        });

        store.put("user_List_zip", new Primitive("zip") {
            public PacioliValue apply(List<PacioliValue> params) throws MVMException {
                PacioliList x = (PacioliList) params.get(0);
                PacioliList y = (PacioliList) params.get(1);
                return x.zip(y);
            }
        });

        store.put("debug_List_zip", new Primitive("zip") {
            public PacioliValue apply(List<PacioliValue> params) throws MVMException {
                checkNrArgs(params, 2);
                checkListArg(params, 0);
                checkListArg(params, 1);
                Callable fun = (Callable) store.lookup("user_List_zip");
                PacioliValue result = fun.apply(params);
                return result;
            }
        });

        store.put("user_List_list_size", new Primitive("list_size") {
            public PacioliValue apply(List<PacioliValue> params) throws MVMException {
                PacioliList x = (PacioliList) params.get(0);
                return new Matrix(x.items().size());
            }
        });

        store.put("debug_List_list_size", new Primitive("list_size") {
            public PacioliValue apply(List<PacioliValue> params) throws MVMException {
                checkNrArgs(params, 1);
                checkListArg(params, 0);
                Callable fun = (Callable) store.lookup("user_List_list_size");
                PacioliValue result = fun.apply(params);
                return result;
            }
        });

    }

    public void run(String code, PrintStream out) throws MVMException {
        long before = System.currentTimeMillis();
        try {
            runFile(code);
        } catch (ParserException ex) {

            // Copied from Reader:

            // See if this is a chained exception. The reader uses this to 
            // throw Pacioli exceptions, because the map on Parsers does not
            // allow checked exceptions. The runtime ParserException carries
            // the Pacioli exception that is thrown here.
            if (ex.getCause() != null) {
                if (ex.getCause() instanceof MVMException) {
                    throw (MVMException) ex.getCause();
                } else {
                    throw new MVMException(ex);
                }
            }

            // A parser error should contain details. If not we throw
            // a PacioliException.
            ParseErrorDetails details = ex.getErrorDetails();
            if (details == null) {
                throw new MVMException(ex);
            } else {
                int pos = details.getIndex();
                String message = String.format("Expected on of %s but found %s.", details.getExpected(), details.getEncountered());
                if (details.getUnexpected() != null) {
                    message += String.format(" Dit not expect %s.", details.getUnexpected());
                }
                if (details.getFailureMessage() != null) {
                    message += String.format(" (%s)", details.getFailureMessage());
                }
                throw new MVMException(message);
            }



        }
        long after = System.currentTimeMillis();
        logln("Ready in %d ms", after - before);
    }

    private void runFile(String code) throws MVMException {
        Parser<Unit> unitParser = unitExpressionParser();
        Parser<Expression> exprParser = expressionParser();
        Parsers.or(
                baseunitCommand(),
                unitCommand(unitParser),
                indexsetCommand(),
                storeCommand(exprParser),
                printCommand(exprParser),
                unitVectorCommand(unitParser))
                .endBy(TERMS.token(";"))
                .from(TOKENIZER, IGNORED.skipMany())
                .parse(code);
    }
    /* 
     * Tokens
     */
    private static final String[] OPERATORS = {";", ",", "(", ")", "-", "^", "*", "/"};
    private static final String[] KEYWORDS = {
        "baseunit", "unit", "indexset", "unitvector", "load", "store", "print",
        "application", "lambda", "var", "const", "if", "bang", "key", "application_debug",
        "path", "list", "matrix", "index",
        "multiply", "power", "scaled"
    };
    private static final Terminals TERMS =
            Terminals.caseInsensitive(OPERATORS, KEYWORDS);
    private static final Parser<?> TOKENIZER =
            Parsers.or(
            TERMS.tokenizer(),
            Terminals.Identifier.TOKENIZER,
            Terminals.DecimalLiteral.TOKENIZER,
            Terminals.StringLiteral.DOUBLE_QUOTE_TOKENIZER);
    private static final Parser<Void> IGNORED = Parsers.or(
            Scanners.lineComment("#"),
            Scanners.WHITESPACES);

    /* 
     * Commands
     */
    private Parser<Void> unitCommand(Parser<Unit> unitParser) {
        return Parsers.sequence(
                TERMS.token("unit"),
                Terminals.StringLiteral.PARSER,
                Terminals.StringLiteral.PARSER,
                unitParser,
                new org.codehaus.jparsec.functors.Map4<Token, String, String, Unit, Void>() {
            public Void map(Token id, String name, String symbol, Unit body) {
                unitSystem.addUnit(name, new NamedUnit(symbol, body));
                return null;
            }
        });
    }

    private Parser<Void> baseunitCommand() {
        return Parsers.sequence(
                TERMS.token("baseunit"),
                Terminals.StringLiteral.PARSER,
                Terminals.StringLiteral.PARSER,
                new org.codehaus.jparsec.functors.Map3<Token, String, String, Void>() {
            public Void map(Token id, String name, String symbol) {
                unitSystem.addUnit(name, new NamedUnit(symbol));
                return null;
            }
        });
    }

    private Parser<Void> indexsetCommand() {
        return Parsers.sequence(
                TERMS.token("indexset"),
                Terminals.StringLiteral.PARSER,
                TERMS.token("list")
                .next(TERMS.token("("))
                .next(Terminals.StringLiteral.PARSER.sepBy(TERMS.token(",")))
                .followedBy(TERMS.token(")")),
                new org.codehaus.jparsec.functors.Map3<Token, String, List<String>, Void>() {
            public Void map(Token id, String name, List<String> set) {
                if (indexSets.containsKey(name)) {
                    throw createException("Redefining index set '%s'", name);
                }
                indexSets.put(name, new IndexSet(name, set));
                return null;
            }
        });
    }

    private Parser<Void> unitVectorCommand(Parser<Unit> unitParser) {
        return Parsers.sequence(
                TERMS.token("unitvector"),
                Terminals.StringLiteral.PARSER,
                Terminals.StringLiteral.PARSER,
                TERMS.token("list")
                .next(TERMS.token("("))
                .next(unitParser.sepBy(TERMS.token(",")))
                .followedBy(TERMS.token(")")),
                new org.codehaus.jparsec.functors.Map4<Token, String, String, List<Unit>, Void>() {
            public Void map(Token id, String entityName, String name, List<Unit> units) {

                String symbol = entityName + "!" + name;
                IndexSet entity;
                if (indexSets.containsKey(entityName)) {
                    entity = indexSets.get(entityName);
                } else {
                    throw createException("Index set '%s' unnown", entityName);
                }

                Unit[] unitArray = new Unit[units.size()];
                unitVectors.put(symbol, new UnitVector(entity, name, units.toArray(unitArray)));

                return null;
            }
        });
    }

    private Parser<Void> storeCommand(Parser<Expression> exprParser) {
        return Parsers.sequence(
                TERMS.token("store").next(Terminals.StringLiteral.PARSER),
                exprParser,
                new org.codehaus.jparsec.functors.Map2<String, Expression, Void>() {
            public Void map(String name, Expression body) {
                //logln("Computing '%s'", name);
                try {
                    store.put(name, body.eval(store));
                } catch (MVMException ex) {
                    throw new ParserException(ex, null, null, null);
                }
                return null;
            }
        });
    }

    private Parser<Void> printCommand(Parser<Expression> exprParser) {
        return TERMS.token("print").next(exprParser)
                .map(new org.codehaus.jparsec.functors.Map<Expression, Void>() {
            public Void map(Expression body) {
                try {
                	PacioliValue result = body.eval(store);
                	if (result != null) {
                		logln("%s", result.toText());
                	}
                } catch (MVMException ex) {
                    throw new ParserException(ex, null, null, null);
                }
                return null;
            }
        });
    }

    /* 
     * Expressions
     */
    private static final Parser<Expression> VARIABLE =
            TERMS.token("var").next(Parsers.between(TERMS.token("("), Terminals.StringLiteral.PARSER, TERMS.token(")")))
            .map(new org.codehaus.jparsec.functors.Map<String, Expression>() {
        public Expression map(String arg) {
            return new Identifier(arg);
        }
    });

    private Parser<Expression> expressionParser() {
        Parser.Reference<Expression> reference = Parser.newReference();
        Parser<Expression> lazyExpr = reference.lazy();
        Parser<Expression> parser = Parsers.or(
                applicationParser(lazyExpr),
                applicationDebugParser(lazyExpr),
                ifParser(lazyExpr),
                lambdaParser(lazyExpr),
                constParser(),
                bangParser(),
                unitParser(),
                keyParser(),
                VARIABLE);
        reference.set(parser);
        return parser;
    }

    private static Parser<Expression> constParser() {
        return TERMS.token("const").next(TERMS.token("(")).next(Terminals.StringLiteral.PARSER)
                .followedBy(TERMS.token(")"))
                .map(new org.codehaus.jparsec.functors.Map<String, Expression>() {
            public Expression map(String value) {
                if (value.equals("true")) {
                    return new Const(new Boole(true));
                } else if (value.equals("false")) {
                    return new Const(new Boole(false));
                } else {
                    return new Const(new Matrix(Double.parseDouble(value)));
                }
            }
        });
    }

    private Parser<Expression> unitParser() {
        return TERMS.token("unit").next(TERMS.token("(")).next(Terminals.StringLiteral.PARSER)
                .followedBy(TERMS.token(")"))
                .map(new org.codehaus.jparsec.functors.Map<String, Expression>() {
            public Expression map(String value) {
                if (value.equals("1")) {
                    return new Const(new Matrix(1));
                } else {
                    return new Const(new Matrix(unitSystem.lookupUnit(value)));
                }
            }
        });
    }

    private Parser<Expression> bangParser() {
        return Parsers.sequence(
                TERMS.token("bang").next(TERMS.token("(")).next(Terminals.StringLiteral.PARSER),
                TERMS.token(",").next(Terminals.StringLiteral.PARSER).followedBy(TERMS.token(")")),
                new org.codehaus.jparsec.functors.Map2<String, String, Expression>() {
            public Expression map(String entityName, String unitName) {
                MatrixShape shape;
                if (unitName.isEmpty()) {
                    if (!indexSets.containsKey(entityName)) {
                        throw createException("Index set '%s' unnown", entityName);
                    }
                    shape = new MatrixShape(Unit.ONE, new MatrixDimension(indexSets.get(entityName)), Unit.ONE, new MatrixDimension(), Unit.ONE);
                } else {
                    String name = entityName + "!" + unitName;
                    if (!unitVectors.containsKey(name)) {
                        throw createException("Unit vector '%s' unnown", name);
                    }
                    UnitVector vector = unitVectors.get(name);
                    shape = new MatrixShape(Unit.ONE, new MatrixDimension(vector.indexSet), new MatrixBase(vector, 0), new MatrixDimension(), Unit.ONE);
                }
                return new Const(new Matrix(shape).ones());
            }
        });
    }

    private Parser<Expression> keyParser() {
        return TERMS.token("key")
                .next(TERMS.token("("))
                .next(Parsers.tuple(Terminals.StringLiteral.PARSER,
                TERMS.token(",").next(Terminals.StringLiteral.PARSER)).sepBy(TERMS.token(",")))
                .followedBy(TERMS.token(")"))
                .map(new org.codehaus.jparsec.functors.Map<List<Pair<String, String>>, Expression>() {
            public Expression map(List<Pair<String, String>> pairs) {
                if (pairs.isEmpty()) {
                    return new Const(new Key());
                } else {
                    List<IndexSet> sets = new ArrayList<IndexSet>();
                    List<String> items = new ArrayList<String>();
                    for (Pair<String, String> pair : pairs) {
                        items.add(pair.b);
                        String entityName = pair.a;
                        if (indexSets.containsKey(entityName)) {
                            sets.add(indexSets.get(entityName));
                        } else {
                            throw createException("Index set '%s' unnown", entityName);
                        }
                    }
                    return new Const(new Key(items, new MatrixDimension(sets)));
                }
            }
        });
    }

    private static Parser<Expression> applicationParser(Parser<Expression> expParser) {
        return Parsers.sequence(
                TERMS.token("application").next(TERMS.token("(")).next(expParser),
                TERMS.token(",").next(expParser).many()
                .followedBy(TERMS.token(")")),
                new org.codehaus.jparsec.functors.Map2<Expression, List<Expression>, Expression>() {
            public Expression map(Expression fun, List<Expression> args) {
                return new Application(fun, args);
            }
        });
    }

    private static Parser<Expression> applicationDebugParser(Parser<Expression> expParser) {
        return Parsers.sequence(
                TERMS.token("application_debug").next(TERMS.token("(")).next(Terminals.StringLiteral.PARSER),
                TERMS.token(",").next(Terminals.StringLiteral.PARSER),
                TERMS.token(",").next(Terminals.StringLiteral.PARSER),
                TERMS.token(",").next(expParser),
                TERMS.token(",").next(expParser).many()
                .followedBy(TERMS.token(")")),
                new org.codehaus.jparsec.functors.Map5<String, String, String, Expression, List<Expression>, Expression>() {
            public Expression map(String text, String fullText, String trace, Expression fun, List<Expression> args) {
                return new ApplicationDebug(text, fullText, trace.equals("true"), fun, args);
            }
        });
    }

    private static Parser<Expression> ifParser(Parser<Expression> expParser) {
        return Parsers.sequence(
                TERMS.token("if").next(TERMS.token("(")).next(expParser),
                TERMS.token(",").next(expParser),
                TERMS.token(",").next(expParser).followedBy(TERMS.token(")")),
                new org.codehaus.jparsec.functors.Map3<Expression, Expression, Expression, Expression>() {
            public Expression map(Expression test, Expression pos, Expression neg) {
                return new Branch(test, pos, neg);
            }
        });
    }

    private static Parser<Expression> lambdaParser(Parser<Expression> expParser) {
        return Parsers.sequence(
                TERMS.token("lambda").next(Parsers.between(TERMS.token("("), Terminals.StringLiteral.PARSER.sepBy(TERMS.token(",")), TERMS.token(")"))),
                expParser,
                new org.codehaus.jparsec.functors.Map2<List<String>, Expression, Expression>() {
            public Expression map(List<String> args, Expression body) {
                return new Lambda(args, body);
            }
        });
    }

    ////////////////////////////////////////////////////////////////////////////////
    // Units
    private Parser<Unit> unitExpressionParser() {
        return Parsers.or(
                UNITNUMBER,
                unitPower(),
                unitNamed())
                .sepBy1(TERMS.token("*"))
                .sepBy1(TERMS.token("/"))
                .map(new org.codehaus.jparsec.functors.Map<List<List<Unit>>, Unit>() {
            public Unit map(List<List<Unit>> termss) {
                Unit unit = Unit.ONE;
                boolean first = true;
                for (List<Unit> terms : termss) {
                    Unit tmp = Unit.ONE;
                    for (Unit term : terms) {
                        tmp = tmp.multiply(term);
                    }
                    if (first) {
                        unit = unit.multiply(tmp);
                    } else {
                        unit = unit.multiply(tmp.reciprocal());
                    }
                    first = false;
                }
                return unit;
            }
        });
    }
    private static final Parser<Unit> UNITNUMBER =
            Terminals.DecimalLiteral.PARSER
            .map(new org.codehaus.jparsec.functors.Map<String, Unit>() {
        public Unit map(String num) {
            return Unit.ONE.multiply(new BigDecimal(num));
        }
    });

    public static Parser<Integer> signedInteger() {
        return Parsers.or(
                Terminals.DecimalLiteral.PARSER
                .map(new org.codehaus.jparsec.functors.Map<String, Integer>() {
            public Integer map(String power) {
                return Integer.parseInt(power);
            }
        }),
                TERMS.token("-")
                .next(Terminals.DecimalLiteral.PARSER)
                .map(new org.codehaus.jparsec.functors.Map<String, Integer>() {
            public Integer map(String power) {
                Integer i = Integer.parseInt(power);
                return -i;
            }
        }));
    }

    private Parser<Unit> unitPower() {
        return Parsers.sequence(
                Parsers.or(
                UNITNUMBER,
                unitNamed()),
                TERMS.token("^")
                .next(signedInteger()),
                new org.codehaus.jparsec.functors.Map2<Unit, Integer, Unit>() {
            public Unit map(Unit unit, Integer power) {
                return unit.raise(new Fraction(power));
            }
        });
    }

    private Parser<Unit> unitNamed() {
        return Terminals.Identifier.PARSER
                .map(new org.codehaus.jparsec.functors.Map<String, Unit>() {
            public Unit map(String name) {
                if (unitSystem.congtainsUnit(name)) {
                    return unitSystem.lookupUnit(name);
                } else {
                    throw createException("unit '%s' unknown", name);
                }
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
        } else {
            System.console().format("%s", text);
        }
    }

    public static void logln(String string, Object... args) {

        if (!atLineStart) {
            //System.out.println();
            log("\n");
            atLineStart = true;
        }

        log(string, args);
    }
    
    public static ParserException createException(String form, Object... args) {
        MVMException ex = new MVMException(String.format(form, args));
        return new ParserException(ex, null, null, null);
    }

    public void dumpTypes() {
        logln("Store signature:");
        for (Map.Entry<String, PacioliValue> entry : store.entrySet()) {
            if (entry.getValue() instanceof Matrix) {
                logln("%s :: %s", entry.getKey(), ((Matrix) entry.getValue()).shape.toText());
            }

        }
    }

    public void dumpState() {
        logln("Store contents:");
        for (Map.Entry<String, PacioliValue> entry : store.entrySet()) {
            if (entry.getValue() instanceof Matrix) {
                logln("%s =%s", entry.getKey(), entry.getValue().toText());
            }
        }
        logln("\nStack:");
        int i = 1;
        for (Iterator it = debugStack.descendingIterator(); it.hasNext();) {
            logln("\n%s) %s", i++, it.next());
        }
    }

    static public UnitSystem makeSI() {
        UnitSystem si = new UnitSystem();
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
}