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
import type { RawDOKMatrix, RawMatrix } from "./raw-matrix";
import {
  STORAGE_CCS,
  STORAGE_COO,
  STORAGE_DOK,
  STORAGE_FULL,
} from "./raw-matrix";

// Match the types from numeric
export type NumericFullMatrix = number[][];
export type NumericDOKMatrix = (number | undefined)[][];
export type NumericCOOMatrix = [number[], number[], number[]];
export type numericCCSMatrix = [number[], number[], number[]];
export type NUMERIC_MATRIX =
  | NumericFullMatrix
  | NumericDOKMatrix
  | NumericCOOMatrix
  | numericCCSMatrix;

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

export function getFullNumbers(numbers: RawMatrix): NumericFullMatrix {
  const m = numbers.nrRows;
  const n = numbers.nrColumns;

  const fullFromDOK = function (
    nums: RawDOKMatrix | NumericDOKMatrix
  ): NumericFullMatrix {
    const array = new Array(m) as NumericFullMatrix;
    for (let i = 0; i < m; i++) {
      const inner = new Array<number>(n);
      for (let j = 0; j < n; j++) {
        const rowi = nums[i];
        inner[j] = rowi ? rowi[j] || 0 : 0;
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
      return fullFromDOK(sscatter(numbers) as NumericDOKMatrix);
    }
    // or:
    // return numeric.ccsFull(numeric.ccsScatter(this.numbers))
    case STORAGE_CCS: {
      // Let numeric create a full matrix, although it might be too small
      const full = ccsFull(numbers as unknown as numericCCSMatrix);

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

export function getCOONumbers(numbers: RawMatrix): NumericCOOMatrix {
  switch (numbers.storage) {
    case STORAGE_FULL: {
      return DOK2COO(numbers);
    }
    case STORAGE_DOK: {
      return DOK2COO(numbers);
    }
    case STORAGE_COO: {
      return numbers as unknown as NumericCOOMatrix;
    }
    case STORAGE_CCS: {
      const ccsNumbers = ccsGather(numbers as unknown as numericCCSMatrix);
      const rows = ccsNumbers[0];
      const columns = ccsNumbers[1];
      const values = ccsNumbers[2];
      const tmp: NumericDOKMatrix = [];
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

export function getCCSNumbers(numbers: RawMatrix): numericCCSMatrix {
  let ccsNumbers: numericCCSMatrix;
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
        ccsNumbers = ccsScatter(numbers as unknown as NumericCOOMatrix);
      }
      break;
    }
    case STORAGE_CCS: {
      return numbers as unknown as numericCCSMatrix;
    }
    default: {
      throw new Error("unknown number kind");
    }
  }
  return ccsNumbers; // tagNumbers(ccsNumbers, numbers.nrRows, numbers.nrColumns, STORAGE_CCS);
}

function DOK2COO(numbers: RawDOKMatrix | NumericDOKMatrix): NumericCOOMatrix {
  const rows = [];
  const columns = [];
  const values = [];
  const tmp: [number, number, number][] = [];
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
              if (value !== undefined && value !== 0) {
                tmp.push([parsedX, parsedY, value]);
              }
            }
          }
        }
      }
    }
  }
  tmp.sort((a: [number, number, number], b: [number, number, number]) => {
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
