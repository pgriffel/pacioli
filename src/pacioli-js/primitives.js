/* Runtime Support for the Pacioli language
 *
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

var Pacioli = Pacioli || {};

// -----------------------------------------------------------------------------
// 1. Primitive Units Unit Prefixes
// -----------------------------------------------------------------------------

Pacioli.RADIAN = Pacioli.unit('radian')      // From primitive module 'Matrix'
Pacioli.PERCENT = Pacioli.unit('percent')    // From primitive module 'Standard'

Pacioli.prefix = {
    yotta: {symbol: 'Y',    factor: Math.pow(10, 24)},
    zetta: {symbol: 'Z',    factor: Math.pow(10, 21)},
    exa:   {symbol: 'E',    factor: Math.pow(10, 18)},
    peta:  {symbol: 'P',    factor: Math.pow(10, 15)},
    tera:  {symbol: 'T',    factor: Math.pow(10, 12)},
    giga:  {symbol: 'G',    factor: Math.pow(10, 9)},
    mega:  {symbol: 'M',    factor: Math.pow(10, 6)},
    kilo:  {symbol: 'k',    factor: Math.pow(10, 3)},
    hecto: {symbol: 'h',    factor: Math.pow(10, 2)},
    deca:  {symbol: 'da',   factor: Math.pow(10, 1)},
    deci:  {symbol: 'd',    factor: Math.pow(10, -1)},
    centi: {symbol: 'c',    factor: Math.pow(10, -2)},
    milli: {symbol: 'm',    factor: Math.pow(10, -3)},
    micro: {symbol: '\xB5', factor: Math.pow(10, -6)},
    nano:  {symbol: 'n',    factor: Math.pow(10, -9)},
    pico:  {symbol: 'p',    factor: Math.pow(10, -12)},
    femto: {symbol: 'f',    factor: Math.pow(10, -15)},
    atto:  {symbol: 'a',    factor: Math.pow(10, -18)},
    zepto: {symbol: 'z',    factor: Math.pow(10, -21)},
    yocto: {symbol: 'y',    factor: Math.pow(10, -24)}
}

// -----------------------------------------------------------------------------
// 2. Pacioli Primitives
//
// Each primitive function is named 'global_<module>_<name>'.
// -----------------------------------------------------------------------------

function global_Primitives_tuple() {
    var tuple = Array.prototype.slice.call(arguments);
    tuple.kind = 'tuple'
    return tuple
}

function global_Primitives_apply(fun,arg) {
    return fun.apply(this, arg);
}

function global_Primitives_new_ref(value) {
    return [value];
}

function global_Primitives_empty_ref() {
    return new Array(1);
}

function global_Primitives_ref_set(ref, value) {
    ref[0] = value;
    return ref;
}

function global_Primitives_ref_get(ref) {
    return ref[0];
}

function global_Primitives_not(boole) {
  return !boole;
}

function global_Primitives_skip() {
    return null
}

function global_Primitives_while_function(test, body) {
    while (test()) {
        body();
    }
    return null;
}

function global_Primitives_catch_result(code, ref) {
    try {
        code();
    } catch(err) {
        return ref[0];
    }
}

function global_Primitives_throw_result(ref, value) {
    ref[0] = value;
    throw "jump";
}

function global_Primitives_seq(x, y) {
    return y;
}

function global_Primitives_not_equal(x,y) {
    return !global_Primitives_equal(x, y);
}

function global_Primitives_equal(x,y) {

    if (x.kind !== y.kind) return false

    if (x === y) {
        return true
    } else if (x.kind === "coordinates") { //(x instanceof Pacioli.Coordinates && y instanceof Pacioli.Coordinates) {
     alert('duh')
        return x.equals(y)
    } else if (x.kind === "matrix") { //(x instanceof Pacioli.Matrix && y instanceof Pacioli.Matrix) {
        return Pacioli.findNonZero(x, y, function (a, b) {return a !== b}) === null
        //return x.equals(y)
    } else if (x instanceof Array && y instanceof Array) { 
        var n = x.length
        if (y.length !== n) {
            return false
        }
        for (var i = 0; i < n; i++) {
            if (!global_Primitives_equal(x[i], y[i])) {
                return false
            }
        }
        return true
    } else {
        return false
    }
}

function global_Primitives_print(x) {
    return Pacioli.printValue(x)
}

function compute_global_Matrix__() {
    return Pacioli.createCoordinates([], []);
}

function global_Matrix_unit_factor(x) { 
    return Pacioli.oneNumbers(1, 1)
}

function global_Matrix_magnitude(x) {
    return x
}

function global_Matrix_row(x, coord) {

    var row = coord.position
    var rowUnit = Pacioli.scalarShape(x.shape.findRowUnit(row))
    var matrix = new Pacioli.Matrix(x.shape.column().scale(x.shape.factor()).scale(rowUnit))

    if (x.storage === 0) {
        for (var j = 0; j < x.nrColumns(); j++) {
            matrix.set(0, j, x.getNumber(row, j))
        }
    } else {
        var numbers = x.getCOONumbers()
        var rows = []
        var columns = []
        var values = []
        for (var i = 0; i < numbers[0].length; i++) {
            if (numbers[0][i] === row) {
                rows.push(i)
                columns.push(numbers[1][i])
                values.push(numbers[2][i])
            }
        }
        matrix.numbers = [rows, columns, values]
        matrix.storage = 2
    }
    return matrix;
}

function global_Matrix_row_units(x) {
    return Pacioli.oneNumbers(x.nrRows, 1)
}

function global_Matrix_row_domain(matrix) {
    var n = matrix.nrRows;
    var domain = new Array(n);
    for (var i = 0; i < n; i++) {
        domain[i] = {kind: "coordinates", position: i, size: n}
    }
    return Pacioli.tagKind(domain, "list");
}

function global_Matrix_column(x, coord) {
    var columnUnit = Pacioli.scalarShape(x.shape.findColumnUnit(coord.position))
    var matrix = new Pacioli.Matrix(x.shape.row().scale(x.shape.factor()))
    var j = coord.position
    for (var i = 0; i < x.nrRows(); i++) {
        matrix.set(i, 0, x.getNumber(i, j))
    }
    return matrix;
}

function global_Matrix_column_domain(matrix) {
    var n = matrix.nrColumns;
    var domain = new Array(n);
    for (var i = 0; i < n; i++) {
        domain[i] = {kind: "coordinates", position: i, size: n}
    }
    return domain;
}

function global_Matrix_column_units(x) {
    return Pacioli.oneNumbers(x.nrColumns, 1)
}

function global_Matrix_get_num(matrix, i, j) {
    return Pacioli.get(matrix, i.position, j.position)
}

function global_Matrix_get(matrix, i, j) {
    return Pacioli.get(matrix, i.position, j.position)
}

function global_Matrix_make_matrix(tuples) {
    var first = tuples[0]
    var numbers = Pacioli.zeroNumbers(first[0].size, first[1].size)
    for (var i = 0; i < tuples.length; i++) {
        var tup = tuples[i];
        Pacioli.set(numbers, tup[0].position, tup[1].position, Pacioli.getNumber(tup[2], 0, 0))
    }
    return numbers;
}

function global_Matrix_support(x) {
    return Pacioli.unaryNumbers(x, function (val) { return 1})
}

function global_Matrix_top(cnt, x) {
    var n = Pacioli.getNumber(cnt, 0, 0) 

    if (n === 0) {
        return Pacioli.zeroNumbers(x.nrRows, x.nrColumns)
    }

    var matrix = Pacioli.zeroNumbers(x.nrRows, x.nrColumns)

    var top = []
    var count = 0

    var numbers = Pacioli.getCOONumbers(x)
    var rows = numbers[0]
    var columns = numbers[1]
    var values = numbers[2]
    for (var l = 0; l < rows.length; l++) {
        var i = rows[l]
        var j = columns[l]
            var val = values[l] //Pacioli.getNumber(x, i, j)
            if (count < n) {
                top[count] = [i, j, val]
                count += 1
            } else {
                var worst = 0
                for (var k = 1; k < count; k++) {
                    if (top[k][2] < top[worst][2]) {
                        worst = k
                    }
                }
                if (val > top[worst][2]) {
                    top[worst] = [i, j, val]
                }
            }
    }
    for (var k = 0; k < count; k++) {
        Pacioli.set(matrix, top[k][0], top[k][1], top[k][2]);
    }

    return matrix;
}

function global_Matrix_bottom(cnt, x) {
    var n = Pacioli.getNumber(cnt, 0, 0) 

    if (n === 0) {
        return Pacioli.zeroNumbers(x.nrRows, x.nrColumns)
    }

    var matrix = Pacioli.zeroNumbers(x.nrRows, x.nrColumns)

    var bottom = []
    var count = 0

    var numbers = Pacioli.getCOONumbers(x)
    var rows = numbers[0]
    var columns = numbers[1]
    var values = numbers[2]
    for (var l = 0; l < rows.length; l++) {
    var i = rows[l]
        var j = columns[l]
            var val = values[l]
            if (count < n) {
                bottom[count] = [i, j, val]
                count += 1
            } else {
                var best = 0
                for (var k = 1; k < count; k++) {
                    if (bottom[k][2] > bottom[best][2]) {
                        best = k
                    }
                }
                if (val < bottom[best][2]) {
                    bottom[best] = [i, j, val]
                }
            }
    }
    for (var k = 0; k < count; k++) {
        Pacioli.set(matrix, bottom[k][0], bottom[k][1], bottom[k][2]);
    }

    return matrix;
}

function global_Matrix_left_identity(x) {
    var numbers = Pacioli.zeroNumbers(x.nrRows, x.nrRows)
    for (var i = 0; i < x.nrRows; i++) {
        Pacioli.set(numbers, i, i, 1);
    }
    return numbers
}

function global_Matrix_right_identity(x) {
    var numbers = Pacioli.zeroNumbers(x.nrColumns, x.nrColumns)
    for (var i = 0; i < x.nrColumns; i++) {
        Pacioli.set(numbers, i, i, 1);
    }
    return numbers
}

function global_Matrix_reciprocal(x) {
    return Pacioli.unaryNumbers(x, function (val) { return val == 0 ? 0 : 1 / val})
}

function global_Matrix_transpose(x) {
    var result = Pacioli.zeroNumbers(x.nrColumns, x.nrRows)
    var numbers = Pacioli.getCOONumbers(x)
    var rows = numbers[0]
    var columns = numbers[1]
    var values = numbers[2]
    for (var i = 0; i < rows.length; i++) {
        Pacioli.set(result, columns[i], rows[i], values[i])
    }
    return result
}

function global_Matrix_dim_inv(x) {
    return global_Matrix_transpose(global_Matrix_reciprocal(x));
}

function global_Matrix_dim_div(x, y) {
    return global_Matrix_dot(x, global_Matrix_dim_inv(y));
}

function global_Matrix_dot(x, y) {
    return Pacioli.tagNumbers(numeric.ccsDot(Pacioli.getCCSNumbers(x), Pacioli.getCCSNumbers(y)), x.nrRows, y.nrColumns, 3);
}

function global_Matrix_multiply(x,y) {
    if (x.storage === 13) {
        return Pacioli.tagNumbers(numeric.ccsmul(Pacioli.getCCSNumbers(x), Pacioli.getCCSNumbers(y)), x.nrRows, y.nrColumns, 3);
    } else {
        return Pacioli.elementWiseNumbers(x, y, function(a, b) { return a*b});
    }
}

function global_Matrix_kronecker(x,y) {
    alert("is this used?")
    var xm = x.length
    var ym = y.length
    var xn = x[0].length
    var yn = y[0].length;
    var m = xm * ym; 
    var n = xn * yn;
    var matrix = new Array(m);
    for (var xi = 0; xi < xm; xi++) {
        for (var yi = 0; yi < ym; yi++) {
            var row = new Array(n);
            for (var xj = 0; xj < xn; xj++) {
                for (var yj = 0; yj < yn; yj++) {     
                    row[xj*yn + yj] = x[xi][xj] * y[yi][yj];
                }
            }
            matrix[xi*ym + yi] = row;
        }
    }
    return matrix;
}

function global_Matrix_divide(x,y) {
    return Pacioli.elementWiseNumbers(x, y, function(a, b) { return b !== 0 ? a/b : 0})
}

function global_Matrix_sum(x,y) {
    if (x.storage === 13) {
        return Pacioli.tagNumbers(numeric.ccsadd(Pacioli.getCCSNumbers(x), Pacioli.getCCSNumbers(y)), x.nrRows, y.nrColumns, 3);
    } else {
        return Pacioli.elementWiseNumbers(x, y, function(a, b) { return a+b});
    }
    //return Pacioli.elementWiseNumbers(x, y, function(a, b) { return a+b})
}

function global_Matrix_minus(x,y) {
    //return Pacioli.elementWiseNumbers(x, y, function(a, b) { return a-b})
    if (x.storage === 13) {
        return Pacioli.tagNumbers(numeric.ccssub(Pacioli.getCCSNumbers(x), Pacioli.getCCSNumbers(y)), x.nrRows, y.nrColumns, 3);
    } else {
        return Pacioli.elementWiseNumbers(x, y, function(a, b) { return a-b});
    }
}

function global_Matrix_negative(x) { 
    return Pacioli.unaryNumbers(x, function (val) { return -val})
}

function global_Matrix_scale(x,y) { 
    var factor = Pacioli.getNumber(x, 0, 0)
    return Pacioli.unaryNumbers(y, function (val) { return factor * val})
}

function global_Matrix_scale_down(x,y) {
    return global_Matrix_scale(global_Matrix_reciprocal(y), x);
}

function global_Matrix_total(x) { 
    var values = Pacioli.getCOONumbers(x)[2]
    var total = 0
    for (var i = 0; i < values.length; i++) {
        total += values[i]
    }
    var result = Pacioli.zeroNumbers(1, 1)
    Pacioli.set(result, 0, 0, total)
    return result
}

function global_Matrix_mod(x, y) {
    return Pacioli.tagNumbers(numeric.mod(Pacioli.getFullNumbers(x), Pacioli.getFullNumbers(y)), x.nrRows, x.nrColumns, 0);
}

function global_Matrix_max(x, y) {
    return Pacioli.tagNumbers(numeric.max(Pacioli.getFullNumbers(x), Pacioli.getFullNumbers(y)), x.nrRows, y.nrRows, 0)
}

function global_Matrix_min(x, y) {
    return Pacioli.tagNumbers(numeric.min(Pacioli.getFullNumbers(x), Pacioli.getFullNumbers(y)), x.nrRows, y.nrRows, 0)
}

function global_Matrix_sin(x) {
    return Pacioli.tagNumbers(numeric.sin(Pacioli.getFullNumbers(x)), x.nrRows, x.nrColumns, 0);
}

function global_Matrix_cos(x) {
    return Pacioli.tagNumbers(numeric.cos(Pacioli.getFullNumbers(x)), x.nrRows, x.nrColumns, 0);
}

function global_Matrix_tan(x) {
    return Pacioli.tagNumbers(numeric.tan(Pacioli.getFullNumbers(x)), x.nrRows, x.nrColumns, 0);
}

function global_Matrix_asin(x) {
    return Pacioli.tagNumbers(numeric.asin(Pacioli.getFullNumbers(x)), x.nrRows, x.nrColumns, 0);
}

function global_Matrix_acos(x) {
    return Pacioli.tagNumbers(numeric.acos(Pacioli.getFullNumbers(x)), x.nrRows, x.nrColumns, 0);
}

function global_Matrix_atan(x) {
    return Pacioli.tagNumbers(numeric.atan(Pacioli.getFullNumbers(x)), x.nrRows, x.nrColumns, 0);
}

function global_Matrix_atan2(x, y) {
    return Pacioli.tagNumbers(numeric.atan2(Pacioli.getFullNumbers(x), Pacioli.getFullNumbers(y)), x.nrRows, x.nrColumns, 0);
}

function global_Matrix_abs(x) { 
    return Pacioli.unaryNumbers(x, function (val) { return Math.abs(val)})
}

function global_Matrix_power(x,y) {
    var n = Pacioli.getNumber(y, 0, 0)
    if (n === 0) {
        return global_Matrix_left_identity(x)
    } else if (n === 1) {
        return x
    } else if (n < 0) {
        return global_Matrix_power(global_Standard_inverse(x), global_Matrix_negative(y))
    } else { 
        var result = x
        for (var i = 1; i < n; i++) {
            result = global_Matrix_dot(result, x)
        }
        return result
    }
}

function global_Matrix_expt(x,y) {
    var n = Pacioli.getNumber(y, 0, 0)
    return Pacioli.tagNumbers(numeric.pow(Pacioli.getFullNumbers(x), n), x.nrRows, x.nrColumns, 0);
}

function global_Matrix_log(x, y) {
    return global_Matrix_divide(Pacioli.tagNumbers(numeric.log(Pacioli.getFullNumbers(x)), x.nrRows, x.nrColumns, 0),
                                Pacioli.tagNumbers(numeric.log(Pacioli.getFullNumbers(y)), x.nrRows, x.nrColumns, 0));
}

function global_Matrix_exp(x) {
    return Pacioli.tagNumbers(numeric.exp(Pacioli.getFullNumbers(x)), x.nrRows, x.nrColumns, 0);
}

function global_Matrix_ln(x) {
    return Pacioli.tagNumbers(numeric.log(Pacioli.getFullNumbers(x)), x.nrRows, x.nrColumns, 0);
}

function global_Matrix_less(x,y) { 
    return Pacioli.findNonZero(x, y, function (a, b) {return a >= b}) === null
}

function global_Matrix_sqrt(x) { 
    return Pacioli.unaryNumbers(x, function (val) { return Math.sqrt(val)})
}

function global_Matrix_solve(x, ignored) {
    return Pacioli.tagNumbers(numeric.inv(Pacioli.getFullNumbers(x)), x.nrColumns, x.nrRows, 0);
}

function global_Matrix_random() { 
    return Pacioli.tagNumbers([[Math.random()]], 1, 1, 0);
}

function global_List_zip(x,y) {
    var list = new Array(Math.min(x.length, y.length));
    for (var i = 0; i < list.length; i++) {
        list[i] = [x[i], y[i]];
    }
    return Pacioli.tagKind(list, "list");
}

function global_List_add_mut(list,item) {
    list.push(item);
    return list;
}

function global_List_append(x,y) {
    return Pacioli.tagKind(x.concat(y), "list")
}

function global_List_reverse(x) {
    return Pacioli.tagKind(x.slice(0).reverse(), "list");
}

function global_List_tail(x) {
    var array = new Array(x.length-1);
    for (var i = 0; i < array.length; i++) {
        array[i] = x[i+1];
    }
    return Pacioli.tagKind(array, "list");
}

function global_List_singleton_list(x) {
    return Pacioli.tagKind([x], "list");
}

function global_List_nth(x,y) {
    return y[Pacioli.getNumber(x, 0, 0)];
}

function global_List_naturals(num) {
    var n = Pacioli.getNumber(num, 0, 0)
    var list = new Array(n);
    for (var i = 0; i < n; i++) {
        list[i] = Pacioli.initialNumbers(1, 1, [[0, 0, i]]);
    }
    return Pacioli.tagKind(list, "list");
}

function global_List_loop_list(init, fun, list) {
    var accu = init;
    for (var i = 0; i < list.length; i++) {
        accu = global_Primitives_apply(fun, [accu, list[i]]);
    }
    return accu;
}

function global_List_list_size(x) {
    return Pacioli.initialNumbers(1, 1, [[0, 0, x.length]]);
}

function global_List_head(x) {
    return x[0];
}

function global_List_fold_list(fun, list) {
    var accu = list[0];
    for (var i = 1; i < list.length; i++) {
        accu = global_Primitives_apply(fun, [accu, list[i]]);
    }
    return accu;
}

function global_List_cons(item,list) {
    return global_List_append(global_List_singleton_list(item), list);
}

function global_List_empty_list() {
   return Pacioli.tagKind([], "list");
}

