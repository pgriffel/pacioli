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
import type { PacioliCoordinates } from "../values/coordinates";
import type { IndexSet } from "../values/index-set";
import type { PacioliMatrix } from "../values/matrix";
import type { MatrixShape } from "../values/matrix-shape";
import { getFullNumbers } from "../raw-values/numbers";

/**
 * Generic abstract TableData class.
 *
 * The TableData is an intermediate form between matrices and tabular output
 * that avoids duplication of funcionality. A recurring issue is displaying one
 * or more matrices in table form. The output can be ascii or html or any other
 * medium. The intermediate form handles common issues besides collecting the
 * data:
 *
 * - transforming to strings in the right number of decimals
 * - adding totals, automatic and custom
 * - filtering zero rows
 * - custom output for zero (e.g. "-" instead of "0")
 *
 * Typical usage is a chain like:
 *
 * One or more matrices -> TableData -> StringifiedTableData -> Ascii or DOM
 *
 * Various options are available at each step in this chain.
 *
 * The GenericTableData assumes a collection of matrices/tensors with the same index
 * sets. The table structure consists of an index column for each index set in the
 * matrices' index sets, and a value column for each matrix.
 */
class GenericTableData<Header, Coordinates, Num> {
  public constructor(
    /**
     * The headers for the index columns
     *
     * row.length is the row order and column.length is the column order.
     */
    public readonly indexHeaders: { row: Header[]; column: Header[] },

    /**
     * The index columns.
     *
     * index.length equals values.length
     */
    public readonly index: {
      row: Coordinates;
      column: Coordinates;
    }[],

    /**
     * Headers for the value columns
     */
    public readonly valueHeaders: string[],

    /**
     * The value columns
     *
     * index.length equals values.length
     * for all i: values[i].row.length === valueHeaders.length
     */
    public readonly values: { row: Num[]; isZero: boolean }[],

    /**
     * Total row
     *
     * totals.length equals valueHeaders.length
     */
    public readonly totals: (Num | undefined)[]
  ) {}

  /**
   * Does the table data represent a single scalar value?
   *
   * @returns True if the index sets are empty and there is one value column.
   */
  isSingleScalar(): boolean {
    return (
      this.indexHeaders.row.length === 0 &&
      this.indexHeaders.column.length === 0 &&
      this.valueHeaders.length <= 1
    );
  }
}

/**
 * A GenericTableData with all coordinates, numbers and units as objects.
 */
export class TableData extends GenericTableData<
  IndexSet,
  PacioliCoordinates,
  DimNum
> {
  static from(
    matrix: PacioliMatrix,
    header: string,
    showTotal: boolean,
    total?: PacioliMatrix
  ) {
    return tableDataFromMatrix(matrix, header, showTotal, total);
  }

  public stringify(
    zero: string | undefined,
    decimals: number[],
    ignoreDecimals: boolean
  ): StringifiedTableData {
    return stringifyTableData(this, zero, decimals, ignoreDecimals);
  }

  public clipboardText(): string {
    return toClipboardText(this);
  }

  public merge(other: TableData) {
    return mergeTableData(this, other);
  }
}

/**
 * Same as TableData, but all coordinates, numbers and units are stringified.
 */
export class StringifiedTableData extends GenericTableData<
  string,
  string[],
  { magnitude: string; unit: string }
> {
  public dom(showTotals: boolean): HTMLElement {
    return domFromTableData(this, showTotals);
  }

  public ascii(): string {
    return asciiFromTableData(this);
  }
}

/**
 * Convenience function to merge a list of TableDatas in one call.
 *
 * It is an error if the list is empty.
 *
 * @param datas The TableData objects to merge
 * @returns The merged TableData
 */
export function mergeTableDatas(datas: TableData[]): TableData {
  if (datas.length === 0) {
    throw Error("Cannot merge an empty list of table data");
  } else {
    let merged = datas[0];
    for (let i = 1; i < datas.length; i++) {
      merged = mergeTableData(merged, datas[i]);
    }
    return merged;
  }
}

