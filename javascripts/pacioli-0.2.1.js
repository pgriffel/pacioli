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
// 1. Power Products and Units
//
// The PowerProducts data type supports the algebraic operations for units
// of measurement.
//
// A base in a power product must be a string. For a unit this string is its
// unique name. A unit vector's base pair (u,i) is represented as string 'u$i'. 
// -----------------------------------------------------------------------------

Pacioli.PowerProduct = function (x) {
    this.powers = {}
    if (typeof x === 'number') {
        this.factor = x
    } else {
        this.factor = 1;
        this.powers[x] = 1;
    }
}

Pacioli.PowerProduct.prototype.power = function (x) {
    return this.powers[x] || 0;
}

Pacioli.PowerProduct.prototype.equals = function (arg) {
    var other = arg instanceof Pacioli.PowerProduct ? arg : new Pacioli.PowerProduct(arg)
    for (var x in this.powers) {
        if (this.power(x) !== other.power(x)) {
            return false
        }
    }
    for (var x in other.powers) {
        if (this.power(x) !== other.power(x)) {
            return false
        }
    }
    return true;
}

Pacioli.PowerProduct.prototype.isDimensionless = function () {
    for (var base in this.powers) {
        if (this.powers[base] !== 0) {
            return false;
        }
    }
    return true;
}

Pacioli.PowerProduct.prototype.flat = function () {

    flatUnit = function (name) {
        var unit = Pacioli.fetchUnit(name)
        if (unit.definition === undefined) {
            return new Pacioli.PowerProduct(name)
        } else {
            return unit.definition.flat()
        }
    }

    return this.map(function (base) {
        var names = base.split('$')
        if (names.length === 1) {
            return flatUnit(base)
        } else {
            var prefix = Pacioli.prefix[names[0]]
            if (prefix === undefined) {
                throw new Error("prefix '" + names[0] + "' unknown")
            } else {
                return new Pacioli.PowerProduct(prefix.factor).mult(flatUnit(names[1]))
            }
        }
    })
}

Pacioli.PowerProduct.prototype.toText = function () {
    var text = "";
    for (var x in this.powers) {
        var n = this.powers[x]
        var base = x //x.replace('$', ':')
        if (n === 1) {
            text += '*' + base;
        }
        if (1 < n) {
            text += '*' + base + '^' + n;
        }
        if (n === -1) {
            text += '/' + base;
        }
        if (n < -1) {
            text += '/' + base + '^' + -n;
        }
    }
    if (this.factor === 1 && text[0] === '*') {
        return text.substr(1)
    } else if (this.factor === 1 && text === "") {
        return ""
    } else {
        return this.factor + text;
    }
}

Pacioli.PowerProduct.prototype.toDOM = function () {
    var fragment = document.createDocumentFragment()
    fragment.appendChild(document.createTextNode(this.factor))
    var text = "";
    var firstPower = null;
    for (var x in this.powers) {
        var n = this.powers[x]
        if (firstPower === null && n !==0) {
            firstPower = n
        }
        var base = x //x.replace('$', ':')
        if (n === 1) {
            text += '*' + base;
            fragment.appendChild(document.createTextNode("*"))
            fragment.appendChild(document.createTextNode(base))
        }
        if (1 < n) {
            text += '*' + base + '<sup>' + n + '</sup>';
            fragment.appendChild(document.createTextNode("*"))
            fragment.appendChild(document.createTextNode(base))
            var sup = document.createElement("sup")
            sup.appendChild(document.createTextNode(n))
            fragment.appendChild(sup)
        }
        if (n === -1) {
            text += '/' + base;
            fragment.appendChild(document.createTextNode("/" + base))
        }
        if (n < -1) {
            text += '/' + base + '<sup>' + -n + '</sup>';
            fragment.appendChild(document.createTextNode("/" + base))
            var sup = document.createElement("sup")
            sup.appendChild(document.createTextNode(-n))
            fragment.appendChild(sup)
        }
    }
    if (this.factor == 1 && 0 < firstPower) {
        fragment.removeChild(fragment.firstChild)
        fragment.removeChild(fragment.firstChild)
    } 
    //fragment.normalize()
    return fragment
}

Pacioli.PowerProduct.prototype.mult = function (other) {
    var result = new Pacioli.PowerProduct(this.factor*other.factor);
    for (var x in this.powers) {
        result.powers[x] = this.powers[x];
    }
    for (var x in other.powers) {
        result.powers[x] = this.power(x) + other.powers[x];
    }
    return result;
}

Pacioli.PowerProduct.prototype.div = function (other) {
    var result = new Pacioli.PowerProduct(this.factor/other.factor);
    for (var x in this.powers) {
        result.powers[x] = this.powers[x];
    }
    for (var x in other.powers) {
        result.powers[x] = this.power(x) - other.powers[x];
    }
    return result;
}

Pacioli.PowerProduct.prototype.reciprocal = function () {
    var result = new Pacioli.PowerProduct(this.factor === 0 ? 0 : 1/this.factor);
    for (var x in this.powers) {
        result.powers[x] = -this.powers[x];
    }
    return result;
}

Pacioli.PowerProduct.prototype.expt = function (power) {
    var result = new Pacioli.PowerProduct(Math.pow(this.factor, power));
    for (var x in this.powers) {
        result.powers[x] = this.powers[x] * power;
    } 
    return result;
}

Pacioli.PowerProduct.prototype.map = function (fun) {
    var result = new Pacioli.PowerProduct(this.factor);
    for (var x in this.powers) {
        var base = fun(x)
        var powerBase = base instanceof Pacioli.PowerProduct ? base : new Pacioli.PowerProduct(base)
        result = result.mult(powerBase.expt(this.powers[x]))
    }
    return result;
}

Pacioli.PowerProduct.prototype.symbolized = function () {
    return this.map(function (base) { 
        var names = base.split('$')
        if (names.length === 1) {
            return Pacioli.fetchUnit(base).symbol 
        } else {
            var prefix = Pacioli.prefix[names[0]]
            if (prefix === undefined) {
                throw new Error("prefix '" + names[0] + "' unknown")
            } else {
                return prefix.symbol + Pacioli.fetchUnit(names[1]).symbol
            }
        }
    })
}

Pacioli.PowerProduct.prototype.conversionFactor = function (to) {
    var flat = this.div(to).flat()
    if (flat.isDimensionless()) {
        return flat.factor
    } else {
        throw new Error("cannot convert unit '" + this.toText() + "' to unit '" + to.toText() + "'")
    }
}
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
// 1. Matrix Shape
//
// The Shape data type stores information about the dimensions and the
// units of measurement of a matrix.
// -----------------------------------------------------------------------------

Pacioli.Shape = function (multiplier, rowSets, rowUnit, columnSets, columnUnit) {
    this.multiplier = multiplier || Pacioli.unit(1)
    this.rowSets = rowSets || []
    this.columnSets = columnSets || []
    this.rowUnit = rowUnit || Pacioli.unit(1)
    this.columnUnit = columnUnit || Pacioli.unit(1)
}

Pacioli.Shape.prototype.toString = function () {
    return "Shape"
}

Pacioli.Shape.prototype.rowOrder = function () {
    return this.rowSets.length;
}

Pacioli.Shape.prototype.columnOrder = function () {
    return this.columnSets.length;
}

Pacioli.Shape.prototype.toText = function () {
    var text = '(' + this.multiplier.toText() + '|'
    text += this.rowSets + '|'
    text += this.columnSets + '|'
    text += this.rowUnit.toText() + '|'
    text += this.columnUnit.toText() + '|'
    text += ')'
    return text;
}

Pacioli.Shape.prototype.equals = function (other) {
    return this.toText() === other.toText()
}

Pacioli.Shape.prototype.isScalar = function () {
    return this.rowSets.length == 0 && this.columnSets.length == 0;
}

Pacioli.Shape.prototype.mult = function (other) {
    if (other.isScalar()) {
        return this.scale(other)
    }
    
    if (this.isScalar()) {
        return other.scale(this)
    }

    var result = new Pacioli.Shape();
    result.multiplier = this.multiplier.mult(other.multiplier)
    result.rowSets = this.rowSets
    result.columnSets = this.columnSets
    result.rowUnit = this.rowUnit.mult(other.rowUnit)
    result.columnUnit = this.columnUnit.mult(other.columnUnit)
    return result;
}

Pacioli.Shape.prototype.dot = function (other) {
    var result = new Pacioli.Shape();
    result.multiplier = this.multiplier.mult(other.multiplier)
    result.rowSets = this.rowSets
    result.columnSets = other.columnSets
    result.rowUnit = this.rowUnit
    result.columnUnit = other.columnUnit
    return result;
}

Pacioli.Shape.prototype.transpose = function () {
    var result = new Pacioli.Shape();
    result.multiplier = this.multiplier
    result.rowSets = this.columnSets
    result.columnSets = this.rowSets
    result.rowUnit = this.columnUnit.reciprocal()
    result.columnUnit = this.rowUnit.reciprocal()
    return result;
}

Pacioli.Shape.prototype.reciprocal = function () {
    var result = new Pacioli.Shape();
    result.multiplier = this.multiplier.reciprocal()
    result.rowSets = this.rowSets
    result.columnSets = this.columnSets
    result.rowUnit = this.rowUnit.reciprocal()
    result.columnUnit = this.columnUnit.reciprocal()
    return result;
}

Pacioli.Shape.prototype.kron = function (other) {
    var mapper = function (order) {
                     return function (base) { 
                         var parts = base.split('$')
                         return parts[0] + '$' + (parseInt(parts[1]) + order); 
                     }
                 }
    var result = new Pacioli.Shape();
    result.multiplier = this.multiplier.mult(other.multiplier)
    result.rowSets = this.rowSets.concat(other.rowSets)
    result.columnSets = this.columnSets.concat(other.columnSets)
    result.rowUnit = this.rowUnit.mult(other.rowUnit.map(mapper(this.rowOrder())))
    result.columnUnit = this.columnUnit.mult(other.columnUnit.map(mapper(this.columnOrder())))
    return result;
}

Pacioli.Shape.prototype.project = function (cols) {
    var mapper = function (from, to) {
                     return function (base) { 
                         var parts = base.split('$')
                         var offset = parseInt(parts[1])
                         return offset === from ? parts[0] + '$' + to : 1
                         
                     }
                 }
    var result = new Pacioli.Shape();
    result.multiplier = this.multiplier
    for (var i = 0; i < cols.length; i++) {
        result.rowSets.push(this.rowSets[cols[i]])
        result.rowUnit = result.rowUnit.mult(this.rowUnit.map(mapper(cols[i], i)))
    }
    return result;
}

Pacioli.Shape.prototype.expt = function (power) {
    var result = new Pacioli.Shape();
    result.multiplier = this.multiplier.expt(power)
    result.rowSets = this.rowSets
    result.columnSets = this.columnSets
    result.rowUnit = this.rowUnit.expt(power)
    result.columnUnit = this.columnUnit.expt(power)
    return result;
}

Pacioli.Shape.prototype.scale = function (factor) {
    var result = new Pacioli.Shape();
    result.multiplier = this.multiplier.mult(factor.multiplier)
    result.rowSets = this.rowSets
    result.columnSets = this.columnSets
    result.rowUnit = this.rowUnit
    result.columnUnit = this.columnUnit
    return result;
}

Pacioli.Shape.prototype.div = function (other) {
    return this.mult(other.reciprocal())
}

Pacioli.Shape.prototype.dim_inv = function () {
    return this.transpose().reciprocal()
}

Pacioli.Shape.prototype.per = function (other) {
    return this.dot(other.dim_inv())
}

Pacioli.Shape.prototype.leftIdentity = function () {
    var row = this.row()
    return row.per(row)
}

Pacioli.Shape.prototype.rightIdentity = function () {
    var column = this.column()
    return column.per(column)
}

Pacioli.Shape.prototype.dimensionless = function () {
    var result = new Pacioli.Shape();
    result.rowSets = this.rowSets
    result.columnSets = this.columnSets
    return result;
}

Pacioli.Shape.prototype.factor = function () {
    var result = new Pacioli.Shape();
    result.multiplier = this.multiplier
    return result;
}

