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

import { ccsFull, ccsGather, ccsScatter, ccsSparse, sscatter } from "numeric";

// -----------------------------------------------------------------------------
// Matrix Numbers
//
// See http://numericjs.com/wordpress/?p=66
//
// Full - Completely filled two-dimensional JavaScript array
// DOK (Dictionary Of Keys format) - Sparse two-dimensional JavaScript array
// COO (Coordinate format) - Triple of lists
// CCS (Column Compressed Storage format) - Triple of lists
// -----------------------------------------------------------------------------

export function tagNumbers(
  numbers: any,
  nrRows: number,
  nrColumns: number,
  storage: any
) {
  numbers.nrRows = nrRows;
  numbers.nrColumns = nrColumns;
  numbers.storage = storage;
  numbers.kind = "matrix";
  return numbers;
}

export function getFullNumbers(numbers: any) {
  var m = numbers.nrRows;
  var n = numbers.nrColumns;

  const fillDOK = function (nums: any) {
    var array = new Array(m);
    for (var i = 0; i < m; i++) {
      var inner = new Array(n);
      for (var j = 0; j < n; j++) {
        inner[j] = nums[i] ? nums[i][j] || 0 : 0;
      }
      array[i] = inner;
    }
    return tagNumbers(array, m, n, 0);
  };

  switch (numbers.storage) {
    case 0:
      return numbers;
    case 1:
      return fillDOK(numbers);
    case 2:
      return fillDOK(sscatter(numbers));
    // or:
    // return numeric.ccsFull(numeric.ccsScatter(this.numbers))
    case 3:
      // Let numeric create a full matrix, although it might be too small
      var full = ccsFull(numbers);

      // Fill the missing rows and columns with zeros
      for (var i = full.length; i < m; i++) {
        full[i] = [];
        for (var j = 0; j < n; j++) {
          full[i][j] = 0;
        }
      }
      for (var j = full[0].length; j < n; j++) {
        for (var i = 0; i < m; i++) {
          full[i][j] = 0;
        }
      }

      return tagNumbers(full, m, n, 0);
  }
}

// Pacioli.getDOKNumbers = function (numbers) {

//     var m = numbers.nrRows
//     var n = numbers.nrColumns

//     sparseDOK = function (nums) {
//         var array = []
//         for (var i = 0; i < m; i++) {
//             var inner = nums[i]
//             for (var j = 0; j < n; j++) {
//                 if (inner[j] !== 0) {
//                     if (array[i] === undefined) {
//                         array[i] = []
//                     }
//                     array[i][j] = inner[j]
//                 }
//             }
//         }
//         return Pacioli.tagNumbers(array, m, n, 1)
//     }

//     switch (numbers.storage) {
//     case 0:
//         return sparseDOK(numbers)
//     case 1:
//         return numbers
//     case 2:
//         return Pacioli.tagNumbers(numeric.sscatter(numbers), m, n, 1)
//     case 3:
//         return Pacioli.tagNumbers(numeric.sscatter(numeric.ccsGather(numbers)), m, n, 1)
//     }
// }

export function getCOONumbers(numbers: any): number[][] {
  switch ((numbers as any).storage) {
    case 0:
      return DOK2COO(numbers);
    case 1:
      return DOK2COO(numbers);
    case 2:
      return numbers;
    case 3:
      var ccsNumbers = ccsGather(numbers);
      var rows = ccsNumbers[0];
      var columns = ccsNumbers[1];
      var values = ccsNumbers[2];
      var tmp: any = [];
      for (var i = 0; i < rows.length; i++) {
        if (tmp[rows[i]] === undefined) tmp[rows[i]] = [];
        tmp[rows[i]][columns[i]] = values[i];
      }
      return DOK2COO(tmp);
    default:
      throw new Error("unknown number kind");
  }
}

export function getCCSNumbers(numbers: any) {
  var ccsNumbers;
  switch (numbers.storage) {
    case 0:
      ccsNumbers = ccsSparse(numbers);
      break;
    case 1:
      var gathered = DOK2COO(numbers);
      if (gathered[0].length === 0) {
        ccsNumbers = ccsScatter([[0], [0], [0]]);
      } else {
        ccsNumbers = ccsScatter(gathered);
      }
      break;
    case 2:
      if (numbers[0].length === 0) {
        ccsNumbers = ccsScatter([[0], [0], [0]]);
      } else {
        ccsNumbers = ccsScatter(numbers);
      }
      break;
    case 3:
      return numbers;
  }
  return tagNumbers(ccsNumbers, numbers.nrRows, numbers.nrColumns, 3);
}

