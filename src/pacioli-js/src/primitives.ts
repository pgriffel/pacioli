/* Runtime Support for the Pacioli language
 *
 * Copyright (c) 2023-2025 Paul Griffioen
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
  ccsmul,
  ccssub,
  cos,
  dot,
  exp,
  inv,
  log,
  LU,
  max,
  min,
  pow,
  sin,
  svd,
  tan,
} from "numeric";
import { UOM } from "uom-ts";
import { initialNumbers, oneNumbers, printValue, zeroNumbers } from "./cache";
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
import {
  NOTHING,
  RawArray,
  RawBoole,
  RawCoordinates,
  RawFunction,
  RawList,
  RawMap,
  RawMatrix,
  RawRef,
  RawString,
  RawTuple,
  RawValue,
  STORAGE_CCS,
  STORAGE_FULL,
  tagArray,
  tagList,
  tagRef,
  tagTuple,
} from "./value";
import { PacioliVoid, VOID } from "./values/void";
import { PacioliMatrix } from "./values/matrix";
import { PacioliMap } from "./values/map";
import { RawMaybe } from "./values/maybe";

// -----------------------------------------------------------------------------
// 1. Primitive Units Unit Prefixes
// -----------------------------------------------------------------------------

export const ONE = UOM.ONE;

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

export const $base_base_tuple = function (...args: RawValue[]): RawTuple {
  return tagTuple(Array.prototype.slice.call(args));
};

export const $base_base_apply = function (fun: RawFunction, arg: RawTuple) {
  return fun.apply(fun, arg);
};

export function $base_base_identity(x: RawMatrix): RawMatrix {
  return x;
}

export function $base_base__new_ref(value: RawValue): RawRef {
  return tagRef([value]);
}

export function $base_base__empty_ref(): RawRef {
  return tagRef(new Array(1));
}

export function $base_base__ref_set(ref: RawRef, value: RawValue): RawRef {
  ref[0] = value;
  return ref;
}

export function $base_base__ref_get(ref: RawRef): RawValue {
  return ref[0];
}

export function $base_base_just(value: RawValue): RawValue {
  return new RawMaybe(value);
}

export function $base_base_error(value: RawString): unknown {
  throw Error(value);
}

// Fixme: decide on return value (is nothing now) and give
// a proper type.
export function $base_base_catch(code: any, _: any[]) {
  if (false) {
    // dev switch to debug exceptions in a catch block
    return code();
  } else {
    try {
      return new RawMaybe(code());
    } catch (err) {
      return NOTHING;
    }
  }
}

// TODO: give a type
export function $base_base_nothing(): RawValue {
  return NOTHING; // Nasty cast because NOTHING is undefined. Reconsider undefined as value?!
}

export function $base_base_is_nothing(maybe: RawMaybe): RawBoole {
  return maybe.value === undefined;
}

export function $base_base_from_just(maybe: RawMaybe): RawValue {
  if (maybe.value === undefined) {
    throw new Error("Cannot get empty Maybe value");
  }
  return maybe.value;
}

export function $base_base_not(boole: RawBoole): RawBoole {
  return !boole;
}

export function $base_system__skip(): PacioliVoid {
  return VOID;
}

export function $base_base__while(
  test: () => RawBoole,
  body: () => PacioliVoid
): PacioliVoid {
  while (test()) {
    body();
  }
  return VOID;
}

export function $base_base__for(
  items: RawList,
  body: (arg: RawValue) => PacioliVoid
): PacioliVoid {
  for (let item of items) {
    body(item);
  }

  return VOID;
}

export function $base_base__catch_result(
  code: () => PacioliVoid,
  ref: RawRef
): RawValue | PacioliVoid {
  // dev switch to debug exceptions in a catch block
  if (false) {
    code();
    // TODO: check if this is a Void statement. If not we have to throw an error.
    // We need this information from the compiler?!
    return VOID;
  } else {
    try {
      code();
      // TODO: check if this is a Void statement. If not we have to throw an error.
      // We need this information from the compiler?!
      throw new Error("Statement ends without returning a value");
    } catch (err) {
      if (err == "jump") {
        return ref[0];
      } else {
        throw err;
      }
    }
  }
}

export function $base_base__throw_result(ref: RawRef, value: RawValue) {
  ref[0] = value;
  throw "jump";
}

export function $base_base__catch_void(
  code: () => PacioliVoid,
  ref: RawRef
): RawValue | PacioliVoid {
  // dev switch to debug exceptions in a catch block
  if (false) {
    code();
    // TODO: check if this is a Void statement. If not we have to throw an error.
    // We need this information from the compiler?!
    return VOID;
  } else {
    try {
      code();
      // TODO: check if this is a Void statement. If not we have to throw an error.
      // We need this information from the compiler?!
      return VOID;
    } catch (err) {
      if (err == "jump") {
        return ref[0];
      } else {
        throw err;
      }
    }
  }
}

export function $base_base__throw_void(ref: RawRef, value: RawValue) {
  ref[0] = value;
  throw "jump";
}

export function $base_base__seq(_x: PacioliVoid, y: PacioliVoid): PacioliVoid {
  return y;
}

export function $base_base_not_equal(x: RawValue, y: RawValue): RawBoole {
  return !$base_base_equal(x, y);
}

export function $base_base_equal(x: RawValue, y: RawValue): RawBoole {
  // if (x.kind !== y.kind) return false;

  if (x == y) {
    return true;
  } else if (typeof x === "string" || typeof y === "string") {
    return x === y;
  } else if (typeof x === "boolean" || typeof y === "boolean") {
    return x === y;
  } else if (typeof x === "function" || typeof y === "function") {
    return x === y;
  } else if (x.kind === "coordinates" && y.kind === "coordinates") {
    return x.position === y.position;
  } else if (x.kind === "maybe" && y.kind === "maybe") {
    return (
      (x.value === undefined && y.value === undefined) ||
      (x.value !== undefined &&
        y.value !== undefined &&
        $base_base_equal(x.value, y.value))
    );
  } else if (x.kind === "matrix" && y.kind === "matrix") {
    return !findNonZero(
      x,
      y,
      function (a: number, b: number) {
        return a !== b;
      },
      false
    );
  } else if (x instanceof Array && y instanceof Array) {
    var n = x.length;
    if (y.length !== n) {
      return false;
    }
    for (var i = 0; i < n; i++) {
      if (
        // TODO: remove casts. Split this if case into tuple, list, etc., instead of instanceof Array!?
        !$base_base_equal(
          x[i] as unknown as RawValue,
          y[i] as unknown as RawValue
        )
      ) {
        return false;
      }
    }
    return true;
  } else {
    return false;
  }
}

export function $base_io_print(x: RawValue): PacioliVoid {
  printValue(x);
  return VOID;
}

export function $base_matrix_is_zero(x: RawMatrix): RawBoole {
  var values = getCOONumbers(x)[2];
  for (var i = 0; i < values.length; i++) {
    if (values[i] != 0) return false;
  }
  return true;
}

export function $base_matrix_scalar_unit(_x: RawMatrix): RawMatrix {
  return oneNumbers(1, 1);
}

export function $base_matrix_magnitude(x: RawMatrix): RawMatrix {
  return x;
}

export function $base_matrix_row(
  x: RawMatrix,
  coord: RawCoordinates
): RawMatrix {
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

export function $base_matrix_row_unit(x: RawMatrix): RawMatrix {
  return oneNumbers(x.nrRows, 1);
}

export function $base_matrix_row_domain(matrix: RawMatrix): RawList {
  var n = matrix.nrRows;
  var domain = new Array<RawCoordinates>(n);
  for (var i = 0; i < n; i++) {
    domain[i] = { kind: "coordinates", position: i, size: n };
  }
  return tagList(domain);
}

export function $base_matrix_index_less(
  x: RawCoordinates,
  y: RawCoordinates
): RawBoole {
  return x.position < y.position;
}

export function $base_matrix_column(
  x: RawMatrix,
  coord: RawCoordinates
): RawMatrix {
  // todo: reconsider this and the $base_matrix_row implementation
  return $base_matrix_transpose(
    $base_matrix_row($base_matrix_transpose(x), coord)
  );
}

export function $base_matrix_column_domain(matrix: RawMatrix): RawList {
  var n = matrix.nrColumns;
  var domain = new Array(n);
  for (var i = 0; i < n; i++) {
    domain[i] = { kind: "coordinates", position: i, size: n };
  }
  return tagList(domain);
}

export function $base_matrix_column_unit(x: RawMatrix): RawMatrix {
  return oneNumbers(x.nrColumns, 1);
}

export function $base_matrix_get_num(
  matrix: RawMatrix,
  i: RawCoordinates,
  j: RawCoordinates
): RawMatrix {
  return get(matrix, i.position, j.position);
}

export function $base_matrix_get(
  matrix: RawMatrix,
  i: RawCoordinates,
  j: RawCoordinates
): RawMatrix {
  return get(matrix, i.position, j.position);
}

export function $base_matrix_make_matrix(tuples: RawList): RawMatrix {
  var first = tuples[0] as unknown as [
    RawCoordinates,
    RawCoordinates,
    RawMatrix
  ];
  var numbers = zeroNumbers(first[0].size, first[1].size);
  for (var i = 0; i < tuples.length; i++) {
    var tup = tuples[i] as unknown as [
      RawCoordinates,
      RawCoordinates,
      RawMatrix
    ];
    set(numbers, tup[0].position, tup[1].position, getNumber(tup[2], 0, 0));
  }
  return numbers;
}

export function $base_matrix_signum(x: RawMatrix): RawMatrix {
  return unaryNumbers(x, function (val: number) {
    return val < 0 ? -1 : val > 0 ? 1 : 0;
  });
}

export function $base_matrix_support(x: RawMatrix): RawMatrix {
  return unaryNumbers(x, function (_val: number) {
    return 1;
  });
}

export function $base_matrix_positive_support(x: RawMatrix): RawMatrix {
  return unaryNumbers(x, function (val: number) {
    return 0 < val ? 1 : 0;
  });
}

export function $base_matrix_negative_support(x: RawMatrix): RawMatrix {
  return unaryNumbers(x, function (val: number) {
    return val < 0 ? 1 : 0;
  });
}

export function $base_matrix_top(cnt: RawMatrix, x: RawMatrix): RawMatrix {
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

export function $base_matrix_bottom(cnt: RawMatrix, x: RawMatrix): RawMatrix {
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

export function $base_matrix_left_identity(x: RawMatrix): RawMatrix {
  var numbers = zeroNumbers(x.nrRows, x.nrRows);
  for (var i = 0; i < x.nrRows; i++) {
    set(numbers, i, i, 1);
  }
  return numbers;
}

export function $base_matrix_right_identity(x: RawMatrix): RawMatrix {
  var numbers = zeroNumbers(x.nrColumns, x.nrColumns);
  for (var i = 0; i < x.nrColumns; i++) {
    set(numbers, i, i, 1);
  }
  return numbers;
}

export function $base_matrix_reciprocal(x: RawMatrix): RawMatrix {
  return unaryNumbers(x, function (val: number) {
    return val == 0 ? 0 : 1 / val;
  });
}

export function $base_matrix_transpose(x: RawMatrix): RawMatrix {
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

export function $base_matrix_dim_inv(x: RawMatrix): RawMatrix {
  return $base_matrix_transpose($base_matrix_reciprocal(x));
}

export function $base_matrix_dim_div(x: RawMatrix, y: RawMatrix): RawMatrix {
  return $base_matrix_mmult(x, $base_matrix_dim_inv(y));
}

export function $base_matrix_mmult(x: RawMatrix, y: RawMatrix): RawMatrix {
  if (x.nrColumns !== y.nrRows) {
    throw Error("Invalid mmult");
  }
  // Currently the only function that uses CCS. The others have been disabled with
  // the === 13 hack. See note in numbers.ts
  return tagNumbers(
    dot(getFullNumbers(x), getFullNumbers(y)),
    x.nrRows,
    y.nrColumns,
    STORAGE_FULL
  );
  // return tagNumbers(
  //   ccsDot(getCCSNumbers(x), getCCSNumbers(y)),
  //   x.nrRows,
  //   y.nrColumns,
  //   STORAGE_CCS
  // );
}

export function $base_matrix_multiply(x: RawMatrix, y: RawMatrix): RawMatrix {
  // TODO: 13????? See note in numbers.ts
  if ((x.storage as any) === 13) {
    return tagNumbers(
      ccsmul(getCCSNumbers(x), getCCSNumbers(y)),
      x.nrRows,
      y.nrColumns,
      STORAGE_CCS
    );
  } else {
    return elementWiseNumbers(x, y, function (a: number, b: number) {
      return a * b;
    });
  }
}

// Pacioli.$base_matrix_kronecker = function (x,y) {
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

export function $base_matrix_divide(x: RawMatrix, y: RawMatrix): RawMatrix {
  return elementWiseNumbers(x, y, function (a: number, b: number) {
    return b !== 0 ? a / b : 0;
  });
}

export function $base_matrix_gcd(x: RawMatrix, y: RawMatrix): RawMatrix {
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

export function $base_matrix_sum(x: RawMatrix, y: RawMatrix): RawMatrix {
  // TODO: 13????? See note in numbers.ts
  if ((x.storage as any) === 13) {
    return tagNumbers(
      ccsadd(getCCSNumbers(x), getCCSNumbers(y)),
      x.nrRows,
      y.nrColumns,
      STORAGE_CCS
    );
  } else {
    return elementWiseNumbers(x, y, function (a: number, b: number) {
      return a + b;
    });
  }
}

export function $base_matrix_minus(x: RawMatrix, y: RawMatrix): RawMatrix {
  //return Pacioli.elementWiseNumbers(x, y, function(a, b) { return a-b})
  // TODO: 13????? See note in numbers.ts
  if ((x.storage as any) === 13) {
    return tagNumbers(
      ccssub(getCCSNumbers(x), getCCSNumbers(y)),
      x.nrRows,
      y.nrColumns,
      STORAGE_CCS
    );
  } else {
    return elementWiseNumbers(x, y, function (a: number, b: number) {
      return a - b;
    });
  }
}

export function $base_matrix_negative(x: RawMatrix): RawMatrix {
  return unaryNumbers(x, function (val: number) {
    return -val;
  });
}

export function $base_matrix_scale(x: RawMatrix, y: RawMatrix): RawMatrix {
  var factor = getNumber(x, 0, 0);
  return unaryNumbers(y, function (val: number): number {
    return factor * val;
  });
}

export function $base_matrix_rscale(x: RawMatrix, y: RawMatrix): RawMatrix {
  var factor = getNumber(y, 0, 0);
  return unaryNumbers(x, function (val: number): number {
    return factor * val;
  });
}

export function $base_matrix_scale_down(x: RawMatrix, y: RawMatrix): RawMatrix {
  return $base_matrix_scale($base_matrix_reciprocal(y), x);
}

export function $base_matrix_total(x: RawMatrix): RawMatrix {
  var values = getCOONumbers(x)[2];
  var total = 0;
  for (var i = 0; i < values.length; i++) {
    total += values[i];
  }
  var result = zeroNumbers(1, 1);
  set(result, 0, 0, total);
  return result;
}

export function $base_matrix_mod(x: RawMatrix, y: RawMatrix): RawMatrix {
  return elementWiseNumbers(x, y, function (a: number, b: number) {
    if (b === 0) {
      return a;
    } else {
      const rem = a % b;
      return rem < 0 ? rem + Math.abs(b) : rem;
    }
  });
}

export function $base_matrix_abs_min(x: RawMatrix, y: RawMatrix): RawMatrix {
  return elementWiseNumbers(x, y, function (a: number, b: number) {
    if (b === 0) {
      return a;
    } else {
      return a - b * Math.round(a / b);
    }
  });
}

export function $base_matrix_rem(x: RawMatrix, y: RawMatrix): RawMatrix {
  return elementWiseNumbers(x, y, function (a: number, b: number) {
    return b === 0 ? a : a % b;
  });
}

export function $base_matrix_div(x: RawMatrix, y: RawMatrix): RawMatrix {
  return elementWiseNumbers(x, y, function (a: number, b: number) {
    return b === 0 ? 0 : Math.trunc(a / b);
  });
}

export function $base_matrix_max(x: RawMatrix, y: RawMatrix): RawMatrix {
  return tagNumbers(
    max(getFullNumbers(x), getFullNumbers(y)),
    x.nrRows,
    x.nrColumns,
    STORAGE_FULL
  );
}

export function $base_matrix_min(x: RawMatrix, y: RawMatrix): RawMatrix {
  return tagNumbers(
    min(getFullNumbers(x), getFullNumbers(y)),
    x.nrRows,
    x.nrColumns,
    STORAGE_FULL
  );
}

export function $base_matrix_sin(x: RawMatrix): RawMatrix {
  return tagNumbers(
    sin(getFullNumbers(x)),
    x.nrRows,
    x.nrColumns,
    STORAGE_FULL
  );
}

export function $base_matrix_cos(x: RawMatrix): RawMatrix {
  return tagNumbers(
    cos(getFullNumbers(x)),
    x.nrRows,
    x.nrColumns,
    STORAGE_FULL
  );
}

export function $base_matrix_tan(x: RawMatrix): RawMatrix {
  return tagNumbers(
    tan(getFullNumbers(x)),
    x.nrRows,
    x.nrColumns,
    STORAGE_FULL
  );
}

export function $base_system__asin(x: RawMatrix): RawMatrix {
  return tagNumbers(
    asin(getFullNumbers(x)),
    x.nrRows,
    x.nrColumns,
    STORAGE_FULL
  );
}

export function $base_system__acos(x: RawMatrix): RawMatrix {
  return tagNumbers(
    acos(getFullNumbers(x)),
    x.nrRows,
    x.nrColumns,
    STORAGE_FULL
  );
}

export function $base_system__atan(x: RawMatrix): RawMatrix {
  return tagNumbers(
    atan(getFullNumbers(x)),
    x.nrRows,
    x.nrColumns,
    STORAGE_FULL
  );
}

export function $base_system__atan2(x: RawMatrix, y: RawMatrix): RawMatrix {
  return tagNumbers(
    atan2(getFullNumbers(x), getFullNumbers(y)),
    x.nrRows,
    x.nrColumns,
    STORAGE_FULL
  );
}

export function $base_matrix_floor(x: RawMatrix): RawMatrix {
  return unaryNumbers(x, function (val: number) {
    return Math.floor(val);
  });
}

export function $base_matrix_ceiling(x: RawMatrix): RawMatrix {
  return unaryNumbers(x, function (val: number) {
    return Math.ceil(val);
  });
}

export function $base_matrix_truncate(x: RawMatrix): RawMatrix {
  return unaryNumbers(x, function (val: number) {
    return Math.trunc(val);
  });
}

export function $base_matrix_round(x: RawMatrix): RawMatrix {
  return unaryNumbers(x, function (val: number) {
    return Math.round(val);
  });
}

export function $base_matrix_abs(x: RawMatrix): RawMatrix {
  return unaryNumbers(x, function (val: number) {
    return Math.abs(val);
  });
}

export function $base_matrix_mexpt(x: RawMatrix, y: RawMatrix): RawMatrix {
  var n = getNumber(y, 0, 0);
  if (n === 0) {
    return $base_matrix_left_identity(x);
  } else if (n === 1) {
    return x;
  } else if (n < 0) {
    return $base_matrix_mexpt(
      tagNumbers(inv(getFullNumbers(x)), x.nrColumns, x.nrRows, STORAGE_FULL),
      // $base_matrix_solve(x, $base_matrix_left_identity(x)),
      $base_matrix_negative(y)
    );
  } else {
    var result = x;
    for (var i = 1; i < n; i++) {
      result = $base_matrix_mmult(result, x);
    }
    return result;
  }
}

export function $base_matrix_expt(x: RawMatrix, y: RawMatrix): RawMatrix {
  var n = getNumber(y, 0, 0);
  return tagNumbers(
    pow(getFullNumbers(x), n),
    x.nrRows,
    x.nrColumns,
    STORAGE_FULL
  );
}

export function $base_matrix_log(x: RawMatrix, y: RawMatrix): RawMatrix {
  const yLogged = log(getFullNumbers(y));
  const yLog = initialNumbers(1, 1, [[0, 0, yLogged[0][0]]]);
  return $base_matrix_scale_down(
    tagNumbers(log(getFullNumbers(x)), x.nrRows, x.nrColumns, STORAGE_FULL),
    yLog
  );
}

export function $base_matrix_exp(x: RawMatrix): RawMatrix {
  return tagNumbers(
    exp(getFullNumbers(x)),
    x.nrRows,
    x.nrColumns,
    STORAGE_FULL
  );
}

export function $base_matrix_ln(x: RawMatrix): RawMatrix {
  return tagNumbers(
    log(getFullNumbers(x)),
    x.nrRows,
    x.nrColumns,
    STORAGE_FULL
  );
}

export function $base_matrix_less(x: RawMatrix, y: RawMatrix): RawBoole {
  return !findNonZero(
    x,
    y,
    function (a: number, b: number) {
      return a >= b;
    },
    true
  ); //=== null
}

export function $base_matrix_less_eq(x: RawMatrix, y: RawMatrix): RawBoole {
  return !findNonZero(
    x,
    y,
    function (a: number, b: number) {
      return a > b;
    },
    false
  ); //=== null
}

export function $base_matrix_greater(x: RawMatrix, y: RawMatrix): RawBoole {
  return !findNonZero(
    x,
    y,
    function (a: number, b: number) {
      return a <= b;
    },
    true
  ); //=== null
}

export function $base_matrix_greater_eq(x: RawMatrix, y: RawMatrix): RawBoole {
  return !findNonZero(
    x,
    y,
    function (a: number, b: number) {
      return a < b;
    },
    false
  ); //=== null
}

export function $base_matrix_sqrt(x: RawMatrix): RawMatrix {
  return unaryNumbers(x, function (val: number) {
    return Math.sqrt(val);
  });
}

export function $base_matrix_cbrt(x: RawMatrix): RawMatrix {
  return unaryNumbers(x, function (val: number) {
    return Math.cbrt(val);
  });
}

export function $base_matrix_qr(_: RawMatrix): RawTuple {
  throw new Error("Function qr is not implemented in pacioli-js");
}

export function $base_matrix_plu(x: RawMatrix): RawTuple {
  throw new Error("Function plu is not implemented in pacioli-js");

  // Does numeric provide serparate L and U?

  const decomposition = LU(getFullNumbers(x));

  const m = x.nrRows;
  const n = x.nrColumns;

  var Pmat = zeroNumbers(m, m);
  var LUmat = zeroNumbers(m, n);

  for (let i = 0; i < m; i++) {
    set(Pmat, i, i, 1);

    for (let j = 0; j < n; j++) {
      set(LUmat, i, j, decomposition.LU[i][j]);
    }
  }

  for (let i = 0; i < m; i++) {
    const Pi = decomposition.P[i];
    if (Pi !== i) {
      for (let j = 0; j < n; j++) {
        const tmp = Pmat[i][j];
        set(Pmat, i, j, Pmat[Pi][j]);
        set(Pmat, Pi, j, tmp);
      }
    }
  }

  return tagTuple([Pmat, LUmat]);
}

export function $base_matrix_solve(x: RawMatrix, y: RawMatrix): RawMatrix {
  // https://en.wikipedia.org/wiki/Moore%E2%80%93Penrose_inverse
  // See https://github.com/Fylax/Apache-Commons-Math3-C-/blob/master/linear/SingularValueDecomposition.cs for the Java implementation

  // Doesn't give the same results as the Java variant. Gives NaN numbers in the current random tests for
  // cases that the Java variant has not issue with.

  const EPS = 1.0 * Math.pow(2, -52);

  try {
    const svd = $base_matrix_svd(x) as unknown as [
      RawMatrix,
      RawMatrix,
      RawMatrix
    ][];

    // Copied from SingularValueDecomposition.cs
    const treshold = Math.max(
      EPS,
      EPS * getNumber(svd[0][0], 0, 0) * Math.max(x.nrRows, x.nrColumns)
    );

    var inv = zeroNumbers(x.nrColumns, x.nrRows);
    for (let elt of svd) {
      // This loop swaps storage 2 and 3
      const tup = elt;
      const [a, v, w] = tup as unknown as [RawMatrix, RawMatrix, RawMatrix];
      if (Math.abs(getNumber(a, 0, 0)) > treshold) {
        const m = $base_matrix_scale(
          $base_matrix_reciprocal(a),
          $base_matrix_mmult(w, $base_matrix_transpose(v))
        );

        inv = $base_matrix_sum(inv, m);
      }
    }

    const res = $base_matrix_mmult(inv, y);

    if (res.nrColumns !== y.nrColumns) {
      throw new Error("Incorrect matrix shape issue in solve");
    }

    if (res.nrRows !== x.nrColumns) {
      throw new Error("Incorrect matrix shape issue in solve");
    }

    return res;
  } catch (ex: unknown) {
    // Debugging svd issues. Uncomment the following and place a breakpoint:

    // console.log("oeps", ex);

    // const svd = $base_matrix_svd(x) as unknown as [
    //   RawMatrix,
    //   RawMatrix,
    //   RawMatrix
    // ][];

    // // Copied from SingularValueDecomposition.cs
    // const treshold = Math.max(
    //   EPS,
    //   EPS * getNumber(svd[0][0], 0, 0) * Math.max(x.nrRows, x.nrColumns)
    // );

    // var inv = zeroNumbers(x.nrColumns, x.nrRows);
    // for (let elt of svd) {
    //   // This loop swaps storage 2 and 3
    //   const tup = elt;
    //   const [a, v, w] = tup as unknown as [RawMatrix, RawMatrix, RawMatrix];
    //   if (Math.abs(getNumber(a, 0, 0)) > treshold) {
    //     const m = $base_matrix_scale(
    //       $base_matrix_reciprocal(a),
    //       $base_matrix_mmult(w, $base_matrix_transpose(v))
    //     );

    //     inv = $base_matrix_sum(inv, m);
    //   }
    // }

    // const res = $base_matrix_mmult(inv, y);

    // console.log(res);

    throw ex;
  }
}

export function $base_matrix_svd(x: RawMatrix): RawList {
  // If x is mxn then we should get vectors of size m and size n

  // numerics requires that the number of rows is at least as large
  // as the number of columns. Transpose to fix this if needed.
  const needsTranspose = x.nrRows < x.nrColumns;

  const m = needsTranspose ? x.nrColumns : x.nrRows;
  const n = needsTranspose ? x.nrRows : x.nrColumns;

  const full = getFullNumbers(needsTranspose ? $base_matrix_transpose(x) : x);

  // Experiment with svd-js. Also gives NaN numbers.
  // const alt = SVD(full);
  // console.log("svd-js output", alt);

  const trip = svd(full);
  const r = trip.S.length;

  let tuples = [];

  for (let j = 0; j < r; j++) {
    const si = trip.S[j];
    if (isNaN(si)) {
      throw Error("Cannot compute svd. Insufficient numerical precision.");
    }
    const sv = initialNumbers(1, 1, [[0, 0, si]]);

    var left = zeroNumbers(m, 1);

    for (let i = 0; i < m; i++) {
      const uij = trip.U[i][j];
      if (isNaN(uij)) {
        throw Error("Cannot compute svd. Insufficient numerical precision.");
      }
      set(left, i, 0, uij);
    }

    var right = zeroNumbers(n, 1);
    for (let i = 0; i < n; i++) {
      const vij = trip.V[i][j];
      if (isNaN(vij)) {
        throw Error("Cannot compute svd. Insufficient numerical precision.");
      }
      set(right, i, 0, vij);
    }

    tuples.push(
      tagTuple(needsTranspose ? [sv, right, left] : [sv, left, right])
    );
  }

  return tagList(tuples);
}

export function $base_matrix_random(): RawMatrix {
  return tagNumbers([[Math.random()]], 1, 1, STORAGE_FULL);
}

export function $base_matrix_ranking(x: RawMatrix): RawMatrix {
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

export function $base_list_mapnz(fun: RawFunction, x: RawMatrix): RawMatrix {
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
      getNumber(
        fun.call(
          fun,
          tagNumbers([[values[i]]], 1, 1, STORAGE_FULL)
        ) as RawMatrix,
        0,
        0
      )
    );
  }
  return result;
}

export function $base_list_zip(x: RawList, y: RawList): RawList {
  var list = new Array(Math.min(x.length, y.length));
  for (var i = 0; i < list.length; i++) {
    list[i] = tagTuple([x[i], y[i]]);
  }
  return tagList(list);
}

export function $base_list_map_list(fun: RawFunction, items: RawList): RawList {
  var list = tagList(new Array(items.length));
  for (var i = 0; i < items.length; i++) {
    list[i] = fun(items[i]);
  }
  return tagList(list);
}

export function $base_system__add_mut(list: RawList, item: RawValue): RawList {
  list.push(item);
  return list;
}

export function $base_list_append(x: RawList, y: RawList): RawList {
  return tagList(x.concat(y));
}

export function $base_list_reverse(x: RawList): RawList {
  return tagList(x.slice(0).reverse());
}

export function $base_list_tail(x: RawList): RawList {
  var array = new Array(x.length - 1);
  for (var i = 0; i < array.length; i++) {
    array[i] = x[i + 1];
  }
  return tagList(array);
}

export function $base_list_singleton_list(x: RawValue): RawList {
  return tagList([x]);
}

export function $base_list_nth(x: RawMatrix, y: RawList): RawValue {
  return y[getNumber(x, 0, 0)];
}

export function $base_list_naturals(num: RawMatrix): RawList {
  var n = getNumber(num, 0, 0);
  var list = new Array(n);
  for (var i = 0; i < n; i++) {
    list[i] = initialNumbers(1, 1, [[0, 0, i]]);
  }
  return tagList(list);
}

export function $base_list_loop_list(
  init: RawValue,
  fun: RawFunction,
  list: RawList
): RawValue {
  var accu: RawValue = init;
  for (var i = 0; i < list.length; i++) {
    accu = fun.apply(fun, [accu, list[i]]);
  }
  return accu;
}

export function $base_list_list_size(x: RawList): RawMatrix {
  return initialNumbers(1, 1, [[0, 0, x.length]]);
}

export function $base_list_head(x: RawList): RawValue {
  return x[0];
}

export function $base_list_fold_list(
  fun: RawFunction,
  list: RawList
): RawValue {
  if (list.length == 0) {
    throw new Error("Cannot fold an empty list");
  }
  var accu = list[0];
  for (var i = 1; i < list.length; i++) {
    accu = fun.apply(fun, [accu, list[i]]);
  }
  return accu;
}

export function $base_list_sort_list(list: RawList, fun: RawFunction): RawList {
  return tagList(
    list.slice(0).sort(function (a: RawValue, b: RawValue) {
      return getNumber(fun.apply(fun, [a, b]) as RawMatrix, 0, 0);
    })
  );
}

export function $base_list_cons(item: RawValue, list: RawList): RawList {
  return $base_list_append($base_list_singleton_list(item), list);
}

export function $base_list_contains(list: RawList, item: RawValue): RawBoole {
  return list.some((val) => $base_base_equal(val, item));
}

export function $base_list_empty_list(): RawList {
  return tagList([]);
}

/**
 * Format in pacioli-js is not really supported. It only works for dimensionless
 * scalars. No unit information is available, so all units are dropped from the
 * output. Matrices are not supported (yet).
 *
 * The format function is implemented for debugging and testing purposes. Regular
 * output in the browser is via the boxed pacioli-js api and the DOM.
 *
 * @param formatter
 * @param args
 * @returns
 */
