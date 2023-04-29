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

import { DimNum } from "uom-ts";
import { Context, SIUnit } from "uom-ts";
import { getCOONumbers, tagNumbers } from "./numbers";
import { MatrixShape } from "./matrix-shape";

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
export class Matrix {
  readonly kind = "matrix";

  constructor(public shape: MatrixShape, public numbers: any) {}

  /**
   * Filters the matrix entries. Only entries satisfying the predicate remain.
   *
   * @param predicate A boolean function on coordinates and values
   * @returns A new matrix of the same shape
   */
  public filter(predicate: (value: number, i: any, j: any) => boolean) {
    return new Matrix(this.shape, filter_matrix(this.numbers, predicate));
    // }

    return this;
  }

  public convertUnit(unit: SIUnit, context: Context) {
    const unitShape = MatrixShape.scalar(unit);
    return new Matrix(
      this.shape.dimensionless().scale(unitShape),
      convert_unit(this.numbers, this.shape, unit, context)
    );
  }

  public keyValueList(zeros: boolean = false): {
    values: { row: string[]; column: string[]; value: DimNum }[];
    rows: string[];
    columns: string[];
  } {
    // Get the COO numbers
    var coo = getCOONumbers(this.numbers);
    var rows = coo[0];
    var columns = coo[1];
    var values = coo[2];

    // The key value list we will return
    const kvList: { row: string[]; column: string[]; value: DimNum }[] = [];

    // Fill the list with all [non-zero] values
    for (var i = 0; i < rows.length; i++) {
      if (zeros || values[i] !== 0) {
        kvList.push({
          row: this.shape.rowCoordinates(rows[i]).names,
          column: this.shape.columnCoordinates(columns[i]).names,
          value: new DimNum(values[i], this.shape.unitAt(rows[i], columns[i])),
        });
      }
    }

    return {
      values: kvList,
      rows: this.shape.rowNames(),
      columns: this.shape.columnNames(),
    };
  }
}

/**
 * Helper for the Matrix type. Temporary until calling Pacioli functions
 * is implemented!? Could be/should be/is a glbl_ function!?
 */
export function filter_matrix(
  numbers: any,
  predicate: (value: number, i: any, j: any) => boolean
) {
  const m = numbers.nrRows;
  const n = numbers.nrColumns;

  const coo = getCOONumbers(numbers);

  var rows = coo[0];
  var columns = coo[1];
  var values = coo[2];

  const filteredRows = [];
  const filteredColumns = [];
  const filteredValues = [];

  for (var i = 0; i < rows.length; i++) {
    var rowCoords = { kind: "coordinates", position: rows[i], size: m };
    var columnCoords = { kind: "coordinates", position: columns[i], size: n };
    if (predicate(values[i], rowCoords, columnCoords)) {
      filteredRows.push(rows[i]);
      filteredColumns.push(columns[i]);
      filteredValues.push(values[i]);
    }
  }
  return tagNumbers([filteredRows, filteredColumns, filteredValues], m, n, 2);
}

/**
 * Helper for the Matrix type. Temporary until calling Pacioli functions
 * is implemented!? Could be/should be/is be a glbl_ function!?
 */
export function convert_unit(
  numbers: any,
  shape: MatrixShape,
  unit: SIUnit,
  context: Context
) {
  const m = numbers.nrRows;
  const n = numbers.nrColumns;

  const coo = getCOONumbers(numbers);

  var rows = coo[0];
  var columns = coo[1];
  var values = coo[2];

  const convertedValues = [];

  for (var i = 0; i < rows.length; i++) {
    var factor = context.conversionFactor(
      shape.unitAt(rows[i], columns[i]),
      unit
    );
    convertedValues.push(values[i] * factor);
  }
  return tagNumbers([rows, columns, convertedValues], m, n, 2);
}
