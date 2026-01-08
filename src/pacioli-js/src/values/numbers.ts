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

import { ccsFull, ccsGather, ccsScatter, ccsSparse, sscatter } from "numeric";
import type { MatrixStorage, RawMatrix } from "../value";
import { STORAGE_CCS, STORAGE_COO, STORAGE_DOK, STORAGE_FULL } from "../value";

// Match the types from numeric
export type FULL_MATRIX = number[][];
export type DOK_MATRIX = number[][];
export type COO_MATRIX = [number[], number[], number[]];
export type CCS_MATRIX = [number[], number[], number[]];
export type NUMERIC_MATRIX = FULL_MATRIX | DOK_MATRIX | COO_MATRIX | CCS_MATRIX;

// -----------------------------------------------------------------------------
// Matrix Numbers
//
// See http://numericjs.com/wordpress/?p=66
//
// Full - Completely filled two-dimensional JavaScript array
// DOK (Dictionary Of Keys format) - Sparse two-dimensional JavaScript array
// COO (Coordinate format) - Triple of lists
// CCS (Column Compressed Storage format) - Triple of lists
//
// numeric has two flavours of functions, i) functions that operate on Full
// matrices and ii) functions that operate on CCS matrices
//
// For case i) the primitives call getFullNumbers
// For case ii) the primitives call getCCSNumbers
//
// Currently both variants are used. Function $base_matrix_mmult uses CCS. Other
// CCS calls are disabled by checking === 13 instead of === 3.
// -----------------------------------------------------------------------------

// Array.prototype.toString = function () {
//   const array = this as RawMatrix | RawTuple | RawList;
//   if (array.kind === "matrix") {
//     if (array.nrRows === 1 && array.nrColumns === 1) {
//       return getNumber(array, 0, 0).toString();
//     } else {
//       const nums = getFullNumbers(array) as number[][];
//       return (
//         "[" + nums.map((row) => "[" + row.join(", ") + "]").join(", ") + "]"
//       );
//     }
//   } else if (array.kind === "tuple") {
//     return "(" + array.map((x) => x.toString()).join(", ") + ")";
//   } else if (array.kind === "list") {
//     return "[" + array.map((x) => x.toString()).join(", ") + "]";
//   }
//   return this.map((x) => x.toString()).join(",");
// };

export function tagNumbers(
  numbers: NUMERIC_MATRIX,
  nrRows: number,
  nrColumns: number,
  storage: MatrixStorage
): RawMatrix {
  const matrix = numbers as RawMatrix;

  matrix.nrRows = nrRows;
  matrix.nrColumns = nrColumns;
  matrix.storage = storage;
  matrix.kind = "matrix";

  return matrix;
}

export function getFullNumbers(numbers: RawMatrix): FULL_MATRIX {
  const m = numbers.nrRows;
  const n = numbers.nrColumns;

  const fullFromDOK = function (nums: number[][]): FULL_MATRIX {
    const array = new Array(m);
    for (let i = 0; i < m; i++) {
      const inner = new Array(n);
      for (let j = 0; j < n; j++) {
        inner[j] = nums[i] ? nums[i][j] || 0 : 0;
      }
      array[i] = inner;
    }
    // return tagNumbers(array, m, n, STORAGE_FULL);
    return array;
  };

  switch (numbers.storage) {
    case STORAGE_FULL: {
      return numbers;
    }
    case STORAGE_DOK: {
      return fullFromDOK(numbers);
    }
    case STORAGE_COO: {
      return fullFromDOK(sscatter(numbers) as DOK_MATRIX);
    }
    // or:
    // return numeric.ccsFull(numeric.ccsScatter(this.numbers))
    case STORAGE_CCS: {
      // Let numeric create a full matrix, although it might be too small
      const full = ccsFull(numbers as unknown as CCS_MATRIX);

      // Fill the missing rows and columns with zeros
      for (let i = full.length; i < m; i++) {
        full[i] = [];
        for (let j = 0; j < n; j++) {
          full[i][j] = 0;
        }
      }
      for (let j = full[0].length; j < n; j++) {
        for (let i = 0; i < m; i++) {
          full[i][j] = 0;
        }
      }

      // return tagNumbers(full, m, n, STORAGE_FULL);
      return full;
    }
  }
}

// Pacioli.getDOKNumbers = function (numbers) {

//     const m = numbers.nrRows
//     const n = numbers.nrColumns