Pacioli.Shape.prototype.row = function () {
    var result = new Pacioli.Shape();
    result.rowSets = this.rowSets
    result.rowUnit = this.rowUnit
    return result;
}

Pacioli.Shape.prototype.column = function () {
    var result = new Pacioli.Shape();
    result.columnSets = this.columnSets
    result.columnUnit = this.columnUnit
    return result;
}

Pacioli.Shape.prototype.nrRows = function () {
    var count = 1
    for (var i = 0; i < this.rowOrder(); i++) {
        count *= this.rowSets[i].items.length
    }
    return count
}

Pacioli.Shape.prototype.nrColumns = function () {
    var count = 1
    for (var i = 0; i < this.columnOrder(); i++) {
        count *= this.columnSets[i].items.length
    }
    return count
}

Pacioli.Shape.prototype.rowCoordinates = function (position) {
    return new Pacioli.Coordinates(position, this.rowSets);
}

Pacioli.Shape.prototype.columnCoordinates = function (position) {
    return new Pacioli.Coordinates(position, this.columnSets);
}

Pacioli.Shape.prototype.rowName = function () {
    return this.rowSets.map(function (x) {return x.name})
}

Pacioli.Shape.prototype.columnName = function () {
    return this.columnSets.map(function (x) {return x.name})
}

Pacioli.Shape.prototype.columnCoordinates = function (position) {
    return new Pacioli.Coordinates(position, this.columnSets);
}

Pacioli.Shape.prototype.findRowUnit = function (row) {
    return this.rowCoordinates(row).findIndividualUnit(this.rowUnit)
}

Pacioli.Shape.prototype.findColumnUnit = function (column) {
    return this.columnCoordinates(column).findIndividualUnit(this.columnUnit)
}

Pacioli.Shape.prototype.unitAt = function (row, column) {
    return this.multiplier.mult(this.findRowUnit(row)).div(this.findColumnUnit(column))
}
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
// 1. Index Sets and Coordinates
//
// The Shape data type stores information about the dimensions and the
// units of measurement of a matrix.
// -----------------------------------------------------------------------------

Pacioli.Coordinates = function(names, indexSets) {
    if (typeof names === "number") { 
        this.names = []
        var pos = names
        for (var i = indexSets.length - 1; 0 <= i; i--) {
            var l = indexSets[i].items.length
            this.names[i] = indexSets[i].items[pos % l]
            pos = Math.floor(pos / l)
        }
    } else { 
        this.names = names
    }
    this.indexSets = indexSets
    this.kind = "coordinates"
}

Pacioli.Coordinates.prototype.project = function (cols) {
    var names = []
    var indexSets = []
    for (var i = 0; i < cols.length; i++) {
        names.push(this.names[cols[i]])
        indexSets.push(this.indexSets[cols[i]])
    }
    return new Pacioli.Coordinates(names, indexSets)
}

Pacioli.Coordinates.prototype.toText = function () {
    var n = this.order()
    if (n === 0) {
        return "_"
    } else {
        var names = new Array(n)
        for (var i = 0 ; i < n; i++) {
            names[i] = this.indexSets[i].name + '@' + this.names[i]
        }
        return names.reduce(function (x, y) {return x + '%' + y})
    }
}

Pacioli.Coordinates.prototype.shortText = function () {
    var n = this.order()
    if (n === 0) {
        return "_"
    } else {
        var names = new Array(n)
        for (var i = 0 ; i < n; i++) {
            names[i] = this.names[i]
        }
        return names.reduce(function (x, y) {return x + '%' + y})
    }
}

Pacioli.Coordinates.prototype.equals = function (other) {
    var n = this.order()
    if (other.order() !== n) {
        return false
    }
    for (var i = 0; i < n; i++) {
        if (this.indexSets[i] !== other.indexSets[i]) {
            return false
        }
        if (this.names[i] !== other.names[i]) {
            return false
        }
    }
    return true
}

Pacioli.Coordinates.prototype.shape = function () {
    var shape = new Pacioli.Shape();
    shape.multiplier = Pacioli.unit(1)
    shape.rowSets = this.indexSets
    shape.columnSets = []
    shape.rowUnit = Pacioli.unit(1)
    shape.columnUnit = Pacioli.unit(1)
    return shape
}

Pacioli.Coordinates.prototype.order = function () {
    return this.names.length
}

Pacioli.Coordinates.prototype.size = function () {
    var size = 1
    for (var i = 0 ; i < this.order(); i++) {
        var set = this.indexSets[i]
        size = size*set.items.length
    }
    return size;
}

Pacioli.Coordinates.prototype.position = function () {
    var position = 0
    for (var i = 0 ; i < this.order(); i++) {
        var set = this.indexSets[i]
        position = position*set.items.length + set.index[this.names[i]]
    }
    return position;
}

Pacioli.Coordinates.prototype.findIndividualUnit = function (unit) {

    var names = this.names
    
    vecBaseItem = function (base, order) {
        var parts = base.split('$')
        if (parts[1] == order) {
            var vec = Pacioli.lookupItem('unitvec_' + parts[0]) 
            var pos = names[order]
            return vec.units[pos] || Pacioli.unit(1)
        } else {
            return Pacioli.unit(1)
        }
    }

    var newUnit = Pacioli.unit(1)
    for (var i = 0; i < this.order() ; i++) {
        newUnit = newUnit.mult(unit.map(function (base) {return vecBaseItem(base, i) }))
    }
    return newUnit;
}
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
//
// A box combines a Pacioli type and value into a single
// object. Pacioli values in the outside world are always boxed, but
// internally types and values are computated seperately to avoid
// boxing and unboxing.
//
// The box object provides some convenient functions to handle Pacioli
// values. Which functions are applicable depends on the kind of value.
//
//   kind function:
//     .apply and .call
//
//   kind matrix:
//     .get and .getNumber
//     .number, .convert and .unit  (singleton matrices only)
//
//   kind list:
//     .length and .unlist
//
//   kind tuple:
//     .length and .untuple
// -----------------------------------------------------------------------------

Pacioli.Box = function(type, value) {
    this.type = type
    this.value = value
}

Pacioli.Box.prototype.toString = function () {
    return "Pacioli " + this.value.kind + " object"
}

Pacioli.Box.prototype.kind = function () {
    return this.value.kind
}

Pacioli.Box.prototype.apply = function (argument) {
    var utuple = argument.map(function (x) {return x.type})
    var vtuple = argument.map(function (x) {return x.value})
    utuple.kind = 'tuple'
    vtuple.kind = 'tuple'
    return new Pacioli.Box(this.type.apply(this, utuple), this.value.apply(this, vtuple))
}

Pacioli.Box.prototype.call = function () {
    var utuple = Array.prototype.slice.call(arguments, 0).map(function (x) {return x.type})
    var vtuple = Array.prototype.slice.call(arguments, 0).map(function (x) {return x.value})
    utuple.kind = 'tuple'
    vtuple.kind = 'tuple'
    return new Pacioli.Box(this.type.apply(this, utuple), this.value.apply(this, vtuple))
}

Pacioli.Box.prototype.get = function (i, j) {
    var shape = new Pacioli.Shape();
    shape.multiplier = this.type.param.unitAt(i, j);
    return new Pacioli.Box(new Pacioli.Type('matrix', shape), Pacioli.get(this.value, i, j))
}

Pacioli.Box.prototype.getNumber = function (i, j) {
    return Pacioli.getNumber(this.value, i, j)
}

Pacioli.Box.prototype.length = function () {
    return this.value.length
}

Pacioli.Box.prototype.number = function () {
    return Pacioli.getNumber(this.value, 0, 0)
}

Pacioli.Box.prototype.convert = function (unit) {
    return Pacioli.num(Pacioli.getNumber(this.value, 0, 0) * this.type.param.unitAt(0, 0).conversionFactor(unit), unit)
}

Pacioli.Box.prototype.unit = function () {
    return this.type.param.unitAt(0, 0)
}

Pacioli.Box.prototype.untuple = function () {
    var array = []
    for (var i = 0; i < this.value.length; i++) {
        array.push(new Pacioli.Box(this.type.param[i], this.value[i]))
    }
    return array
}

Pacioli.Box.prototype.unlist = function () {
    var array = []
    for (var i = 0; i < this.value.length; i++) {
        array.push(new Pacioli.Box(this.type.param, this.value[i]))
    }
    return array
}


Pacioli.Box.prototype.coordinatesText = function () {
    return new Pacioli.Coordinates(this.value.position, this.type.param).shortText()
}
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
    if (x instanceof Pacioli.Matrix) {
        return Pacioli.DOMmatrixTable(x);
    } else if (x instanceof Pacioli.Coordinates) {
        return document.createTextNode(x.toText())
    } else if (x instanceof Array) {
        if (x.kind === undefined) {
            var list = document.createElement("ul")
            for (var i = 0; i < x.length; i++) {
                var item = document.createElement("li")
                item.appendChild(Pacioli.DOM(x[i]))
                list.appendChild(item)
            } 
            return list
        } else {
            var list = document.createElement("ol")
            for (var i = 0; i < x.length; i++) {
                var item = document.createElement("li")
                item.appendChild(Pacioli.DOM(x[i]))
                list.appendChild(item)
            } 
            return list
        }
    } else if (x instanceof Pacioli.Shape) {
        return document.createTextNode(x.toText())
    } else {
        return document.createTextNode(x)
    }
}

Pacioli.ValueDOM = function(x) {
    switch (x.kind) {
    case "matrix":
        return valuesOnly === true ? Pacioli.ValueDOMmatrixTable(x) :  Pacioli.DOMmatrixTable(x);
    case "coordinates":
        return document.createTextNode(x.toText())
    case "ref":
        return Pacioli.DOM(x[0])
    case "list":
        var list = document.createElement("ul")
        for (var i = 0; i < x.length; i++) {
            var item = document.createElement("li")
            item.appendChild(Pacioli.DOM(x[i], valuesOnly))
            list.appendChild(item)
        } 
        return list
    case "tuple":
        var list = document.createElement("ol")
        for (var i = 0; i < x.length; i++) {
            var item = document.createElement("li")
            item.appendChild(Pacioli.DOM(x[i], valuesOnly))
            list.appendChild(item)
        } 
        return list
    default:
        return document.createTextNode(x)
    }
    if (x instanceof Pacioli.Matrix) {
        return Pacioli.DOMmatrixTable(x);
    } else if (x instanceof Pacioli.Coordinates) {
        return document.createTextNode(x.toText())
    } else if (x instanceof Array) {
        if (x.kind === undefined) {
            var list = document.createElement("ul")
            for (var i = 0; i < x.length; i++) {
                var item = document.createElement("li")
                item.appendChild(Pacioli.DOM(x[i]))
                list.appendChild(item)
            } 
            return list
        } else {
            var list = document.createElement("ol")
            for (var i = 0; i < x.length; i++) {
                var item = document.createElement("li")
                item.appendChild(Pacioli.DOM(x[i]))
                list.appendChild(item)
            } 
            return list
        }
    } else if (x instanceof Pacioli.Shape) {
        return document.createTextNode(x.toText())
    } else {
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


Pacioli.DOMmatrixTable = function(matrix) {

    var shape = matrix.type.param
    var numbers = matrix.value

    var rowOrder = shape.rowOrder()
    var columnOrder = shape.columnOrder()

    if (rowOrder === 0 && columnOrder === 0) {
        var fragment = document.createDocumentFragment()
        var unit = shape.unitAt(0, 0)
        fragment.appendChild(document.createTextNode(matrix.getNumber(0, 0).toFixed(2)))
        if (!unit.equals(1)) {
            fragment.appendChild(document.createTextNode(" "))
            fragment.appendChild(unit.symbolized().toDOM())
        }
        //fragment.normalize()
        return fragment
    }

    var table = document.createElement("table")
    table.className = "matrix"

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

    table.appendChild(row)

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

                table.appendChild(row)
        }
    }
    return table
}

