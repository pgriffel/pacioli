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

Pacioli.ONE = Pacioli.unit()
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
// Each primitive function is named 'glbl_<module>_<name>'.
// -----------------------------------------------------------------------------

Pacioli.glbl_base_tuple = function () {
    var tuple = Array.prototype.slice.call(arguments);
    tuple.kind = 'tuple'
    return tuple
}

Pacioli.glbl_base_apply = function (fun,arg) {
    return fun.apply(this, arg);
}

Pacioli.glbl_base_new_ref = function (value) {
    return [value];
}

Pacioli.glbl_base_empty_ref = function () {
    return new Array(1);
}

Pacioli.glbl_base_ref_set = function (ref, value) {
    ref[0] = value;
    return ref;
}

Pacioli.glbl_base_ref_get = function (ref) {
    return ref[0];
}

Pacioli.glbl_base_not = function (boole) {
  return !boole;
}

Pacioli.glbl_base_skip = function () {
    return null
}

Pacioli.glbl_base_while_function = function (test, body) {
    while (test()) {
        body();
    }
    return null;
}

Pacioli.glbl_base_catch_result = function (code, ref) {
    try {
        code();
    } catch(err) {
        if (err == "jump") {
            return ref[0];
        } else {
            throw err
        }
    }
}

Pacioli.glbl_base_throw_result = function (ref, value) {
    ref[0] = value;
    throw "jump";
}

Pacioli.glbl_base_seq = function (x, y) {
    return y;
}

Pacioli.glbl_base_not_equal = function (x,y) {
    return !Pacioli.glbl_base_equal(x, y);
}

Pacioli.b_glbl_base_not_equal = function (x,y) {
    return !Pacioli.b_glbl_base_equal(x, y);
}

Pacioli.glbl_base_equal = function (x,y) {

    if (x.kind !== y.kind) return false

    if (x === y) {
        return true
    } else if (x.kind === "coordinates") { //(x instanceof Pacioli.Coordinates && y instanceof Pacioli.Coordinates) {
     alert('duh')
        return x.equals(y)
    } else if (x.kind === "matrix") { //(x instanceof Pacioli.Matrix && y instanceof Pacioli.Matrix) {
        return !Pacioli.findNonZero(x, y, function (a, b) {return a !== b}, false) // === null
        //return x.equals(y)
    } else if (x instanceof Array && y instanceof Array) { 
        var n = x.length
        if (y.length !== n) {
            return false
        }
        for (var i = 0; i < n; i++) {
            if (!glbl_base_equal(x[i], y[i])) {
                return false
            }
        }
        return true
    } else {
        return false
    }
}

Pacioli.b_glbl_base_equal = function (x,y) {

    if (x instanceof Pacioli.Box || y instanceof Pacioli.Box) {
        if (x instanceof Pacioli.Box && y instanceof Pacioli.Box) {
            if (!x.type.equals(y.type)) {
                throw 'Type ' + x.type.param.toText() + ' not compatible for equality with type ' + y.type.param.toText();
            }
            return !Pacioli.findNonZero(x.value, y.value, function (a, b) {return a !== b}, false) // === null
        } else {
            return false;
        }
    }

    if (x.kind !== y.kind) return false

    if (x === y) {
        return true
    } else if (x.kind === "coordinates") { //(x instanceof Pacioli.Coordinates && y instanceof Pacioli.Coordinates) {
     alert('duh')
        return x.equals(y)
    } else if (x.kind === "matrix") { //(x instanceof Pacioli.Matrix && y instanceof Pacioli.Matrix) {
        return !Pacioli.findNonZero(x.value, y.value, function (a, b) {return a !== b}, false) // === null
        //return x.equals(y)
    } else if (x instanceof Array && y instanceof Array) { 
        var n = x.length
        if (y.length !== n) {
            return false
        }
        for (var i = 0; i < n; i++) {
            if (!b_glbl_base_equal(x[i], y[i])) {
                return false
            }
        }
        return true
    } else {
        return false
    }
}

Pacioli.glbl_base_print = function (x) {
    return Pacioli.printValue(x)
}

