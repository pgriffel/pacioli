/* Runtime Support for the Pacioli language
 *
 * Copyright (c) 2023 Paul Griffioen
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

import {
  acos,
  asin,
  atan,
  atan2,
  ccsadd,
  ccsDot,
  ccsmul,
  ccssub,
  cos,
  div,
  exp,
  inv,
  log,
  max,
  min,
  mod,
  pow,
  sin,
  tan,
} from "numeric";
import { UOM } from "uom-ts";
import {
  createCoordinates,
  initialNumbers,
  oneNumbers,
  printValue,
  zeroNumbers,
} from "./api";
import {
  elementWiseNumbers,
  findNonZero,
  get,
  getCCSNumbers,
  getCOONumbers,
  getFullNumbers,
  getNumber,
  set,
  tagNumbers,
  unaryNumbers,
} from "./values/numbers";
import { PacioliFunction } from "./values/function";
import { PacioliValue, tagKind } from "./value";
import { nothing } from "./values/void";
import { Matrix } from "./values/matrix";

// -----------------------------------------------------------------------------
// 1. Primitive Units Unit Prefixes
// -----------------------------------------------------------------------------

export const ONE = UOM.ONE;
// export const RADIAN = si.getUnit('radian') // unit('radian')      // From primitive module 'Matrix'
// export const PERCENT = si.getUnit('percent') // unit('percent')    // From primitive module 'Standard'

export const prefix = {
  yotta: { symbol: "Y", factor: Math.pow(10, 24) },
  zetta: { symbol: "Z", factor: Math.pow(10, 21) },
  exa: { symbol: "E", factor: Math.pow(10, 18) },
  peta: { symbol: "P", factor: Math.pow(10, 15) },
  tera: { symbol: "T", factor: Math.pow(10, 12) },
  giga: { symbol: "G", factor: Math.pow(10, 9) },
  mega: { symbol: "M", factor: Math.pow(10, 6) },
  kilo: { symbol: "k", factor: Math.pow(10, 3) },
  hecto: { symbol: "h", factor: Math.pow(10, 2) },
  deca: { symbol: "da", factor: Math.pow(10, 1) },
  deci: { symbol: "d", factor: Math.pow(10, -1) },
  centi: { symbol: "c", factor: Math.pow(10, -2) },
  milli: { symbol: "m", factor: Math.pow(10, -3) },
  micro: { symbol: "\xB5", factor: Math.pow(10, -6) },
  nano: { symbol: "n", factor: Math.pow(10, -9) },
  pico: { symbol: "p", factor: Math.pow(10, -12) },
  femto: { symbol: "f", factor: Math.pow(10, -15) },
  atto: { symbol: "a", factor: Math.pow(10, -18) },
  zepto: { symbol: "z", factor: Math.pow(10, -21) },
  yocto: { symbol: "y", factor: Math.pow(10, -24) },
};

// -----------------------------------------------------------------------------
// 2. Pacioli Primitives
//
// Each primitive function is named '<module>_<name>'.
// -----------------------------------------------------------------------------

export const lib_base_base_tuple = function (...args: PacioliValue[]) {
  return tagKind(Array.prototype.slice.call(args), "tuple");
};

export const lib_base_base_apply = function (fun: any, arg: PacioliValue[]) {
  // TODO: check first arg of apply. what is 'this'? Does it matter?
  return fun.apply(fun, arg);
};

export function lib_base_base__new_ref(value: any) {
  return [value];
}

export function lib_base_base__empty_ref() {
  return new Array(1);
}

export function lib_base_base__ref_set(ref: any[], value: any) {
  ref[0] = value;
  return ref;
}

export function lib_base_base__ref_get(ref: any[]) {
  return ref[0];
}

export function lib_base_base_not(boole: boolean) {
  return !boole;
}

export function lib_base_system__skip() {
  return nothing;
}

export function lib_base_base__while(test: any, body: any) {
  while (test()) {
    body();
  }
  return nothing;
}

export function lib_base_base__catch_result(code: any, ref: any[]) {
  if (false) {
    // dev switch to debug exceptions in a catch block
    code();
  } else {
    try {
      code();
    } catch (err) {
      if (err == "jump") {
        return ref[0];
      } else {
        throw err;
      }
    }
  }
}

export function lib_base_base__throw_result(ref: any[], value: any) {
  ref[0] = value;
  throw "jump";
}

export function lib_base_base__seq(_x: any, y: any) {
  return y;
}

export function lib_base_base_not_equal(x: any, y: any) {
  return !lib_base_base_equal(x, y);
}

export function lib_base_base_equal(x: any, y: any) {
  if (x.kind !== y.kind) return false;

  if (x === y) {
    return true;
  } else if (x.kind === "coordinates") {
    //(x instanceof Pacioli.Coordinates && y instanceof Pacioli.Coordinates) {
    // alert("duh");
    //return x.equals(y);
    return x.position === y.position;
  } else if (x.kind === "matrix") {
    //(x instanceof Pacioli.Matrix && y instanceof Pacioli.Matrix) {
    return !findNonZero(
      x,
      y,
      function (a: number, b: number) {
        return a !== b;
      },
      false
    ); // === null
    //return x.equals(y)
  } else if (x instanceof Array && y instanceof Array) {
    var n = x.length;
    if (y.length !== n) {
      return false;
    }
    for (var i = 0; i < n; i++) {
      if (!lib_base_base_equal(x[i], y[i])) {
        return false;
      }
    }
    return true;
  } else {
    return false;
  }
}

export function lib_base_io_print(x: any) {
  printValue(x);
  return nothing;
}

export function lib_base_matrix_is_zero(x: any) {
  var values = getCOONumbers(x)[2];
  for (var i = 0; i < values.length; i++) {
    if (values[i] != 0) return false;
  }
  return true;
}

export function compute_lib_base_matrix__() {
  return createCoordinates([]);
}

export function lib_base_matrix_unit_factor(_x: any) {
  return oneNumbers(1, 1);
}

export function lib_base_matrix_magnitude(x: any) {
  return x;
}

export function lib_base_matrix_row(x: any, coord: any) {
  var row = coord.position;
  var matrix = zeroNumbers(1, x.nrColumns);
  var numbers = getCOONumbers(x);
  var rows = numbers[0];
  var columns = numbers[1];
  var values = numbers[2];
  for (var i = 0; i < rows.length; i++) {
    if (rows[i] === row) {
      set(matrix, 0, columns[i], values[i]);
    }
  }
  return matrix;
}

export function lib_base_matrix_row_unit(x: any) {
  return oneNumbers(x.nrRows, 1);
}

export function lib_base_matrix_row_domain(matrix: any) {
  var n = matrix.nrRows;
  var domain = new Array(n);
  for (var i = 0; i < n; i++) {
    domain[i] = { kind: "coordinates", position: i, size: n };
  }
  return tagKind(domain, "list");
}

export function lib_base_matrix_column(x: any, coord: any) {
  // todo: reconsider this and the lib_base_matrix_row implementation
  return lib_base_matrix_transpose(
    lib_base_matrix_row(lib_base_matrix_transpose(x), coord)
  );
}

export function lib_base_matrix_column_domain(matrix: any) {
  var n = matrix.nrColumns;
  var domain = new Array(n);
  for (var i = 0; i < n; i++) {
    domain[i] = { kind: "coordinates", position: i, size: n };
  }
  return tagKind(domain, "list");
}

export function lib_base_matrix_column_unit(x: any) {
  return oneNumbers(x.nrColumns, 1);
}

export function lib_base_matrix_get_num(matrix: any, i: any, j: any) {
  return get(matrix, i.position, j.position);
}

export function lib_base_matrix_get(matrix: any, i: any, j: any) {
  return get(matrix, i.position, j.position);
}

export function lib_base_matrix_make_matrix(tuples: any[]) {
  var first = tuples[0];
  var numbers = zeroNumbers(first[0].size, first[1].size);
  for (var i = 0; i < tuples.length; i++) {
    var tup = tuples[i];
    set(numbers, tup[0].position, tup[1].position, getNumber(tup[2], 0, 0));
  }
  return numbers;
}

export function lib_base_matrix_support(x: any) {
  return unaryNumbers(x, function (_val: number) {
    return 1;
  });
}

export function lib_base_matrix_positive_support(x: any) {
  return unaryNumbers(x, function (val: number) {
    return 0 < val ? 1 : 0;
  });
}

export function lib_base_matrix_negative_support(x: any) {
  return unaryNumbers(x, function (val: number) {
    return val < 0 ? 1 : 0;
  });
}

export function lib_base_matrix_top(cnt: any, x: any) {
  var n = getNumber(cnt, 0, 0);

  if (n === 0) {
    return zeroNumbers(x.nrRows, x.nrColumns);
  }

  var matrix = zeroNumbers(x.nrRows, x.nrColumns);

  var top = [];
  var count = 0;

  var numbers = getCOONumbers(x);
  var rows = numbers[0];
  var columns = numbers[1];
  var values = numbers[2];
  for (var l = 0; l < rows.length; l++) {
    var i = rows[l];
    var j = columns[l];
    var val = values[l]; //Pacioli.getNumber(x, i, j)
    if (count < n) {
      top[count] = [i, j, val];
      count += 1;
    } else {
      var worst = 0;
      for (var k = 1; k < count; k++) {
        if (top[k][2] < top[worst][2]) {
          worst = k;
        }
      }
      if (val > top[worst][2]) {
        top[worst] = [i, j, val];
      }
    }
  }
  for (var k = 0; k < count; k++) {
    set(matrix, top[k][0], top[k][1], top[k][2]);
  }

  return matrix;
}

export function lib_base_matrix_bottom(cnt: any, x: any) {
  var n = getNumber(cnt, 0, 0);

  if (n === 0) {
    return zeroNumbers(x.nrRows, x.nrColumns);
  }

  var matrix = zeroNumbers(x.nrRows, x.nrColumns);

  var bottom = [];
  var count = 0;

  var numbers = getCOONumbers(x);
  var rows = numbers[0];
  var columns = numbers[1];
  var values = numbers[2];
  for (var l = 0; l < rows.length; l++) {
    var i = rows[l];
    var j = columns[l];
    var val = values[l];
    if (count < n) {
      bottom[count] = [i, j, val];
      count += 1;
    } else {
      var best = 0;
      for (var k = 1; k < count; k++) {
        if (bottom[k][2] > bottom[best][2]) {
          best = k;
        }
      }
      if (val < bottom[best][2]) {
        bottom[best] = [i, j, val];
      }
    }
  }
  for (var k = 0; k < count; k++) {
    set(matrix, bottom[k][0], bottom[k][1], bottom[k][2]);
  }

  return matrix;
}

export function lib_base_matrix_left_identity(x: any) {
  var numbers = zeroNumbers(x.nrRows, x.nrRows);
  for (var i = 0; i < x.nrRows; i++) {
    set(numbers, i, i, 1);
  }
  return numbers;
}

export function lib_base_matrix_right_identity(x: any) {
  var numbers = zeroNumbers(x.nrColumns, x.nrColumns);
  for (var i = 0; i < x.nrColumns; i++) {
    set(numbers, i, i, 1);
  }
  return numbers;
}

export function lib_base_matrix_reciprocal(x: any) {
  return unaryNumbers(x, function (val: number) {
    return val == 0 ? 0 : 1 / val;
  });
}

export function lib_base_matrix_transpose(x: any) {
  var result = zeroNumbers(x.nrColumns, x.nrRows);
  var numbers = getCOONumbers(x);
  var rows = numbers[0];
  var columns = numbers[1];
  var values = numbers[2];
  for (var i = 0; i < rows.length; i++) {
    set(result, columns[i], rows[i], values[i]);
  }
  return result;
}

export function lib_base_matrix_dim_inv(x: any) {
  return lib_base_matrix_transpose(lib_base_matrix_reciprocal(x));
}

export function lib_base_matrix_dim_div(x: any, y: any) {
  return lib_base_matrix_mmult(x, lib_base_matrix_dim_inv(y));
}

export function lib_base_matrix_mmult(x: any, y: any) {
  return tagNumbers(
    ccsDot(getCCSNumbers(x), getCCSNumbers(y)),
    x.nrRows,
    y.nrColumns,
    3
  );
}

export function lib_base_matrix_multiply(x: any, y: any) {
  if (x.storage === 13) {
    return tagNumbers(
      ccsmul(getCCSNumbers(x), getCCSNumbers(y)),
      x.nrRows,
      y.nrColumns,
      3
    );
  } else {
    return elementWiseNumbers(x, y, function (a: number, b: number) {
      return a * b;
    });
  }
}

// Pacioli.lib_base_matrix_kronecker = function (x,y) {
//     alert("is this used?")
//     var xm = x.length
//     var ym = y.length
//     var xn = x[0].length
//     var yn = y[0].length;
//     var m = xm * ym;
//     var n = xn * yn;
//     var matrix = new Array(m);
//     for (var xi = 0; xi < xm; xi++) {
//         for (var yi = 0; yi < ym; yi++) {
//             var row = new Array(n);
//             for (var xj = 0; xj < xn; xj++) {
//                 for (var yj = 0; yj < yn; yj++) {
//                     row[xj*yn + yj] = x[xi][xj] * y[yi][yj];
//                 }
//             }
//             matrix[xi*ym + yi] = row;
//         }
//     }
//     return matrix;
// }

export function lib_base_matrix_divide(x: any, y: any) {
  return elementWiseNumbers(x, y, function (a: number, b: number) {
    return b !== 0 ? a / b : 0;
  });
}

export function lib_base_matrix_gcd(x: any, y: any) {
  return elementWiseNumbers(x, y, function (a: number, b: number) {
    if (a < 0) a = -a;
    if (b < 0) b = -b;
    if (b > a) {
      var temp = a;
      a = b;
      b = temp;
    }
    if (a == 0) return b;
    if (b == 0) return a;
    while (true) {
      a %= b;
      if (a == 0) return b;
      b %= a;
      if (b == 0) return a;
    }
  });
}

export function lib_base_matrix_sum(x: any, y: any) {
  if (x.storage === 13) {
    return tagNumbers(
      ccsadd(getCCSNumbers(x), getCCSNumbers(y)),
      x.nrRows,
      y.nrColumns,
      3
    );
  } else {
    return elementWiseNumbers(x, y, function (a: number, b: number) {
      return a + b;
    });
  }
}

export function lib_base_matrix_minus(x: any, y: any) {
  //return Pacioli.elementWiseNumbers(x, y, function(a, b) { return a-b})
  if (x.storage === 13) {
    return tagNumbers(
      ccssub(getCCSNumbers(x), getCCSNumbers(y)),
      x.nrRows,
      y.nrColumns,
      3
    );
  } else {
    return elementWiseNumbers(x, y, function (a: number, b: number) {
      return a - b;
    });
  }
}

export function lib_base_matrix_negative(x: any) {
  return unaryNumbers(x, function (val: number) {
    return -val;
  });
}

export function lib_base_matrix_scale(x: any, y: any) {
  var factor = getNumber(x, 0, 0);
  return unaryNumbers(y, function (val: any) {
    return factor * val;
  });
}

export function lib_base_matrix_rscale(x: any, y: any) {
  var factor = getNumber(y, 0, 0);
  return unaryNumbers(x, function (val: any) {
    return factor * val;
  });
}

export function lib_base_matrix_scale_down(x: any, y: any) {
  return lib_base_matrix_scale(lib_base_matrix_reciprocal(y), x);
}

export function lib_base_matrix_total(x: any) {
  var values = getCOONumbers(x)[2];
  var total = 0;
  for (var i = 0; i < values.length; i++) {
    total += values[i];
  }
  var result = zeroNumbers(1, 1);
  set(result, 0, 0, total);
  return result;
}

export function lib_base_matrix_mod(x: any, y: any) {
  return tagNumbers(
    mod(getFullNumbers(x), getFullNumbers(y)),
    x.nrRows,
    x.nrColumns,
    0
  );
}

export function lib_base_matrix_div(x: any, y: any) {
  return tagNumbers(
    div(getFullNumbers(x), getFullNumbers(y)),
    x.nrRows,
    x.nrColumns,
    0
  );
}

export function lib_base_matrix_max(x: any, y: any) {
  return tagNumbers(
    max(getFullNumbers(x), getFullNumbers(y)),
    x.nrRows,
    y.nrRows,
    0
  );
}

export function lib_base_matrix_min(x: any, y: any) {
  return tagNumbers(
    min(getFullNumbers(x), getFullNumbers(y)),
    x.nrRows,
    y.nrRows,
    0
  );
}

export function lib_base_matrix_sin(x: any) {
  return tagNumbers(sin(getFullNumbers(x)), x.nrRows, x.nrColumns, 0);
}

export function lib_base_matrix_cos(x: any) {
  return tagNumbers(cos(getFullNumbers(x)), x.nrRows, x.nrColumns, 0);
}

export function lib_base_matrix_tan(x: any) {
  return tagNumbers(tan(getFullNumbers(x)), x.nrRows, x.nrColumns, 0);
}

export function lib_base_system__asin(x: any) {
  return tagNumbers(asin(getFullNumbers(x)), x.nrRows, x.nrColumns, 0);
}

export function lib_base_system__acos(x: any) {
  return tagNumbers(acos(getFullNumbers(x)), x.nrRows, x.nrColumns, 0);
}

export function lib_base_system__atan(x: any) {
  return tagNumbers(atan(getFullNumbers(x)), x.nrRows, x.nrColumns, 0);
}

export function lib_base_system__atan2(x: any, y: any) {
  return tagNumbers(
    atan2(getFullNumbers(x), getFullNumbers(y)),
    x.nrRows,
    x.nrColumns,
    0
  );
}

export function lib_base_matrix_abs(x: any) {
  return unaryNumbers(x, function (val: number) {
    return Math.abs(val);
  });
}

export function lib_base_matrix_mexpt(x: any, y: any): any {
  var n = getNumber(y, 0, 0);
  if (n === 0) {
    return lib_base_matrix_left_identity(x);
  } else if (n === 1) {
    return x;
  } else if (n < 0) {
    return lib_base_matrix_mexpt(
      lib_base_matrix_solve(x, lib_base_matrix_left_identity(x)),
      lib_base_matrix_negative(y)
    );
  } else {
    var result = x;
    for (var i = 1; i < n; i++) {
      result = lib_base_matrix_mmult(result, x);
    }
    return result;
  }
}

export function lib_base_matrix_expt(x: any, y: any) {
  var n = getNumber(y, 0, 0);
  return tagNumbers(pow(getFullNumbers(x), n), x.nrRows, x.nrColumns, 0);
}

export function lib_base_matrix_log(x: any, y: any) {
  return lib_base_matrix_divide(
    tagNumbers(log(getFullNumbers(x)), x.nrRows, x.nrColumns, 0),
    tagNumbers(log(getFullNumbers(y)), x.nrRows, x.nrColumns, 0)
  );
}

export function lib_base_matrix_exp(x: any) {
  return tagNumbers(exp(getFullNumbers(x)), x.nrRows, x.nrColumns, 0);
}

export function lib_base_matrix_ln(x: any) {
  return tagNumbers(log(getFullNumbers(x)), x.nrRows, x.nrColumns, 0);
}

export function lib_base_matrix_less(x: any, y: any) {
  return !findNonZero(
    x,
    y,
    function (a: number, b: number) {
      return a >= b;
    },
    true
  ); //=== null
}

export function lib_base_matrix_less_eq(x: any, y: any) {
  return !findNonZero(
    x,
    y,
    function (a: number, b: number) {
      return a > b;
    },
    false
  ); //=== null
}

export function lib_base_matrix_greater(x: any, y: any) {
  return !findNonZero(
    x,
    y,
    function (a: number, b: number) {
      return a <= b;
    },
    true
  ); //=== null
}

export function lib_base_matrix_greater_eq(x: any, y: any) {
  return !findNonZero(
    x,
    y,
    function (a: number, b: number) {
      return a < b;
    },
    false
  ); //=== null
}

export function lib_base_matrix_sqrt(x: any) {
  return unaryNumbers(x, function (val: number) {
    return Math.sqrt(val);
  });
}

export function lib_base_matrix_solve(x: any, _ignored: any) {
  // https://en.wikipedia.org/wiki/Moore%E2%80%93Penrose_inverse
  // Maybe use svd to compute pseudo-inverse?
  return tagNumbers(inv(getFullNumbers(x)), x.nrColumns, x.nrRows, 0);
}

export function lib_base_matrix_random() {
  return tagNumbers([[Math.random()]], 1, 1, 0);
}

export function lib_base_matrix_ranking(x: any) {
  var result = zeroNumbers(x.nrRows, x.nrColumns);
  var numbers = getCOONumbers(x);
  var rows = numbers[0];
  var columns = numbers[1];
  var values = numbers[2];

  var tmp = [];
  for (var i = 0; i < rows.length; i++) {
    tmp[i] = [rows[i], columns[i], values[i]];
  }
  tmp.sort(function (a, b) {
    if (a[2] > b[2]) return 1;
    if (a[2] < b[2]) return -1;
    return 0;
  });
  for (var i = 0; i < tmp.length; i++) {
    set(result, tmp[i][0], tmp[i][1], i + 1);
  }
  return result;
}

export function lib_base_list_mapnz(fun: any, x: any) {
  var result = zeroNumbers(x.nrRows, x.nrColumns);
  var numbers = getCOONumbers(x);
  var rows = numbers[0];
  var columns = numbers[1];
  var values = numbers[2];

  for (var i = 0; i < rows.length; i++) {
    // Again the fun arg to fun.call. See apply
    set(
      result,
      rows[i],
      columns[i],
      getNumber(fun.call(fun, tagNumbers([[values[i]]], 1, 1, 0)), 0, 0)
    );
  }
  return result;
}

export function lib_base_list_zip(x: any, y: any) {
  var list = new Array(Math.min(x.length, y.length));
  for (var i = 0; i < list.length; i++) {
    list[i] = [x[i], y[i]];
  }
  return tagKind(list, "list");
}

export function lib_base_list_map_list(fun: any, items: any) {
  var list = new Array(items.length);
  for (var i = 0; i < items.length; i++) {
    list[i] = fun(items[i]);
  }
  return tagKind(list, "list");
}

export function lib_base_system__add_mut(list: any, item: PacioliValue) {
  (list as PacioliValue[]).push(item);
  return list;
}

export function lib_base_list_append(x: any, y: any) {
  return tagKind(x.concat(y), "list");
}

export function lib_base_list_reverse(x: any) {
  return tagKind(x.slice(0).reverse(), "list");
}

export function lib_base_list_tail(x: any) {
  var array = new Array(x.length - 1);
  for (var i = 0; i < array.length; i++) {
    array[i] = x[i + 1];
  }
  return tagKind(array, "list");
}

export function lib_base_list_singleton_list(x: any) {
  return tagKind([x], "list");
}

export function lib_base_list_nth(x: any, y: any) {
  return y[getNumber(x, 0, 0)];
}

export function lib_base_list_naturals(num: any) {
  var n = getNumber(num, 0, 0);
  var list = new Array(n);
  for (var i = 0; i < n; i++) {
    list[i] = initialNumbers(1, 1, [[0, 0, i]]);
  }
  return tagKind(list, "list");
}

export function lib_base_list_loop_list(
  init: PacioliValue,
  fun: PacioliFunction,
  list: PacioliValue[]
) {
  var accu: PacioliValue = init;
  for (var i = 0; i < list.length; i++) {
    accu = lib_base_base_apply(fun, [accu, list[i]]);
  }
  return accu;
}

export function lib_base_list_list_size(x: any) {
  return initialNumbers(1, 1, [[0, 0, x.length]]);
}

export function lib_base_list_head(x: any) {
  return x[0];
}

export function lib_base_list_fold_list(fun: any, list: any) {
  if (list.length == 0) {
    throw new Error("Cannot fold an empty list");
  }
  var accu = list[0];
  for (var i = 1; i < list.length; i++) {
    accu = lib_base_base_apply(fun, [accu, list[i]]);
  }
  return accu;
}

export function lib_base_list_sort_list(list: any, fun: any) {
  return tagKind(
    list.slice(0).sort(function (a: any, b: any) {
      if (lib_base_base_apply(fun, [a, b])) return -1;
      if (lib_base_base_apply(fun, [b, a])) return 1;
      return 0;
    }),
    "list"
  );
}

export function lib_base_list_cons(item: any, list: any) {
  return lib_base_list_append(lib_base_list_singleton_list(item), list);
}

export function lib_base_list_empty_list() {
  return tagKind([], "list");
}

export function lib_base_string_format(formatter: any, ...args: any[]) {
  // Quick and dirty format implementation. Does not handle escaped percentages. So
  // format("\%s %s", "foo") gives "\foo %s" instead of "%s foo"
  let output = formatter;
  for (const arg of args) {
    output = output.replace(/%s/, arg);
  }
  return output;
}

let NR_DECIMALS = 2;

export function lib_base_io_nr_decimals() {
  return initialNumbers(1, 1, [[0, 0, NR_DECIMALS]]);
}

export function lib_base_io_set_nr_decimals(num: any) {
  NR_DECIMALS = getNumber(num, 0, 0);
  return nothing;
}

export function lib_base_string_num2string(num: any, decimals: any, unit: any) {
  const shape = unit.shape;
  if (shape === undefined) {
    throw Error("shape undefined");
  }
  const matrix = new Matrix(shape, num);
  return matrix.toDecimal(getNumber(decimals, 0, 0));
}

export function lib_base_string_num2str(num: any, unit: any) {
  const shape = unit.shape;
  if (shape === undefined) {
    throw Error("shape undefined");
  }
  const matrix = new Matrix(shape, num);
  return matrix.toDecimal(NR_DECIMALS);
}

export function lib_base_string_concatenate(x: any, y: any) {
  return x.concat(y);
}

export function lib_base_string_split_string(x: any, y: any) {
  return tagKind(x.split(y), "list");
}

export function lib_base_string_pad_left(x: any, n: any, sub: any) {
  return x.padStart(getNumber(n, 0, 0), sub);
}

export function lib_base_string_pad_right(x: any, n: any, sub: any) {
  return x.padEnd(getNumber(n, 0, 0), sub);
}

export function lib_base_string_trim(x: any) {
  return x.trim();
}

export function lib_base_string_parse_num(x: any) {
  return initialNumbers(1, 1, [[0, 0, Number(x)]]);
}

export function lib_base_system__system_time() {
  return initialNumbers(1, 1, [[0, 0, Date.now()]]);
}

export function lib_base_array_make_array(n: any) {
  return tagKind(new Array(getNumber(n, 0, 0)), "list"); // TODO: make 'array' kind
}

export function lib_base_array_array_get(arr: any, pos: any) {
  return arr[getNumber(pos, 0, 0)];
}

export function lib_base_array_array_put(arr: any, pos: any, val: any) {
  arr[getNumber(pos, 0, 0)] = val;
}

export function lib_base_array_array_size(arr: any) {
  return initialNumbers(1, 1, [[0, 0, arr.length]]);
}

// Abandoned experiment

// Pacioli.lib_shells_csg_polygon = function (vectors) {
//     var vertices = vectors.map(function (x) {
//         var v = Pacioli.getFullNumbers(x)
//         return new CSG.Vertex(v, [0,1,0])
//     })
//     console.log(vertices)
//     return Pacioli.tagKind(new CSG.Polygon(vertices), "csg");
// }

// Pacioli.lib_shells_csg_mesh = function (polygons) {
//     console.log(polygons)
//    return Pacioli.tagKind(CSG.fromPolygons(polygons), "csg");
// }

// Pacioli.lib_shells_csg_sphere = function (radius, slices, stacks) {
//    return Pacioli.tagKind(CSG.sphere({ radius: Pacioli.getNumber(radius, 0, 0) , slices: Pacioli.getNumber(slices, 0, 0), stacks: Pacioli.getNumber(stacks, 0, 0)}), "csg");
// }

// Pacioli.lib_shells_csg_cube = function (radius) {
//    return Pacioli.tagKind(CSG.cube({ radius: Pacioli.getNumber(radius, 0, 0) }), "csg");
// }

// Pacioli.lib_shells_csg_subtract = function (x, y) {
//    return Pacioli.tagKind(x.subtract(y), "csg");
// }