// fixme
Pacioli.DOMmatrix = function(matrix) {
            var theader = "<div><table border='0'>";
            var tbody = '';
            for (var i = 0; i < matrix.nrRows(); i++) {
                tbody += '<tr>';
                for (j = 0; j < matrix.nrColumns(); j++) {
                        tbody += "<td align='right', width='100px'>";
                        tbody += matrix.getNumber(i, j) === 0 ? '-' : matrix.getNumber(i, j) //.toFixed(2);
                        //tbody += ' ' + matrix.unitAt(i, j).toText()
                        tbody += "</td>";
                        tbody += "<td align='left'>";
                        tbody += matrix.getNumber(i, j) === 0 || matrix.unitAt(i, j).toText() === '1' ? '' : matrix.unitAt(i, j).toText()
                        //tbody += ' ' + matrix.unitAt(i, j).toText()
                        tbody += "</td>";
                }
                tbody += "</tr>";
            }
            var tfooter = "</table></div>";
            return theader + tbody + tfooter;
}

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
// Runtime Types
//
// A value's type is a Type object with a kind and a param according to
// the following table:
//
//   Kind             | Type Param               | Value
//   -----------------+--------------------------+-----------------------
//   boole            | -                        | Boole
//   matrix           | Shape Object             | Full, DOK, COO or CCS array
//   coordinate       | Coordinate Object        | Object {position: i, size: n} with 0<=i<n
//   function         | Function                 | Function
//   tuple            | List of Element Type     | Array
//   list             | Element Type             | Array
//   reference        | Element Type             | Singleton Array
//   void             | null                     | null
//
// Notes:
// - A value that is not a Boole or Function is tagged with its kind
// - An unknown type (for empty lists and refs) is indicated with null.
// - A matrix is additionally tagged with its storage, nrRows and nrColumns
// - The coordinate object is a representative. Its names are ignored.
// - See file numbers.js for the Full, DOK, COO or CCS arrays
// -----------------------------------------------------------------------------

Pacioli.Type = function(kind, param) {
    this.kind = kind
    this.param = param || null // todo: sync with var from type for empty list and empty ref
}

Pacioli.Type.prototype.toString = function () {
    return "Type(" + this.kind + ", " + this.param  + ")"
}

Pacioli.tagKind = function (value, kind) {
    value.kind = kind
    return value
}

Pacioli.createMatrixType = function (multiplier, rowSets, rowUnit, columnSets, columnUnit) {
    return new Pacioli.Type('matrix', new Pacioli.Shape(multiplier, rowSets, rowUnit, columnSets, columnUnit))
}

Pacioli.match = function (x, y) {
    return Pacioli.solve(Pacioli.collect(x, y))
}

Pacioli.solve = function (eqs) {
    var map = {}
    for (var i=0; i < eqs.length; i++) {
        var lhs = Pacioli.subs(eqs[i][0], map)
        var rhs = Pacioli.subs(eqs[i][1], map)
        if (Pacioli.isVar(lhs)) {
            map = Pacioli.compose(Pacioli.bind(lhs, rhs), map)
        } else if (lhs instanceof Pacioli.PowerProduct) {
            map = Pacioli.compose(Pacioli.matchUnits(lhs, rhs), map)
        }
    }
    return map
}

Pacioli.isVar = function (x) {
    return typeof x === 'string' && x[0] === '_'
}

Pacioli.bind = function (key, value) {
    var binding = {}
    binding[key] = value
    return binding
}

Pacioli.compose = function (x, y) {
    var map = {}
    for (key in x) {
        map[key] = x[key]
    }
    for (key in y) {
        map[key] = Pacioli.subs(y[key], x)
    }
    return map
}

Pacioli.matchUnits = function (x, y) {
    return x.equals(y) ? {} : Pacioli.unitMatch(x.div(y))
}

Pacioli.unitMatch = function (unit) {

    var varBases = []
    var fixedBases = []
    for (x in unit.powers) {
        if (Pacioli.isVar(x)) {
            varBases.push(x)
        } else {
            fixedBases.push(x)
        }
    }

    if (varBases.length === 0) {
        if (fixedBases.length !== 0) throw "Contradiction in unit match: 1 = " + unit.toText()
        return {}
    }

    var firstVar = varBases[0]
    var power = unit.powers[firstVar]
    
    if (varBases.length === 1) {

        var rest = new Pacioli.PowerProduct(1)
        for (var i=0; i < fixedBases.length; i++) {
            var fixedPower = unit.powers[fixedBases[i]]
            if (fixedPower % power !== 0) throw "unit error in unit " + unit.toText()
            rest = rest.mult(new Pacioli.PowerProduct(fixedBases[i]).expt(-fixedPower / power))
        }

        return Pacioli.bind(firstVar, rest)
    }

    var minVar = firstVar
    for (var i = 1; i < varBases.length; i++) {
        if (Math.abs(unit.powers[varBases[i]]) < Math.abs(unit.powers[minVar])) {
            minVar = varBases[i]
        }
    }

    var rest = new Pacioli.PowerProduct(1)
    var minPower = unit.powers[minVar]
    for (x in unit.powers) {
        if (x != minVar) {
            rest = rest.multiply(new Pacioli.PowerProduct(x).expt(-Math.floor(unit.powers[x] / minPower)))
        }
    }

    var binding = Pacioli.bind(minVar, new Pacioli.PowerProduct(minVar).mult(rest))
    return Pacioli.compose(Pacioli.unitMatch(Pacioli.subs(unit, binding)), binding)
}

Pacioli.collect = function (x, y) {
    if (Pacioli.isVar(x)) {
        return [[x, y]]
    } else if (Pacioli.isVar(y)) {
        return [[y, x]]
    } else if (x instanceof Pacioli.Type) {
        switch (x.kind) {
        case 'tuple':
            var eqs = []
            for (var i=0; i < x.param.length; i++) {
                eqs = eqs.concat(Pacioli.collect(x.param[i], y.param[i]))
            }
            return eqs
        case 'list':
            return Pacioli.collect(x.param, y.param)
        case 'matrix':
            var eqs = []
            eqs.push([x.param.multiplier, y.param.multiplier])
            eqs.push([x.param.rowSets, y.param.rowSets])
            if (Pacioli.isVar(x.param.rowSets) || 0 < x.param.rowSets.length) eqs.push([x.param.rowUnit, y.param.rowUnit])
            eqs.push([x.param.columnSets, y.param.columnSets])
            if (Pacioli.isVar(x.param.columnSets) || 0 < x.param.columnSets.length) eqs.push([x.param.columnUnit, y.param.columnUnit])
            return eqs
        default:
            throw "cannot match: kind " + x.kind + " unknown"
        }
    }
    throw "cannot match: kind " + x.kind + " unknown"
}

Pacioli.subs = function (object, bindings) {
    if (Pacioli.isVar(object)) {
        return bindings.hasOwnProperty(object) ? bindings[object] : object
    } else if (object instanceof Pacioli.PowerProduct) {
        return object.map(function (base) { return Pacioli.isVar(base) ? Pacioli.subs(base, bindings) : base })
    } else if (object instanceof Pacioli.Type) {
        switch (object.kind) {
        case 'tuple':
            return new Pacioli.Type('tuple', object.param.map(function (x) {return Pacioli.subs(x, bindings) }))
        case 'list':
            return new Pacioli.Type('list', Pacioli.subs(object.param, bindings))
        case 'matrix':
            var shape = new Pacioli.Shape(
                              Pacioli.subs(object.param.multiplier, bindings),
                              Pacioli.subs(object.param.rowSets, bindings),
                              Pacioli.subs(object.param.rowUnit, bindings),
                              Pacioli.subs(object.param.columnSets, bindings),
                              Pacioli.subs(object.param.columnUnit, bindings))
            return new Pacioli.Type('matrix', shape)
        default:
            throw "cannot subs: kind " + x.kind + " unknown"
        }
    } else {
        return object
    }
}

Pacioli.Type.prototype.dom = function () {
    return this.param[0]
}

Pacioli.Type.prototype.ran = function () {
    return this.param[1]
}
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
// 0. Interface
//
// See box.js for other interface functions
// -----------------------------------------------------------------------------

Pacioli.value = function (module, name) {
    return new Pacioli.Box(Pacioli.lookupItem("u_global_" + module + "_" + name),
                           Pacioli.lookupItem("global_" + module + "_" + name))
}

Pacioli.fun = function (module, name) {
    return new Pacioli.Box(Pacioli.lookupItem("u_global_" + module + "_" + name),
                           Pacioli.lookupItem("global_" + module + "_" + name))
}

Pacioli.unit = function (name1, name2) {
    return new Pacioli.PowerProduct(name2 === undefined ? name1 : name1 + '$' + name2)
}

Pacioli.num = function (num, unit) {
    var shape = new Pacioli.Shape ()
    if (unit !== undefined) {
        shape.multiplier = unit
    }
    return new Pacioli.Box(new Pacioli.Type("matrix", shape),
                           Pacioli.tagNumbers([[typeof num === "string" ? parseFloat(num) : num]], 1, 1, 1))
}

Pacioli.tuple = function (array) {
    var uTuple = array.map(function (elt) {return elt.type})
    var vTuple = array.map(function (elt) {return elt.value})
    vTuple.kind = 'tuple'
    return new Pacioli.Box(new Pacioli.Type('tuple', uTuple), vTuple)
}

Pacioli.list = function (array) {
    var uList = array.length === 0 ? null : array[0].type
    var vList = array.map(function (elt) {return elt.value})
    vList.kind = 'list'
    return new Pacioli.Box(new Pacioli.Type('list', uList), vList)
}

Pacioli.print = function (x) {
    document.body.appendChild(Pacioli.DOM(x))      
    return x;
}

// -----------------------------------------------------------------------------
// 0. Functions used by generated code 
// -----------------------------------------------------------------------------

Pacioli.makeIndexSet = function (name, items) {
    var indexSet = {
        name:name,
        items: items,
        index: {}
    }
    for (var i = 0; i < items.length; i++) {
        indexSet.index[items[i]] = i
    }
    return indexSet
}

Pacioli.createCoordinates = function (pairs) {
    var names = []
    var indexSets = []
    for (var i = 0 ; i < pairs.length; i++) {
        names[i] = pairs[i][0]
        indexSets[i] = Pacioli.lookupItem(pairs[i][1])
    }
    var coords = new Pacioli.Coordinates(names, indexSets);
    return {kind: "coordinates", position: coords.position(), size: coords.size()}
}

Pacioli.createCoordinatesType = function (pairs) {
alert('obsolete')
    var names = []
    var indexSets = []
    for (var i = 0 ; i < pairs.length; i++) {
        names[i] = pairs[i][0]
        indexSets[i] = Pacioli.lookupItem(pairs[i][1])
    }
    return new Pacioli.Coordinates(names, indexSets);
}

Pacioli.bangShape = function (indexHome, index, unitHome, unit) {
    var result = new Pacioli.Shape();
    result.rowSets = [Pacioli.fetchIndex(indexHome, index)]
    result.rowUnit = Pacioli.unit(unit === '' ? 1 : unitHome + '_' + index + '_' + unit + '$' + 0)
    return result;
}

Pacioli.scalarShape = function (unit) {
    var result = new Pacioli.Shape();
    result.multiplier = unit;
    return result;
}

Pacioli.zeroNumbers = function (m, n) {
    return Pacioli.tagNumbers([], m, n, 1)
}

Pacioli.oneNumbers = function (m, n) {
    var numbers = Pacioli.tagNumbers([], m, n, 1)
    for (var i = 0; i < m; i++) {
        for (var j = 0; j < n; j++) {
            Pacioli.set(numbers, i, j, 1)
        }
    }
    return numbers;
}

Pacioli.initialNumbers = function (m, n, data) {
    var numbers = Pacioli.tagNumbers([], m, n, 1)
    for (var i = 0; i < data.length; i++) {
        Pacioli.set(numbers, data[i][0], data[i][1], data[i][2])
    }
    return numbers;
}