Pacioli.glbl_base_is_zero = function (x) {
    var values = Pacioli.getCOONumbers(x)[2]
    for (var i = 0; i < values.length; i++) {
        if (values[i] != 0) return false;
    }
    return true;
}

Pacioli.compute_glbl_base__ = function () {
    return Pacioli.createCoordinates([], []);
}

Pacioli.compute_b_glbl_base__ = function () {
    return Pacioli.compute_glbl_base__();
}

Pacioli.glbl_base_unit_factor = function (x) { 
    return Pacioli.oneNumbers(1, 1)
}

Pacioli.b_glbl_base_unit_factor = function (x) { 
    return new Pacioli.Box(x.type.factor(), Pacioli.oneNumbers(1, 1));
}

Pacioli.glbl_base_magnitude = function (x) {
    return x
}

Pacioli.b_glbl_base_magnitude = function (x) {
    return new Pacioli.Box(x.type.dimensionless(), x.value);
}

Pacioli.glbl_base_row = function (x, coord) {
    var row = coord.position
    var matrix = Pacioli.zeroNumbers(1, x.nrColumns)
    var numbers = Pacioli.getCOONumbers(x)
    var rows = numbers[0]
    var columns = numbers[1]
    var values = numbers[2]
    for (var i = 0; i < rows.length; i++) {
            if (rows[i] === row) {
                Pacioli.set(matrix, 0, columns[i], values[i])
            }
    }
    return matrix
}

Pacioli.glbl_base_row_unit = function (x) {
    return Pacioli.oneNumbers(x.nrRows, 1)
}

Pacioli.glbl_base_row_domain = function (matrix) {
    var n = matrix.nrRows;
    var domain = new Array(n);
    for (var i = 0; i < n; i++) {
        domain[i] = {kind: "coordinates", position: i, size: n}
    }
    return Pacioli.tagKind(domain, "list");
}

Pacioli.glbl_base_column = function (x, coord) {
    // todo: reconsider this and the glbl_base_row implementation 
    return Pacioli.glbl_base_transpose(Pacioli.glbl_base_row(Pacioli.glbl_base_transpose(x), coord))
}

Pacioli.glbl_base_column_domain = function (matrix) {
    var n = matrix.nrColumns;
    var domain = new Array(n);
    for (var i = 0; i < n; i++) {
        domain[i] = {kind: "coordinates", position: i, size: n}
    }
    return Pacioli.tagKind(domain, "list");
}

Pacioli.glbl_base_column_unit = function (x) {
    return Pacioli.oneNumbers(x.nrColumns, 1)
}

Pacioli.glbl_base_get_num = function (matrix, i, j) {
    return Pacioli.get(matrix, i.position, j.position)
}

Pacioli.glbl_base_get = function (matrix, i, j) {
    return Pacioli.get(matrix, i.position, j.position)
}

Pacioli.b_glbl_base_get = function (matrix, i, j) {
    return new Pacioli.Box(matrix.type.factor(), Pacioli.glbl_base_get(matrix.value, i, j));
}

Pacioli.glbl_base_make_matrix = function (tuples) {
    var first = tuples[0]
    var numbers = Pacioli.zeroNumbers(first[0].size, first[1].size)
    for (var i = 0; i < tuples.length; i++) {
        var tup = tuples[i];
        Pacioli.set(numbers, tup[0].position, tup[1].position, Pacioli.getNumber(tup[2], 0, 0))
    }
    return numbers;
}

Pacioli.b_glbl_base_make_matrix = function (tuples) {

    var first = tuples[0];

    var shape = first[0].coords.shape().per(first[1].coords.shape()).scale(first[2].type.param.factor());
    //shape.multiplier = first[2].type.param.multiplier;

    var numbers = Pacioli.zeroNumbers(first[0].size, first[1].size)
    for (var i = 0; i < tuples.length; i++) {
        var tup = tuples[i];
        Pacioli.set(numbers, tup[0].position, tup[1].position, Pacioli.getNumber(tup[2].value, 0, 0))
    }
    
    return new Pacioli.Box(new Pacioli.Type("matrix", shape), numbers);
}