//     sparseDOK = function (nums) {
//         const array = []
//         for (const i = 0; i < m; i++) {
//             const inner = nums[i]
//             for (const j = 0; j < n; j++) {
//                 if (inner[j] !== 0) {
//                     if (array[i] === undefined) {
//                         array[i] = []
//                     }
//                     array[i][j] = inner[j]
//                 }
//             }
//         }
//         return Pacioli.tagNumbers(array, m, n, 1)
//     }

//     switch (numbers.storage) {
//     case 0:
//         return sparseDOK(numbers)
//     case 1:
//         return numbers
//     case 2:
//         return Pacioli.tagNumbers(numeric.sscatter(numbers), m, n, 1)
//     case 3:
//         return Pacioli.tagNumbers(numeric.sscatter(numeric.ccsGather(numbers)), m, n, 1)
//     }
// }

export function getCOONumbers(numbers: RawMatrix): COO_MATRIX {
  switch (numbers.storage) {
    case STORAGE_FULL: {
      return DOK2COO(numbers);
    }
    case STORAGE_DOK: {
      return DOK2COO(numbers);
    }
    case STORAGE_COO: {
      return numbers as unknown as COO_MATRIX;
    }
    case STORAGE_CCS: {
      const ccsNumbers = ccsGather(numbers as unknown as CCS_MATRIX);
      const rows = ccsNumbers[0];
      const columns = ccsNumbers[1];
      const values = ccsNumbers[2];
      const tmp: DOK_MATRIX = [];
      for (let i = 0; i < rows.length; i++) {
        if (tmp[rows[i]] === undefined) tmp[rows[i]] = [];
        tmp[rows[i]][columns[i]] = values[i];
      }
      return DOK2COO(tmp);
    }
    default:
      throw new Error("unknown number kind");
  }
}

export function getCCSNumbers(numbers: RawMatrix): CCS_MATRIX {
  let ccsNumbers: CCS_MATRIX;
  switch (numbers.storage) {
    case STORAGE_FULL: {
      ccsNumbers = ccsSparse(numbers);
      break;
    }
    case STORAGE_DOK: {
      const gathered = DOK2COO(numbers);
      if (gathered[0].length === 0) {
        ccsNumbers = ccsScatter([[0], [0], [0]]);
      } else {
        ccsNumbers = ccsScatter(gathered);
      }
      break;
    }
    case STORAGE_COO: {
      if (numbers[0].length === 0) {
        ccsNumbers = ccsScatter([[0], [0], [0]]);
      } else {
        ccsNumbers = ccsScatter(numbers as unknown as COO_MATRIX);
      }
      break;
    }
    case STORAGE_CCS: {
      return numbers as unknown as CCS_MATRIX;
    }
    default: {
      throw new Error("unknown number kind");
    }
  }
  return ccsNumbers; // tagNumbers(ccsNumbers, numbers.nrRows, numbers.nrColumns, STORAGE_CCS);
}

function DOK2COO(numbers: DOK_MATRIX): COO_MATRIX {
  const rows = [];
  const columns = [];
  const values = [];
  const tmp = [];
  for (const x in numbers) {
    if (Object.prototype.hasOwnProperty.call(numbers, x)) {
      const parsedX = parseInt(x);
      //if (typeof parsedX === "number") {
      if (isFinite(parsedX) && !isNaN(parsedX)) {
        const row = numbers[parsedX];
        for (const y in row) {
          if (Object.prototype.hasOwnProperty.call(row, y)) {
            const parsedY = parseInt(y);
            //if (typeof parsedY === "number") {
            if (isFinite(parsedY) && !isNaN(parsedY)) {
              const value = row[parsedY];
              if (value !== 0) {
                tmp.push([parsedX, parsedY, value]);
              }
            }
          }
        }
      }
    }
  }
  tmp.sort(function (a, b) {
    if (a[0] > b[0]) return 1;
    if (a[0] < b[0]) return -1;
    if (a[1] > b[1]) return 1;
    if (a[1] < b[1]) return -1;
    return 0;
  });
  for (let i = 0; i < tmp.length; i++) {
    rows.push(tmp[i][0]);
    columns.push(tmp[i][1]);
    values.push(tmp[i][2]);
  }

  // // TODO: drop the tagNumbers
  // return tagNumbers(
  //   [rows, columns, values],
  //   numbers.nrRows,
  //   numbers.nrColumns,
  //   STORAGE_COO
  // ) as unknown as COO_MATRIX;
  return [rows, columns, values];
}

export function get(numbers: RawMatrix, i: number, j: number) {
  return tagNumbers([[getNumber(numbers, i, j)]], 1, 1, STORAGE_FULL);
}

