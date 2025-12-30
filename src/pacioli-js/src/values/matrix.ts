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

import { DimNum } from "uom-ts";
import type { Context, SIUnit } from "uom-ts";
import {
  getCOONumbers,
  getFullNumbers,
  getNumber,
  tagNumbers,
} from "./numbers";
import { MatrixShape } from "./matrix-shape";
import type { RawCoordinates, RawMatrix } from "../value";
import { STORAGE_COO } from "../value";

/**
 * A matrix combines a shape and numbers.
 *
 * Operations on a matrix are limited to what is used in UI etc. Code
 * generated from Pacioli does not use this class. It is only for a
 * convenient API.
 *
 * TODO: define a proper API. Expose all primitives?
 *
 */
export class PacioliMatrix {
  readonly kind = "matrix";

  constructor(public shape: MatrixShape, public numbers: RawMatrix) {}

  /**
   * Filters the matrix entries. Only entries satisfying the predicate remain.
   *
   * @param predicate A boolean function on coordinates and values
   * @returns A new matrix of the same shape
   */
  public filter(
    predicate: (value: number, i: RawCoordinates, j: RawCoordinates) => boolean
  ) {
    return new PacioliMatrix(
      this.shape,
      filter_matrix(this.numbers, predicate)
    );
  }

  getDimNum(row: number, column: number) {
    return DimNum.fromNumber(
      this.getNum(row, column),
      this.getUnit(row, column)
    );
  }

  getNum(row: number, column: number) {
    return getNumber(this.numbers, row, column);
  }

  getUnit(row: number, column: number) {
    return this.shape.unitAt(row, column);
  }

  public convertUnit(unit: SIUnit, context: Context) {
    const unitShape = MatrixShape.scalar(unit);
    return new PacioliMatrix(
      this.shape.dimensionless().scale(unitShape),
      convert_unit(this.numbers, this.shape, unit, context)
    );
  }

  public keyValueList(zeros: boolean = false): {
    values: { row: string[]; column: string[]; value: DimNum }[];
    rows: string[];
    columns: string[];
  } {
    // The key value list we will return
    const kvList: { row: string[]; column: string[]; value: DimNum }[] = [];

    if (zeros) {
      // Get the full numbers
      const full = getFullNumbers(this.numbers);

      // Fill the list with all values
      for (let i = 0; i < this.shape.nrRows(); i++) {
        for (let j = 0; j < this.shape.nrColumns(); j++) {
          kvList.push({
            row: this.shape.rowCoordinates(i).names,
            column: this.shape.columnCoordinates(j).names,
            value: DimNum.fromNumber(full[i][j], this.shape.unitAt(i, j)),
          });
        }
      }
    } else {
      // Get the COO numbers
      const coo = getCOONumbers(this.numbers);
      const rows = coo[0];
      const columns = coo[1];
      const values = coo[2];

      // Fill the list with all non-zero values
      for (let i = 0; i < rows.length; i++) {
        if (values[i] !== 0) {
          kvList.push({
            row: this.shape.rowCoordinates(rows[i]).names,
            column: this.shape.columnCoordinates(columns[i]).names,
            value: DimNum.fromNumber(
              values[i],
              this.shape.unitAt(rows[i], columns[i])
            ),
          });
        }
      }
    }

    return {
      values: kvList,
      rows: this.shape.rowNames(),
      columns: this.shape.columnNames(),
    };
  }

  public number(): number {
    return getNumber(this.numbers, 0, 0);
  }

