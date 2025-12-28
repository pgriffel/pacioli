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

import type { PacioliMatrix } from "../values/matrix";
import { getNumber, getFullNumbers } from "../values/numbers";
import { firstDefined, locale, toFixed, unitToText } from "./utils";

/**
 * Collection of columns for use in a DOM Pacioli table. See api function DOMTable.
 *
 * TODO: check if it works for row vectors. The code handles columns order > 0, but
 * do we want that? And does it work?
 */
export class DOMTableColumns {
  constructor(
    public readonly columns: {
      title: string;
      value: PacioliMatrix;
      decimals: number;
      zero?: string;
    }[],
    public readonly options?: {
      decimals: number;
      zero?: string;
      zeroRows: boolean;
      totalsRow?: boolean;
    }
  ) {
    // TODO: check the columns! Is not type checked!!! All columns must have the same shape
    this.columns = columns;
    this.options = options;
  }

  // TODO: reduce the result types to just one!?
  toDOM(): HTMLElement | DocumentFragment | Text {
    return createDOMTable(this.columns, this.options);
  }

  toClipboardText(): string {
    const n = this.columns.length;

    if (n === 0) {
      return "";
    }

    // Use the first column for the shape.
    const matrix = this.columns[0].value;
    const shape = matrix.shape;

    const rowOrder = shape.rowOrder();
    const columnOrder = shape.columnOrder();

    // nonsense?
    if (rowOrder === 0 && columnOrder === 0) {
      return getNumber(matrix.numbers, 0, 0).toLocaleString(locale);
    }

    let text = "";

    if (0 < rowOrder) {
      text += shape.rowName();
    }
    if (0 < columnOrder) {
      text += shape.columnName();
    }

    // Add a header for each column
    for (let i = 0; i < n; i++) {
      text += "\t" + this.columns[i].title;
    }

    // Note that the full number might explode on tensors with many dimensions. TODO:
    // a more efficient alternative with COO numbers
    const numbers = this.columns.map((record) =>
      getFullNumbers(record.value.numbers)
    );
    // const shapes = this.columns.map((record) => record.value.shape);

    // For COO numbers
    // var rows = numbers.map(trip => trip[0])
    // var columns = numbers.map(trip => trip[1])
    // var values = numbers.map(trip => trip[2])

    const nrRows = shape.nrRows();
    const nrColumns = shape.nrColumns();

    if (nrRows === 0 || nrColumns == 0) {
      // Kan dit??? Copied from above
      return "0";
    } else {
      // Add the data rows
      for (let i = 0; i < nrRows; i++) {
        text += "\n";

        for (let j = 0; j < nrColumns; j++) {
          // Add the index
          if (0 < rowOrder) {
            const idx = shape.rowCoordinates(i).names.toString();
            text += idx;
          }
          if (0 < columnOrder) {
            const idx = shape.columnCoordinates(j).names.toString();
            text += idx;
          }

          // Add the value for each colulmn
          for (let k = 0; k < n; k++) {
            const num = numbers[k][i][j];
            // text += "\t" + num.toLocaleString(locale);
            text += "\t" + num.toString();
          }
        }
      }
    }
    return text;
  }
}

/**
 * Creates an HTML table element from a list of columns. All column values
 * must be a vector with the same index sets.
 *
 * @param columns A properties object for every column
 * @returns A 'table' HTML element
 */
