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

import { Matrix } from "./values/matrix";
import { getCOONumbers, getFullNumbers, getNumber } from "./values/numbers";
import { Coordinates } from "./values/coordinates";

// TODO: remove any type
export function DOM(x: any) {
  if (typeof x === "boolean" || typeof x === "string") {
    return document.createTextNode(x.toString());
  } else {
    switch (x.kind) {
      case "matrix":
        if (x.shape) {
          return DOMmatrixTable(x);
        } else {
          // hack to debug without shape info via print en printed
          return document.createTextNode(getFullNumbers(x));
        }
      case "coordinates":
        const coords = x as Coordinates;
        return document.createTextNode(coords.shortText());
      // case "ref":
      //     return Pacioli.DOM(x.value[0])
      case "list":
        var list = document.createElement("ul");
        var items = x; //.unlist()
        for (var i = 0; i < items.length; i++) {
          var item = document.createElement("li");
          item.appendChild(DOM(items[i]));
          list.appendChild(item);
        }
        return list;
      case "tuple":
        var tup = document.createElement("ol");
        var items = x; //.untuple()
        for (var i = 0; i < items.length; i++) {
          var item = document.createElement("li");
          item.appendChild(DOM(items[i]));
          tup.appendChild(item);
        }
        return tup;
      default:
        return document.createTextNode(x.value + x.kind);
    }
  }
}

// TODO Use tableRows from Matrix
export function DOMmatrixTable(matrix: Matrix) {
  var shape = matrix.shape;
  var numbers = matrix.numbers;

  var rowOrder = shape.rowOrder();
  var columnOrder = shape.columnOrder();

  if (rowOrder === 0 && columnOrder === 0) {
    var fragment = document.createDocumentFragment();
    var unit = shape.unitAt(0, 0);
    fragment.appendChild(
      document.createTextNode(getNumber(matrix.numbers, 0, 0).toFixed(2))
    );
    if (!unit.isDimensionless()) {
      fragment.appendChild(document.createTextNode(" "));
      fragment.appendChild(document.createTextNode(unit.toText()));
    }
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
      cell.innerHTML = values[i].toFixed(2);
      row.appendChild(cell);

      var cell = document.createElement("td");
      cell.className = "unit";
      var un = shape.unitAt(rows[i], columns[i]);
      if (un.toText() === "1") {
        cell.innerHTML = "";
      } else {
        cell.appendChild(document.createTextNode(un.toText()));
      }
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
export function DOMTable(columns: { title: string; value: Matrix }[]) {
  // Use the first column for the shape. TODO: check the rest! Is not type checked!!!
  const matrix = columns[0].value;
  const n = columns.length;
  const shape = matrix.shape;

  const rowOrder = shape.rowOrder();
  const columnOrder = shape.columnOrder();

  if (rowOrder === 0 && columnOrder === 0) {
    const fragment = document.createDocumentFragment();
    const unit = shape.unitAt(0, 0);
    fragment.appendChild(
      document.createTextNode(getNumber(matrix.numbers, 0, 0).toFixed(2))
    );
    if (!unit.isDimensionless()) {
      fragment.appendChild(document.createTextNode(" "));
      fragment.appendChild(document.createTextNode(unit.toText()));
    }
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
    let header = document.createElement("th");
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
        for (let k = 0; k < n; k++) {
          let cell = document.createElement("td");
          cell.className = "value";
          const num = numbers[k][i][j];
          allZero = allZero && num === 0;
          cell.innerHTML = num.toFixed(2);
          row.appendChild(cell);

          cell = document.createElement("td");
          cell.className = "unit";
          const un =
            0 < rowOrder ? shapes[k].unitAt(i, j) : shapes[k].unitAt(i, j);
          if (un.toText() === "1") {
            cell.innerHTML = "";
          } else {
            cell.appendChild(document.createTextNode(un.toText()));
          }

          row.appendChild(cell);
        }

        if (!allZero) {
          tbody.appendChild(row);
        }
      }
    }
  }
  return table;
}
