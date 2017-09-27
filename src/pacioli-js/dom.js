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
// 1. DOM interface
//
// Pacioli.DOM(x) gives a DOM representation of boxed value x.
// -----------------------------------------------------------------------------

Pacioli.DOM = function(x) {

    if (typeof x === "boolean") return document.createTextNode(x.value)

    switch (x.kind()) {
    case "matrix":
        return Pacioli.DOMmatrixTable(x);
    case "coordinates":
        return document.createTextNode(x.coordinatesText())
    case "ref":
        return Pacioli.DOM(x.value[0])
    case "list":
        var list = document.createElement("ul")
        var items = x.unlist()
        for (var i = 0; i < items.length; i++) {
            var item = document.createElement("li")
            item.appendChild(Pacioli.DOM(items[i]))
            list.appendChild(item)
        } 
        return list
    case "tuple":
        var list = document.createElement("ol")
        var items = x.untuple()
        for (var i = 0; i < items.length; i++) {
            var item = document.createElement("li")
            item.appendChild(Pacioli.DOM(items[i]))
            list.appendChild(item)
        } 
        return list
    default:
        return document.createTextNode(x.value)
    }
}

Pacioli.DOMmatrixTable = function(matrix) {

    var shape = matrix.type.param
    var numbers = matrix.value

    var rowOrder = shape.rowOrder()
    var columnOrder = shape.columnOrder()

    if (rowOrder === 0 && columnOrder === 0) {
        var fragment = document.createDocumentFragment()
        var unit = shape.unitAt(0, 0)
        fragment.appendChild(document.createTextNode(matrix.getNumber(0, 0).toFixed(2)))
        if (!unit.isDimensionless()) {
            fragment.appendChild(document.createTextNode(" "))
            fragment.appendChild(unit.symbolized().toDOM())
        }
        //fragment.normalize()
        return fragment
    }

    var table = document.createElement("table")
    table.className = "matrix table"
//    table.style = "width: auto"

    var thead = document.createElement("thead");
    var tbody = document.createElement("tbody");

    table.appendChild(thead);
    table.appendChild(tbody);
    
    var row = document.createElement("tr")

    if (0 < rowOrder) {
        var header = document.createElement("th")
        header.className = "key"
        header.innerHTML = shape.rowName()
        row.appendChild(header)
    }
    if (0 < columnOrder) {
        var header = document.createElement("th")
        header.className = "key"
        header.innerHTML = shape.columnName()
        row.appendChild(header)

    }

    var header = document.createElement("th")
    header.className = "value"
    row.appendChild(header)

    header = document.createElement("th")
    header.className = "unit"
    row.appendChild(header)

    thead.appendChild(row)

    var numbers = Pacioli.getCOONumbers(numbers)
    var rows = numbers[0]
    var columns = numbers[1]
    var values = numbers[2]
    if (rows.length === 0) {
        return document.createTextNode("0")
    } else {
        for (var i = 0; i < rows.length; i++) {
            var row = document.createElement("tr")
                if (0 < rowOrder) {
                    var cell = document.createElement("td")
                    cell.className = "key"
                    cell.innerHTML = shape.rowCoordinates(rows[i]).names 
                    row.appendChild(cell)
                }
                if (0 < columnOrder) {
                    var cell = document.createElement("td")
                    cell.className = "key"
                    cell.innerHTML = shape.columnCoordinates(columns[i]).names
                    row.appendChild(cell)
                }

                var cell = document.createElement("td")
                cell.className = "value"
                cell.innerHTML = values[i].toFixed(2);
                row.appendChild(cell)

                var cell = document.createElement("td")
                cell.className = "unit"
                var un = shape.unitAt(rows[i], columns[i])
                if (un.toText() === '1') {
                    cell.innerHTML = ''
                } else {
                    cell.appendChild(un.symbolized().toDOM())
                }
                row.appendChild(cell)

                tbody.appendChild(row)
        }
    }
    return table
}

// -----------------------------------------------------------------------------
// Variant for unboxed values. Used by printing.
// -----------------------------------------------------------------------------