Pacioli.conversionNumbers = function (shape) {
    var numbers = Pacioli.zeroNumbers(shape.nrRows(), shape.nrColumns())
    for (var i = 0; i < shape.nrRows(); i++) {
        var flat = shape.unitAt(i, i).reciprocal().flat()
        if (flat.isDimensionless()) {
            Pacioli.set(numbers, i, i, flat.factor)
        } else {
            /* throw new Error("Cannot convert unit '" +
                            shape.findColumnUnit(i).toText() +
                            "' to unit '" +
                            shape.findRowUnit(i).toText() +
                            "' for entry '" +
                            shape.rowCoordinates(i).toText() +
                            "' during the construction of a matrix of type '" +
                            shape.toText() +
                            "'.") */
            Pacioli.set(numbers, i, i, "unit conversion error")
        }
        
    }
    return numbers
}

Pacioli.conversionMatrixType = function (shape) {
    return new Pacioli.Type("matrix", shape);
}

Pacioli.printValue = function (x) {
    document.body.appendChild(Pacioli.ValueDOM(x))
    return x;
}

// -----------------------------------------------------------------------------
// 1. The Store
//
// todo: store in a proper place in the Pacioli namespace
// -----------------------------------------------------------------------------

Pacioli.fetchIndex = function (home, name) {
    return Pacioli.lookupItem("index_" + home + "_" + name);
}

Pacioli.fetchUnit = function (name) {
    return Pacioli.lookupItem("unit_" + name);
}

Pacioli.fetchUnitVec = function (indexHome, index, unitHome, unit) {
    return Pacioli.lookupItem("unitvec_" + unitHome + "_" + index + "_" + unit);
}

Pacioli.fetchValue = function (home, name) {
    return Pacioli.lookupItem("global_" + home + "_" + name);
}

Pacioli.fetchType = function (home, name) {
    return Pacioli.lookupType("global_" + home + "_" + name);
}

Pacioli.lookupItem = function (full) {
    if (window[full] == undefined) {
        if (window["compute_" + full] == undefined) {
            throw new Error("no function found to compute Pacioli item '" + full + "'");
        }
        window[full] = window["compute_" + full]();
    }
    return window[full];
}


Pacioli.lookupType = function (full) {
    if (window["u_" + full] == undefined) {
        if (window["compute_" + "u_" + full] == undefined) {
            throw new Error("no function found to compute Pacioli type '" + "u_" + full + "'");
        }
        window["u_"+ full] = window["compute_" + "u_" + full]();
    }
    return window["u_" + full];
}
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
// 1. Primitive Units Unit Prefixes
// -----------------------------------------------------------------------------

Pacioli.RADIAN = Pacioli.unit('radian')      // From primitive module 'Matrix'
Pacioli.PERCENT = Pacioli.unit('percent')    // From primitive module 'Standard'

Pacioli.prefix = {
    yotta: {symbol: 'Y',    factor: Math.pow(10, 24)},
    zetta: {symbol: 'Z',    factor: Math.pow(10, 21)},
    exa:   {symbol: 'E',    factor: Math.pow(10, 18)},
    peta:  {symbol: 'P',    factor: Math.pow(10, 15)},
    tera:  {symbol: 'T',    factor: Math.pow(10, 12)},
    giga:  {symbol: 'G',    factor: Math.pow(10, 9)},
    mega:  {symbol: 'M',    factor: Math.pow(10, 6)},
    kilo:  {symbol: 'k',    factor: Math.pow(10, 3)},
    hecto: {symbol: 'h',    factor: Math.pow(10, 2)},
    deca:  {symbol: 'da',   factor: Math.pow(10, 1)},
    deci:  {symbol: 'd',    factor: Math.pow(10, -1)},
    centi: {symbol: 'c',    factor: Math.pow(10, -2)},
    milli: {symbol: 'm',    factor: Math.pow(10, -3)},
    micro: {symbol: '\xB5', factor: Math.pow(10, -6)},
    nano:  {symbol: 'n',    factor: Math.pow(10, -9)},
    pico:  {symbol: 'p',    factor: Math.pow(10, -12)},
    femto: {symbol: 'f',    factor: Math.pow(10, -15)},
    atto:  {symbol: 'a',    factor: Math.pow(10, -18)},
    zepto: {symbol: 'z',    factor: Math.pow(10, -21)},
    yocto: {symbol: 'y',    factor: Math.pow(10, -24)}
}

// -----------------------------------------------------------------------------
// 2. Pacioli Primitives
//
// Each primitive function is named 'global_<module>_<name>'.
// -----------------------------------------------------------------------------

function global_Primitives_tuple() {
    var tuple = Array.prototype.slice.call(arguments);
    tuple.kind = 'tuple'
    return tuple
}

function global_Primitives_apply(fun,arg) {
    return fun.apply(this, arg);
}

function global_Primitives_new_ref(value) {
    return [value];
}

function global_Primitives_empty_ref() {
    return new Array(1);
}

function global_Primitives_ref_set(ref, value) {
    ref[0] = value;
    return ref;
}

function global_Primitives_ref_get(ref) {
    return ref[0];
}

function global_Primitives_not(boole) {
  return !boole;
}

function global_Primitives_skip() {
    return null
}

function global_Primitives_while_function(test, body) {
    while (test()) {
        body();
    }
    return null;
}

function global_Primitives_catch_result(code, ref) {
    try {
        code();
    } catch(err) {
        return ref[0];
    }
}

function global_Primitives_throw_result(ref, value) {
    ref[0] = value;
    throw "jump";
}

function global_Primitives_seq(x, y) {
    return y;
}

function global_Primitives_not_equal(x,y) {
    return !global_Primitives_equal(x, y);
}

function global_Primitives_equal(x,y) {

    if (x.kind !== y.kind) return false

    if (x === y) {
        return true
    } else if (x.kind === "coordinates") { //(x instanceof Pacioli.Coordinates && y instanceof Pacioli.Coordinates) {
     alert('duh')
        return x.equals(y)
    } else if (x.kind === "matrix") { //(x instanceof Pacioli.Matrix && y instanceof Pacioli.Matrix) {
        return Pacioli.findNonZero(x, y, function (a, b) {return a !== b}) === null
        //return x.equals(y)
    } else if (x instanceof Array && y instanceof Array) { 
        var n = x.length
        if (y.length !== n) {
            return false
        }
        for (var i = 0; i < n; i++) {
            if (!global_Primitives_equal(x[i], y[i])) {
                return false
            }
        }
        return true
    } else {
        return false
    }
}

function global_Primitives_print(x) {
    return Pacioli.printValue(x)
}

function compute_global_Matrix__() {
    return Pacioli.createCoordinates([], []);
}

function global_Matrix_unit_factor(x) { 
    return Pacioli.oneNumbers(1, 1)
}

function global_Matrix_magnitude(x) {
    return x
}

function global_Matrix_row(x, coord) {

    var row = coord.position
    var rowUnit = Pacioli.scalarShape(x.shape.findRowUnit(row))
    var matrix = new Pacioli.Matrix(x.shape.column().scale(x.shape.factor()).scale(rowUnit))

    if (x.storage === 0) {
        for (var j = 0; j < x.nrColumns(); j++) {
            matrix.set(0, j, x.getNumber(row, j))
        }
    } else {
        var numbers = x.getCOONumbers()
        var rows = []
        var columns = []
        var values = []
        for (var i = 0; i < numbers[0].length; i++) {
            if (numbers[0][i] === row) {
                rows.push(i)
                columns.push(numbers[1][i])
                values.push(numbers[2][i])
            }
        }
        matrix.numbers = [rows, columns, values]
        matrix.storage = 2
    }
    return matrix;
}

function global_Matrix_row_units(x) {
    return Pacioli.oneNumbers(x.nrRows, 1)
}

function global_Matrix_row_domain(matrix) {
    var n = matrix.nrRows;
    var domain = new Array(n);
    for (var i = 0; i < n; i++) {
        domain[i] = {kind: "coordinates", position: i, size: n}
    }
    return Pacioli.tagKind(domain, "list");
}

function global_Matrix_column(x, coord) {
    var columnUnit = Pacioli.scalarShape(x.shape.findColumnUnit(coord.position))
    var matrix = new Pacioli.Matrix(x.shape.row().scale(x.shape.factor()))
    var j = coord.position
    for (var i = 0; i < x.nrRows(); i++) {
        matrix.set(i, 0, x.getNumber(i, j))
    }
    return matrix;
}

function global_Matrix_column_domain(matrix) {
    var n = matrix.nrColumns;
    var domain = new Array(n);
    for (var i = 0; i < n; i++) {
        domain[i] = {kind: "coordinates", position: i, size: n}
    }
    return domain;
}

function global_Matrix_column_units(x) {
    return Pacioli.oneNumbers(x.nrColumns, 1)
}

function global_Matrix_get_num(matrix, i, j) {
    return Pacioli.get(matrix, i.position, j.position)
}

function global_Matrix_get(matrix, i, j) {
    return Pacioli.get(matrix, i.position, j.position)
}

function global_Matrix_make_matrix(tuples) {
    var first = tuples[0]
    var numbers = Pacioli.zeroNumbers(first[0].size, first[1].size)
    for (var i = 0; i < tuples.length; i++) {
        var tup = tuples[i];
        Pacioli.set(numbers, tup[0].position, tup[1].position, Pacioli.getNumber(tup[2], 0, 0))
    }
    return numbers;
}

function global_Matrix_support(x) {
    return Pacioli.unaryNumbers(x, function (val) { return 1})
}

function global_Matrix_top(cnt, x) {
    var n = Pacioli.getNumber(cnt, 0, 0) 

    if (n === 0) {
        return Pacioli.zeroNumbers(x.nrRows, x.nrColumns)
    }

    var matrix = Pacioli.zeroNumbers(x.nrRows, x.nrColumns)

    var top = []
    var count = 0

    var numbers = Pacioli.getCOONumbers(x)
    var rows = numbers[0]
    var columns = numbers[1]
    var values = numbers[2]
    for (var l = 0; l < rows.length; l++) {
        var i = rows[l]
        var j = columns[l]
            var val = values[l] //Pacioli.getNumber(x, i, j)
            if (count < n) {
                top[count] = [i, j, val]
                count += 1
            } else {
                var worst = 0
                for (var k = 1; k < count; k++) {
                    if (top[k][2] < top[worst][2]) {
                        worst = k
                    }
                }
                if (val > top[worst][2]) {
                    top[worst] = [i, j, val]
                }
            }
    }
    for (var k = 0; k < count; k++) {
        Pacioli.set(matrix, top[k][0], top[k][1], top[k][2]);
    }

    return matrix;
}

function global_Matrix_bottom(cnt, x) {
    var n = Pacioli.getNumber(cnt, 0, 0) 

    if (n === 0) {
        return Pacioli.zeroNumbers(x.nrRows, x.nrColumns)
    }

    var matrix = Pacioli.zeroNumbers(x.nrRows, x.nrColumns)

    var bottom = []
    var count = 0

    var numbers = Pacioli.getCOONumbers(x)
    var rows = numbers[0]
    var columns = numbers[1]
    var values = numbers[2]
    for (var l = 0; l < rows.length; l++) {
    var i = rows[l]
        var j = columns[l]
            var val = values[l]
            if (count < n) {
                bottom[count] = [i, j, val]
                count += 1
            } else {
                var best = 0
                for (var k = 1; k < count; k++) {
                    if (bottom[k][2] > bottom[best][2]) {
                        best = k
                    }
                }
                if (val < bottom[best][2]) {
                    bottom[best] = [i, j, val]
                }
            }
    }
    for (var k = 0; k < count; k++) {
        Pacioli.set(matrix, bottom[k][0], bottom[k][1], bottom[k][2]);
    }

    return matrix;
}

function global_Matrix_left_identity(x) {
    var numbers = Pacioli.zeroNumbers(x.nrRows, x.nrRows)
    for (var i = 0; i < x.nrRows; i++) {
        Pacioli.set(numbers, i, i, 1);
    }
    return numbers
}

function global_Matrix_right_identity(x) {
    var numbers = Pacioli.zeroNumbers(x.nrColumns, x.nrColumns)
    for (var i = 0; i < x.nrColumns; i++) {
        Pacioli.set(numbers, i, i, 1);
    }
    return numbers
}

function global_Matrix_reciprocal(x) {
    return Pacioli.unaryNumbers(x, function (val) { return val == 0 ? 0 : 1 / val})
}