export function $base_string_format(formatter: RawValue, ...args: RawValue[]) {
  if (typeof formatter !== "string") {
    throw new Error(
      `Illegal format string. The first argument to format must be a string. Found: \n\n${formatter}`
    );
  }

  const formatString: string = formatter;

  let out = "";
  let argumentIndex = 0;

  const n = formatString.length;
  let i = 0;

  while (i < n) {
    const char = formatString[i];

    if (char === "%") {
      if (i + 1 === n) {
        throw new Error(
          `unfinished format directive at end of format string ${formatString}`
        );
      }

      const secondChar = formatString[i + 1];

      if (secondChar === "%") {
        out += "%";
        i += 2;
      } else if (secondChar === "s") {
        const debugHack = false;

        const arg = args[argumentIndex++];
        const mat = arg as any as RawMatrix;
        if (debugHack && mat.kind === "matrix") {
          out += `mat(${mat.nrRows}, ${mat.nrColumns}) ${mat.join(" + ")} ${
            mat.storage
          }`;
        } else {
          out += arg;
        }
        i += 2;
      } else {
        const regex = /^%([0-9]*)d/;

        const match = regex.exec(formatString.slice(i));

        if (match !== null && match[0].length > 0) {
          let size: number | null;
          try {
            size = match[1] === "" ? null : parseInt(match[1]);
          } catch (ex: unknown) {
            size = null;
          }

          const mat = args[argumentIndex++] as any as RawMatrix;

          if (mat.kind !== "matrix") {
            throw new Error("Expected matrix for %d format argument");
          }

          // TODO: make dimensionless output for mat.
          const txt = getNumber(mat, 0, 0).toFixed(0);

          out += size === null ? txt : txt.padStart(size, " ");
          i += match[0].length;
        } else {
          const regex = /^%([0-9]*)([.]?)([0-9]*)f/;

          const match = regex.exec(formatString.slice(i));

          if (match !== null && match[0].length > 0) {
            let nrDecs: number;
            try {
              nrDecs = match[3] === "" ? NR_DECIMALS : parseInt(match[3]);
            } catch (ex: unknown) {
              nrDecs = NR_DECIMALS;
            }

            let size: number | null;
            try {
              size = match[1] === "" ? null : parseInt(match[1]);
            } catch (ex: unknown) {
              size = null;
            }

            const mat = args[argumentIndex++] as any as RawMatrix;

            if (mat.kind !== "matrix") {
              throw new Error("Expected matrix for %d format argument");
            }

            // TODO: make dimensionless output for mat.
            const txt = getNumber(mat, 0, 0).toFixed(nrDecs);

            out += size === null ? txt : txt.padStart(size, " ");
            i += match[0].length;
          } else {
            out += char;
            i++;
          }
        }
      }
    } else {
      out += char;
      i++;
    }
  }

  return out;

  // Quick and dirty format implementation. Does not handle escaped percentages. So
  // format("\%s %s", "foo") gives "\foo %s" instead of "%s foo"
  // TODO: better runtime error handling instead of casts
  let output = formatter as unknown as RawString;
  for (const arg of args) {
    output = output.replace(/%s/, arg as unknown as RawString);
  }
  return output;
}