  public toDecimal(decimals: number) {
    function columnSize(rows: string[][], column: number) {
      return rows
        .map((row) => row[column].length)
        .reduce((x, y) => Math.max(x, y), 0);
    }

    const shape = this.shape;
    const num = this.numbers;

    const rowOrder = shape.rowOrder();
    const columnOrder = shape.columnOrder();

    if (rowOrder === 0 && columnOrder === 0) {
      const n = getNumber(num, 0, 0);
      return n.toFixed(decimals) + "" + shape.unitAt(0, 0).toText();
    } else {
      const matrix = new PacioliMatrix(shape, num);
      const rows = matrix.tableRows(decimals) as string[][];
      const colSize0 = columnSize(rows, 0);

      if (rowOrder > 0 && columnOrder > 0) {
        const colSize1 = columnSize(rows, 1);
        const colSize2 = columnSize(rows.slice(1), 2);
        const text = rows
          .map((row, i) => {
            return i === 0
              ? `${row[0].padEnd(colSize0, " ")} ${row[1].padEnd(
                  colSize1,
                  " "
                )} ${row[2]}`
              : `${row[0].padEnd(colSize0, " ")} ${row[1].padEnd(
                  colSize1,
                  " "
                )} ${row[2].padStart(colSize2, " ")} ${row[3]}`;
          })
          .reduce((x, y) => `${x}${y}\n`, "");
        return text;
      } else {
        const colSize1 = columnSize(rows.slice(1), 1);
        const text = rows
          .map((row, i) => {
            return i === 0
              ? `${row[0].padEnd(colSize0, " ")} ${row[1]}`
              : `${row[0].padEnd(colSize0, " ")} ${row[1].padStart(
                  colSize1,
                  " "
                )} ${row[2]}`;
          })
          .reduce((x, y) => `${x}${y}\n`, "");
        return text;
      }
    }
  }

  public tableRows(decimals: number): string[][] {
    const shape = this.shape;
    const numbers = this.numbers;

    const rowOrder = shape.rowOrder();
    const columnOrder = shape.columnOrder();

    const table: string[][] = [];

    let row: string[] = [];

    if (0 < rowOrder) {
      row.push(shape.rowName());
    }
    if (0 < columnOrder) {
      row.push(shape.columnName());
    }

    row.push("Value");
    row.push("");

    table.push(row);

    const coo = getCOONumbers(numbers);
    const rows = coo[0];
    const columns = coo[1];
    const values = coo[2];
    if (rows.length === 0) {
      return [];
    } else {
      for (let i = 0; i < rows.length; i++) {
        row = [];
        if (0 < rowOrder) {
          row.push(shape.rowCoordinates(rows[i]).names.toString());
        }
        if (0 < columnOrder) {
          row.push(shape.columnCoordinates(rows[i]).names.toString());
        }

        row.push(values[i].toFixed(decimals));

        const un = shape.unitAt(rows[i], columns[i]);
        if (un.toText() === "1") {
          row.push("");
        } else {
          row.push(un.toText());
        }

        table.push(row);
      }
    }
    return table;
  }
}

/**
 * Helper for the Matrix type. Temporary until calling Pacioli functions
 * is implemented!? Could be/should be/is a glbl_ function!?
 */
export function filter_matrix(
  numbers: RawMatrix,
  predicate: (value: number, i: RawCoordinates, j: RawCoordinates) => boolean
) {
  const m = numbers.nrRows;
  const n = numbers.nrColumns;

  const coo = getCOONumbers(numbers);

  const rows = coo[0];
  const columns = coo[1];
  const values = coo[2];

  const filteredRows = [];
  const filteredColumns = [];
  const filteredValues = [];

  for (let i = 0; i < rows.length; i++) {
    const rowCoords = {
      kind: "coordinates" as const,
      position: rows[i],
      size: m,
    };
    const columnCoords = {
      kind: "coordinates" as const,
      position: columns[i],
      size: n,
    };
    if (predicate(values[i], rowCoords, columnCoords)) {
      filteredRows.push(rows[i]);
      filteredColumns.push(columns[i]);
      filteredValues.push(values[i]);
    }
  }
  return tagNumbers(
    [filteredRows, filteredColumns, filteredValues],
    m,
    n,
    STORAGE_COO
  );
}

/**
 * Helper for the Matrix type. Temporary until calling Pacioli functions
 * is implemented!? Could be/should be/is be a glbl_ function!?
 */
export function convert_unit(
  numbers: RawMatrix,
  shape: MatrixShape,
  unit: SIUnit,
  context: Context
) {
  const m = numbers.nrRows;
  const n = numbers.nrColumns;

  const coo = getCOONumbers(numbers);

  const rows = coo[0];
  const columns = coo[1];
  const values = coo[2];

  const convertedValues = [];

  for (let i = 0; i < rows.length; i++) {
    const factor = context.conversionFactor(
      shape.unitAt(rows[i], columns[i]),
      unit
    );
    convertedValues.push(values[i] * factor.toNumber());
  }
  return tagNumbers([rows, columns, convertedValues], m, n, STORAGE_COO);
}