function global_Matrix_transpose(x) {
    var result = Pacioli.zeroNumbers(x.nrColumns, x.nrRows)
    var numbers = Pacioli.getCOONumbers(x)
    var rows = numbers[0]
    var columns = numbers[1]
    var values = numbers[2]
    for (var i = 0; i < rows.length; i++) {
        Pacioli.set(result, columns[i], rows[i], values[i])
    }
    return result
}

function global_Matrix_dim_inv(x) {
    return global_Matrix_transpose(global_Matrix_reciprocal(x));
}

function global_Matrix_dim_div(x, y) {
    return global_Matrix_dot(x, global_Matrix_dim_inv(y));
}

function global_Matrix_dot(x, y) {
    return Pacioli.tagNumbers(numeric.ccsDot(Pacioli.getCCSNumbers(x), Pacioli.getCCSNumbers(y)), x.nrRows, y.nrColumns, 3);
}

function global_Matrix_multiply(x,y) {
    if (x.storage === 13) {
        return Pacioli.tagNumbers(numeric.ccsmul(Pacioli.getCCSNumbers(x), Pacioli.getCCSNumbers(y)), x.nrRows, y.nrColumns, 3);
    } else {
        return Pacioli.elementWiseNumbers(x, y, function(a, b) { return a*b});
    }
}

function global_Matrix_kronecker(x,y) {
    alert("is this used?")
    var xm = x.length
    var ym = y.length
    var xn = x[0].length
    var yn = y[0].length;
    var m = xm * ym; 
    var n = xn * yn;
    var matrix = new Array(m);
    for (var xi = 0; xi < xm; xi++) {
        for (var yi = 0; yi < ym; yi++) {
            var row = new Array(n);
            for (var xj = 0; xj < xn; xj++) {
                for (var yj = 0; yj < yn; yj++) {     
                    row[xj*yn + yj] = x[xi][xj] * y[yi][yj];
                }
            }
            matrix[xi*ym + yi] = row;
        }
    }
    return matrix;
}

function global_Matrix_divide(x,y) {
    return Pacioli.elementWiseNumbers(x, y, function(a, b) { return b !== 0 ? a/b : 0})
}

function global_Matrix_sum(x,y) {
    if (x.storage === 13) {
        return Pacioli.tagNumbers(numeric.ccsadd(Pacioli.getCCSNumbers(x), Pacioli.getCCSNumbers(y)), x.nrRows, y.nrColumns, 3);
    } else {
        return Pacioli.elementWiseNumbers(x, y, function(a, b) { return a+b});
    }
    //return Pacioli.elementWiseNumbers(x, y, function(a, b) { return a+b})
}

function global_Matrix_minus(x,y) {
    //return Pacioli.elementWiseNumbers(x, y, function(a, b) { return a-b})
    if (x.storage === 13) {
        return Pacioli.tagNumbers(numeric.ccssub(Pacioli.getCCSNumbers(x), Pacioli.getCCSNumbers(y)), x.nrRows, y.nrColumns, 3);
    } else {
        return Pacioli.elementWiseNumbers(x, y, function(a, b) { return a-b});
    }
}

function global_Matrix_negative(x) { 
    return Pacioli.unaryNumbers(x, function (val) { return -val})
}

function global_Matrix_scale(x,y) { 
    var factor = Pacioli.getNumber(x, 0, 0)
    return Pacioli.unaryNumbers(y, function (val) { return factor * val})
}

function global_Matrix_scale_down(x,y) {
    return global_Matrix_scale(global_Matrix_reciprocal(y), x);
}

function global_Matrix_total(x) { 
    var values = Pacioli.getCOONumbers(x)[2]
    var total = 0
    for (var i = 0; i < values.length; i++) {
        total += values[i]
    }
    var result = Pacioli.zeroNumbers(1, 1)
    Pacioli.set(result, 0, 0, total)
    return result
}

function global_Matrix_mod(x, y) {
    return Pacioli.tagNumbers(numeric.mod(Pacioli.getFullNumbers(x), Pacioli.getFullNumbers(y)), x.nrRows, x.nrColumns, 0);
}

function global_Matrix_max(x, y) {
    return Pacioli.tagNumbers(numeric.max(Pacioli.getFullNumbers(x), Pacioli.getFullNumbers(y)), x.nrRows, y.nrRows, 0)
}

function global_Matrix_min(x, y) {
    return Pacioli.tagNumbers(numeric.min(Pacioli.getFullNumbers(x), Pacioli.getFullNumbers(y)), x.nrRows, y.nrRows, 0)
}

function global_Matrix_sin(x) {
    return Pacioli.tagNumbers(numeric.sin(Pacioli.getFullNumbers(x)), x.nrRows, x.nrColumns, 0);
}

function global_Matrix_cos(x) {
    return Pacioli.tagNumbers(numeric.cos(Pacioli.getFullNumbers(x)), x.nrRows, x.nrColumns, 0);
}

function global_Matrix_tan(x) {
    return Pacioli.tagNumbers(numeric.tan(Pacioli.getFullNumbers(x)), x.nrRows, x.nrColumns, 0);
}

function global_Matrix_asin(x) {
    return Pacioli.tagNumbers(numeric.asin(Pacioli.getFullNumbers(x)), x.nrRows, x.nrColumns, 0);
}

function global_Matrix_acos(x) {
    return Pacioli.tagNumbers(numeric.acos(Pacioli.getFullNumbers(x)), x.nrRows, x.nrColumns, 0);
}

function global_Matrix_atan(x) {
    return Pacioli.tagNumbers(numeric.atan(Pacioli.getFullNumbers(x)), x.nrRows, x.nrColumns, 0);
}

function global_Matrix_atan2(x, y) {
    return Pacioli.tagNumbers(numeric.atan2(Pacioli.getFullNumbers(x), Pacioli.getFullNumbers(y)), x.nrRows, x.nrColumns, 0);
}

function global_Matrix_abs(x) { 
    return Pacioli.unaryNumbers(x, function (val) { return Math.abs(val)})
}

function global_Matrix_power(x,y) {
    var n = Pacioli.getNumber(y, 0, 0)
    if (n === 0) {
        return global_Matrix_left_identity(x)
    } else if (n === 1) {
        return x
    } else if (n < 0) {
        return global_Matrix_power(global_Standard_inverse(x), global_Matrix_negative(y))
    } else { 
        var result = x
        for (var i = 1; i < n; i++) {
            result = global_Matrix_dot(result, x)
        }
        return result
    }
}

function global_Matrix_expt(x,y) {
    var n = Pacioli.getNumber(y, 0, 0)
    return Pacioli.tagNumbers(numeric.pow(Pacioli.getFullNumbers(x), n), x.nrRows, x.nrColumns, 0);
}

function global_Matrix_log(x, y) {
    return global_Matrix_divide(Pacioli.tagNumbers(numeric.log(Pacioli.getFullNumbers(x)), x.nrRows, x.nrColumns, 0),
                                Pacioli.tagNumbers(numeric.log(Pacioli.getFullNumbers(y)), x.nrRows, x.nrColumns, 0));
}

function global_Matrix_exp(x) {
    return Pacioli.tagNumbers(numeric.exp(Pacioli.getFullNumbers(x)), x.nrRows, x.nrColumns, 0);
}

function global_Matrix_ln(x) {
    return Pacioli.tagNumbers(numeric.log(Pacioli.getFullNumbers(x)), x.nrRows, x.nrColumns, 0);
}

function global_Matrix_less(x,y) { 
    return Pacioli.findNonZero(x, y, function (a, b) {return a >= b}) === null
}

function global_Matrix_sqrt(x) { 
    return Pacioli.unaryNumbers(x, function (val) { return Math.sqrt(val)})
}

function global_Matrix_solve(x, ignored) {
    return Pacioli.tagNumbers(numeric.inv(Pacioli.getFullNumbers(x)), x.nrColumns, x.nrRows, 0);
}

function global_Matrix_random() { 
    return Pacioli.tagNumbers([[Math.random()]], 1, 1, 0);
}

function global_List_zip(x,y) {
    var list = new Array(Math.min(x.length, y.length));
    for (var i = 0; i < list.length; i++) {
        list[i] = [x[i], y[i]];
    }
    return Pacioli.tagKind(list, "list");
}

function global_List_add_mut(list,item) {
    list.push(item);
    return list;
}

function global_List_append(x,y) {
    return Pacioli.tagKind(x.concat(y), "list")
}

function global_List_reverse(x) {
    return Pacioli.tagKind(x.slice(0).reverse(), "list");
}

function global_List_tail(x) {
    var array = new Array(x.length-1);
    for (var i = 0; i < array.length; i++) {
        array[i] = x[i+1];
    }
    return Pacioli.tagKind(array, "list");
}

function global_List_singleton_list(x) {
    return Pacioli.tagKind([x], "list");
}

function global_List_nth(x,y) {
    return y[Pacioli.getNumber(x, 0, 0)];
}

function global_List_naturals(num) {
    var n = Pacioli.getNumber(num, 0, 0)
    var list = new Array(n);
    for (var i = 0; i < n; i++) {
        list[i] = Pacioli.initialNumbers(1, 1, [[0, 0, i]]);
    }
    return Pacioli.tagKind(list, "list");
}

function global_List_loop_list(init, fun, list) {
    var accu = init;
    for (var i = 0; i < list.length; i++) {
        accu = global_Primitives_apply(fun, [accu, list[i]]);
    }
    return accu;
}

function global_List_list_size(x) {
    return Pacioli.initialNumbers(1, 1, [[0, 0, x.length]]);
}

function global_List_head(x) {
    return x[0];
}

function global_List_fold_list(fun, list) {
    var accu = list[0];
    for (var i = 1; i < list.length; i++) {
        accu = global_Primitives_apply(fun, [accu, list[i]]);
    }
    return accu;
}

function global_List_cons(item,list) {
    return global_List_append(global_List_singleton_list(item), list);
}

function global_List_empty_list() {
   return Pacioli.tagKind([], "list");
}