Pacioli.ValueDOM = function(x) {
    switch (x.kind) {
    case "matrix":
        return true ? Pacioli.ValueDOMmatrixTable(x) :  Pacioli.DOMmatrixTable(x);
    case "coordinates":
        return document.createTextNode(x.position + "/" + x.size)
    case "ref":
        return Pacioli.DOM(x[0])
    case "list":
        var list = document.createElement("ul")
        for (var i = 0; i < x.length; i++) {
            var item = document.createElement("li")
            item.appendChild(Pacioli.DOM(x[i]))
            list.appendChild(item)
        } 
        return list
    case "tuple":
        var list = document.createElement("ol")
        for (var i = 0; i < x.length; i++) {
            var item = document.createElement("li")
            item.appendChild(Pacioli.DOM(x[i]))
            list.appendChild(item)
        } 
        return list
    default:
        return document.createTextNode(x)
    }
}

Pacioli.ValueDOMmatrixTable = function(matrix) {
    var m = matrix.nrRows
    var n = matrix.nrColumns

    if (m === 1 && n === 1) {
        var fragment = document.createDocumentFragment()
        fragment.appendChild(document.createTextNode(Pacioli.getNumber(matrix, 0, 0).toFixed(2)))
        return fragment
    }

    var table = document.createElement("table")
    table.className = "matrix"

    var row = document.createElement("tr")

    if (0 < m) {
        var header = document.createElement("th")
        header.className = "key"
        header.innerHTML = "row"
        row.appendChild(header)
    }
    if (0 < n) {
        var header = document.createElement("th")
        header.className = "key"
        header.innerHTML = "column"
        row.appendChild(header)

    }

    var header = document.createElement("th")
    header.className = "value"
    row.appendChild(header)

    header = document.createElement("th")
    header.className = "unit"
    row.appendChild(header)

    table.appendChild(row)

    var numbers = Pacioli.getCOONumbers(matrix)
    var rows = numbers[0]
    var columns = numbers[1]
    var values = numbers[2]
    if (rows.length === 0) {
        return document.createTextNode("0")
    } else {
        for (var i = 0; i < rows.length; i++) {
            var row = document.createElement("tr")
                if (0 < m) {
                    var cell = document.createElement("td")
                    cell.className = "key"
                    cell.innerHTML = rows[i] //"rij"//matrix.rowName()
                    row.appendChild(cell)
                }
                if (0 < n) {
                    var cell = document.createElement("td")
                    cell.className = "key"
                    cell.innerHTML = columns[i] //"kolom"//matrix.columnName()
                    row.appendChild(cell)
                }

                var cell = document.createElement("td")
                cell.className = "value"
                cell.innerHTML = values[i].toFixed(2);
                row.appendChild(cell)

                var cell = document.createElement("td")
                cell.className = "unit"
                    cell.innerHTML = ''
                row.appendChild(cell)

                table.appendChild(row)
        }
    }
    return table
}

// -----------------------------------------------------------------------------
// Are these functions used?
// -----------------------------------------------------------------------------

Pacioli.DOMtop = function(n, matrix) {
    return Pacioli.DOM(Pacioli.fun("Matrix", "top").call(Pacioli.num(n), matrix))
}

Pacioli.DOMbottom = function(n, matrix) {
    return Pacioli.DOM(Pacioli.fun("Matrix", "bottom").call(Pacioli.num(n), matrix))
}

Pacioli.DOMrowTops = function(n, matrix) {
    var list = document.createElement("ul")
    var keys = global_Matrix_row_domain(matrix)
    for (var i = 0; i < keys.length; i++) {
        var item = document.createElement("li")
        item.appendChild(Pacioli.DOM(keys[i]))
        item.appendChild(Pacioli.DOMtop(n, global_Matrix_row(matrix, keys[i])))
        list.appendChild(item)
    }
    return list
}

Pacioli.DOMrowBottoms = function(n, matrix) {
    var list = document.createElement("ul")
    var keys = global_Matrix_row_domain(matrix)
    for (var i = 0; i < keys.length; i++) {
        var item = document.createElement("li")
        item.appendChild(Pacioli.DOM(keys[i]))
        item.appendChild(Pacioli.DOMbottom(n, global_Matrix_row(matrix, keys[i])))
        list.appendChild(item)
    }
    return list
}
