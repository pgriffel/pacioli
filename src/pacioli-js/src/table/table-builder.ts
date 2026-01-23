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

import type { DimNum } from "uom-ts";
import { NR_DECIMALS } from "../primitives";
import type { TableColumn } from "./table-column";

/**
 * Exactly the same as DOMOptions. TODO: consider merging.
 */
export interface TableBuilderOptions {
  decimals: number;
  ignoredecimals: boolean;
  exponential: boolean;
  zero: string;
  nozerorows: boolean;
  totals: boolean;
  ascii: boolean;
  clipboard: boolean;
}

const DEFAULT_TABLE_BUILDER_OPTTIONS = {
  decimals: NR_DECIMALS,
  ignoredecimals: false,
  exponential: false,
  nozerorows: false,
  totals: false,
  ascii: false,
  clipboard: false,
};

/**
 * The TableBuilder is an intermediate form between matrices and tabular output
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
 * One or more matrices or number lists -> TableBuilder -> Ascii or DOM
 *
 * The TabldBuilder assumes a collection of matrices/tensors with the same index
 * sets. The table structure consists of an index column for each index set in the
 * matrices' index sets, and a value column for each matrix.
 */
export class TableBuilder {
  constructor(
    public readonly columns: TableColumn[],
    public readonly options: Partial<TableBuilderOptions> = {},
  ) {}

  /**
   * Does the table data represent a single scalar value?
   *
   * @returns True if the index sets are empty and there is one value column.
   */
  isSingleScalar(): boolean {
    return (
      this.columns.length === 0 ||
      (this.columns[0].indexHeaders.length === 0 && this.columns.length <= 1)
    );
  }

  singuleScalar(): DimNum {
    return this.columns[0].values[0].num;
  }

  stringifiedSinguleScalar(): string {
    // TODO: zero returnen if zero?
    return (this.options?.ignoredecimals ?? false)
      ? this.singuleScalar().toFixed()
      : this.singuleScalar().toFixed(this.options?.decimals ?? NR_DECIMALS);
  }

  indexHeaders(): string[] {
    if (this.columns.length === 0) {
      return [];
    }
    return this.columns[0].indexHeaders;
  }

  valueHeaders(): string[] {
    return this.columns.map((column) => column.header);
  }

  rows(): {
    index: string[];
    values: { num: DimNum; magnitude: string; unit: string }[];
  }[] {
    if (this.columns.length === 0) {
      return [];
    }

    const index = this.columns[0].index;

    const rows: {
      index: string[];
      values: { num: DimNum; magnitude: string; unit: string }[];
    }[] = [];

    for (const [i, element] of index.entries()) {
      const row = {
        index: element,
        values: this.columns.map((col) => {
          const effOptions = {
            ...DEFAULT_TABLE_BUILDER_OPTTIONS,
            ...this.options,
            ...col.options,
          };

          const dimNum = col.values[i].num;

          const magnitude = stringifyCell(
            dimNum,
            effOptions.zero,
            effOptions.ignoredecimals,
            effOptions.decimals,
            effOptions.exponential,
          );

          return {
            num: dimNum,
            magnitude,
            unit: dimNum.unit.toText(),
          };
        }),
      };

      // TODO: if (showZeroRows || !values.isZero) {

      rows.push(row);
    }

    return rows;
  }

  /**
   * Same length as value headers and values in each row.
   *
   * @returns
   */
  totals(): ({ num: DimNum; magnitude: string; unit: string } | undefined)[] {
    return this.columns.map((column) => {
      if (this.options.totals !== true && column.options.showTotal !== true) {
        return;
      }

      const dimNum = column.total();

      if (dimNum === undefined) {
        return;
      }

      const effOptions = {
        ...DEFAULT_TABLE_BUILDER_OPTTIONS,
        ...this.options,
        ...column.options,
      };

      const magnitude = stringifyCell(
        dimNum,
        effOptions.zero,
        effOptions.ignoredecimals,
        effOptions.decimals,
        effOptions.exponential,
      );

      return {
        num: dimNum,
        magnitude,
        unit: dimNum.unit.toText(),
      };
    });
  }

  dom(): HTMLElement {
    if (this.options.ascii === true) {
      const elt = document.createElement("pre");

      elt.innerText = this.ascii();

      return elt;
    } else if (this.options.clipboard === true) {
      const elt = document.createElement("pre");

      elt.innerText = this.clipboardText();

      return elt;
    } else {
      return domFromTable(this);
    }
  }

  ascii(): string {
    return asciiFromTable(this);
  }

  public clipboardText(): string {
    return toClipboardText(this);
  }
}