/* Charts for the Pacioli language
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
// Line Chart
// -----------------------------------------------------------------------------

Pacioli.LineChart = function (parent, data, options) {

    this.parent = parent
    this.data = data

    var defaultOptions = {
        width: 640,
        height: 360,
        margin: {left: 10, top: 10, right: 10, bottom: 10},
        unit: null,
        label: ""
    }

    this.options = Pacioli.copyOptions(options, defaultOptions)
}

Pacioli.LineChart.prototype.draw = function () {

    try {

        var shape = this.data.type.param.param
        var matlist = this.data.value
        var parent = this.parent

        // Make the parent node empty
        while (parent.firstChild) {
            parent.removeChild(parent.firstChild)
        }

        // Determine the unit of measurement
        var unit = this.options.unit || shape.multiplier
        var factor = shape.multiplier.conversionFactor(unit)
    
        // Convert the Pacioli values to an array of numbers
        var data = matlist.map(function (x) {
            return Pacioli.getNumber(x, 0, 0) * factor
        })
    
        // Add the label if defined
        if (this.options.label !== undefined) {
            var label = this.options.label
            parent.appendChild(typeof label == "string" ? document.createTextNode(label) : label)
        }
    
        // Source: http://bl.ocks.org/2579619
    
        // Define dimensions of graph
        var m = [4, 20, 14, 20]; // margins
        var w = 300 - m[1] - m[3]; // width
        var h = 50 - m[0] - m[2]; // height
    
        // Add an SVG element with the desired dimensions and margin.
        var graph = d3.select(this.parent).append("svg:svg")
                      //.attr("id", id + "_chart")
                      .attr("class", "chart")
                      .append("svg:g")
                      .attr("transform", "translate(" + m[3] + "," + m[0] + ")");
    
        // Determine data ranges
        var xRange = d3.scale.linear().domain([0, data.length]).range([0, w]);
        var yRange = d3.scale.linear().domain([0, d3.max(data)]).range([h, 0]);
    
        // Create a line function that converts the data into x and y points
        var line = d3.svg.line()
                     .x(function(d,i) { return xRange(i); })
                     .y(function(d) { return yRange(d); })
    
        // Create the x axis
        var xAxis = d3.svg.axis().scale(xRange).tickSize(-h).tickSubdivide(true).ticks(5);
        graph.append("svg:g")
             .attr("class", "x axis")
             .attr("transform", "translate(0," + h + ")")
             .call(xAxis);
    
        // create left yAxis
    //    var yAxisLeft = d3.svg.axis().scale(yRange).ticks(2).orient("left");
    //    graph.append("svg:g")
    //         .attr("class", "y axis axisLeft")
    //         .attr("transform", "translate(-15,0)")
    //         .call(yAxisLeft);
    
        // Add lines AFTER the axes above so that the line is above the tick-lines
        graph.append("svg:path").attr("d", line(data)).attr("class", "data");
    
    } catch (err) {
        Pacioli.displayChartError(this.parent, "While drawing bar chart '" + this.options.label + "':", err)
    }

    return this

};


// -----------------------------------------------------------------------------
// Pie Chart
// -----------------------------------------------------------------------------

Pacioli.PieChart = function (parent, data, options) {

    this.parent = parent
    this.data = data 

    var defaultOptions = {
        width: 640,
        height: 360,
        margin: {left: 10, top: 10, right: 10, bottom: 10},
        unit: null,
        label: "",
        labelOffset: 0.5
    }

    this.options = Pacioli.copyOptions(options, defaultOptions)
}

Pacioli.PieChart.prototype.draw = function () {

    try {

        var shape = this.data.type.param
        var numbers = this.data.value
        var parent = this.parent
        
        // Make the parent node empty
        while (parent.firstChild) {
            parent.removeChild(parent.firstChild)
        }
    
        // Convert the Pacioli vector to an array with the right info
        var data = []
        var unit = this.options.unit || shape.unitAt(0, 0)
        for (var i = 0; i < numbers.nrRows; i++) {
            var factor = shape.unitAt(i, 0).conversionFactor(unit)
            data.push({
                number: Pacioli.getNumber(numbers, i, 0) * factor,
                label: shape.rowCoordinates(i).shortText()
            })
        }
    
        
        var margin = this.options.margin
        var width = this.options.width - margin.left - margin.right
        var height = this.options.height - margin.top - margin.bottom
        var radius = Math.min(width, height) / 2
    
        var arc = d3.svg.arc()
                    .outerRadius(radius*0.7)
                    .innerRadius(0);
        var arc2 = d3.svg.arc()
                    .outerRadius(radius*1.2*this.options.labelOffset)
                    .innerRadius(0);
    
    
        var pie = d3.layout.pie()
                    .sort(null)
                    .value(function(d) { return d.number; });
    
        var svg = d3.select(this.parent).append("svg")
                    .attr("width", width + margin.left + margin.right)
                    .attr("height", height + margin.top + margin.bottom)
                    .append("g")
                    .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

         svg.append("text")
            .attr("transform", "translate(" + 0*width / 2 + "," + height / 2 + ")")
            .style("text-anchor", "middle")
            //.text(this.options.label + " (" + unit.symbolized().toText() + ")");
            .text(this.options.label);
  
    
        var g = svg.selectAll(".arc")
                   .data(pie(data))
                   .enter().append("g")
                   .attr("class", "arc");
        var color = d3.scale.category20();     //builtin range of colors
          
        g.append("path")
         .attr("d", arc)
         .style("fill", function(d, i) { return color(i) });
    
        g = svg.selectAll(".arctext")
                   .data(pie(data))
                   .enter().append("g")
                   .attr("class", "arctext");

        g.append("text")
         .attr("transform", function(d) {
             return "translate(" + arc2.centroid(d) + ")";
         })
         .attr("dy", ".35em")
         .style("text-anchor", "middle")
         .text(function(d) { return 0 < d.data.number ? d.data.label + ' = ' + d.data.number.toFixed(2) + ' ' + unit.symbolized().toText() : "" });    
    } catch (err) {
        Pacioli.displayChartError(this.parent, "While drawing bar chart '" + this.options.label + "':", err)
    }

    return this
};

// -----------------------------------------------------------------------------
// Bar Chart
// -----------------------------------------------------------------------------

Pacioli.BarChart = function (parent, data, options) {

    this.parent = parent
    this.data = data 

    var defaultOptions = {
        width: 640,
        height: 360,
        margin: {left: 10, top: 10, right: 10, bottom: 10},
        unit: null,
        label: ""
    }

    this.options = Pacioli.copyOptions(options, defaultOptions)
}

Pacioli.BarChart.prototype.draw = function () {

    try {

        var shape = this.data.type.param
        var numbers = this.data.value
        var parent = this.parent
        
        // Make the parent node empty
        while (parent.firstChild) {
            parent.removeChild(parent.firstChild)
        }
    
        // Convert the Pacioli vector to an array with the right info
        var data = []
        var unit = this.options.unit || shape.unitAt(0, 0)
        for (var i = 0; i < numbers.nrRows; i++) {
            var factor = shape.unitAt(i, 0).conversionFactor(unit)
            data.push({
                number: Pacioli.getNumber(numbers, i, 0) * factor,
                label: shape.rowCoordinates(i).shortText()
            })
        }

        // Copied from the interwebs
        var margin = {top: 20, right: 20, bottom: 150, left: 40}
        var width = this.options.width - margin.left - margin.right
        var height = this.options.height - margin.top - margin.bottom
        
        var x = d3.scale.ordinal()
                  .rangeRoundBands([0, width], .1);
        
        var y = d3.scale.linear()
                  .range([height, 0]);
        
        var xAxis = d3.svg.axis()
                      .scale(x)
                      .orient("bottom");

        // todo: show this text on x axis
        var xSet = shape.rowName() //vector.shape.rowSets.map(function (x) {return x.name})
        
        var yAxis = d3.svg.axis()
                       .scale(y)
                       .orient("left")
                       .ticks(10, "%");
        
        var svg = d3.select(this.parent).append("svg")
                    .attr("width", width + margin.left + margin.right)
                    .attr("height", height + margin.top + margin.bottom)
                    .append("g")
                    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
    
        x.domain(data.map(function(d) { return d.label; }));
        y.domain([0, d3.max(data, function(d) { return d.number; })]);
    
        svg.append("g")
           .attr("class", "x axis")
           .attr("transform", "translate(0," + height + ")")
           .call(xAxis)
           .selectAll("text")  
           .style("text-anchor", "end")
           .attr("dx", "-.8em")
           .attr("dy", ".15em")
           .attr("transform", function(d) { return "rotate(-65)" });

        svg.append("g")
           .attr("class", "y axis")
           .call(yAxis)
           .append("text")
           .attr("transform", "rotate(-90)")
           .attr("y", 6)
           .attr("dy", ".71em")
           .style("text-anchor", "end")
           .text(this.options.label + " (" + unit.symbolized().toText() + ")");
    
        svg.selectAll(".bar")
           .data(data)
           .enter().append("rect")
           .attr("class", "bar")
           .attr("x", function(d) { return x(d.label)+12; })    // the +12 -12 makes room for the y axis label
           .attr("width", x.rangeBand()-12)
           .attr("y", function(d) { return y(d.number); })
           .attr("height", function(d) { return height - y(d.number); });

    } catch (err) {
        Pacioli.displayChartError(this.parent, "While drawing bar chart '" + this.options.label + "':", err)
    }

    return this

};

// -----------------------------------------------------------------------------
// Histogram
// -----------------------------------------------------------------------------

Pacioli.Histogram = function (parent, data, options) {

    this.parent = parent
    this.data = data 

    var defaultOptions = {
        width: 640,
        height: 360,
        margin: {left: 40, top: 20, right: 20, bottom: 50},
        unit: null,
        label: "",
        bins: 10,
        lower: null,
        upper: null
    }

    this.options = Pacioli.copyOptions(options, defaultOptions)
}

Pacioli.Histogram.prototype.draw = function () {

    try {

        var unit = this.options.unit || Pacioli.dataUnit(this.data)
        var data = Pacioli.transformData(this.data, unit)

/*
        var shape = this.data.type.param
        var numbers = this.data.value
        var parent = this.parent

        // Convert the Pacioli vector to an array with the non-zero
        // numbers converted to the chart's unit
        var data = []
        var unit = this.options.unit || shape.unitAt(0, 0)

        for (var i = 0; i < numbers.nrRows; i++) {
            var num = Pacioli.getNumber(numbers, i, 0)
            if (num !== 0) {
                var factor = shape.unitAt(i, 0).conversionFactor(unit)
                data.push(num * factor)
            }
        }
*/
        // Create an array with the bin tresholds and generate a histogram layout from it for the data
        var lower = this.options.lower || data.min //d3.min(data)
        var upper = this.options.upper || data.max //d3.max(data)
        var binScale = d3.scale.linear().domain([0, this.options.bins]).range([lower, upper]);
        var binArray = d3.range(this.options.bins + 1).map(binScale);
        var layout = d3.layout.histogram().bins(binArray)(data.values);   

        // Determine the drawing dimensions
        var margin = this.options.margin
        var width = this.options.width - margin.left - margin.right
        var height = this.options.height - margin.top - margin.bottom

        // Create x and y scales mapping the histogram layout to the drawing dimensions
        var x = d3.scale.linear().domain([lower, upper]).range([0, width]);
        var y = d3.scale.linear()
                  .domain([0, d3.max(layout, function(d) { return d.y; })])
                  .range([height, 0]);
        
        // Create the axes
        var xAxis = d3.svg.axis().scale(x).orient("bottom");
        var yAxis = d3.svg.axis().scale(y).orient("left")
        
        // Make the parent node empty
        while (parent.firstChild) {
            parent.removeChild(parent.firstChild)
        }

        // Create an svg element under the parent        
        var svg = d3.select(this.parent).append("svg")
                    .attr("width", width + margin.left + margin.right)
                    .attr("height", height + margin.top + margin.bottom)
                    .append("g")
                    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
    
        // Add the x axis
        var label = this.options.label || vector.rowName() //vector.shape.rowSets.map(function (x) {return x.name})
        svg.append("g")
           .attr("class", "x axis")
           .attr("transform", "translate(0," + height + ")")
           .call(xAxis)
           .append("text")
           .attr("x", width)
           .attr("y", 26)
           .attr("dy", ".71em")
           .style("text-anchor", "end")
           .text(label + " (" + unit.symbolized().toText() + ")");

        // Add the y axis
        svg.append("g")
           .attr("class", "y axis")
           .call(yAxis)
           .append("text")
           .attr("x", 20)
           .attr("dy", "-.71em")
           .style("text-anchor", "end")
           .text("Frequency");

        // Add the histogram bars
        svg.selectAll(".bar")
           .data(layout)
           .enter().append("g")
           .attr("class", "bar")
           .attr("transform", function(d) { return "translate(" + x(d.x) + "," + y(d.y) + ")"; })
           .append("rect")
           .attr("x", 1)
           .attr("width", x(lower+layout[0].dx) - 1)
           .attr("height", function(d) { return height - y(d.y); })
           .on("click", function (d, i) {this.onClick(d.x, d.x + d.dx, data.max)}.bind(this));

    } catch (err) {
        Pacioli.displayChartError(this.parent, "While drawing histogram '" + this.options.label + "':", err)
    }

    return this

};

Pacioli.Histogram.prototype.onClick = function (lower, upper, max) {

    var result
    var unit = this.options.unit || Pacioli.dataUnit(this.data)

    if (this.data.type.kind === "matrix") {

        // Find the displayed vector and its units
        var vector = this.data.value
        var shape = this.data.type.param
    
        // Filter the chart's vector for the given bounds
        var filtered = Pacioli.zeroNumbers(vector.nrRows, vector.nrColumns)
        for (var i = 0; i < vector.nrRows; i++) {
            var num = Pacioli.getNumber(vector, i, 0) * shape.unitAt(i, 0).conversionFactor(unit)
            if (lower <= num && (num < upper || (num === max && upper === max))) {
                 Pacioli.set(filtered, i, 0, Pacioli.getNumber(vector, i, 0))
            }
        }

        // Create a copy of the original object
        result = new Pacioli.Box(this.data.type, filtered)

    } else if (this.data.type.kind === "list") {

        var factor = this.data.type.param.param.multiplier.conversionFactor(unit)
        var filtered = []
        for (var i = 0; i < this.data.value.length; i++) {
            var num = Pacioli.getNumber(this.data.value[i], 0, 0) * factor
            if (lower <= num && num < upper) {
                 filtered.push(this.data.value[i])
            }
        }
        filtered.kind = this.data.value.kind
        result = new Pacioli.Box(this.data.type, filtered)
        console.log(this.data)
        console.log(result)
    }

    // Show the filtered vector in a popup window    
    var div = document.createElement("div")
    var close = document.createElement("button")
    close.innerHTML = "close"
    close.onclick = function () {document.body.removeChild(div)}
    div.style.backgroundColor = "#EEE" 
    div.style.position = "fixed"
    div.style.left = "100px"
    div.style.top = 100 + "px"
    div.style.height = "300px" 
    div.style.width = "500px" 
    document.body.appendChild(div)
    div.appendChild(close)
    div.appendChild(Pacioli.DOM(result))
    div.style.overflow = "auto"
}

