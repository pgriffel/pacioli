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

import { DimNum, SIUnit } from "uom-ts";
import { TableBuilder } from "../table/table-builder";
import { NR_DECIMALS } from "../primitives";
import type { MatrixShape } from "../values/matrix-shape";
import type {
  NumericFullMatrix,
  numericCCSMatrix,
  NumericCOOMatrix,
  NumericDOKMatrix,
} from "./numbers";
import { getCOONumbers, getFullNumbers } from "./numbers";
import { tagMatrix } from "./raw-value";
import { TableColumn } from "../table/table-column";

export type RawMatrixStorage = "full" | "DOK" | "COO" | "CCS";

/**
 * Type of an unboxed matrix. Implemented as a nested array of numbers with some
 * extra properties (nr rows, nr columns, and storage kind). The meaning of the
 * numbers depends on the storage kind.
 */
export type RawMatrix =
  | RawFullMatrix
  | RawDOKMatrix
  | RawCOOMatrix
  | RawCCSMatrix;

export interface RawFullMatrix extends NumericFullMatrix {
  kind: "matrix";
  nrRows: number;
  nrColumns: number;
  shape?: MatrixShape; // see oneNumbersFromShape
  storage: "full";
}

export interface RawDOKMatrix extends NumericDOKMatrix {
  kind: "matrix";
  nrRows: number;
  nrColumns: number;
  shape?: MatrixShape; // see oneNumbersFromShape
  storage: "DOK";
}

export interface RawCOOMatrix extends NumericCOOMatrix {
  kind: "matrix";
  nrRows: number;
  nrColumns: number;
  shape?: MatrixShape; // see oneNumbersFromShape
  storage: "COO";
}

export interface RawCCSMatrix extends numericCCSMatrix {
  kind: "matrix";
  nrRows: number;
  nrColumns: number;
  shape?: MatrixShape; // see oneNumbersFromShape
  storage: "CCS";
}

export function get(numbers: RawMatrix, i: number, j: number) {
  return tagMatrix([[getNumber(numbers, i, j)]], 1, 1, "full");
}

export function set(
  numbers: RawMatrix,
  row: number,
  column: number,
  value: number,
) {
  switch (numbers.storage) {
    case "full": {
      numbers[row][column] = value;
      break;
    }
    case "DOK": {
      if (numbers[row] === undefined) {
        numbers[row] = Array.from({ length: numbers.nrColumns });
      }
      numbers[row][column] = value;
      break;
    }
    case "COO": {
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
    case "CCS": {
      throw new Error("Set not implemented for CCS storage");
    }
  }
}

export function getNumber(
  numbers: RawMatrix,
  row: number,
  column: number,
): number {
  switch (numbers.storage) {
    case "full": {
      return numbers[row][column];
    }
    case "DOK": {
      const entry = numbers[row];
      return entry ? (entry[column] ?? 0) : 0;
    }
    case "COO": {
      const rows = numbers[0];
      const columns = numbers[1];
      const values = numbers[2];
      for (const [i, entry] of rows.entries()) {
        if (row < entry) return 0;
        if (row === entry) {
          if (column < columns[i]) return 0;
          if (column === columns[i]) return values[i];
        }
      }
      return 0;
    }
    case "CCS": {
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
  fun: (val: number) => number,
): RawMatrix {
  const coo = getCOONumbers(numbers);
  return tagMatrix(
    [coo[0], coo[1], coo[2].map((element) => fun(element))],
    numbers.nrRows,
    numbers.nrColumns,
    "COO",
  );
}

export function elementWiseNumbers(
  xNumbers: RawMatrix,
  yNumbers: RawMatrix,
  fun: (x: number, y: number) => number,
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

  return tagMatrix(
    [rows, columns, values],
    xNumbers.nrRows,
    xNumbers.nrColumns,
    "COO",
  );
}

export function findNonZero(
  xNumbers: RawMatrix,
  yNumbers: RawMatrix,
  fun: (x: number, y: number) => boolean,
  zero_zero_case: boolean,
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

/**
 * Create a TableBuilder.
 *
 * The numbers in the table are dimensionless because raw matrices don't carry untis!
 *
 * @param matrix A raw matrix
 * @param header Title for the value column. Default is "Value"
 * @returns The TableBuilder
 */
export function tableBuilderFromRawMatrix(
  matrix: RawMatrix,
  header: string = "Value",
): TableBuilder {
  const indexSets = [
    ...(matrix.nrRows === 1 ? [] : ["row"]),
    ...(matrix.nrColumns === 1 ? [] : ["column"]),
  ];
  const index: string[][] = [];
  const values: { num: DimNum; isZero: boolean }[] = [];

  const nrRows = matrix.nrRows;
  const nrColumns = matrix.nrColumns;

  if (nrRows === 0 || nrColumns === 0) {
    throw new Error("No rows and columns?");
  } else {
    const numbers = getFullNumbers(matrix);

    // Add the data rows
    for (let i = 0; i < nrRows; i++) {
      for (let j = 0; j < nrColumns; j++) {
        index.push([i.toString(), j.toString()]);

        const num = numbers[i][j];

        const dimNum = DimNum.fromNumber(num, SIUnit.ONE);

        values.push({ num: dimNum, isZero: num === 0 });
      }
    }
  }

  const column = new TableColumn(indexSets, index, header, values);

  const options = {
    decimals: NR_DECIMALS,
    ignoredecimals: false,
    nozerorows: false,
    totals: true,
  };

  return new TableBuilder([column], options);
}
