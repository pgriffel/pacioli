/**
 * Copyright 2026 Paul Griffioen
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

import { ccsFull, ccsGather, ccsScatter, ccsSparse, sscatter } from "numeric";
import type { RawDOKMatrix, RawMatrix } from "./raw-matrix";

/**
 * Raw Matrix Numbers
 *
 * The numeric library is used for the storage of matrix numbers and for
 * linear algebra operations these numbers. This files contains type definitions
 * for the numeric numbers and conversion operations to manipulate them.
 *
 * See http://numericjs.com/wordpress/?p=66
 *
 * Numbers can be stored in four different ways:
 *
 * Full - Completely filled two-dimensional JavaScript array
 * DOK (Dictionary Of Keys format) - Sparse two-dimensional JavaScript array
 * COO (Coordinate format) - Triple of lists
 * CCS (Column Compressed Storage format) - Triple of lists
 *
 * numeric has two flavours of functions, i) functions that operate on Full
 * matrices and ii) functions that operate on CCS matrices
 *
 * For case i) the primitives call getFullNumbers
 * For case ii) the primitives call getCCSNumbers
 *
 * Currently both variants are used. Function $base_matrix_mmult uses CCS. Other
 * CCS calls are disabled by checking === 13 instead of === 3.
 */

/**
 * Union of the different representations of raw matrix numbers.
 */
export type NumericMatrix =
  | NumericFullMatrix
  | NumericDOKMatrix
  | NumericCOOMatrix
  | numericCCSMatrix;

export type NumericFullMatrix = number[][];
export type NumericDOKMatrix = (undefined | (number | undefined)[])[];
export type NumericCOOMatrix = [number[], number[], number[]];
export type numericCCSMatrix = [number[], number[], number[]];

/**
 * Convert numbers from a raw matrix to numeric numbers in 'full' storage format.
 *
 * @param numbers A RawMatrix
 * @returns The numeric numbers
 */
export function getFullNumbers(numbers: RawMatrix): NumericFullMatrix {
  const m = numbers.nrRows;
  const n = numbers.nrColumns;

  const fullFromDOK = function (
    nums: RawDOKMatrix | NumericDOKMatrix,
  ): NumericFullMatrix {
    const array = Array.from({ length: m }) as NumericFullMatrix;
    for (let i = 0; i < m; i++) {
      const inner = Array.from<number>({ length: n });
      for (let j = 0; j < n; j++) {
        const rowi = nums[i];
        inner[j] = rowi ? (rowi[j] ?? 0) : 0;
      }
      array[i] = inner;
    }
    // return tagNumbers(array, m, n, "full");
    return array;
  };

  switch (numbers.storage) {
    case "full": {
      return numbers;
    }
    case "DOK": {
      return fullFromDOK(numbers);
    }
    case "COO": {
      return fullFromDOK(sscatter(numbers) as NumericDOKMatrix);
    }
    // or:
    // return numeric.ccsFull(numeric.ccsScatter(this.numbers))
    case "CCS": {
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

      // return tagNumbers(full, m, n, "full");
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

/**
 * Convert numbers from a raw matrix to numeric numbers in 'COO' storage format.
 *
 * @param numbers A RawMatrix
 * @returns The numeric numbers
 */
export function getCOONumbers(numbers: RawMatrix): NumericCOOMatrix {
  switch (numbers.storage) {
    case "full": {
      return DOK2COO(numbers);
    }
    case "DOK": {
      return DOK2COO(numbers);
    }
    case "COO": {
      return numbers as unknown as NumericCOOMatrix;
    }
    case "CCS": {
      const ccsNumbers = ccsGather(numbers as unknown as numericCCSMatrix);
      const rows = ccsNumbers[0];
      const columns = ccsNumbers[1];
      const values = ccsNumbers[2];
      const tmp: NumericDOKMatrix = [];
      for (const [i, entry] of rows.entries()) {
        let row = tmp[entry];
        if (row === undefined) row = [];
        row[columns[i]] = values[i];
      }
      return DOK2COO(tmp);
    }
    default: {
      throw new Error("unknown number kind");
    }
  }
}

/**
 * Convert numbers from a raw matrix to numeric numbers in 'CCS' storage format.
 *
 * @param numbers A RawMatrix
 * @returns The numeric numbers
 */
export function getCCSNumbers(numbers: RawMatrix): numericCCSMatrix {
  let ccsNumbers: numericCCSMatrix;
  switch (numbers.storage) {
    case "full": {
      ccsNumbers = ccsSparse(numbers);
      break;
    }
    case "DOK": {
      const gathered = DOK2COO(numbers);
      if (gathered[0].length === 0) {
        ccsNumbers = ccsScatter([[0], [0], [0]]);
      } else {
        ccsNumbers = ccsScatter(gathered);
      }
      break;
    }
    case "COO": {
      if (numbers[0].length === 0) {
        ccsNumbers = ccsScatter([[0], [0], [0]]);
      } else {
        ccsNumbers = ccsScatter(numbers as unknown as NumericCOOMatrix);
      }
      break;
    }
    case "CCS": {
      return numbers as unknown as numericCCSMatrix;
    }
    default: {
      throw new Error("unknown number kind");
    }
  }
  return ccsNumbers; // tagNumbers(ccsNumbers, numbers.nrRows, numbers.nrColumns, "CCS");
}

/**
 * Helper function.
 */
function DOK2COO(numbers: RawDOKMatrix | NumericDOKMatrix): NumericCOOMatrix {
  const tripleArray: [number, number, number][] = [];

  for (const x in numbers) {
    if (Object.prototype.hasOwnProperty.call(numbers, x)) {
      const parsedX = Number.parseInt(x);
      //if (typeof parsedX === "number") {
      if (Number.isFinite(parsedX) && !Number.isNaN(parsedX)) {
        const row = numbers[parsedX];
        for (const y in row) {
          if (Object.prototype.hasOwnProperty.call(row, y)) {
            const parsedY = Number.parseInt(y);
            //if (typeof parsedY === "number") {
            if (Number.isFinite(parsedY) && !Number.isNaN(parsedY)) {
              const value = row[parsedY];
              if (value !== undefined && value !== 0) {
                tripleArray.push([parsedX, parsedY, value]);
              }
            }
          }
        }
      }
    }
  }

  tripleArray.sort(
    (a: [number, number, number], b: [number, number, number]) => {
      if (a[0] > b[0]) return 1;
      if (a[0] < b[0]) return -1;
      if (a[1] > b[1]) return 1;
      if (a[1] < b[1]) return -1;
      return 0;
    },
  );

  const rows = [];
  const columns = [];
  const values = [];

  for (const element of tripleArray) {
    rows.push(element[0]);
    columns.push(element[1]);
    values.push(element[2]);
  }

  return [rows, columns, values];
}