// -----------------------------------------------------------------------------
// Utilities
// -----------------------------------------------------------------------------

Pacioli.copyOptions = function (options, defaults) {
    var obj = {}
    for (var option in defaults) {
        if (defaults.hasOwnProperty(option)) {
            obj[option] = options && options.hasOwnProperty(option) ? options[option] : defaults[option]
        }
    }
    return obj
}

Pacioli.displayChartError = function (parent, message, err) {
    while (parent.firstChild) {
        parent.removeChild(parent.firstChild)
    }
    parent.appendChild(document.createTextNode(message))
    message = document.createElement("p")
    message.style.color = "red"
    parent.appendChild(message)
    message.appendChild(document.createTextNode(err))
}

Pacioli.dataUnit = function (data) {
   switch (data.type.kind) {
    case "list":
        var content = data.type.param
        if (content.kind === "matrix") {
            return content.param.unitAt(0, 0)
        } else {
            throw "exptected a list of numbers but got a list of " + content.kind
        }
    case "matrix":
        return data.type.param.unitAt(0, 0)
    default:
        throw "exptected a vector or a list of numbers but got a " + data.type.kind
    }
}

Pacioli.transformData = function (data, unit) {

    var values = []
    var labels = []
    var min
    var max

    switch (data.type.kind) {
    case "list":
        if (data.type.param.kind !== "matrix") throw "exptected a list of numbers but got a list of " + data.type.param.kind
        var factor = data.type.param.param.multiplier.conversionFactor(unit)
        for (var i = 0; i < data.value.length; i++) {
            var value = Pacioli.getNumber(data.value[i], 0, 0) * factor
            if (value !== 0) {
                values.push(value)
                labels.push(i)
                if (max === undefined || max < value) max = value
                if (min === undefined || value < min) min = value
            }
        }
        break;
    case "matrix":
        var numbers = data.value
        var shape = data.type.param
        for (var i = 0; i < numbers.nrRows; i++) {
            var factor = shape.unitAt(i, 0).conversionFactor(unit)
            var value = Pacioli.getNumber(numbers, i, 0) * factor
            if (value !== 0) {
                values.push(value)
                labels.push(shape.rowCoordinates(i).shortText())
                if (max === undefined || max < value) max = value
                if (min === undefined || value < min) min = value
            }
        }
        break;
    default:
        throw "exptected a vector or a list of numbers but got a " + data.type.kind
    }

    return {
        values: values,
        labels: labels,
        max: max,
        min: min
    }
}/* A THREE.js 3D space for Pacioli 
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

var scaleFudge = 1;
   
var Pacioli = Pacioli || {};

Pacioli.Space = function (parent, options) {

    this.parent = parent
    this.animating = false
    this.options = {}
    this.body = null
    this.axes = null

    this.copyOptions(options || {})

    this.mouseInfo = {
        moving: false,
        rotating: false,
        circling: false,
        lastX: null,
        lastY: null
    }

    this.cameraInfo = {
        rotationX: -0.25,
        rotationY: 0.1,
        offsetX: 0,
        offsetY: 0,
        zoom: 1,
        distance: 10
    }

    this.init()
}

Pacioli.Space.prototype.setOptions = function (options) {
    this.copyOptions(options)
    var hasAxes = (this.axes !== null)
    this.init()
    if (hasAxes) {
        this.showAxes()
    }
    this.draw()
}

Pacioli.Space.prototype.copyOptions = function (options) { 
    this.options = {
        webgl: options.webgl === true || (options.webgl !== false && this.options.webgl === true) || false,
        perspective: options.perspective === true || (options.perspective !== false && this.options.perspective === true) || false,
        axisSize: options.axisSize || this.options.axisSize || 10,
        width: options.width || this.options.width || 640,
        height: options.height || this.options.height || 360,
        unit: options.unit || this.options.unit || Pacioli.unit(1)
    }
}

Pacioli.Space.prototype.init = function () {

    // Make the parent node empty
    while (this.parent.firstChild) {
        this.parent.removeChild(this.parent.firstChild)
    }

    // Create the canvas element
    this.canvas = document.createElement("canvas")
    this.canvas.width = this.options.width
    this.canvas.height = this.options.height
    //this.canvas.style.border = "1px solid black"
    //this.canvas.style.outline = 1 
    this.canvas.tabIndex = 1
    this.canvas.className = "space"
    this.canvas.addEventListener('mousedown', this.onDocumentMouseDown.bind(this), false);
    this.canvas.addEventListener('mousemove', this.onDocumentMouseMove.bind(this), false);
    this.canvas.addEventListener('mouseup', this.onDocumentMouseUp.bind(this), false);
    this.canvas.addEventListener('mouseout', this.onDocumentMouseOut.bind(this), false);
    this.canvas.addEventListener('keydown', this.onDocumentKeyDown.bind(this), false);
    this.canvas.addEventListener('mousewheel', this.onMouseWheel.bind(this), false);
    this.canvas.addEventListener('DOMMouseScroll', this.onMouseWheel.bind(this), false);
    //this.canvas.addEventListener('touchstart', this.onTouchStart.bind(this), false);
    //this.canvas.addEventListener('touchmove', this.onTouchMove.bind(this), false);
    //this.canvas.addEventListener('touchend', this.onTouchEnd.bind(this), false);
    //this.canvas.addEventListener('touchcancel', this.onTouchCancel.bind(this), false);
    //this.canvas.addEventListener('touchleave', this.onTouchLeave.bind(this), false);
    this.parent.appendChild(this.canvas)

    var width = this.canvas.width
    var height = this.canvas.height

    // Create the camera
    if (this.options.perspective) {
	this.camera = new THREE.PerspectiveCamera(75, width/height, 0.1, 10000);
    } else {
	this.camera = new THREE.OrthographicCamera(-width/2, width/2, height/2, -height/2, -1000, 1000);
    }

    // Create the renderer
    if (this.options.webgl) {
	this.renderer = new THREE.WebGLRenderer({canvas: this.canvas, antialias: true});
    } else {
	this.renderer = new THREE.CanvasRenderer({canvas: this.canvas});
    }
    this.renderer.setSize(width, height);

    // Create the scene
    this.scene = new THREE.Scene();

    // Remove any axes. This forces creation on first use.
    this.axes = null

    // Replace the body. Not sure if this is necessary. See comment about axes above.
    var replacement = new THREE.Object3D()
    if (this.body !== null) {
        replacement.rotation = this.body.rotation;
    }
    this.body = replacement
    this.scene.add(this.body)
}

Pacioli.Space.prototype.draw = function () {
    requestAnimationFrame(this.animate.bind(this));
}

Pacioli.Space.prototype.drawfast = function () {
    var self = this
    requestAnimationFrame(self.animatefast.bind(self));
}

Pacioli.Space.prototype.animatefast = function () {
    spaceTimeoutID = null
    this.renderer.render(this.scene, this.camera);
}

Pacioli.Space.prototype.animate = function () {
spaceTimeoutID = null
    var width = this.canvas.width
    var height = this.canvas.height

    var camera = this.camera
    var cameraInfo = this.cameraInfo

    // Adjust the camera position
    var dist = cameraInfo.zoom * scaleFudge * cameraInfo.distance
    camera.position.x = dist * Math.cos(cameraInfo.rotationY) * Math.cos(cameraInfo.rotationX);
    camera.position.z = dist * Math.cos(cameraInfo.rotationY) * -Math.sin(cameraInfo.rotationX);
    camera.position.y = dist * Math.sin(cameraInfo.rotationY);

    // Adjust the screen offset
    if (camera instanceof THREE.PerspectiveCamera) {
        camera.setViewOffset(width, height, cameraInfo.offsetX, cameraInfo.offsetY, width, height);
    } else {
        var factor = cameraInfo.zoom * scaleFudge /cameraInfo.distance
        camera.left = factor * (cameraInfo.offsetX - width/2);
        camera.right = factor * (cameraInfo.offsetX + width/2);
        camera.top = factor * (-cameraInfo.offsetY + height/2);
        camera.bottom = factor * (-cameraInfo.offsetY - height/2);
    }

    // Make the camera look at the origin and do the necessary update.
    camera.lookAt(this.body.position);
    camera.updateProjectionMatrix();

    // Rotate each label towards the user
    if (this.axes != undefined) this.orientAxisLabels(cameraInfo.rotationX + Math.PI/2);

    // Rendered the scene
    this.renderer.render(this.scene, camera);

    // Loop the animation. Note: three.js includes requestAnimationFrame shim
    if (this.animating) { 
        this.draw() 
    }
}

Pacioli.Space.prototype.focus = function () {
    this.canvas.focus()
}

Pacioli.Space.prototype.move = function (dx, dy) {
    this.moveCamera(dx, dy)
    this.draw()
}

Pacioli.Space.prototype.resize = function (width, height) {
    this.canvas.width = width
    this.canvas.height = height
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height);
    this.draw()
}

Pacioli.Space.prototype.showAxes = function () {
    if (this.axes === null) {
        this.axes = newAxes(this.options.axisSize, this.options.unit.equals(1) ? "  " : " (" + this.options.unit.symbolized().toText() + ")");
        this.scene.add(this.axes.object);
        this.draw()
    }
}

Pacioli.Space.prototype.hideAxes = function () {
    if (this.axes !== null) {
	this.scene.remove(this.axes.object);
        this.axes = null
        this.draw()
    }
}

Pacioli.Space.prototype.orientAxisLabels = function (direction) {
    if (this.axes !== null) {
	for (var i = 0; i < this.axes.labels.length; i++) {
	    this.axes.labels[i].rotation.y = direction;
	}
    }
}

Pacioli.Space.prototype.onDocumentKeyDown = function (event) {

    function handleArrow(moveX, moveY, rotateX, rotateY) {
	if (event.shiftKey && ! event.ctrlKey && ! event.altKey) {
	    event.preventDefault();
	    this.moveCamera(moveX, moveY);
	} else if (! event.shiftKey && ! event.ctrlKey && ! event.altKey) {
	    event.preventDefault();
	    this.rotateCamera(rotateX, rotateY);
	} else if (! event.shiftKey && event.ctrlKey && ! event.altKey) {
	    event.preventDefault();
	    this.handleRotateBody(rotateX, rotateY);
	}
	this.draw();
    }

    switch (event.which) {
	case 61: this.zoomIn(); break;
	case 173: this.zoomOut(); break;
	case 37: handleArrow.call(this, 20, 0, 0.1, 0); break;
	case 38: handleArrow.call(this, 0, 20, 0, -0.1); break;
	case 39: handleArrow.call(this, -20, 0, -0.1, 0); break;
	case 40: handleArrow.call(this, 0, -20, 0, 0.1); break;
    }
}

Pacioli.Space.prototype.onDocumentMouseDown = function (event) {

    var info = this.mouseInfo

    info.lastX = event.clientX
    info.lastY = event.clientY
    info.circling = ! event.shiftKey && ! event.ctrlKey && ! event.altKey;
    info.rotating = ! event.shiftKey && event.ctrlKey && ! event.altKey;
    info.moving = event.shiftKey && ! event.ctrlKey && ! event.altKey;
    if (info.rotating || info.circling || info.moving) {
	event.preventDefault();
	this.animating = true;
	this.draw()
    }
    event.target.focus();
}


Pacioli.Space.prototype.onMouseWheel = function (event) {
    event.preventDefault();
    var data = event.wheelDelta || -event.detail;
    if (0 < Number(data)) {
        this.zoomIn();
    } else {
        this.zoomOut();
    }
}

Pacioli.Space.prototype.onDocumentMouseMove = function (event) {

    var info = this.mouseInfo

    // Calculate the movement
    var dx = info.lastX - event.clientX;
    var dy = info.lastY - event.clientY;

    // Adjust the view
    if (info.circling) this.rotateCamera(0.01 * dx,  -0.003 * dy);
    if (info.rotating) this.handleRotateBody(0.01 * dx, -0.003 * dy);
    if (info.moving) this.moveCamera(dx, dy);

    // Prevent default behavior
    if (info.rotating || info.circling || info.moving) event.preventDefault();

    // Update the last known position
    info.lastX = event.clientX;
    info.lastY = event.clientY;
}

Pacioli.Space.prototype.onDocumentMouseUp = function (event) {
    var info = this.mouseInfo
    if (info.rotating || info.circling || info.moving) {
	event.preventDefault();
	this.animating = false;
	info.moving = false;
	info.rotating = false;
	info.circling = false;
    }
}

Pacioli.Space.prototype.onDocumentMouseOut = function (event) {
    var info = this.mouseInfo
    if (info.rotating || info.circling || info.moving) {
	event.preventDefault();
	this.animating = false;
	info.moving = false;
	info.rotating = false;
	info.circling = false;
    }
}

Pacioli.Space.prototype.zoomOut = function () {
    this.cameraInfo.zoom *= 1.2;
    this.draw()
}

Pacioli.Space.prototype.zoomIn = function () {
    this.cameraInfo.zoom /= 1.2;
    this.draw()
}

Pacioli.Space.prototype.moveCamera = function (dx, dy) {
    this.cameraInfo.offsetX += dx;
    this.cameraInfo.offsetY += dy;
}

Pacioli.Space.prototype.rotateCamera = function (dx, dy) {
    this.cameraInfo.rotationX = this.cameraInfo.rotationX + dx;
    // If rotation gets -pi/2 or pi/2 then canvas in firefox with
    // ortho camera and axes on hangs. The 1.57 is just below pi/2 and
    // avoids the problem.
    //rotationY = Math.min(Math.max(rotationY + dy, -Math.PI/2), Math.PI/2);
    this.cameraInfo.rotationY = Math.min(Math.max(this.cameraInfo.rotationY + dy, -1.57), 1.57);
}

Pacioli.Space.prototype.handleRotateBody = function(dx, dy) {

    // The vertical axis and the axis perpendicular to it and to the user direction
    var axis1 = new THREE.Vector3(0,1,0);
    var axis2 = new THREE.Vector3().cross(axis1, this.camera.position);
    
    // Make rotation matrices around the two axes
    var rotObjectMatrix1 = new THREE.Matrix4();
    var rotObjectMatrix2 = new THREE.Matrix4();
    rotObjectMatrix1.makeRotationAxis(axis1.normalize(), dx);
    rotObjectMatrix2.makeRotationAxis(axis2.normalize(), dy);

    // Apply the matrices to the body
    rotObjectMatrix1.multiplySelf(this.body.matrix);
    rotObjectMatrix2.multiplySelf(rotObjectMatrix1);
    this.body.rotation.setEulerFromRotationMatrix(rotObjectMatrix2);
}

// todo: find out how to rotate multiple times. Currently each rotation
//       overwrites the previous rotation. Can the rotation on body be effectuated?
//       Check this after upgrade to new THREE version. The handleRotation can reuse 
//       this function
Pacioli.Space.prototype.rotateBody = function(axis, angle) {
    var rotObjectMatrix = new THREE.Matrix4()
    rotObjectMatrix.makeRotationAxis(axis.normalize(), angle)
    this.body.rotation.setEulerFromRotationMatrix(rotObjectMatrix)
}

Pacioli.Space.prototype.remove = function (body) {
    this.body.remove(body)
}

Pacioli.Space.prototype.addMesh = function (mesh, options) {

    var graphics = options || {}

    // Create the proper material
    var material = graphics.material || "normal";
    var transparent = graphics.transparent || false;
    var webgl = this.options.webgl
    var wireframe = graphics.wireframe || false
    var transparent = graphics.transparent || false
    var props = {
	overdraw: !(webgl || wireframe || transparent),
	wireframe: wireframe,
	side: THREE.DoubleSide,
	transparent: transparent,
	opacity: (transparent) ? 0.5 : 1.0
    };

    if (material == "normal") {
	var material = new THREE.MeshNormalMaterial(props);
    } else if (material == "Lambert") {
	var material = new THREE.MeshLambertMaterial(props);
    } else if (material == "Phong") {
	var material = new THREE.MeshPhongMaterial(props);
    } else {
	props['color'] = 0Xaaaaff;
	var material = new THREE.MeshBasicMaterial(props);
    }

    // Create a mesh object with the material and add it to the body
    var meshObject = Pacioli.mesh2THREE(mesh, material, this.options.unit)
    this.body.add(meshObject);

    // Return the mesh object to the caller as reference
    return meshObject;
}



Pacioli.Space.prototype.clear = function () {
    while (0 < this.body.children.length) {
        this.body.remove(this.body.children[0])
    }
}

Pacioli.Space.prototype.addCurve = function (points, graphics) {
    var geometry = new THREE.Geometry();
    var material = new THREE.LineBasicMaterial({color: 0xaaaaaa, transparent: true, opacity:0.3});

    var factor = points.type.param.param.multiplier.conversionFactor(this.options.unit)

    for (var i = 0; i < points.value.length; i++) {
	var point = points.value[i];
        geometry.vertices.push(Pacioli.vec2THREE(point, factor))
    }

    var lineObject = new THREE.Line(geometry, material);
    this.body.add(lineObject);

    return lineObject
}

Pacioli.vec2THREE = function (vector, factor) {
    return new THREE.Vector3(Pacioli.getNumber(vector, 0, 0) * factor,
                             Pacioli.getNumber(vector, 2, 0) * factor,
                             Pacioli.getNumber(vector, 1, 0) * factor);
}


Pacioli.mesh2THREE = function (mesh, material, unit) {

    var factor = mesh.type.param[0].param.param.multiplier.conversionFactor(unit)
 
    var geometry = new THREE.Geometry();

    var vertices = mesh.value[0]
    for (var i = 0; i < vertices.length; i++) {
	geometry.vertices.push(Pacioli.vec2THREE(vertices[i], factor));
    }

    var faces = mesh.value[1]
    for (var i = 0; i < faces.length; i++) {
	var face = faces[i]
	geometry.faces.push(new THREE.Face4(Pacioli.getNumber(face[0], 0, 0),
                                            Pacioli.getNumber(face[1], 0, 0),
                                            Pacioli.getNumber(face[2], 0, 0),
                                            Pacioli.getNumber(face[3], 0, 0)))
    }

    geometry.mergeVertices();
    geometry.computeFaceNormals();
    geometry.computeCentroids();

    return new THREE.Mesh(geometry, material);
}

function addLight(scene) {

    // Add ambient light to the scene
    scene.add(new THREE.AmbientLight(0x555555));

    // Add a point light to the scene
    var light1 = new THREE.DirectionalLight(0xaaaaFF, 0.5);
    light1.position.set(100, 100, 100);
    light1.target = body;
    scene.add(light1);

    // Add a point light to the scene
    var light2 = new THREE.DirectionalLight(0xaaaaff, 0.5);
    light2.position.set(-100, -100, 100);
    light2.target = body;
    scene.add(light2);
}

function newAxes(n, unit) {

    // Create the new axes object
    var axes = {
	object: new THREE.Object3D(),    // Container for axes elements
	labels: []                       // Labels to be oriented towards the user during animation
    }

    // Create the axes material
    var material = new THREE.LineBasicMaterial({color: 0xbbbbbb});

    function addAxisLine(from, to) {
	var geometry = new THREE.Geometry();
	geometry.vertices.push(new THREE.Vector3(from[0], from[1], from[2]));
	geometry.vertices.push(new THREE.Vector3(to[0], to[1], to[2]));
	axes.object.add(new THREE.Line(geometry, material));
    }

    function addLabel(text, size, position) {
	var label = newLabel(text, size);
	axes.object.add(label);
	axes.labels.push(label);
	label.position.x = position[0];
	label.position.y = position[1] + scaleFudge*0.5;
	label.position.z = position[2];
    }

    // Add the axes' lines
    addAxisLine([-n * scaleFudge, 0, 0], [n * scaleFudge, 0, 0]);
    addAxisLine([0, -n * scaleFudge, 0], [0, n * scaleFudge, 0]);
    addAxisLine([0, 0, -n * scaleFudge], [0, 0, n * scaleFudge]);

    // Add the axes' labels
    addLabel("x" + unit, 0.1, [n, 0, 0]);
    addLabel("y" + unit, 0.1, [0, 0, n]);
    addLabel("z" + unit, 0.1, [0, n, 0]);

    // Add the tickmarks
    for (var i = -n; i <= n; i ++) {

	if (i != 0) {

	    // The tickmark lines
	    var thickness = i % 10 == 0 ? 0.4 : i % 5 == 0 ? 0.2 : 0.1;
	    addAxisLine([i*scaleFudge, 0, -thickness*scaleFudge], [i*scaleFudge, 0, thickness*scaleFudge]);
	    addAxisLine([-thickness*scaleFudge, i*scaleFudge, 0], [thickness*scaleFudge, i*scaleFudge, 0]);
	    addAxisLine([0, -thickness*scaleFudge, i*scaleFudge], [0, thickness*scaleFudge, i*scaleFudge]);

	    // The tickmark numbers
	    if (i % 10 == 0) {
		addLabel(i, 0.05, [i, 0, 0]);
		addLabel(i, 0.05, [0, i, 0]);
		addLabel(i, 0.05, [0, 0, i]);
	    }
	}
    }

    // Return the new axes object
    return axes;
}

function newLabel(text, size) {

    // Write the text on a new canvas.
    var canvas = document.createElement('canvas');
    var context = canvas.getContext('2d');
    var width = context.measureText(text).width;

    // Create a picture of the text. It must be square to maintain
    // size ratios and large enough to hold the text. Assume the width
    // is larger than the height.
    canvas.width = width;
    canvas.height = width;
    context.textBaseline = 'top';
    context.fillText(text, 0, 0);

    // Put the canvas in a texture and make a plane.
    var texture = new THREE.Texture(canvas);
    texture.needsUpdate = true;
    var cover = new THREE.MeshBasicMaterial({map: texture, transparent: true, side: THREE.DoubleSide});
    var shape = new THREE.PlaneGeometry(width*size, width*size);

    // Create the label
    var label = new THREE.Mesh(shape, cover);
    label.needsUpdate = true;
    return label;
}

//function onTouchStart(event) {
//    event.preventDefault();
//    var touch = event.touches[0];
//    lastX = touch.pageX;
//    lastY = touch.pageY;
//    moving = false;
//    circling = false;
//    rotating = true;
//    animating = true;
//    requestAnimationFrame(animate);
//    //event.target.focus();
//}
//
//function onTouchMove(event) {
//    event.preventDefault();
//    var touch = event.touches[0];
//
//    var dx = lastX - event.clientX;
//    var dy = lastY - event.clientY;
//
//    if (moving) moveCamera(dx, dy);
//    if (rotating) rotateBody(0.01 * dx, -0.003 * dy);
//    if (circling) rotateCamera(0.01 * dx, -0.003 * dy);
//
//    lastX = touch.pageX;
//    lastY = touch.pageY;
//}
//
//function onTouchEnd(event) {
//    event.preventDefault();
//    animating = false;
//    moving = false;
//    rotating = false;
//    circling = false;
//}
//
//function onTouchCancel(event) {
//    event.preventDefault();
//    animating = false;
//    moving = false;
//    rotating = false;
//    circling = false;
//}
//
//function onTouchLeave(event) {
//    event.preventDefault();
//    animating = false;
//    moving = false;
//    rotating = false;
//    circling = false;
//}