function DOK2COO(numbers: any) {
  var rows = [];
  var columns = [];
  var values = [];
  var tmp = [];
  for (let x in numbers) {
    if (numbers.hasOwnProperty(x)) {
      var parsedX = parseInt(x);
      //if (typeof parsedX === "number") {
      if (isFinite(parsedX) && !isNaN(parsedX)) {
        var row = numbers[parsedX];
        for (let y in row) {
          if (row.hasOwnProperty(y)) {
            var parsedY = parseInt(y);
            //if (typeof parsedY === "number") {
            if (isFinite(parsedY) && !isNaN(parsedY)) {
              var value = row[parsedY];
              if (value !== 0) {
                tmp.push([parsedX, parsedY, value]);
              }
            }
          }
        }
      }
    }
  }
  tmp.sort(function (a, b) {
    if (a[0] > b[0]) return 1;
    if (a[0] < b[0]) return -1;
    if (a[1] > b[1]) return 1;
    if (a[1] < b[1]) return -1;
    return 0;
  });
  for (var i = 0; i < tmp.length; i++) {
    rows.push(tmp[i][0]);
    columns.push(tmp[i][1]);
    values.push(tmp[i][2]);
  }

  return tagNumbers(
    [rows, columns, values],
    numbers.nrRows,
    numbers.nrColumns,
    2
  );
}

export function get(numbers: any, i: any, j: any) {
  return tagNumbers([[getNumber(numbers, i, j)]], 1, 1, 0);
}

export function set(numbers: any, row: number, column: number, value: number) {
  switch (numbers.storage) {
    case 0:
      numbers[row][column] = value;
      break;
    case 1:
      if (numbers[row] === undefined) {
        numbers[row] = new Array(numbers.nrColumns);
      }
      numbers[row][column] = value;
      break;
    case 2:
      var rows = numbers[0];
      var columns = numbers[1];
      var values = numbers[2];
      var n = rows.length;
      var i = n;
      while (
        0 < i &&
        (row < rows[i - 1] || (row === rows[i - 1] && column <= columns[i - 1]))
      ) {
        i--;
      }
      if (i < n && column !== columns[i]) {
        for (var k = n; i < k; k--) {
          rows[k] = rows[k - 1];
          columns[k] = columns[k - 1];
          values[k] = values[k - 1];
        }
      }
      rows[i] = row;
      columns[i] = column;
      values[i] = value;
      break;
    case 3:
      throw "Set not implemented for CCS storage";
  }
}

export function getNumber(numbers: number[][], row: number, column: number) {
  switch ((numbers as any).storage) {
    case 0:
      return numbers[row][column];
    case 1:
      return numbers[row] ? numbers[row][column] || 0 : 0;
    case 2:
      var rows = numbers[0];
      var columns = numbers[1];
      var values = numbers[2];
      for (var i = 0; i < rows.length; i++) {
        if (row < rows[i]) return 0;
        if (row === rows[i]) {
          if (column < columns[i]) return 0;
          if (column === columns[i]) return values[i];
        }
      }
      return 0;
    case 3:
      var columns = numbers[0];
      var rows = numbers[1];
      var values = numbers[2];
      var n = columns.length - 1;
      if (column < n) {
        var start = columns[column];
        var end = columns[column + 1];
        for (var i = start; i != end; i++) {
          if (rows[i] === row) {
            return values[i];
          }
        }
        return 0;
      } else {
        return 0;
      }
    default:
      throw new Error("unexpect number storage");
  }
}

export function unaryNumbers(numbers: any, fun: any) {
  var coo = getCOONumbers(numbers);
  return tagNumbers(
    [coo[0], coo[1], coo[2].map(fun)],
    numbers.nrRows,
    numbers.nrColumns,
    2
  );
}