function createDOMTable(
  columns: {
    title: string;
    value: PacioliMatrix;
    decimals: number;
    zero?: string;
  }[],
  options?: {
    decimals: number;
    zero?: string;
    zeroRows: boolean;
    totalsRow?: boolean;
  }
): HTMLElement | DocumentFragment | Text {
  const n = columns.length;

  if (n === 0) {
    return document.createTextNode("-");
  }

  // Use the first column for the shape. TODO: check the rest! Is not type checked!!!
  const matrix = columns[0].value;
  const shape = matrix.shape;

  const rowOrder = shape.rowOrder();
  const columnOrder = shape.columnOrder();

  if (rowOrder === 0 && columnOrder === 0) {
    const value = getNumber(matrix.numbers, 0, 0);
    const unit = shape.unitAt(0, 0);

    const fragment = document.createDocumentFragment();

    fragment.appendChild(
      document.createTextNode(
        toFixed(
          value,
          firstDefined(columns[0].decimals, options?.decimals, 2)!,
          firstDefined(columns[0].zero, options?.zero)
        )
      )
    );

    fragment.appendChild(
      document.createTextNode(
        unitToText(
          unit,
          value === 0 &&
            (typeof columns[0].zero === "string" ||
              typeof options?.zero === "string")
        )
      )
    );

    //fragment.normalize()
    return fragment;
  }

  const table = document.createElement("table");
  table.className = "pacioli-tab";
  //    table.style = "width: auto"

  // Create the table
  const thead = document.createElement("thead");
  const tbody = document.createElement("tbody");
  table.appendChild(thead);
  table.appendChild(tbody);

  // Create the header row
  const row = document.createElement("tr");

  // Add the index headers
  if (0 < rowOrder) {
    const header = document.createElement("th");
    header.className = "key";
    header.innerHTML = shape.rowName();
    row.appendChild(header);
  }
  if (0 < columnOrder) {
    const header = document.createElement("th");
    header.className = "key";
    header.innerHTML = shape.columnName();
    row.appendChild(header);
  }

  // Add a header for each column
  for (let i = 0; i < n; i++) {
    const header = document.createElement("th");
    header.className = "value";
    header.innerHTML = columns[i].title;
    header.colSpan = 2;
    row.appendChild(header);

    // header = document.createElement("th")
    // header.className = "unit"
    // row.appendChild(header)
  }

  // Add the header row to the table
  thead.appendChild(row);

  // Note that the full number might explode on tensors with many dimensions. TODO:
  // a more efficient alternative with COO numbers
  const numbers = columns.map((record) => getFullNumbers(record.value.numbers));
  const shapes = columns.map((record) => record.value.shape);

  // For COO numbers
  // var rows = numbers.map(trip => trip[0])
  // var columns = numbers.map(trip => trip[1])
  // var values = numbers.map(trip => trip[2])

  const nrRows = shape.nrRows();
  const nrColumns = shape.nrColumns();

  if (nrRows === 0 || nrColumns == 0) {
    // Kan dit??? Copied from above
    return document.createTextNode("0");
  } else {
    const totals: Array<number> = new Array(n).fill(0);

    // Add the data rows
    for (let i = 0; i < nrRows; i++) {
      for (let j = 0; j < nrColumns; j++) {
        // Create a new row
        const row = document.createElement("tr");
        let allZero = true;

        // Add the index
        if (0 < rowOrder) {
          const cell = document.createElement("td");
          cell.className = "key";
          cell.innerHTML = shape.rowCoordinates(i).names.toString();
          row.appendChild(cell);
        }
        if (0 < columnOrder) {
          const cell = document.createElement("td");
          cell.className = "key";
          cell.innerHTML = shape.columnCoordinates(j).names.toString();
          row.appendChild(cell);
        }

        // Add the value for each colulmn
        const nrDecs = firstDefined(columns[j].decimals, options?.decimals, 2)!;
        const zero = firstDefined(columns[j].zero, options?.zero);
        for (let k = 0; k < n; k++) {
          let cell = document.createElement("td");
          cell.className = "value";
          const num = numbers[k][i][j];
          allZero = allZero && num === 0;
          cell.innerHTML = toFixed(num, nrDecs, zero);
          row.appendChild(cell);

          totals[k] += num;

          cell = document.createElement("td");
          cell.className = "unit";
          const un =
            0 < rowOrder ? shapes[k].unitAt(i, j) : shapes[k].unitAt(i, j);
          cell.appendChild(
            document.createTextNode(
              unitToText(un, num === 0 && typeof zero === "string")
            )
          );

          row.appendChild(cell);
        }

        if (!allZero) {
          tbody.appendChild(row);
        }
      }
    }

    // Add a total row if asked
    if (options?.totalsRow) {
      const row = document.createElement("tr");

      // Add the index
      if (0 < rowOrder) {
        const cell = document.createElement("td");
        cell.className = "key";
        cell.innerHTML = "Totaal";
        row.appendChild(cell);
      }
      if (0 < columnOrder) {
        const cell = document.createElement("td");
        cell.className = "key";
        cell.innerHTML = "";
        row.appendChild(cell);
      }

      // Add the totals cells
      const nrDecs = 2; // TODO
      const zero = "-";
      for (let k = 0; k < n; k++) {
        let cell = document.createElement("td");
        cell.className = "total";
        const num = totals[k];
        cell.innerHTML = toFixed(num, nrDecs, zero);
        row.appendChild(cell);

        // TODO: handle units
        cell = document.createElement("td");
        cell.className = "unit";
        // const un =
        // 0 < rowOrder ? shapes[k].unitAt(i, j) : shapes[k].unitAt(i, j);
        cell.appendChild(
          document.createTextNode(
            "" // unitToText(un, num === 0 && typeof zero === "string")
          )
        );

        row.appendChild(cell);
      }

      // Add the totals row
      tbody.appendChild(row);
    }
  }
  return table;
}