function asciiFromTableData(
  data: StringifiedTableData,
  showZeroRows: boolean = true
) {
  const zero = "0";

  const n = data.valueHeaders.length;

  if (n === 0) {
    return "";
  }

  if (data.isSingleScalar()) {
    if (data.values.length > 0) {
      const value = data.values[0];
      return value.row[0].magnitude + value.row[0].unit;
    } else {
      return zero;
    }
  }

  const maxColumnWidths: number[] = [];
  const alignRight: boolean[] = [];
  const headers: string[] = [];

  data.indexHeaders.row.forEach((indexSet) => {
    headers.push(indexSet);
    maxColumnWidths.push(indexSet.length);
    alignRight.push(false);
  });
  data.indexHeaders.column.forEach((indexSet) => {
    headers.push(indexSet);
    maxColumnWidths.push(indexSet.length);
    alignRight.push(false);
  });

  const nrValues = data.valueHeaders.length;
  // Add a header for each column
  for (let i = 0; i < nrValues; i++) {
    headers.push(data.valueHeaders[i]);
    headers.push(""); // unit column
    maxColumnWidths.push(data.valueHeaders[i].length);
    alignRight.push(true);
    alignRight.push(false);
  }

  const text: string[][] = [];

  text.push(headers);

  const nrRows = data.index.length;

  // Add the data rows
  for (let i = 0; i < nrRows; i++) {
    const index = data.index[i];
    const values = data.values[i];

    if (showZeroRows || !values.isZero) {
      // Create a new row
      const row: string[] = [];

      // Add the index
      index.row.concat(index.column).forEach((idx) => {
        row.push(idx);
      });

      values.row.forEach((value) => {
        row.push(value.magnitude);
        row.push(value.unit);
      });

      text.push(row);

      for (const [j, element] of row.entries()) {
        maxColumnWidths[j] = Math.max(maxColumnWidths[j], element.length);
      }
    }
  }

  let output = "";
  text.forEach((line) => {
    const row = [];
    for (const [i, cell] of line.entries()) {
      const l = maxColumnWidths[i];
      const txt = alignRight[i] ? cell.padStart(l) : cell.padEnd(l);
      row.push(txt);
    }
    output += row.join(" ");
    output += "\n";
  });

  return output;
}

function domFromTableData(
  data: StringifiedTableData,
  showTotals: boolean,
  showZeroRows: boolean = true
): HTMLElement {
  const zero = "0";

  if (data.isSingleScalar()) {
    const span = document.createElement("span");
    if (data.values.length > 0) {
      const value = data.values[0];
      span.textContent = value.row[0].magnitude + value.row[0].unit;
    } else {
      span.textContent = zero;
    }
    return span;
  }

  const table = document.createElement("table");
  table.className = "pacioli-table";
  //    table.style = "width: auto"

  // Create the table
  const thead = document.createElement("thead");
  const tbody = document.createElement("tbody");
  table.appendChild(thead);
  table.appendChild(tbody);

  // Create the header row
  const row = document.createElement("tr");

  // Add the index headers
  data.indexHeaders.row.forEach((text) => {
    const header = document.createElement("th");
    header.className = "key";
    header.innerHTML = text;
    row.appendChild(header);
  });
  data.indexHeaders.column.forEach((text) => {
    const header = document.createElement("th");
    header.className = "key";
    header.innerHTML = text;
    row.appendChild(header);
  });

  const nrValues = data.valueHeaders.length;
  // Add a header for each column
  for (let i = 0; i < nrValues; i++) {
    const header = document.createElement("th");
    header.className = "value";
    header.innerHTML = data.valueHeaders[i];
    header.colSpan = 2;
    row.appendChild(header);

    // header = document.createElement("th")
    // header.className = "unit"
    // row.appendChild(header)
  }

  // Add the header row to the table
  thead.appendChild(row);

  const nrRows = data.index.length;

  // const totals: Array<number> = new Array(n).fill(0);

  // Add the data rows
  for (let i = 0; i < nrRows; i++) {
    const index = data.index[i];
    const values = data.values[i];

    if (showZeroRows || !values.isZero) {
      // Create a new row
      const row = document.createElement("tr");

      // Add the index
      index.row.concat(index.column).forEach((idx) => {
        const cell = document.createElement("td");
        cell.className = "key";
        cell.innerHTML = idx;
        row.appendChild(cell);
      });

      values.row.forEach((value) => {
        let cell = document.createElement("td");
        cell.className = "value";
        cell.innerHTML = value.magnitude;
        row.appendChild(cell);

        cell = document.createElement("td");
        cell.className = "unit";
        cell.appendChild(document.createTextNode(value.unit));

        row.appendChild(cell);
      });

      tbody.appendChild(row);
    }
  }

  // Add a total row if asked
  const indexWidth =
    data.indexHeaders.row.length + data.indexHeaders.column.length;

  if (showTotals && indexWidth > 0) {
    const totalRow = document.createElement("tr");

    const cell = document.createElement("td");
    cell.className = "total key";
    cell.innerHTML = "Total";
    totalRow.appendChild(cell);

    for (let i = 1; i < indexWidth; i++) {
      const cell = document.createElement("td");
      cell.className = "key";
      cell.innerHTML = "";
      totalRow.appendChild(cell);
    }

    data.totals.forEach((value) => {
      let cell = document.createElement("td");
      cell.className = "total value";
      cell.innerHTML = value ? value.magnitude : "";
      totalRow.appendChild(cell);

      cell = document.createElement("td");
      cell.className = "total unit";
      cell.appendChild(document.createTextNode(value ? value.unit : ""));

      totalRow.appendChild(cell);
    });

    tbody.appendChild(totalRow);
  }

  return table;
}

