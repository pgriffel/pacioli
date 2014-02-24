/* Runtime Support for the Pacioli language
 *
 * Copyright (c) 2013 Paul Griffioen
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

var Pacioli = Pacioli || {};

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

Pacioli.tagNumbers = function (numbers, nrRows, nrColumns, storage) {
    numbers.nrRows = nrRows
    numbers.nrColumns = nrColumns
    numbers.storage = storage
    numbers.kind = 'matrix'
    return numbers
}

Pacioli.getFullNumbers = function (numbers) {

    var m = numbers.nrRows
    var n = numbers.nrColumns

    fillDOK = function (nums) {
        var array = new Array(m);
        for (var i = 0; i < m; i++) {
            var inner = new Array(n); 
            for (var j = 0; j < n; j++) {
                inner[j] = nums[i] ? nums[i][j] || 0 : 0
            }
            array[i] = inner
        }
        return Pacioli.tagNumbers(array, m, n, 0)
    }

    switch (numbers.storage)
    {
    case 0:
        return numbers
    case 1:
        return fillDOK(numbers)
    case 2:
        return fillDOK(numeric.sscatter(numbers))
        // or:
        // return numeric.ccsFull(numeric.ccsScatter(this.numbers))
    case 3:

        // Let numeric create a full matrix, although it might be too small
        var full = numeric.ccsFull(numbers)

        // Fill the missing rows and columns with zeros
        for (var i = full.length; i < m; i++) {
            full[i] = []
            for (var j = 0; j < n; j++) {
                full[i][j] = 0
            }
        }
        for (var j = full[0].length; j < n; j++) {
            for (var i = 0; i < m; i++) {
                full[i][j] = 0
            }
        }
        
        return Pacioli.tagNumbers(full, m, n, 0)
    }
}

Pacioli.getDOKNumbers = function (numbers) {

    var m = numbers.nrRows
    var n = numbers.nrColumns

    sparseDOK = function (nums) {
        var array = []
        for (var i = 0; i < m; i++) {
            var inner = nums[i]
            for (var j = 0; j < n; j++) {
                if (inner[j] !== 0) {
                    if (array[i] === undefined) {
                        array[i] = []
                    }
                    array[i][j] = inner[j]
                }
            }
        }
        return Pacioli.tagNumbers(array, m, n, 1)
    }

    switch (numbers.storage) {
    case 0:
        return sparseDOK(numbers)
    case 1:
        return numbers
    case 2:
        return Pacioli.tagNumbers(numeric.sscatter(numbers), m, n, 1)
    case 3:
        return Pacioli.tagNumbers(numeric.sscatter(numeric.ccsGather(numbers)), m, n, 1)
    }
}

Pacioli.getCOONumbers = function (numbers) {
    switch (numbers.storage) {
    case 0:
        return Pacioli.DOK2COO(numbers)
    case 1:
        return Pacioli.DOK2COO(numbers)
    case 2:
        return numbers
    case 3:
        var ccsNumbers = numeric.ccsGather(numbers)
        var rows = ccsNumbers[0]
        var columns = ccsNumbers[1]
        var values = ccsNumbers[2]
        var tmp = []
        for (var i = 0; i < rows.length; i++) {
            if (tmp[rows[i]] === undefined) tmp[rows[i]] = []
            tmp[rows[i]][columns[i]] = values[i]
        }
        return Pacioli.DOK2COO(tmp)
    }
}

Pacioli.getCCSNumbers = function (numbers) {
    var ccsNumbers
    switch (numbers.storage) {
    case 0:
        ccsNumbers = numeric.ccsSparse(numbers)
        break
    case 1:
        var gathered = Pacioli.DOK2COO(numbers)
        if (gathered[0].length === 0) {
            ccsNumbers = numeric.ccsScatter([[0], [0], [0]])
        } else {
            ccsNumbers = numeric.ccsScatter(gathered)
        }
        break
    case 2:
        if (numbers[0].length === 0) {
            ccsNumbers = numeric.ccsScatter([[0], [0], [0]])
        } else {
            ccsNumbers = numeric.ccsScatter(numbers)
        }
        break
    case 3:
        return numbers
    }
    return Pacioli.tagNumbers(ccsNumbers, numbers.nrRows, numbers.nrColumns, 3)
}

Pacioli.DOK2COO = function (numbers) {
    var rows = []
    var columns = []
    var values = []
    for (x in numbers) {
        if (numbers.hasOwnProperty(x)) {
            var parsedX = parseInt(x)
            //if (typeof parsedX === "number") {
            if (isFinite(parsedX) && !isNaN(parsedX)) {
                var row = numbers[parsedX]
                for (y in row) {
                    if (row.hasOwnProperty(y)) {
                        var parsedY = parseInt(y)
                        //if (typeof parsedY === "number") {
                        if (isFinite(parsedY) && !isNaN(parsedY)) {
                            var value = row[parsedY]
                            if (value !== 0) {
                                rows.push(parsedX)
                                columns.push(parsedY)
                                values.push(value)
                            }
                        }
                    }
                }
            }
        }
    }
    return Pacioli.tagNumbers([rows, columns, values], numbers.nrRows, numbers.nrColumns, 2)
}

Pacioli.get = function (numbers, i, j) {
    return Pacioli.tagNumbers([[Pacioli.getNumber(numbers, i, j)]], 1, 1, 0)
}

Pacioli.set = function (numbers, row, column, value) {
    switch (numbers.storage) {
    case 0:
        numbers[row][column] = value
        break;
    case 1:
        if (numbers[row] === undefined) {
            numbers[row] = new Array(numbers.nrColumns)
        }
        numbers[row][column] = value
        break;
    case 2:
        var rows = numbers[0]
        var columns = numbers[1]
        var values = numbers[2]
        var n = rows.length
        var i = n;
        while (0 < i  && (row < rows[i-1] || (row === rows[i-1] && column <= columns[i-1]))) {
            i--
        }
        if (i < n && column !== columns[i]) {
            for (var k = n; i < k; k--) {
                rows[k] = rows[k-1]
                columns[k] = columns[k-1]
                values[k] = values[k-1]
            }
        }
        rows[i] = row
        columns[i] = column
        values[i] = value
        break;      
    case 3:
        throw "Set not implemented for CCS storage"
    }
}

Pacioli.getNumber = function (numbers, row, column) {
    switch (numbers.storage) {
    case 0:
        return numbers[row][column]
    case 1:
        return numbers[row] ? numbers[row][column] || 0 : 0
    case 2:
        var rows = numbers[0]
        var columns = numbers[1]
        var values = numbers[2]
        for (var i = 0; i < rows.length; i++) {
            if (row < rows[i]) return 0;
            if (row === rows[i]) {
              if (column < columns[i]) return 0;
              if (column === columns[i]) return values[i];
            }
        }
        return 0
      case 3:
        var columns = numbers[0]
        var rows = numbers[1]
        var values = numbers[2]
        var n = columns.length - 1
        if (column < n) {
            var start = columns[column]
            var end = columns[column+1]
            for (var i = start; i != end; i++) {
                if (rows[i] === row) {
                    return values[i]
                }
            }
            return 0
        } else {
            return 0
        }
    }
}

Pacioli.unaryNumbers = function (numbers, fun) {
    var coo = Pacioli.getCOONumbers(numbers)
    return Pacioli.tagNumbers([coo[0], coo[1], coo[2].map(fun)], numbers.nrRows, numbers.nrColumns, 2)
}

Pacioli.elementWiseNumbers = function (xNumbers, yNumbers, fun) {
    var px = 0
    var py = 0
    var xCOO = Pacioli.getCOONumbers(xNumbers)
    var yCOO = Pacioli.getCOONumbers(yNumbers)
    var xRows = xCOO[0]
    var xColumns = xCOO[1]
    var xValues = xCOO[2]
    var yRows = yCOO[0]
    var yColumns = yCOO[1]
    var yValues = yCOO[2]
    var xLen = xRows.length
    var yLen = yRows.length

    var rows = []
    var columns = []
    var values = []

    var handle = function (r, c, vx, vy) {
        var val = fun(vx, vy)
        if (typeof val === "number" && val !== 0) { 
            rows.push(r)
            columns.push(c)
            values.push(val)
        }
    }

    while (px < xLen && py < yLen) {
        var rx = xRows[px]
        var ry = yRows[py]
        var cx = xColumns[px]
        var cy = yColumns[py]
        if (rx > ry) {
            handle(ry, cy, 0, yValues[py])
            py++
        } else if (rx < ry) {
            handle(rx, cx, xValues[px], 0)
            px++
        } else {
            if (cx < cy) {
                handle(rx, cx, xValues[px], 0)
                px++
            } else if (cx > cy) {
                handle(ry, cy, 0, yValues[py])
                py++
            } else {
                handle(rx, cy, xValues[px], yValues[py])
                px++
                py++
            }
        }
    }

    while (px < xLen) {
        var rx = xRows[px]
        var cx = xColumns[px]
        handle(rx, cx, xValues[px], 0)
        px++
    }

    while (py < yLen) {
        var ry = yRows[py]
        var cy = yColumns[py]
        handle(ry, cy, 0, yValues[py])
        py++
    }

    return Pacioli.tagNumbers([rows, columns, values], xNumbers.nrRows, xNumbers.nrColumns, 2)
}


Pacioli.findNonZero = function (xNumbers, yNumbers, fun) {
    var px = 0
    var py = 0
    var xCOO = Pacioli.getCOONumbers(xNumbers)
    var yCOO = Pacioli.getCOONumbers(yNumbers)
    var xRows = xCOO[0]
    var xColumns = xCOO[1]
    var xValues = xCOO[2]
    var yRows = yCOO[0]
    var yColumns = yCOO[1]
    var yValues = yCOO[2]
    var xLen = xRows.length
    var yLen = yRows.length

    var rows = []
    var columns = []
    var values = []

    while (px < xLen && py < yLen) {
        var rx = xRows[px]
        var ry = yRows[py]
        var cx = xColumns[px]
        var cy = yColumns[py]
        if (rx > ry) {
            if (fun(0, yValues[py])) return [ry, cy]
            py++
        } else if (rx < ry) {
            if (fun(xValues[px], 0)) return [rx, cx]
            px++
        } else {
            if (cx < cy) {
                if (fun(xValues[px], 0)) return [rx, cx]
                px++
            } else if (cx > cy) {
                if (fun(0, yValues[py])) return [ry, cy]
                py++
            } else {
                if (fun(xValues[px], yValues[py])) return [rx, cy]
                px++
                py++
            }
        }
    }

    while (px < xLen) {
        var rx = xRows[px]
        var cx = xColumns[px]
        if (fun(xValues[px], 0)) return [rx, cx]
        px++
    }

    while (py < yLen) {
        var ry = yRows[py]
        var cy = yColumns[py]
        if (fun(0, yValues[py])) return [ry, cy]
        py++
    }

    return null
}

Pacioli.projectNumbers = function (numbers, shape, cols) {
    var projectedShape = shape.project(cols)
    var result = Pacioli.zeroNumbers(projectedShape.nrRows(), projectedShape.nrColumns())
    var coo = Pacioli.getCOONumbers(numbers)
    var rows = coo[0]
    var values = coo[2]
    for (var i = 0; i < rows.length; i++) {
        var coords = shape.rowCoordinates(rows[i])
        var pos = coords.project(cols).position()
        var sum = Pacioli.getNumber(result, pos, 0)
        Pacioli.set(result, pos, 0, sum === undefined ? values[i] : sum + values[i])
    }
    return result
}