export function elementWiseNumbers(xNumbers: any, yNumbers: any, fun: any) {
  var px = 0;
  var py = 0;
  var xCOO = getCOONumbers(xNumbers);
  var yCOO = getCOONumbers(yNumbers);
  var xRows = xCOO[0];
  var xColumns = xCOO[1];
  var xValues = xCOO[2];
  var yRows = yCOO[0];
  var yColumns = yCOO[1];
  var yValues = yCOO[2];
  var xLen = xRows.length;
  var yLen = yRows.length;

  var rows: number[] = [];
  var columns: number[] = [];
  var values: number[] = [];

  var handle = function (r: number, c: number, vx: number, vy: number) {
    var val = fun(vx, vy);
    if (typeof val === "number" && val !== 0) {
      rows.push(r);
      columns.push(c);
      values.push(val);
    }
  };

  while (px < xLen && py < yLen) {
    var rx = xRows[px];
    var ry = yRows[py];
    var cx = xColumns[px];
    var cy = yColumns[py];
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
    var rx = xRows[px];
    var cx = xColumns[px];
    handle(rx, cx, xValues[px], 0);
    px++;
  }

  while (py < yLen) {
    var ry = yRows[py];
    var cy = yColumns[py];
    handle(ry, cy, 0, yValues[py]);
    py++;
  }

  return tagNumbers(
    [rows, columns, values],
    xNumbers.nrRows,
    xNumbers.nrColumns,
    2
  );
}

export function findNonZero(
  xNumbers: any,
  yNumbers: any,
  fun: any,
  zero_zero_case: any
) {
  var px = 0;
  var py = 0;
  var xCOO = getCOONumbers(xNumbers);
  var yCOO = getCOONumbers(yNumbers);
  var xRows = xCOO[0];
  var xColumns = xCOO[1];
  var xValues = xCOO[2];
  var yRows = yCOO[0];
  var yColumns = yCOO[1];
  var yValues = yCOO[2];
  var xLen = xRows.length;
  var yLen = yRows.length;
  var count = 0;

  while (px < xLen && py < yLen) {
    var rx = xRows[px];
    var ry = yRows[py];
    var cx = xColumns[px];
    var cy = yColumns[py];
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
    var rx = xRows[px];
    var cx = xColumns[px];
    if (fun(xValues[px], 0)) return true; //[rx, cx]
    px++;
    count++;
  }

  while (py < yLen) {
    var ry = yRows[py];
    var cy = yColumns[py];
    if (fun(0, yValues[py])) return true; //[ry, cy]
    py++;
    count++;
  }

  if (count == xNumbers.nrRows * xNumbers.nrColumns) {
    return false;
  } else {
    return zero_zero_case;
  }
}

// Pacioli.projectNumbers = function (numbers, shape, cols) {
//     var projectedShape = shape.project(cols)
//     var result = Pacioli.zeroNumbers(projectedShape.nrRows(), projectedShape.nrColumns())
//     var coo = Pacioli.getCOONumbers(numbers)
//     var rows = coo[0]
//     var values = coo[2]
//     for (var i = 0; i < rows.length; i++) {
//         var coords = shape.rowCoordinates(rows[i])
//         var pos = coords.project(cols).position()
//         var sum = Pacioli.getNumber(result, pos, 0)
//         Pacioli.set(result, pos, 0, sum === undefined ? values[i] : sum + values[i])
//     }
//     return result
// }

// Pacioli.projectNumbersAlt = function (numbers, shape, cols) {

//     // Determine the projected shape
//     var projectedShape = shape.project(cols);
//     var m = projectedShape.nrRows();
//     var n = projectedShape.nrColumns();

//     // Determine which columns are not projected
//     var colsComp = [];
//     for (var i = 0; i < shape.rowOrder(); i++) {
//         if (cols.indexOf(i) == -1) {
//             colsComp.push(i);
//         }
//     }

//     // Determine the size of the complement coordinates index set.
//     var nrRows = shape.project(colsComp).nrRows();

//     // Create a map from the complement coordinates to the projected matrices.
//     // Matrix map(x) is the sum of all rows where the compound index contains x.
//     var map = new Map();
//     var coo = Pacioli.getCOONumbers(numbers)
//     var rows = coo[0]
//     var values = coo[2]
//     for (var i = 0; i < rows.length; i++) {
//         var coords = shape.rowCoordinates(rows[i])
//         var coordsComp = coords.project(colsComp).position();
//         var pos = coords.project(cols).position()
//         if (!map.has(coordsComp)) {
//             map.set(coordsComp, Pacioli.zeroNumbers(m, n))
//         }
//         var mat = map.get(coordsComp);
//         var sum = Pacioli.getNumber(mat, pos, 0)
//         Pacioli.set(mat, pos, 0, sum === undefined ? values[i] : sum + values[i])
//     }

//     // Turn the map into the desired list
//     var result = [];
//     map.forEach(function (value, key) {
//         var pair = Pacioli.tagKind([{kind: "coordinates", position: key, size: nrRows}, value], "tuple");
//         result.push(pair)
//     });

//     // Return the list
//     return Pacioli.tagKind(result, "list");
// }