let NR_DECIMALS = 2;
let PRECISION = 14;

export function $base_system__nr_decimals(): RawMatrix {
  return initialNumbers(1, 1, [[0, 0, NR_DECIMALS]]);
}

export function $base_system__set_nr_decimals(num: RawMatrix): PacioliVoid {
  NR_DECIMALS = getNumber(num, 0, 0);
  return VOID;
}

export function $base_system__precision(): RawMatrix {
  return initialNumbers(1, 1, [[0, 0, PRECISION]]);
}

export function $base_system__set_precision(num: RawMatrix): PacioliVoid {
  PRECISION = getNumber(num, 0, 0);
  return VOID;
}

export function $base_string_unit2string(unit: RawMatrix): RawString {
  const shape = unit.shape;
  if (shape === undefined) {
    throw Error("shape undefined");
  }
  var rowOrder = shape.rowOrder();
  var columnOrder = shape.columnOrder();

  if (rowOrder === 0 && columnOrder === 0) {
    return shape.unitAt(0, 0).toText();
  } else {
    throw Error("unit2string is not implemented for non-scalars");
  }
}

export function $base_system__num2string(
  num: RawMatrix,
  decimals: RawMatrix,
  unit: RawMatrix
): RawString {
  const shape = unit.shape;
  if (shape === undefined) {
    throw Error("shape undefined");
  }
  const matrix = new PacioliMatrix(shape, num);
  return matrix.toDecimal(getNumber(decimals, 0, 0));
}

