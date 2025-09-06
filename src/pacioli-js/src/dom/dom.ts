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

import { PacioliMatrix } from "../values/matrix";
import { getCOONumbers, getFullNumbers, getNumber } from "../values/numbers";
import { PacioliCoordinates } from "../values/coordinates";
import { DOMTableColumns } from "./table";
import { firstDefined, toFixed, unitToText } from "./utils";

// TODO: remove any type
// TODO: connect zeroRows
export function DOM(
  x: any,
  options?: { decimals?: number; zero?: string; zeroRows?: boolean }
) {
  if (typeof x === "boolean" || typeof x === "string") {
    return document.createTextNode(x.toString());
  } else {
    switch (x.kind) {
      case "matrix":
        if (x.shape) {
          return DOMmatrixTable(x, options);
        } else {
          // hack to debug without shape info via print en printed
          return document.createTextNode(getFullNumbers(x));
        }
      case "coordinates":
        const coords = x as PacioliCoordinates;
        return document.createTextNode(coords.shortText());
      // case "ref":
      //     return Pacioli.DOM(x.value[0])
      case "list":
        var list = document.createElement("ol");
        var items = x; //.unlist()
        for (var i = 0; i < items.length; i++) {
          var item = document.createElement("li");
          item.appendChild(DOM(items[i], options));
          list.appendChild(item);
        }
        return list;
      case "tuple":
        var tup = document.createElement("ul");
        var items = x; //.untuple()
        for (var i = 0; i < items.length; i++) {
          var item = document.createElement("li");
          item.appendChild(DOM(items[i], options));
          tup.appendChild(item);
        }
        return tup;
      default:
        return document.createTextNode(x.value);
    }
  }
}

// TODO Use tableRows from Matrix
export function DOMmatrixTable(
  matrix: PacioliMatrix,
  options?: { decimals?: number; zero?: string; zeroRows?: boolean }
) {
  var shape = matrix.shape;
  var numbers = matrix.numbers;

  var rowOrder = shape.rowOrder();
  var columnOrder = shape.columnOrder();

  if (rowOrder === 0 && columnOrder === 0) {
    var value = getNumber(matrix.numbers, 0, 0);
    var unit = shape.unitAt(0, 0);

    var fragment = document.createDocumentFragment();
    fragment.appendChild(
      document.createTextNode(
        toFixed(value, firstDefined(options?.decimals, 2)!, options?.zero)
      )
    );
    fragment.appendChild(
      document.createTextNode(
        unitToText(unit, value === 0 && typeof options?.zero === "string")
      )
    );
    //fragment.normalize()
    return fragment;
  }

  var table = document.createElement("table");
  table.className = "pacioli-matrix";
  //    table.style = "width: auto"

  var thead = document.createElement("thead");
  var tbody = document.createElement("tbody");

  table.appendChild(thead);
  table.appendChild(tbody);

  var row = document.createElement("tr");

  if (0 < rowOrder) {
    var header = document.createElement("th");
    header.className = "key";
    header.innerHTML = shape.rowName();
    row.appendChild(header);
  }
  if (0 < columnOrder) {
    var header = document.createElement("th");
    header.className = "key";
    header.innerHTML = shape.columnName();
    row.appendChild(header);
  }

  var header = document.createElement("th");
  header.className = "value";
  header.colSpan = 2;
  row.appendChild(header);

  thead.appendChild(row);

  var coo = getCOONumbers(numbers);
  var rows = coo[0];
  var columns = coo[1];
  var values = coo[2];
  if (rows.length === 0) {
    return document.createTextNode("0");
  } else {
    for (var i = 0; i < rows.length; i++) {
      var row = document.createElement("tr");
      if (0 < rowOrder) {
        var cell = document.createElement("td");
        cell.className = "key";
        cell.innerHTML = shape.rowCoordinates(rows[i]).names.toString();
        row.appendChild(cell);
      }
      if (0 < columnOrder) {
        var cell = document.createElement("td");
        cell.className = "key";
        cell.innerHTML = shape.columnCoordinates(columns[i]).names.toString();
        row.appendChild(cell);
      }

      var cell = document.createElement("td");
      cell.className = "value";
      cell.innerHTML = toFixed(
        values[i],
        firstDefined(options?.decimals, 2)!,
        options?.zero
      );
      row.appendChild(cell);

      var cell = document.createElement("td");
      cell.className = "unit";
      var un = shape.unitAt(rows[i], columns[i]);

      cell.appendChild(
        document.createTextNode(
          unitToText(un, values[i] === 0 && typeof options?.zero === "string")
        )
      );
      row.appendChild(cell);

      tbody.appendChild(row);
    }
  }
  return table;
}

/**
 * Creates an HTML table element from a list of columns. All column values
 * must be a vector with the same index sets.
 *
 * @param columns A properties object for every column
 * @returns A 'table' HTML element
 */
export function DOMTable(
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
) {
  return new DOMTableColumns(columns, options).toDOM();
}
