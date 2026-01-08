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

import numeric from "numeric";
import { SIUnit } from "uom-ts";
import { initialNumbers, oneNumbers, printValue, zeroNumbers } from "./cache";
import type { FULL_MATRIX } from "./values/numbers";
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
import type {
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
} from "./value";
import {
  NOTHING,
  rawValueLabel,
  STORAGE_CCS,
  STORAGE_FULL,
  stringifyRawValue,
  tagArray,
  tagList,
  tagRef,
  tagTuple,
} from "./value";
import type { PacioliVoid } from "./values/void";
import { VOID } from "./values/void";
import { PacioliMatrix } from "./values/matrix";
import { PacioliMap } from "./values/map";
import { RawMaybe } from "./values/maybe";
import { SingularValueDecomposition } from "./linear-algebra/singular-value-decomposition";
import { CholeskyDecomposition } from "./linear-algebra/cholesky-decomposition";
import { QRDecomposition } from "./linear-algebra/qr-decomposition";
import { LUDecomposition } from "./linear-algebra/plu-decomposition";
import { EigenvalueDecomposition } from "./linear-algebra/eigenvalue-decomposition";

// -----------------------------------------------------------------------------
// 1. Primitive Units Unit Prefixes
// -----------------------------------------------------------------------------

// See note in numbers.ts
const FLAG_USE_CCS: boolean = false;

export const ONE = SIUnit.ONE;

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

export const compute_$base_system__runtime_environment = function () {
  return "javascript";
};

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
  return tagRef(new Array<RawValue>(1));
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

/**
 * Dev switch to debug exceptions in a catch block
 */
const FLAG_DONT_CATCH_PACIOLI_ERRORS: boolean = false;

export function $base_base_try_catch(code: RawFunction, handler: RawFunction) {
  if (FLAG_DONT_CATCH_PACIOLI_ERRORS) {
    return code();
  } else {
    try {
      return code();
    } catch (err: unknown) {
      return handler(err instanceof Error ? err.message : String(err));
    }
  }
}