export function $base_string_compare_string(
  x: RawString,
  y: RawString
): RawMatrix {
  return initialNumbers(1, 1, [[0, 0, x < y ? -1 : x > y ? 1 : 0]]);
}

export function $base_string_concatenate(
  x: RawString,
  y: RawString
): RawString {
  return x.concat(y);
}

export function $base_string_split_string(x: RawString, y: RawString): RawList {
  return tagList(x.split(y) as unknown as RawValue[]);
}

export function $base_string_pad(
  left: RawString,
  right: RawString,
  n: RawMatrix,
  sub: RawString
): RawString {
  return (
    left + right.padStart(Math.max(0, getNumber(n, 0, 0) - left.length), sub)
  );
}

export function $base_string_trim(x: RawString): RawString {
  return x.trim();
}

export function $base_string_parse_num(x: RawString): RawMatrix {
  return initialNumbers(1, 1, [[0, 0, Number(x)]]);
}

export function $base_system__system_time(): RawMatrix {
  return initialNumbers(1, 1, [[0, 0, Date.now()]]);
}

export function $base_array_make_array(n: RawMatrix): RawArray {
  return tagArray(new Array(getNumber(n, 0, 0)));
}

export function $base_array_array_get(arr: RawArray, pos: RawMatrix): RawValue {
  return arr[getNumber(pos, 0, 0)];
}

export function $base_array_array_put(
  arr: RawArray,
  pos: RawMatrix,
  val: RawValue
): PacioliVoid {
  arr[getNumber(pos, 0, 0)] = val;
  return VOID;
}

export function $base_array_array_size(arr: RawArray): RawMatrix {
  return initialNumbers(1, 1, [[0, 0, arr.length]]);
}

export function $base_map_empty_map(): RawMap {
  // return tagMap(new Map<RawValue, RawValue>());
  return new PacioliMap();
}

export function $base_map_lookup(key: RawValue, map: RawMap): RawValue {
  return map.lookup(key);
}

export function $base_map_store(
  key: RawValue,
  value: RawValue,
  map: RawMap
): PacioliVoid {
  return map.store(key, value);
}

export function $base_map_keys(map: RawMap): RawList {
  return map.keys();
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