function stringifyTableData(
  data: TableData,
  zero: string | undefined,
  decimals: number[],
  ignoreDecimals: boolean
): StringifiedTableData {
  // Interpret the options
  const zeroString = zero;
  const omitDecimals = ignoreDecimals || decimals.length === 0;
  const decimalsPerColumn = omitDecimals
    ? []
    : data.valueHeaders.map((_, col) => decimals[col % decimals.length]);

  const indexHeaders = {
    row: data.indexHeaders.row.map((header) => header.name),
    column: data.indexHeaders.column.map((header) => header.name),
  };
  const index = data.index.map((entry) => {
    return {
      row: entry.row.names,
      column: entry.column.names,
    };
  });
  const values = data.values.map((value) => {
    return {
      row: value.row.map((cell, col) => {
        return {
          magnitude:
            cell.magnitude.isZero() && zeroString !== undefined
              ? zeroString
              : omitDecimals
              ? cell.magnitude.toFixed()
              : cell.magnitude.toFixed(decimalsPerColumn[col]),
          unit: cell.unit.toText(),
        };
      }),
      isZero: value.isZero,
    };
  });
  const totals = data.totals.map((cell, col) => {
    if (cell === undefined) {
      return undefined;
    }
    return {
      magnitude:
        cell.magnitude.isZero() && zeroString !== undefined
          ? zeroString
          : omitDecimals
          ? cell.magnitude.toFixed()
          : cell.magnitude.toFixed(decimalsPerColumn[col]),
      unit: cell.unit.toText(),
    };
  });
  return new StringifiedTableData(
    indexHeaders,
    index,
    data.valueHeaders,
    values,
    totals
  );
}

function tableDataFromMatrix(
  matrix: PacioliMatrix,
  header: string,
  showTotal: boolean,
  total?: PacioliMatrix
): TableData {
  const indexSets = {
    row: matrix.rowIndexSets(),
    column: matrix.columnIndexSets(),
  };
  const index: {
    row: PacioliCoordinates;
    column: PacioliCoordinates;
  }[] = [];
  const columnHeaders: string[] = [header];
  const columns: { row: DimNum[]; isZero: boolean }[] = [];

  const shape: MatrixShape = matrix.shape;

  const nrRows = shape.nrRows();
  const nrColumns = shape.nrColumns();

  let effectiveTotal =
    showTotal && total !== undefined ? total.getDimNum(0, 0) : undefined;

  if (nrRows === 0 || nrColumns === 0) {
    throw new Error("No rows and columns?");
  } else {
    let deriveTotal = showTotal && total === undefined;

    const numbers = getFullNumbers(matrix.numbers);

    // Add the data rows
    for (let i = 0; i < nrRows; i++) {
      for (let j = 0; j < nrColumns; j++) {
        const indexEntry = {
          row: shape.rowCoordinates(i),
          column: shape.columnCoordinates(j),
        };

        index.push(indexEntry);

        const num = numbers[i][j];

        const dimNum = DimNum.fromNumber(num, shape.unitAt(i, j));
        columns.push({ row: [dimNum], isZero: num === 0 });

        if (deriveTotal) {
          if (effectiveTotal === undefined) {
            effectiveTotal = dimNum;
          } else if (effectiveTotal.unit.equals(dimNum.unit)) {
            effectiveTotal = effectiveTotal.sum(dimNum);
          } else {
            deriveTotal = false;
            effectiveTotal = undefined;
          }
        }
      }
    }
  }

  return new TableData(indexSets, index, columnHeaders, columns, [
    effectiveTotal,
  ]);
}

function tableDataHeadersEqual(left: TableData, right: TableData): boolean {
  return left === right || true; // TODO: implement this
}

function mergeTableData(left: TableData, right: TableData): TableData {
  if (!tableDataHeadersEqual(left, right)) {
    throw Error("Headers not equal when merging table data");
  }

  // For now assume no sparse tables
  const indexSets = left.indexHeaders;
  const index: {
    row: PacioliCoordinates;
    column: PacioliCoordinates;
  }[] = left.index;
  const valueHeaders: string[] = left.valueHeaders.concat(right.valueHeaders);
  const values: { row: DimNum[]; isZero: boolean }[] = [];
  const totals = left.totals.concat(right.totals);

  for (let i = 0; i < left.index.length; i++) {
    const lft = left.values[i];
    const rght = right.values[i];
    values.push({
      row: lft.row.concat(rght.row),
      isZero: lft.isZero && rght.isZero,
    });
  }

  return new TableData(indexSets, index, valueHeaders, values, totals);
}

function toClipboardText(data: TableData): string {
  const n = data.valueHeaders.length;

  if (n === 0) {
    return "";
  }

  const headers: string[] = [];

  data.indexHeaders.row.forEach((indexSet) => {
    headers.push(indexSet.name);
  });
  data.indexHeaders.column.forEach((indexSet) => {
    headers.push(indexSet.name);
  });

  const nrValues = data.valueHeaders.length;
  // Add a header for each column
  for (let i = 0; i < nrValues; i++) {
    headers.push(data.valueHeaders[i]);
  }

  let text = "";

  text += headers.join("\t");

  const nrRows = data.index.length;

  // Add the data rows
  for (let i = 0; i < nrRows; i++) {
    const index = data.index[i];
    const values = data.values[i];

    text += "\n";

    // Create a new row
    const row: string[] = [];

    // Add the index
    index.row.names.concat(index.column.names).forEach((idx) => {
      row.push(idx);
    });

    values.row.forEach((value) => {
      row.push(value.magnitude.toString());
    });

    text += row.join("\t");
  }

  return text;
}