export function set(
  numbers: RawMatrix,
  row: number,
  column: number,
  value: number
) {
  switch (numbers.storage) {
    case STORAGE_FULL: {
      numbers[row][column] = value;
      break;
    }
    case STORAGE_DOK: {
      if (numbers[row] === undefined) {
        numbers[row] = new Array(numbers.nrColumns);
      }
      numbers[row][column] = value;
      break;
    }
    case STORAGE_COO: {
      const rows = numbers[0];
      const columns = numbers[1];
      const values = numbers[2];
      const n = rows.length;
      let i = n;
      while (
        0 < i &&
        (row < rows[i - 1] || (row === rows[i - 1] && column <= columns[i - 1]))
      ) {
        i--;
      }
      if (i < n && column !== columns[i]) {
        for (let k = n; i < k; k--) {
          rows[k] = rows[k - 1];
          columns[k] = columns[k - 1];
          values[k] = values[k - 1];
        }
      }
      rows[i] = row;
      columns[i] = column;
      values[i] = value;
      break;
    }
    case STORAGE_CCS: {
      throw "Set not implemented for CCS storage";
    }
  }
}

export function getNumber(
  numbers: RawMatrix,
  row: number,
  column: number
): number {
  switch (numbers.storage) {
    case STORAGE_FULL: {
      return numbers[row][column];
    }
    case STORAGE_DOK: {
      return numbers[row] ? numbers[row][column] || 0 : 0;
    }
    case STORAGE_COO: {
      const rows = numbers[0];
      const columns = numbers[1];
      const values = numbers[2];
      for (let i = 0; i < rows.length; i++) {
        if (row < rows[i]) return 0;
        if (row === rows[i]) {
          if (column < columns[i]) return 0;
          if (column === columns[i]) return values[i];
        }
      }
      return 0;
    }
    case STORAGE_CCS: {
      const columns = numbers[0];
      const rows = numbers[1];
      const values = numbers[2];
      const n = columns.length - 1;
      if (column < n) {
        const start = columns[column];
        const end = columns[column + 1];
        for (let i = start; i !== end; i++) {
          if (rows[i] === row) {
            return values[i];
          }
        }
        return 0;
      } else {
        return 0;
      }
    }
    default: {
      throw new Error("unexpect number storage");
    }
  }
}

export function unaryNumbers(
  numbers: RawMatrix,
  fun: (val: number) => number
): RawMatrix {
  const coo = getCOONumbers(numbers);
  return tagNumbers(
    [coo[0], coo[1], coo[2].map(fun)],
    numbers.nrRows,
    numbers.nrColumns,
    STORAGE_COO
  );
}

export function elementWiseNumbers(
  xNumbers: RawMatrix,
  yNumbers: RawMatrix,
  fun: (x: number, y: number) => number
) {
  let px = 0;
  let py = 0;
  const xCOO = getCOONumbers(xNumbers);
  const yCOO = getCOONumbers(yNumbers);
  const xRows = xCOO[0];
  const xColumns = xCOO[1];
  const xValues = xCOO[2];
  const yRows = yCOO[0];
  const yColumns = yCOO[1];
  const yValues = yCOO[2];
  const xLen = xRows.length;
  const yLen = yRows.length;

  const rows: number[] = [];
  const columns: number[] = [];
  const values: number[] = [];

  const handle = function (r: number, c: number, vx: number, vy: number) {
    const val = fun(vx, vy);
    if (typeof val === "number" && val !== 0) {
      rows.push(r);
      columns.push(c);
      values.push(val);
    }
  };

  while (px < xLen && py < yLen) {
    const rx = xRows[px];
    const ry = yRows[py];
    const cx = xColumns[px];
    const cy = yColumns[py];
    if (rx > ry) {
      handle(ry, cy, 0, yValues[py]);
      py++;
    } else if (rx < ry) {
      handle(rx, cx, xValues[px], 0);
      px++;
    } else {
      if (cx < cy) {
        handle(rx, cx, xValues[px], 0);
        px++;
      } else if (cx > cy) {
        handle(ry, cy, 0, yValues[py]);
        py++;
      } else {
        handle(rx, cy, xValues[px], yValues[py]);
        px++;
        py++;
      }
    }
  }

  while (px < xLen) {
    const rx = xRows[px];
    const cx = xColumns[px];
    handle(rx, cx, xValues[px], 0);
    px++;
  }

  while (py < yLen) {
    const ry = yRows[py];
    const cy = yColumns[py];
    handle(ry, cy, 0, yValues[py]);
    py++;
  }

  return tagNumbers(
    [rows, columns, values],
    xNumbers.nrRows,
    xNumbers.nrColumns,
    STORAGE_COO
  );
}

