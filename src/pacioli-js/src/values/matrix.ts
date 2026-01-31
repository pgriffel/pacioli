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

import { DimNum } from "uom-ts";
import type { Context, SIUnit } from "uom-ts";
import { getCOONumbers, getFullNumbers } from "../raw-values/numbers";
import { MatrixShape } from "./matrix-shape";
import { tagMatrix, type RawCoordinates } from "../raw-values/raw-value";
import type { RawMatrix } from "../raw-values/raw-matrix";
import { getNumber } from "../raw-values/raw-matrix";
import type { IndexSet } from "./index-set";
import type { TableBuilderOptions } from "../table/table-builder";
import { TableBuilder } from "../table/table-builder";
import { TableColumn } from "../table/table-column";

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

  constructor(
    public shape: MatrixShape,
    public numbers: RawMatrix,
  ) {}

  /**
   * Filters the matrix entries. Only entries satisfying the predicate remain.
   *
   * @param predicate A boolean function on coordinates and values
   * @returns A new matrix of the same shape
   */
  public filter(
    predicate: (value: number, i: RawCoordinates, j: RawCoordinates) => boolean,
  ) {
    return new PacioliMatrix(
      this.shape,
      filter_matrix(this.numbers, predicate),
    );
  }

  getDimNum(row: number, column: number) {
    return DimNum.fromNumber(
      this.getNum(row, column),
      this.getUnit(row, column),
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
      convert_unit(this.numbers, this.shape, unit, context),
    );
  }

  public rowIndexSets(): IndexSet[] {
    return this.shape.rowDimension.indexSets;
  }

  public columnIndexSets(): IndexSet[] {
    return this.shape.columnDimension.indexSets;
  }

  public keyValueList(zeros: boolean = false): {
    values: { row: string[]; column: string[]; value: DimNum }[];
    rows: string[];
    columns: string[];
  } {
    return matrixKeyValueList(this, zeros);
  }

  public number(): number {
    return getNumber(this.numbers, 0, 0);
  }

  // toAscii noemen en toDOM maken!?
  public toDecimal(decimals: number, zero?: string) {
    return this.tableBuilder("Value", { decimals, zero }).ascii();
  }

  public tableBuilder(
    header: string,
    tableOptions: Partial<TableBuilderOptions> = {},
  ): TableBuilder {
    return new TableBuilder(
      [TableColumn.fromVector(this, header)],
      tableOptions,
    );
  }
}

/**
 * Helper for the Matrix type. All numbers in the matrix as key value list.
 *
 * @param matrix A Pacioli matrix
 * @param zeros Should zero values be included? Can blow up tensors!
 * @returns The matrix numbers as (row, column, value) triples, the
 *          complete row index and the complete column index.
 */
export function matrixKeyValueList(
  matrix: PacioliMatrix,
  zeros: boolean = false,
): {
  values: { row: string[]; column: string[]; value: DimNum }[];
  rows: string[];
  columns: string[];
} {
  // The key value list we will return
  const kvList: { row: string[]; column: string[]; value: DimNum }[] = [];

  if (zeros) {
    // Get the full numbers
    const full = getFullNumbers(matrix.numbers);

    // Fill the list with all values
    for (let i = 0; i < matrix.shape.nrRows(); i++) {
      for (let j = 0; j < matrix.shape.nrColumns(); j++) {
        kvList.push({
          row: matrix.shape.rowCoordinates(i).names,
          column: matrix.shape.columnCoordinates(j).names,
          value: DimNum.fromNumber(full[i][j], matrix.shape.unitAt(i, j)),
        });
      }
    }
  } else {
    // Get the COO numbers
    const coo = getCOONumbers(matrix.numbers);
    const rows = coo[0];
    const columns = coo[1];
    const values = coo[2];

    // Fill the list with all non-zero values
    for (const [i, row] of rows.entries()) {
      if (values[i] !== 0) {
        kvList.push({
          row: matrix.shape.rowCoordinates(row).names,
          column: matrix.shape.columnCoordinates(columns[i]).names,
          value: DimNum.fromNumber(
            values[i],
            matrix.shape.unitAt(row, columns[i]),
          ),
        });
      }
    }
  }

  return {
    values: kvList,
    rows: matrix.shape.rowNames(),
    columns: matrix.shape.columnNames(),
  };
}

/**
 * Helper for the Matrix type. Temporary until calling Pacioli functions
 * is implemented!? Could be/should be/is a glbl_ function!?
 */
export function filter_matrix(
  numbers: RawMatrix,
  predicate: (value: number, i: RawCoordinates, j: RawCoordinates) => boolean,
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

  for (const [i, row] of rows.entries()) {
    const rowCoords = {
      kind: "coordinates" as const,
      position: row,
      size: m,
    };
    const columnCoords = {
      kind: "coordinates" as const,
      position: columns[i],
      size: n,
    };
    if (predicate(values[i], rowCoords, columnCoords)) {
      filteredRows.push(row);
      filteredColumns.push(columns[i]);
      filteredValues.push(values[i]);
    }
  }
  return tagMatrix(
    [filteredRows, filteredColumns, filteredValues],
    m,
    n,
    "COO",
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
  context: Context,
) {
  const m = numbers.nrRows;
  const n = numbers.nrColumns;

  const coo = getCOONumbers(numbers);

  const rows = coo[0];
  const columns = coo[1];
  const values = coo[2];

  const convertedValues = [];

  for (const [i, row] of rows.entries()) {
    const factor = context.conversionFactor(
      shape.unitAt(row, columns[i]),
      unit,
    );
    convertedValues.push(values[i] * factor.toNumber());
  }
  return tagMatrix([rows, columns, convertedValues], m, n, "COO");
}