export function $base_base_nothing(): RawValue {
  return NOTHING;
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

export function $base_base_not_equal(x: RawValue, y: RawValue): RawBoole {
  return !$base_base_equal(x, y);
}

export function $base_base_equal(x: RawValue, y: RawValue): RawBoole {
  // if (x.kind !== y.kind) return false;

  if (x === y) {
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
    const n = x.length;
    if (y.length !== n) {
      return false;
    }
    for (let i = 0; i < n; i++) {
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
  const values = getCOONumbers(x)[2];
  for (let i = 0; i < values.length; i++) {
    if (values[i] !== 0) return false;
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
  const row = coord.position;
  const matrix = zeroNumbers(1, x.nrColumns);
  const numbers = getCOONumbers(x);
  const rows = numbers[0];
  const columns = numbers[1];
  const values = numbers[2];
  for (let i = 0; i < rows.length; i++) {
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
  const n = matrix.nrRows;
  const domain = new Array<RawCoordinates>(n);
  for (let i = 0; i < n; i++) {
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
  const n = matrix.nrColumns;
  const domain = new Array<RawValue>(n);
  for (let i = 0; i < n; i++) {
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
  const first = tuples[0] as unknown as [
    RawCoordinates,
    RawCoordinates,
    RawMatrix
  ];
  const numbers = zeroNumbers(first[0].size, first[1].size);
  for (let i = 0; i < tuples.length; i++) {
    const tup = tuples[i] as unknown as [
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
  const n = getNumber(cnt, 0, 0);

  if (n === 0) {
    return zeroNumbers(x.nrRows, x.nrColumns);
  }

  const matrix = zeroNumbers(x.nrRows, x.nrColumns);

  const top = [];
  let count = 0;

  const numbers = getCOONumbers(x);
  const rows = numbers[0];
  const columns = numbers[1];
  const values = numbers[2];
  for (let l = 0; l < rows.length; l++) {
    const i = rows[l];
    const j = columns[l];
    const val = values[l]; //Pacioli.getNumber(x, i, j)
    if (count < n) {
      top[count] = [i, j, val];
      count += 1;
    } else {
      let worst = 0;
      for (let k = 1; k < count; k++) {
        if (top[k][2] < top[worst][2]) {
          worst = k;
        }
      }
      if (val > top[worst][2]) {
        top[worst] = [i, j, val];
      }
    }
  }
  for (let k = 0; k < count; k++) {
    set(matrix, top[k][0], top[k][1], top[k][2]);
  }

  return matrix;
}

export function $base_matrix_bottom(cnt: RawMatrix, x: RawMatrix): RawMatrix {
  const n = getNumber(cnt, 0, 0);

  if (n === 0) {
    return zeroNumbers(x.nrRows, x.nrColumns);
  }

  const matrix = zeroNumbers(x.nrRows, x.nrColumns);

  const bottom = [];
  let count = 0;

  const numbers = getCOONumbers(x);
  const rows = numbers[0];
  const columns = numbers[1];
  const values = numbers[2];
  for (let l = 0; l < rows.length; l++) {
    const i = rows[l];
    const j = columns[l];
    const val = values[l];
    if (count < n) {
      bottom[count] = [i, j, val];
      count += 1;
    } else {
      let best = 0;
      for (let k = 1; k < count; k++) {
        if (bottom[k][2] > bottom[best][2]) {
          best = k;
        }
      }
      if (val < bottom[best][2]) {
        bottom[best] = [i, j, val];
      }
    }
  }
  for (let k = 0; k < count; k++) {
    set(matrix, bottom[k][0], bottom[k][1], bottom[k][2]);
  }

  return matrix;
}

export function $base_matrix_left_identity(x: RawMatrix): RawMatrix {
  const numbers = zeroNumbers(x.nrRows, x.nrRows);
  for (let i = 0; i < x.nrRows; i++) {
    set(numbers, i, i, 1);
  }
  return numbers;
}

export function $base_matrix_right_identity(x: RawMatrix): RawMatrix {
  const numbers = zeroNumbers(x.nrColumns, x.nrColumns);
  for (let i = 0; i < x.nrColumns; i++) {
    set(numbers, i, i, 1);
  }
  return numbers;
}

export function $base_matrix_reciprocal(x: RawMatrix): RawMatrix {
  return unaryNumbers(x, function (val: number) {
    return val === 0 ? 0 : 1 / val;
  });
}

export function $base_matrix_transpose(x: RawMatrix): RawMatrix {
  const result = zeroNumbers(x.nrColumns, x.nrRows);
  const numbers = getCOONumbers(x);
  const rows = numbers[0];
  const columns = numbers[1];
  const values = numbers[2];
  for (let i = 0; i < rows.length; i++) {
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
    numeric.dot(getFullNumbers(x), getFullNumbers(y)) as FULL_MATRIX,
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
  // See note in numbers.ts
  if (FLAG_USE_CCS && x.storage === STORAGE_CCS) {
    return tagNumbers(
      numeric.ccsmul(getCCSNumbers(x), getCCSNumbers(y)),
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
//     const xm = x.length
//     const ym = y.length
//     const xn = x[0].length
//     const yn = y[0].length;
//     const m = xm * ym;
//     const n = xn * yn;
//     const matrix = new Array(m);
//     for (const xi = 0; xi < xm; xi++) {
//         for (const yi = 0; yi < ym; yi++) {
//             const row = new Array(n);
//             for (const xj = 0; xj < xn; xj++) {
//                 for (const yj = 0; yj < yn; yj++) {
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
      const temp = a;
      a = b;
      b = temp;
    }
    if (a === 0) return b;
    if (b === 0) return a;
    while (true) {
      a %= b;
      if (a === 0) return b;
      b %= a;
      if (b === 0) return a;
    }
  });
}

export function $base_matrix_sum(x: RawMatrix, y: RawMatrix): RawMatrix {
  // See note in numbers.ts
  if (FLAG_USE_CCS && x.storage === STORAGE_CCS) {
    return tagNumbers(
      numeric.ccsadd(getCCSNumbers(x), getCCSNumbers(y)),
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
  // See note in numbers.ts
  if (FLAG_USE_CCS && x.storage === STORAGE_CCS) {
    return tagNumbers(
      numeric.ccssub(getCCSNumbers(x), getCCSNumbers(y)),
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
  const factor = getNumber(x, 0, 0);
  return unaryNumbers(y, function (val: number): number {
    return factor * val;
  });
}

export function $base_matrix_rscale(x: RawMatrix, y: RawMatrix): RawMatrix {
  const factor = getNumber(y, 0, 0);
  return unaryNumbers(x, function (val: number): number {
    return factor * val;
  });
}

export function $base_matrix_scale_down(x: RawMatrix, y: RawMatrix): RawMatrix {
  return $base_matrix_scale($base_matrix_reciprocal(y), x);
}

export function $base_matrix_total(x: RawMatrix): RawMatrix {
  const values = getCOONumbers(x)[2];
  let total = 0;
  for (let i = 0; i < values.length; i++) {
    total += values[i];
  }
  const result = zeroNumbers(1, 1);
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
    numeric.max(getFullNumbers(x), getFullNumbers(y)),
    x.nrRows,
    x.nrColumns,
    STORAGE_FULL
  );
}

export function $base_matrix_min(x: RawMatrix, y: RawMatrix): RawMatrix {
  return tagNumbers(
    numeric.min(getFullNumbers(x), getFullNumbers(y)),
    x.nrRows,
    x.nrColumns,
    STORAGE_FULL
  );
}

export function $base_matrix_sin(x: RawMatrix): RawMatrix {
  return tagNumbers(
    numeric.sin(getFullNumbers(x)),
    x.nrRows,
    x.nrColumns,
    STORAGE_FULL
  );
}

export function $base_matrix_cos(x: RawMatrix): RawMatrix {
  return tagNumbers(
    numeric.cos(getFullNumbers(x)),
    x.nrRows,
    x.nrColumns,
    STORAGE_FULL
  );
}

export function $base_matrix_tan(x: RawMatrix): RawMatrix {
  return tagNumbers(
    numeric.tan(getFullNumbers(x)),
    x.nrRows,
    x.nrColumns,
    STORAGE_FULL
  );
}

export function $base_system__asin(x: RawMatrix): RawMatrix {
  return tagNumbers(
    numeric.asin(getFullNumbers(x)),
    x.nrRows,
    x.nrColumns,
    STORAGE_FULL
  );
}

export function $base_system__acos(x: RawMatrix): RawMatrix {
  return tagNumbers(
    numeric.acos(getFullNumbers(x)),
    x.nrRows,
    x.nrColumns,
    STORAGE_FULL
  );
}

export function $base_system__atan(x: RawMatrix): RawMatrix {
  return tagNumbers(
    numeric.atan(getFullNumbers(x)),
    x.nrRows,
    x.nrColumns,
    STORAGE_FULL
  );
}

export function $base_system__atan2(x: RawMatrix, y: RawMatrix): RawMatrix {
  return tagNumbers(
    numeric.atan2(getFullNumbers(x), getFullNumbers(y)),
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
  const n = getNumber(y, 0, 0);
  if (n === 0) {
    return $base_matrix_left_identity(x);
  } else if (n === 1) {
    return x;
  } else if (n < 0) {
    return $base_matrix_mexpt(
      tagNumbers(
        numeric.inv(getFullNumbers(x)),
        x.nrColumns,
        x.nrRows,
        STORAGE_FULL
      ),
      // $base_matrix_solve(x, $base_matrix_left_identity(x)),
      $base_matrix_negative(y)
    );
  } else {
    let result = x;
    for (let i = 1; i < n; i++) {
      result = $base_matrix_mmult(result, x);
    }
    return result;
  }
}

export function $base_matrix_expt(x: RawMatrix, y: RawMatrix): RawMatrix {
  const n = getNumber(y, 0, 0);
  return tagNumbers(
    numeric.pow(getFullNumbers(x), n),
    x.nrRows,
    x.nrColumns,
    STORAGE_FULL
  );
}

export function $base_matrix_log(x: RawMatrix, y: RawMatrix): RawMatrix {
  const yLogged = numeric.log(getFullNumbers(y));
  const yLog = initialNumbers(1, 1, [[0, 0, yLogged[0][0]]]);
  return $base_matrix_scale_down(
    tagNumbers(
      numeric.log(getFullNumbers(x)),
      x.nrRows,
      x.nrColumns,
      STORAGE_FULL
    ),
    yLog
  );
}

export function $base_matrix_exp(x: RawMatrix): RawMatrix {
  return tagNumbers(
    numeric.exp(getFullNumbers(x)),
    x.nrRows,
    x.nrColumns,
    STORAGE_FULL
  );
}

export function $base_matrix_ln(x: RawMatrix): RawMatrix {
  return tagNumbers(
    numeric.log(getFullNumbers(x)),
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

export function $base_matrix_qr_decomposition(A: RawMatrix): RawTuple {
  const QR = new QRDecomposition(getFullNumbers(A));
  const Q = QR.getQ();
  const R = QR.getR();

  const m = A.nrRows;
  const n = A.nrColumns;

  const Qmat = zeroNumbers(m, n);
  const Rmat = zeroNumbers(n, n);

  for (let i = 0; i < m; i++) {
    for (let j = 0; j < n; j++) {
      set(Qmat, i, j, Q[i][j]);
    }
  }

  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n; j++) {
      set(Rmat, i, j, R[i][j]);
    }
  }

  return tagTuple([Qmat, Rmat]);
}

export function $base_matrix_plu_decomposition(x: RawMatrix): RawTuple {
  const decomposition = new LUDecomposition(getFullNumbers(x));

  const L: number[][] = decomposition.getL();
  const U: number[][] = decomposition.getU();
  const P: number[] = decomposition.getPivot();

  const m = x.nrRows;
  const n = x.nrColumns;

  const Pmat = zeroNumbers(m, m);
  const Lmat = zeroNumbers(m, n);
  const Umat = zeroNumbers(n, n);

  for (let i = 0; i < m; i++) {
    for (let j = 0; j < n; j++) {
      set(Lmat, i, j, L[i][j]);
    }
  }

  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n; j++) {
      set(Umat, i, j, U[i][j]);
    }
  }

  for (let i = 0; i < m; i++) {
    for (let j = 0; j < m; j++) {
      set(Pmat, i, P[i], 1);
    }
  }

  return tagTuple([Pmat, Lmat, Umat]);
}

/**
 * The eigen value decomposition.
 *
 * A = V '*' D '*' V'^'-1
 *
 * All matrices are n x n
 *
 * @param A A symmetric non-singular matrix
 * @returns A tuple (D, V)
 */
export function $base_matrix_eigenvalue_decomposition(A: RawMatrix): RawTuple {
  const decomposition = new EigenvalueDecomposition(getFullNumbers(A));

  const D: number[][] = decomposition.getD();
  const V: number[][] = decomposition.getV();

  const n = A.nrRows;

  const Dmat = zeroNumbers(n, n);
  const Vmat = zeroNumbers(n, n);

  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n; j++) {
      set(Dmat, i, j, D[i][j]);
      set(Vmat, i, j, V[i][j]);
    }
  }

  return tagTuple([Dmat, Vmat]);
}

/**
 * The eigen value decomposition.
 *
 * A = V '*' D '*' V'^'-1
 *
 * All matrices are n x n
 *
 * @param A A symmetric non-singular matrix
 * @returns A tuple (D, V)
 */
export function $base_matrix_eigenvalue_list(A: RawMatrix): RawList {
  const decomposition = new EigenvalueDecomposition(getFullNumbers(A));

  const d: number[] = decomposition.getRealEigenvalues();
  const e: number[] = decomposition.getImagEigenvalues();
  const V: number[][] = decomposition.getV();

  const n = A.nrRows;

  const tuples = [];

  for (let j = 0; j < n; j++) {
    const realEv = initialNumbers(1, 1, [[0, 0, d[j]]]);
    const imagEv = initialNumbers(1, 1, [[0, 0, e[j]]]);

    const vec = zeroNumbers(n, 1);

    for (let i = 0; i < n; i++) {
      set(vec, i, 0, V[i][j]);
    }

    tuples.push(tagTuple([realEv, imagEv, vec]));
  }

  return tagList(tuples);
}

export function $base_matrix_solve(x: RawMatrix, y: RawMatrix): RawMatrix {
  // https://en.wikipedia.org/wiki/Moore%E2%80%93Penrose_inverse
  // See https://github.com/Fylax/Apache-Commons-Math3-C-/blob/master/linear/SingularValueDecomposition.cs for the Java implementation

  // Doesn't give the same results as the Java variant. Gives NaN numbers in the current random tests for
  // cases that the Java variant has not issue with.

  const EPS = 1.0 * Math.pow(2, -52);

  const svd = $base_matrix_singular_value_list(x) as unknown as [
    RawMatrix,
    RawMatrix,
    RawMatrix
  ][];

  // Copied from SingularValueDecomposition.cs
  const treshold = Math.max(
    EPS,
    EPS * getNumber(svd[0][0], 0, 0) * Math.max(x.nrRows, x.nrColumns)
  );

  let inv = zeroNumbers(x.nrColumns, x.nrRows);
  for (const elt of svd) {
    // This loop swaps storage 2 and 3
    const tup = elt;
    const [a, v, w] = tup as unknown as [RawMatrix, RawMatrix, RawMatrix];
    const r = $base_matrix_reciprocal(a);
    if (Math.abs(getNumber(a, 0, 0)) > treshold) {
      // if (getNumber(r, 0, 0) > treshold) {
      const m = $base_matrix_scale(
        r,
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
}

const FLAG_JAMA_SVD: boolean = true;

/**
 * The singular value decomposition of a matrix A based on the JAMA library
 * implementation.
 *
 * Returns a list of tuples (s, u, v) where s is a 1x1 matrix with the singular
 * value, u is the left singular vector and v the right singular vector. If
 * matrix A is mxn then we should get vectors of size m and size n.
 *
 * @param A The input matrix
 * @returns A list of tuples (s, u, v)
 */
export function $base_matrix_singular_value_list(A: RawMatrix): RawList {
  // numerics and the jama version require that the number of rows is at least
  // as large as the number of columns. Transpose to fix this if needed.
  const needsTranspose = A.nrRows < A.nrColumns;

  const m = needsTranspose ? A.nrColumns : A.nrRows;
  const n = needsTranspose ? A.nrRows : A.nrColumns;

  const full = getFullNumbers(needsTranspose ? $base_matrix_transpose(A) : A);

  if (FLAG_JAMA_SVD) {
    const decomposition = new SingularValueDecomposition(full);

    const s: number[] = decomposition.getSingularValues();
    const U: number[][] = decomposition.getU();
    const V: number[][] = decomposition.getV();

    const r = s.length;

    const tuples = [];

    for (let j = 0; j < r; j++) {
      const sv = initialNumbers(1, 1, [[0, 0, s[j]]]);

      const left = zeroNumbers(m, 1);

      for (let i = 0; i < m; i++) {
        set(left, i, 0, U[i][j]);
      }

      const right = zeroNumbers(n, 1);

      for (let i = 0; i < n; i++) {
        set(right, i, 0, V[i][j]);
      }

      tuples.push(
        tagTuple(needsTranspose ? [sv, right, left] : [sv, left, right])
      );
    }

    return tagList(tuples);
  } else {
    const trip = numeric.svd(full);

    const r = trip.S.length;

    const tuples = [];

    for (let j = 0; j < r; j++) {
      const sv = initialNumbers(1, 1, [[0, 0, trip.S[j]]]);

      const left = zeroNumbers(m, 1);

      for (let i = 0; i < m; i++) {
        set(left, i, 0, trip.U[i][j]);
      }

      const right = zeroNumbers(n, 1);

      for (let i = 0; i < n; i++) {
        set(right, i, 0, trip.V[i][j]);
      }

      tuples.push(
        tagTuple(needsTranspose ? [sv, right, left] : [sv, left, right])
      );
    }

    return tagList(tuples);
  }
}

export function $base_matrix_cholesky_decomposition(A: RawMatrix): RawMatrix {
  const m = A.nrRows;
  const n = A.nrColumns;

  if (m !== n) {
    throw new Error("Matrix must be square for Cholesky decomposition");
  }

  const full = getFullNumbers(A);

  const decomposition = new CholeskyDecomposition(full);

  if (!decomposition.isSPD()) {
    throw new Error("matrix not positive definite in Cholesky decomposition");
  }

  const L: number[][] = decomposition.getL();

  return tagNumbers(L, m, n, STORAGE_FULL);
}

export function $base_matrix_random(): RawMatrix {
  return tagNumbers([[Math.random()]], 1, 1, STORAGE_FULL);
}

export function $base_matrix_ranking(x: RawMatrix): RawMatrix {
  const result = zeroNumbers(x.nrRows, x.nrColumns);
  const numbers = getCOONumbers(x);
  const rows = numbers[0];
  const columns = numbers[1];
  const values = numbers[2];

  const tmp = [];
  for (let i = 0; i < rows.length; i++) {
    tmp[i] = [rows[i], columns[i], values[i]];
  }
  tmp.sort(function (a, b) {
    if (a[2] > b[2]) return 1;
    if (a[2] < b[2]) return -1;
    return 0;
  });
  for (let i = 0; i < tmp.length; i++) {
    set(result, tmp[i][0], tmp[i][1], i + 1);
  }
  return result;
}

export function $base_list_mapnz(fun: RawFunction, x: RawMatrix): RawMatrix {
  const result = zeroNumbers(x.nrRows, x.nrColumns);
  const numbers = getCOONumbers(x);
  const rows = numbers[0];
  const columns = numbers[1];
  const values = numbers[2];

  for (let i = 0; i < rows.length; i++) {
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
  const list = new Array<RawValue>(Math.min(x.length, y.length));
  for (let i = 0; i < list.length; i++) {
    list[i] = tagTuple([x[i], y[i]]);
  }
  return tagList(list);
}

export function $base_list_map_list(fun: RawFunction, items: RawList): RawList {
  const list = tagList(new Array<RawValue>(items.length));
  for (let i = 0; i < items.length; i++) {
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
  const array = new Array<RawValue>(x.length - 1);
  for (let i = 0; i < array.length; i++) {
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
  const n = getNumber(num, 0, 0);
  const list = new Array<RawValue>(n);
  for (let i = 0; i < n; i++) {
    list[i] = initialNumbers(1, 1, [[0, 0, i]]);
  }
  return tagList(list);
}

export function $base_list_loop_list(
  init: RawValue,
  fun: RawFunction,
  list: RawList
): RawValue {
  let accu: RawValue = init;
  for (let i = 0; i < list.length; i++) {
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
  if (list.length === 0) {
    throw new Error("Cannot fold an empty list");
  }
  let accu = list[0];
  for (let i = 1; i < list.length; i++) {
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
      `Illegal format string. The first argument to format must be a string. Found: \n\n${rawValueLabel(
        formatter
      )}`
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
        // TODO: stringifyRawValue gebruiken!
        out += stringifyRawValue(args[argumentIndex++]);
        i += 2;

        // const debugHack = false;

        // const arg = args[argumentIndex++];
        // const mat = arg as RawMatrix;
        // if (debugHack && mat.kind === "matrix") {
        //   out += `mat(${mat.nrRows}, ${mat.nrColumns}) ${mat.join(" + ")} ${
        //     mat.storage
        //   }`;
        // }
        // if (typeof arg === "object" && arg.kind === "coordinates") {
        //   out += arg.position;
        // } else {
        //   out += arg.toString(); // TODO fix this
        // }
        // i += 2;
      } else if (secondChar === "n") {
        out += "\n";
        i += 2;
      } else {
        const regex = /^%([0-9]*)d/;

        const match = regex.exec(formatString.slice(i));

        if (match !== null && match[0].length > 0) {
          let size: number | null;
          try {
            size = match[1] === "" ? null : parseInt(match[1]);
          } catch (_: unknown) {
            size = null;
          }

          const mat = args[argumentIndex++]; // as RawMatrix;

          if (typeof mat !== "object" || mat.kind !== "matrix") {
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
            } catch (_: unknown) {
              nrDecs = NR_DECIMALS;
            }

            let size: number | null;
            try {
              size = match[1] === "" ? null : parseInt(match[1]);
            } catch (_: unknown) {
              size = null;
            }

            const mat = args[argumentIndex++];

            if (typeof mat !== "object" || mat.kind !== "matrix") {
              throw new Error("Expected matrix for %d format argument");
            }

            if (mat.nrRows === 1 && mat.nrColumns === 1) {
              const txt = getNumber(mat, 0, 0).toFixed(nrDecs);
              out += size === null ? txt : txt.padStart(size, " ");
            } else {
              // // FIXME: replace this quick and dirty solution with proper matrix formatting
              // const rowList = DOM(mat, { decimals: nrDecs }).textContent;
              // if (rowList === null) {
              //   out += "Could not format matrix";
              // } else {
              //   out += rowList;
              // }
              out += stringifyRawValue(mat);
            }

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

export let NR_DECIMALS = 2;
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
  const rowOrder = shape.rowOrder();
  const columnOrder = shape.columnOrder();

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

export function $base_string_char_at(
  str: RawString,
  pos: RawMatrix
): RawString {
  const n = str.length;

  if (n === 0) {
    throw new Error("char_at called on empty string");
  }

  const s = getNumber(pos, 0, 0) % n;

  return str.charAt(s < 0 ? s + n : s);
}

export function $base_string_string_length(x: RawString): RawMatrix {
  return initialNumbers(1, 1, [[0, 0, x.length]]);
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
  return tagArray(new Array<RawValue>(getNumber(n, 0, 0)));
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
//     const vertices = vectors.map(function (x) {
//         const v = Pacioli.getFullNumbers(x)
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