export function findNonZero(
  xNumbers: RawMatrix,
  yNumbers: RawMatrix,
  fun: (x: number, y: number) => boolean,
  zero_zero_case: boolean
) {
  let px = 0;
  let py = 0;
  const xCOO = getCOONumbers(xNumbers);
  const yCOO = getCOONumbers(yNumbers);
  const xRows = xCOO[0];
  const xColumns = xCOO[1];
  const xValues = xCOO[2];
  const yRows = yCOO[0];
  const yColumns = yCOO[1];
  const yValues = yCOO[2];
  const xLen = xRows.length;
  const yLen = yRows.length;
  let count = 0;

  while (px < xLen && py < yLen) {
    const rx = xRows[px];
    const ry = yRows[py];
    const cx = xColumns[px];
    const cy = yColumns[py];
    if (rx > ry) {
      if (fun(0, yValues[py])) return true; //[ry, cy]
      py++;
    } else if (rx < ry) {
      if (fun(xValues[px], 0)) return true; //[rx, cx]
      px++;
    } else {
      if (cx < cy) {
        if (fun(xValues[px], 0)) return true; //[rx, cx]
        px++;
      } else if (cx > cy) {
        if (fun(0, yValues[py])) return true; //[ry, cy]
        py++;
      } else {
        if (fun(xValues[px], yValues[py])) return true; //[rx, cy]
        px++;
        py++;
      }
    }
    count++;
  }

  while (px < xLen) {
    // const rx = xRows[px];
    // const cx = xColumns[px];
    if (fun(xValues[px], 0)) return true; //[rx, cx]
    px++;
    count++;
  }

  while (py < yLen) {
    // const ry = yRows[py];
    // const cy = yColumns[py];
    if (fun(0, yValues[py])) return true; //[ry, cy]
    py++;
    count++;
  }

  if (count === xNumbers.nrRows * xNumbers.nrColumns) {
    return false;
  } else {
    return zero_zero_case;
  }
}

// Pacioli.projectNumbers = function (numbers, shape, cols) {
//     const projectedShape = shape.project(cols)
//     const result = Pacioli.zeroNumbers(projectedShape.nrRows(), projectedShape.nrColumns())
//     const coo = Pacioli.getCOONumbers(numbers)
//     const rows = coo[0]
//     const values = coo[2]
//     for (const i = 0; i < rows.length; i++) {
//         const coords = shape.rowCoordinates(rows[i])
//         const pos = coords.project(cols).position()
//         const sum = Pacioli.getNumber(result, pos, 0)
//         Pacioli.set(result, pos, 0, sum === undefined ? values[i] : sum + values[i])
//     }
//     return result
// }

// Pacioli.projectNumbersAlt = function (numbers, shape, cols) {

//     // Determine the projected shape
//     const projectedShape = shape.project(cols);
//     const m = projectedShape.nrRows();
//     const n = projectedShape.nrColumns();

//     // Determine which columns are not projected
//     const colsComp = [];
//     for (const i = 0; i < shape.rowOrder(); i++) {
//         if (cols.indexOf(i) == -1) {
//             colsComp.push(i);
//         }
//     }

//     // Determine the size of the complement coordinates index set.
//     const nrRows = shape.project(colsComp).nrRows();

//     // Create a map from the complement coordinates to the projected matrices.
//     // Matrix map(x) is the sum of all rows where the compound index contains x.
//     const map = new Map();
//     const coo = Pacioli.getCOONumbers(numbers)
//     const rows = coo[0]
//     const values = coo[2]
//     for (const i = 0; i < rows.length; i++) {
//         const coords = shape.rowCoordinates(rows[i])
//         const coordsComp = coords.project(colsComp).position();
//         const pos = coords.project(cols).position()
//         if (!map.has(coordsComp)) {
//             map.set(coordsComp, Pacioli.zeroNumbers(m, n))
//         }
//         const mat = map.get(coordsComp);
//         const sum = Pacioli.getNumber(mat, pos, 0)
//         Pacioli.set(mat, pos, 0, sum === undefined ? values[i] : sum + values[i])
//     }

//     // Turn the map into the desired list
//     const result = [];
//     map.forEach(function (value, key) {
//         const pair = Pacioli.tagKind([{kind: "coordinates", position: key, size: nrRows}, value], "tuple");
//         result.push(pair)
//     });

//     // Return the list
//     return Pacioli.tagKind(result, "list");
// }
