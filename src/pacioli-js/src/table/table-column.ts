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
import type { PacioliMatrix } from "../values/matrix";
import type { MatrixShape } from "../values/matrix-shape";
import { getFullNumbers } from "../raw-values/numbers";
import type { PacioliList } from "../values/list";

/**
 * Options for displaying a table column.
 */
export interface TableColumnOptions {
  decimals: number;
  unit?: SIUnit;
  ignoredecimals: boolean;
  exponential: boolean;
  showTotal: boolean;
  total?: PacioliMatrix;
}

/**
 * A column for the TableBuilder class.
 */
export class TableColumn {
  public constructor(
    /**
     * The headers for the index columns
     *
     * The length is the tensor order. Is zero for a scalar, one for a vector, and
     * two for a matrix.
     */
    public readonly indexHeaders: string[],

    /**
     * The index columns.
     *
     * index.length equals values.length
     */
    public readonly index: string[][],

    /**
     * Headers for the value column
     */
    public readonly header: string,

    /**
     * The column values
     *
     * index.length equals values.length
     */
    public readonly values: { num: DimNum; isZero: boolean }[],

    /**
     * Options for displaying the column.
     */
    public readonly options: Partial<TableColumnOptions> = {},
  ) {}

  /**
   * The column total.
   *
   * @returns A DimNum with the total, or undefined if the units are incompatible.
   */
  total(): DimNum | undefined {
    return sumDimNums(this.values.map((value) => value.num));
  }

  /**
   * Construct a TableColumn from a Pacioli marix.
   *
   * @param matrix The Pacioli matrix
   * @param header A title for the column
   * @param options Options for displaying the column.
   * @returns The new column
   */
  static fromVector(
    matrix: PacioliMatrix,
    header: string,
    options: Partial<TableColumnOptions> = {},
  ) {
    return tableColumnFromMatrix(matrix, header, options);
  }

  /**
   * Construct a TableColumn from a Pacioli list.
   *
   * @param list The Pacioli list
   * @param header A title for the column
   * @param options Options for displaying the column.
   * @returns The new column
   */
  static fromList(
    list: PacioliList,
    header: string,
    options: Partial<TableColumnOptions> = {},
  ) {
    return tableColumnFromList(list, header, options);
  }
}

/**
 * The sum of a list of DimNums. Returns undefined if the units are incompatible.
 *
 * @param nums A list of DimNums
 * @returns The sum or undefined if units are incompatible
 */
function sumDimNums(nums: DimNum[]): DimNum | undefined {
  let total: DimNum | undefined = undefined;

  for (const num of nums) {
    const dimNum = num;

    if (total === undefined) {
      total = dimNum;
    } else if (total.unit.equals(dimNum.unit)) {
      total = total.sum(dimNum);
    } else {
      return undefined;
    }
  }

  return total;
}

/**
 * Helper for TableColumn
 */
function tableColumnFromMatrix(
  matrix: PacioliMatrix,
  header: string,
  options: Partial<TableColumnOptions> = {},
): TableColumn {
  const indexHeaders = [
    ...matrix.rowIndexSets().map((header) => header.name),
    ...matrix.columnIndexSets().map((header) => header.name),
  ];
  const index: string[][] = [];
  const values: { num: DimNum; isZero: boolean }[] = [];

  const shape: MatrixShape = matrix.shape;

  const nrRows = shape.nrRows();
  const nrColumns = shape.nrColumns();

  if (nrRows === 0 || nrColumns === 0) {
    throw new Error("No rows and columns?");
  } else {
    const numbers = getFullNumbers(matrix.numbers);

    // Add the data rows
    for (let i = 0; i < nrRows; i++) {
      for (let j = 0; j < nrColumns; j++) {
        const indexEntry = [
          ...shape.rowCoordinates(i).names,
          ...shape.columnCoordinates(j).names,
        ];

        index.push(indexEntry);

        const num = numbers[i][j];

        const dimNum = DimNum.fromNumber(num, shape.unitAt(i, j));
        values.push({ num: dimNum, isZero: num === 0 });
      }
    }
  }

  return new TableColumn(indexHeaders, index, header, values, options);
}

/**
 * Helper for TableColumn
 */
function tableColumnFromList(
  matrix: PacioliList,
  header: string,
  options: Partial<TableColumnOptions> = {},
): TableColumn {
  const indexHeaders = ["n"];
  const index: string[][] = [];
  const values: {
    num: DimNum;
    isZero: boolean;
  }[] = [];

  const nrRows = matrix.length;

  if (nrRows === 0) {
    throw new Error("No rows and columns?");
  } else {
    for (let i = 0; i < nrRows; i++) {
      index.push([i.toString()]);

      const mat = matrix[i] as PacioliMatrix;
      const num = mat.number();

      const dimNum = DimNum.fromNumber(num, SIUnit.ONE);
      values.push({
        num: dimNum,
        isZero: num === 0,
      });
    }
  }

  return new TableColumn(indexHeaders, index, header, values, options);
}