function asciiFromTable(data: TableBuilder) {
  const n = data.valueHeaders().length;

  if (n === 0) {
    return "";
  }

  if (data.isSingleScalar()) {
    return data.stringifiedSinguleScalar();
  }

  const maxColumnWidths: number[] = [];
  const alignRight: boolean[] = [];
  const headers: string[] = [];

  for (const indexSet of data.indexHeaders()) {
    headers.push(indexSet);
    maxColumnWidths.push(indexSet.length);
    alignRight.push(false);
  }

  const valueHeaders = data.valueHeaders();
  const nrValues = valueHeaders.length;
  // Add a header for each column
  for (let i = 0; i < nrValues; i++) {
    headers.push(valueHeaders[i], ""); // unit column
    maxColumnWidths.push(valueHeaders[i].length, 0);
    alignRight.push(true, false);
  }

  const text: string[][] = [headers];

  for (const row of data.rows()) {
    // Create a new row
    const arow: string[] = [];

    // Add the index
    for (const idx of row.index) {
      arow.push(idx);
    }

    // Add the values
    for (const value of row.values) {
      arow.push(value.magnitude, value.unit);
    }

    for (const [j, element] of arow.entries()) {
      maxColumnWidths[j] = Math.max(maxColumnWidths[j], element.length);
    }

    text.push(arow);
  }

  let output = "";
  for (const line of text) {
    const row = [];
    for (const [i, cell] of line.entries()) {
      const l = maxColumnWidths[i];
      const txt = alignRight[i] ? cell.padStart(l) : cell.padEnd(l);
      row.push(txt);
    }
    output += row.join(" ");
    output += "\n";
  }

  return output;
}

function domFromTable(data: TableBuilder): HTMLElement {
  if (data.isSingleScalar()) {
    const span = document.createElement("span");

    span.textContent = data.stringifiedSinguleScalar();

    return span;
  }

  const table = document.createElement("table");
  table.className = "pacioli-table";

  // Create the table
  const thead = document.createElement("thead");
  const tbody = document.createElement("tbody");
  table.appendChild(thead);
  table.appendChild(tbody);

  // Create the header row
  const row = document.createElement("tr");

  // Add the index headers
  for (const text of data.indexHeaders()) {
    const header = document.createElement("th");
    header.className = "key";
    header.innerHTML = text;
    row.appendChild(header);
  }

  // Add a header for each column
  for (const header of data.valueHeaders()) {
    const headerElement = document.createElement("th");

    headerElement.innerHTML = header;
    headerElement.className = "value";
    headerElement.colSpan = 2;

    row.appendChild(headerElement);
  }

  // Add the header row to the table
  thead.appendChild(row);

  for (const row of data.rows()) {
    // Create a new row
    const rowElt = document.createElement("tr");

    // Add the index
    for (const idx of row.index) {
      const cell = document.createElement("td");
      cell.className = "key";
      cell.innerHTML = idx;
      rowElt.appendChild(cell);
    }

    // Add the values
    for (const value of row.values) {
      const valueCell = document.createElement("td");
      const unitCell = document.createElement("td");

      valueCell.className = "value";
      valueCell.innerHTML = value.magnitude;

      unitCell.className = "unit";
      unitCell.innerHTML = value.unit;

      rowElt.appendChild(valueCell);
      rowElt.appendChild(unitCell);
    }

    tbody.appendChild(rowElt);
  }

  // Add a total row if asked
  const indexWidth = data.indexHeaders().length;

  const totals = data.totals();
  const showTotals = totals.some((total) => total !== undefined);

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

    for (const value of data.totals()) {
      let cell = document.createElement("td");
      cell.className = "total value";
      cell.innerHTML = value ? value.magnitude : "";
      totalRow.appendChild(cell);

      cell = document.createElement("td");
      cell.className = "total unit";
      cell.appendChild(document.createTextNode(value ? value.unit : ""));

      totalRow.appendChild(cell);
    }

    tbody.appendChild(totalRow);
  }

  return table;
}

function stringifyCell(
  cell: DimNum,
  zeroString: string | undefined,
  omitDecimals: boolean,
  nrDecimals: number,
  exponential: boolean,
): string {
  if (cell.magnitude.isZero() && zeroString !== undefined) {
    return zeroString;
  } else if (exponential) {
    return omitDecimals
      ? cell.magnitude.toExponential()
      : cell.magnitude.toExponential(nrDecimals);
  } else {
    return omitDecimals
      ? cell.magnitude.toFixed()
      : cell.magnitude.toFixed(nrDecimals);
  }
}

// function tableDataHeadersEqual(left: TableData, right: TableData): boolean {
//   return left === right || true; // TODO: implement this
// }

function toClipboardText(data: TableBuilder): string {
  const n = data.valueHeaders().length;

  if (n === 0) {
    return "";
  }

  const headers: string[] = [];

  for (const indexSet of data.indexHeaders()) {
    headers.push(indexSet);
  }

  // Add a header for each column
  for (const header of data.valueHeaders()) {
    headers.push(header);
  }

  let text = "";

  text += headers.join("\t");

  for (const row of data.rows()) {
    text += "\n";

    // Create a new row
    const line: string[] = [];

    // Add the index
    for (const idx of row.index) {
      line.push(idx);
    }

    for (const value of row.values) {
      line.push(value.num.magnitude.toFixed());
    }

    text += line.join("\t");
  }

  return text;
}