Pacioli.glbl_base_support = function (x) {
    return Pacioli.unaryNumbers(x, function (val) { return 1})
}

Pacioli.glbl_base_positive_support = function (x) {
    return Pacioli.unaryNumbers(x, function (val) { return 0 < val ? 1 : 0})
}

Pacioli.glbl_base_negative_support = function (x) {
    return Pacioli.unaryNumbers(x, function (val) { return val < 0 ? 1 : 0})
}

Pacioli.glbl_base_top = function (cnt, x) {
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

Pacioli.glbl_base_bottom = function (cnt, x) {
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

Pacioli.glbl_base_left_identity = function (x) {
    var numbers = Pacioli.zeroNumbers(x.nrRows, x.nrRows)
    for (var i = 0; i < x.nrRows; i++) {
        Pacioli.set(numbers, i, i, 1);
    }
    return numbers
}

Pacioli.b_glbl_base_left_identity = function (x) {
    return new Pacioli.Box(x.type.leftIdentity(), Pacioli.glbl_base_left_identity(x.value));
}

Pacioli.glbl_base_right_identity = function (x) {
    var numbers = Pacioli.zeroNumbers(x.nrColumns, x.nrColumns)
    for (var i = 0; i < x.nrColumns; i++) {
        Pacioli.set(numbers, i, i, 1);
    }
    return numbers
}

Pacioli.glbl_base_reciprocal = function (x) {
    return Pacioli.unaryNumbers(x, function (val) { return val == 0 ? 0 : 1 / val})
}

Pacioli.b_glbl_base_reciprocal = function (x) {
    return new Pacioli.Box(x.type.reciprocal(), Pacioli.glbl_base_reciprocal(x.value));
}

Pacioli.glbl_base_transpose = function (x) {
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

Pacioli.b_glbl_base_transpose = function (x) {
    return new Pacioli.Box(x.type.transpose(), Pacioli.glbl_base_transpose(x.value));
}

Pacioli.glbl_base_dim_inv = function (x) {
    return Pacioli.glbl_base_transpose(Pacioli.glbl_base_reciprocal(x));
}

Pacioli.glbl_base_dim_div = function (x, y) {
    return Pacioli.glbl_base_mmult(x, Pacioli.glbl_base_dim_inv(y));
}

Pacioli.glbl_base_mmult = function (x, y) {
    return Pacioli.tagNumbers(numeric.ccsDot(Pacioli.getCCSNumbers(x), Pacioli.getCCSNumbers(y)), x.nrRows, y.nrColumns, 3);
}

Pacioli.b_glbl_base_mmult = function (x, y) {
    return new Pacioli.Box(x.type.dot(y.type), Pacioli.glbl_base_mmult(x.value, y.value));
}

Pacioli.glbl_base_multiply = function (x,y) {
    if (x.storage === 13) {
        return Pacioli.tagNumbers(numeric.ccsmul(Pacioli.getCCSNumbers(x), Pacioli.getCCSNumbers(y)), x.nrRows, y.nrColumns, 3);
    } else {
        return Pacioli.elementWiseNumbers(x, y, function(a, b) { return a*b});
    }
}

Pacioli.b_glbl_base_multiply = function (x,y) {
    return new Pacioli.Box(x.type.mult(y.type), Pacioli.glbl_base_multiply(x.value, y.value));
}

Pacioli.glbl_base_kronecker = function (x,y) {
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

Pacioli.glbl_base_divide = function (x,y) {
    return Pacioli.elementWiseNumbers(x, y, function(a, b) { return b !== 0 ? a/b : 0})
}

Pacioli.b_glbl_base_divide = function (x,y) {
    return new Pacioli.Box(x.type.div(y.type), Pacioli.glbl_base_divide(x.value, y.value));
}

Pacioli.glbl_base_gcd = function (x,y) {
    return Pacioli.elementWiseNumbers(x, y, function(a, b) { 
    if (a < 0) a = -a;
    if (b < 0) b = -b;
    if (b > a) {var temp = a; a = b; b = temp;}
    if (a == 0) return b;
    if (b == 0) return a;
    while (true) {
        a %= b;
        if (a == 0) return b;
        b %= a;
        if (b == 0) return a;
    }
    })
}

Pacioli.glbl_base_sum = function (x,y) {
    if (x.storage === 13) {
        return Pacioli.tagNumbers(numeric.ccsadd(Pacioli.getCCSNumbers(x), Pacioli.getCCSNumbers(y)), x.nrRows, y.nrColumns, 3);
    } else {
        return Pacioli.elementWiseNumbers(x, y, function (a, b) { return a+b});
    }
    //return Pacioli.elementWiseNumbers(x, y, function (a, b) { return a+b})
}

Pacioli.b_glbl_base_sum = function (x,y) {
    if (!x.type.equals(y.type)) {
        throw 'Type ' + x.type.param.toText() + ' not compatible for sum with type ' + y.type.param.toText();
    }
    return new Pacioli.Box(x.type, Pacioli.glbl_base_sum(x.value, y.value));
}

Pacioli.glbl_base_minus = function (x,y) {
    //return Pacioli.elementWiseNumbers(x, y, function(a, b) { return a-b})
    if (x.storage === 13) {
        return Pacioli.tagNumbers(numeric.ccssub(Pacioli.getCCSNumbers(x), Pacioli.getCCSNumbers(y)), x.nrRows, y.nrColumns, 3);
    } else {
        return Pacioli.elementWiseNumbers(x, y, function(a, b) { return a-b});
    }
}

Pacioli.b_glbl_base_minus = function (x,y) {
    if (!x.type.equals(y.type)) {
        throw 'Type ' + x.type.param.toText() + ' not compatible for minus with type ' + y.type.param.toText();
    }
    return new Pacioli.Box(x.type, Pacioli.glbl_base_minus(x.value, y.value));
}

Pacioli.glbl_base_negative = function (x) { 
    return Pacioli.unaryNumbers(x, function (val) { return -val})
}

Pacioli.b_glbl_base_negative = function (x) {
    return new Pacioli.Box(x.type, Pacioli.glbl_base_negative(x.value));
}

Pacioli.glbl_base_scale = function (x,y) { 
    var factor = Pacioli.getNumber(x, 0, 0)
    return Pacioli.unaryNumbers(y, function (val) { return factor * val})
}

Pacioli.b_glbl_base_scale = function (x,y) { 
    return new Pacioli.Box(y.type.scale(x.type), Pacioli.glbl_base_scale(x.value, y.value));
}

Pacioli.glbl_base_scale_down = function (x,y) {
    return Pacioli.glbl_base_scale(Pacioli.glbl_base_reciprocal(y), x);
}

Pacioli.b_glbl_base_scale_down = function (x,y) {
    return Pacioli.b_glbl_base_scale(Pacioli.b_glbl_base_reciprocal(y), x);
}

Pacioli.glbl_base_total = function (x) { 
    var values = Pacioli.getCOONumbers(x)[2]
    var total = 0
    for (var i = 0; i < values.length; i++) {
        total += values[i]
    }
    var result = Pacioli.zeroNumbers(1, 1)
    Pacioli.set(result, 0, 0, total)
    return result
}

Pacioli.glbl_base_mod = function (x, y) {
    return Pacioli.tagNumbers(numeric.mod(Pacioli.getFullNumbers(x), Pacioli.getFullNumbers(y)), x.nrRows, x.nrColumns, 0);
}

Pacioli.b_glbl_base_mod = function (x, y) {
    return new Pacioli.Box(x.type, Pacioli.glbl_base_mod(x.value, y.value));
}

Pacioli.glbl_base_max = function (x, y) {
    return Pacioli.tagNumbers(numeric.max(Pacioli.getFullNumbers(x), Pacioli.getFullNumbers(y)), x.nrRows, y.nrRows, 0)
}

Pacioli.b_glbl_base_max = function (x, y) {
    return new Pacioli.Box(x.type, Pacioli.glbl_base_max(x.value, y.value));
}

Pacioli.glbl_base_min = function (x, y) {
    return Pacioli.tagNumbers(numeric.min(Pacioli.getFullNumbers(x), Pacioli.getFullNumbers(y)), x.nrRows, y.nrRows, 0)
}

Pacioli.glbl_base_sin = function (x) {
    return Pacioli.tagNumbers(numeric.sin(Pacioli.getFullNumbers(x)), x.nrRows, x.nrColumns, 0);
}

Pacioli.b_glbl_base_sin = function (x) {
    return Pacioli.num(numeric.sin(Pacioli.getFullNumbers(x.value)));
}

Pacioli.glbl_base_cos = function (x) {
    return Pacioli.tagNumbers(numeric.cos(Pacioli.getFullNumbers(x)), x.nrRows, x.nrColumns, 0);
}

Pacioli.b_glbl_base_cos = function (x) {
    return Pacioli.num(numeric.cos(Pacioli.getFullNumbers(x.value)));
}

Pacioli.glbl_base_tan = function (x) {
    return Pacioli.tagNumbers(numeric.tan(Pacioli.getFullNumbers(x)), x.nrRows, x.nrColumns, 0);
}

Pacioli.glbl_base_asin = function (x) {
    return Pacioli.tagNumbers(numeric.asin(Pacioli.getFullNumbers(x)), x.nrRows, x.nrColumns, 0);
}

Pacioli.glbl_base_acos = function (x) {
    return Pacioli.tagNumbers(numeric.acos(Pacioli.getFullNumbers(x)), x.nrRows, x.nrColumns, 0);
}

Pacioli.glbl_base_atan = function (x) {
    return Pacioli.tagNumbers(numeric.atan(Pacioli.getFullNumbers(x)), x.nrRows, x.nrColumns, 0);
}

Pacioli.glbl_base_atan2 = function (x, y) {
    return Pacioli.tagNumbers(numeric.atan2(Pacioli.getFullNumbers(x), Pacioli.getFullNumbers(y)), x.nrRows, x.nrColumns, 0);
}

Pacioli.glbl_base_abs = function (x) { 
    return Pacioli.unaryNumbers(x, function (val) { return Math.abs(val)})
}

Pacioli.b_glbl_base_abs = function (x) {
    return new Pacioli.Box(x.type, Pacioli.glbl_base_abs(x.value));
}

Pacioli.glbl_base_power = function (x,y) {
    var n = Pacioli.getNumber(y, 0, 0)
    if (n === 0) {
        return Pacioli.glbl_base_left_identity(x)
    } else if (n === 1) {
        return x
    } else if (n < 0) {
        return Pacioli.glbl_base_power(Pacioli.glbl_standard_inverse(x), Pacioli.glbl_base_negative(y))
    } else { 
        var result = x
        for (var i = 1; i < n; i++) {
            result = Pacioli.glbl_base_mmult(result, x)
        }
        return result
    }
}

Pacioli.glbl_base_expt = function (x,y) {
    var n = Pacioli.getNumber(y, 0, 0)
    return Pacioli.tagNumbers(numeric.pow(Pacioli.getFullNumbers(x), n), x.nrRows, x.nrColumns, 0);
}

Pacioli.glbl_base_log = function (x, y) {
    return Pacioli.glbl_base_divide(Pacioli.tagNumbers(numeric.log(Pacioli.getFullNumbers(x)), x.nrRows, x.nrColumns, 0),
                                Pacioli.tagNumbers(numeric.log(Pacioli.getFullNumbers(y)), x.nrRows, x.nrColumns, 0));
}

Pacioli.glbl_base_exp = function (x) {
    return Pacioli.tagNumbers(numeric.exp(Pacioli.getFullNumbers(x)), x.nrRows, x.nrColumns, 0);
}

Pacioli.b_glbl_base_exp = function (x) {
    return new Pacioli.Box(x.type, Pacioli.glbl_base_exp(x.value));
}

Pacioli.glbl_base_ln = function (x) {
    return Pacioli.tagNumbers(numeric.log(Pacioli.getFullNumbers(x)), x.nrRows, x.nrColumns, 0);
}

Pacioli.b_glbl_base_ln = function (x) {
    return new Pacioli.Box(x.type, Pacioli.glbl_base_ln(x.value));
}

Pacioli.glbl_base_less = function (x,y) { 
    return !Pacioli.findNonZero(x, y, function (a, b) {return a >= b}, true) //=== null
}

Pacioli.b_glbl_base_less = function (x,y) { 
    if (!x.type.equals(y.type)) {
        throw 'Type ' + x.type.param.toText() + ' not compatible for less with type ' + y.type.param.toText();
    }
    return !Pacioli.findNonZero(x.value, y.value, function (a, b) {return a >= b}, true) //=== null
}

Pacioli.glbl_base_less_eq = function (x,y) { 
    return !Pacioli.findNonZero(x, y, function (a, b) {return a > b}, false) //=== null
}

Pacioli.glbl_base_greater = function (x,y) { 
    return !Pacioli.findNonZero(x, y, function (a, b) {return a <= b}, true) //=== null
}

Pacioli.glbl_base_greater_eq = function (x,y) { 
    return !Pacioli.findNonZero(x, y, function (a, b) {return a < b}, false) //=== null
}

Pacioli.glbl_base_sqrt = function (x) { 
    return Pacioli.unaryNumbers(x, function (val) { return Math.sqrt(val)})
}

Pacioli.b_glbl_base_sqrt = function (x) { 
    return new Pacioli.Box(x.type.expt(0.5), Pacioli.glbl_base_sqrt(x.value));
}

Pacioli.glbl_base_solve = function (x, ignored) {
    return Pacioli.tagNumbers(numeric.inv(Pacioli.getFullNumbers(x)), x.nrColumns, x.nrRows, 0);
}

Pacioli.b_glbl_base_solve = function (x, ignored) {
    var type = x.type.column().dim_inv().per(ignored.type.column().dim_inv()).scale(x.type.factor()).scale(ignored.type.factor().reciprocal());
    return new Pacioli.Box(type, Pacioli.glbl_base_solve(x.value, ignored));
}

Pacioli.glbl_base_random = function () { 
    return Pacioli.tagNumbers([[Math.random()]], 1, 1, 0);
}

Pacioli.glbl_base_ranking = function (x) { 
    var result = Pacioli.zeroNumbers(x.nrRows, x.nrColumns)
    var numbers = Pacioli.getCOONumbers(x)
    var rows = numbers[0]
    var columns = numbers[1]
    var values = numbers[2]

    var tmp = [];
    for (var i = 0; i < rows.length; i++) {
        tmp[i] = [rows[i], columns[i], values[i]]
    }
    tmp.sort(function (a, b) {
       if (a[2] > b[2])
          return 1;
       if (a[2] < b[2])
          return -1;
       return 0;
    })
    for (var i = 0; i < tmp.length; i++) {
        Pacioli.set(result, tmp[i][0], tmp[i][1], i+1)
    }
    return result
}

Pacioli.glbl_base_mapnz = function (fun, x) { 
    var result = Pacioli.zeroNumbers(x.nrRows, x.nrColumns)
    var numbers = Pacioli.getCOONumbers(x)
    var rows = numbers[0]
    var columns = numbers[1]
    var values = numbers[2]

    for (var i = 0; i < rows.length; i++) {
        Pacioli.set(result, rows[i], columns[i], Pacioli.getNumber(fun.call(this, Pacioli.tagNumbers([[values[i]]], 1, 1, 0)), 0, 0))
    }
    return result
}

Pacioli.glbl_base_zip = function (x,y) {
    var list = new Array(Math.min(x.length, y.length));
    for (var i = 0; i < list.length; i++) {
        list[i] = [x[i], y[i]];
    }
    return Pacioli.tagKind(list, "list");
}

Pacioli.glbl_base_add_mut = function (list,item) {
    list.push(item);
    return list;
}

Pacioli.glbl_base_append = function (x,y) {
    return Pacioli.tagKind(x.concat(y), "list")
}

Pacioli.glbl_base_reverse = function (x) {
    return Pacioli.tagKind(x.slice(0).reverse(), "list");
}

Pacioli.glbl_base_tail = function (x) {
    var array = new Array(x.length-1);
    for (var i = 0; i < array.length; i++) {
        array[i] = x[i+1];
    }
    return Pacioli.tagKind(array, "list");
}

Pacioli.glbl_base_singleton_list = function (x) {
    return Pacioli.tagKind([x], "list");
}

Pacioli.glbl_base_nth = function (x,y) {
    return y[Pacioli.getNumber(x, 0, 0)];
}

Pacioli.b_glbl_base_nth = function (x,y) {
    return y[Pacioli.getNumber(x.value, 0, 0)];
}

Pacioli.glbl_base_naturals = function (num) {
    var n = Pacioli.getNumber(num, 0, 0)
    var list = new Array(n);
    for (var i = 0; i < n; i++) {
        list[i] = Pacioli.initialNumbers(1, 1, [[0, 0, i]]);
    }
    return Pacioli.tagKind(list, "list");
}

Pacioli.b_glbl_base_naturals = function (num) {
    var n = Pacioli.getNumber(num.value, 0, 0)
    var list = new Array(n);
    for (var i = 0; i < n; i++) {
        list[i] = Pacioli.num(i);
    }
    return Pacioli.tagKind(list, "list");
}

Pacioli.glbl_base_loop_list = function (init, fun, list) {
    var accu = init;
    for (var i = 0; i < list.length; i++) {
        accu = Pacioli.glbl_base_apply(fun, [accu, list[i]]);
    }
    return accu;
}

Pacioli.glbl_base_list_size = function (x) {
    return Pacioli.initialNumbers(1, 1, [[0, 0, x.length]]);
}

Pacioli.b_glbl_base_list_size = function (x) {
    return Pacioli.num(x.length);
}

Pacioli.glbl_base_head = function (x) {
    return x[0];
}

Pacioli.glbl_base_fold_list = function (fun, list) {
    if (list.length == 0) {
        throw new Error("Cannot fold an empty list")
    }
    var accu = list[0];
    for (var i = 1; i < list.length; i++) {
        accu = Pacioli.glbl_base_apply(fun, [accu, list[i]]);
    }
    return accu;
}

Pacioli.glbl_base_sort_list = function (list, fun) {
    //return list;
    return Pacioli.tagKind(list.slice(0).sort(function (a, b) {
            if (Pacioli.glbl_base_apply(fun, [a, b]))
                return 1;
            if (Pacioli.glbl_base_apply(fun, [b, a]))
                return -1;
            return 0;
        }),
        "list");
}

Pacioli.glbl_base_cons = function (item,list) {
    return Pacioli.glbl_base_append(Pacioli.glbl_base_singleton_list(item), list);
}

Pacioli.glbl_base_empty_list = function () {
   return Pacioli.tagKind([], "list");
}


Pacioli.glbl_shells_csg_polygon = function (vectors) {
    var vertices = vectors.map(function (x) {
        var v = Pacioli.getFullNumbers(x)
        return new CSG.Vertex(v, [0,1,0])
    })
    console.log(vertices)
    return Pacioli.tagKind(new CSG.Polygon(vertices), "csg");
}

Pacioli.glbl_shells_csg_mesh = function (polygons) {
    console.log(polygons)
   return Pacioli.tagKind(CSG.fromPolygons(polygons), "csg");
}

Pacioli.glbl_shells_csg_sphere = function (radius, slices, stacks) {
   return Pacioli.tagKind(CSG.sphere({ radius: Pacioli.getNumber(radius, 0, 0) , slices: Pacioli.getNumber(slices, 0, 0), stacks: Pacioli.getNumber(stacks, 0, 0)}), "csg");
}

Pacioli.glbl_shells_csg_cube = function (radius) { 
   return Pacioli.tagKind(CSG.cube({ radius: Pacioli.getNumber(radius, 0, 0) }), "csg");
}

Pacioli.glbl_shells_csg_subtract = function (x, y) {
   return Pacioli.tagKind(x.subtract(y), "csg");
}
