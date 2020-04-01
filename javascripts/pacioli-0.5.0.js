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
    this.powers = {};
    if (x !== undefined) {
        this.powers[x] = 1;
    }
}

Pacioli.PowerProduct.prototype.power = function (x) {
    return this.powers[x] || 0;
}

Pacioli.PowerProduct.prototype.equals = function (other) {
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
        var unit = Pacioli.fetchScalarBase(name)
        if (unit.definition === undefined) {
            return new Pacioli.DimensionedNumber(1, new Pacioli.PowerProduct(name));
        } else {
            return unit.definition.flat();
        }
    }

    var num = new Pacioli.DimensionedNumber();
    for (var base in this.powers) {
        var names = base.split('$')
        if (names.length === 1) {
            num = num.mult(flatUnit(base).expt(this.power(base)));
        } else {
            var prefix = Pacioli.prefix[names[0]]
            if (prefix === undefined) {
                throw new Error("prefix '" + names[0] + "' unknown")
            } else {
                num = num.mult(new Pacioli.DimensionedNumber(prefix.factor).mult(flatUnit(names[1])).expt(this.power(base)));
            }
        }
    }
    return num;
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
    }
    for (var x in this.powers) {
        var n = this.powers[x]
        var base = x //x.replace('$', ':')
        if (n === -1) {
            text += '/' + base;
        }
        if (n < -1) {
            text += '/' + base + '^' + -n;
        }
    }
    if (text === "") {
        return '1';
    } else if (text[0] === '*') {
        return text.substr(1);
    } else if (text[0] === '/') {
        return "1" + text;
    } else {
        return text;
    }
}

Pacioli.PowerProduct.prototype.toDOMsimple = function () {
    var fragment = document.createDocumentFragment()
    fragment.appendChild(document.createTextNode(this.toText()))
    return fragment;
}

Pacioli.PowerProduct.prototype.toDOM = function () {

    var fragment = document.createDocumentFragment()

    var text = "";
    var firstPower = null;
    for (var x in this.powers) {
        var n = this.powers[x]
        if (firstPower === null && 0 < n) {
            firstPower = n
        }
        var base = x //x.replace('$', ':')
        if (n === 1) {
            fragment.appendChild(document.createTextNode("*"))
            fragment.appendChild(document.createTextNode(base))
        }
        if (1 < n) {
            fragment.appendChild(document.createTextNode("*"))
            fragment.appendChild(document.createTextNode(base))
            var sup = document.createElement("sup")
            sup.appendChild(document.createTextNode(n))
            fragment.appendChild(sup)
        }
    }

    for (var x in this.powers) {
        var n = this.powers[x]
        if (firstPower === null && n < 0) {
            firstPower = n
        }
        var base = x //x.replace('$', ':')
        if (n === -1) {
            fragment.appendChild(document.createTextNode("/"))
            fragment.appendChild(document.createTextNode(base))
        }
        if (n < -1) {
            fragment.appendChild(document.createTextNode("/"))
            fragment.appendChild(document.createTextNode(base))
            var sup = document.createElement("sup")
            sup.appendChild(document.createTextNode(-n))
            fragment.appendChild(sup)
        }
    }

    if (0 < firstPower) {
        fragment.removeChild(fragment.firstChild)
    } 
    //fragment.normalize()
    return fragment
}

Pacioli.PowerProduct.prototype.mult = function (other) {
    var result = new Pacioli.PowerProduct();
    for (var x in this.powers) {
        result.powers[x] = this.powers[x];
    }
    for (var x in other.powers) {
        result.powers[x] = this.power(x) + other.powers[x];
    }
    return result;
}

Pacioli.PowerProduct.prototype.div = function (other) {
    var result = new Pacioli.PowerProduct();
    for (var x in this.powers) {
        result.powers[x] = this.powers[x];
    }
    for (var x in other.powers) {
        result.powers[x] = this.power(x) - other.powers[x];
    }
    return result;
}

Pacioli.PowerProduct.prototype.reciprocal = function () {
    var result = new Pacioli.PowerProduct();
    for (var x in this.powers) {
        result.powers[x] = -this.powers[x];
    }
    return result;
}

Pacioli.PowerProduct.prototype.expt = function (power) {
    var result = new Pacioli.PowerProduct();
    for (var x in this.powers) {
        result.powers[x] = this.powers[x] * power;
    } 
    return result;
}

Pacioli.PowerProduct.prototype.map = function (fun) {
    var result = new Pacioli.PowerProduct();
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
            return Pacioli.fetchScalarBase(base).symbol 
        } else {
            var prefix = Pacioli.prefix[names[0]]
            if (prefix === undefined) {
                throw new Error("prefix '" + names[0] + "' unknown")
            } else {
                return prefix.symbol + Pacioli.fetchScalarBase(names[1]).symbol
            }
        }
    })
}

Pacioli.PowerProduct.prototype.conversionFactor = function (to) {
    var flat = this.div(to).flat()
    if (flat.isDimensionless()) {
        return flat.factor
    } else {
        throw new Error("cannot convert unit '" + this.toText() + "' to unit '" + to.toText() + "'" + flat.toText())
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
    this.multiplier = multiplier || Pacioli.unit()
    this.rowSets = rowSets || []
    this.columnSets = columnSets || []
    this.rowUnit = rowUnit || Pacioli.unit()
    this.columnUnit = columnUnit || Pacioli.unit()
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

Pacioli.indexEqual = function (a, b) {
    if (a.length != b.length) return false;
    for (var i = 0; i < a.length; ++i) {
        if (a[i] !== b[i]) return false;
    }
    return true;
}

Pacioli.Shape.prototype.equals = function (other) {
    return this.multiplier.equals(other.multiplier) &&
           Pacioli.indexEqual(this.rowSets, other.rowSets) &&
           Pacioli.indexEqual(this.columnSets, other.columnSets) &&
           this.rowUnit.equals(other.rowUnit) &&
           this.columnUnit.equals(other.columnUnit);
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
    if (!Pacioli.indexEqual(this.columnSets, other.rowSets) && this.columnUnit.equals(other.rowUnit)) {
        throw 'Shape ' + this.toText() + ' not compatible for dot product with shape ' + other.toText();
    } 
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
    return this.rowSets.map(function (x) {return x.name}).reduce(function (x, y) {return x + '%' + y})
}

Pacioli.Shape.prototype.columnName = function () {
    return this.columnSets.map(function (x) {return x.name}).reduce(function (x, y) {return x + '%' + y})
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
    shape.multiplier = Pacioli.unit()
    shape.rowSets = this.indexSets
    shape.columnSets = []
    shape.rowUnit = Pacioli.unit()
    shape.columnUnit = Pacioli.unit()
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

    var names = this.names;
    
    vecBaseItem = function (base, order) {
        var parts = base.split('$');
        if (parts[1] == order) {
            var vec = Pacioli.fetchVectorBase(parts[0]);
            var pos = names[order];
            return vec.units[pos] || Pacioli.unit();
        } else {
            return Pacioli.unit();
        }
    }

    var newUnit = Pacioli.unit()
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
    var tmp = []
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
                                tmp.push([parsedX, parsedY, value])
                            }
                        }
                    }
                }
            }
        }
    }
    tmp.sort(function (a, b) {
       if (a[0] > b[0])
          return 1;
       if (a[0] < b[0])
          return -1;
       if (a[1] > b[1])
          return 1;
       if (a[1] < b[1])
          return -1;
       return 0;
    })
    for (var i = 0; i < tmp.length; i++) {
        rows.push(tmp[i][0])
        columns.push(tmp[i][1])
        values.push(tmp[i][2])
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


Pacioli.findNonZero = function (xNumbers, yNumbers, fun, zero_zero_case) {
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
    var count = 0

    var rows = []
    var columns = []
    var values = []

    while (px < xLen && py < yLen) {
        var rx = xRows[px]
        var ry = yRows[py]
        var cx = xColumns[px]
        var cy = yColumns[py]
        if (rx > ry) {
            if (fun(0, yValues[py])) return true //[ry, cy]
            py++
        } else if (rx < ry) {
            if (fun(xValues[px], 0)) return true //[rx, cx]
            px++
        } else {
            if (cx < cy) {
                if (fun(xValues[px], 0)) return true //[rx, cx]
                px++
            } else if (cx > cy) {
                if (fun(0, yValues[py])) return true //[ry, cy]
                py++
            } else {
                if (fun(xValues[px], yValues[py])) return true //[rx, cy]
                px++
                py++
            }
        }
        count++
    }

    while (px < xLen) {
        var rx = xRows[px]
        var cx = xColumns[px]
        if (fun(xValues[px], 0)) return true //[rx, cx]
        px++
        count++
    }

    while (py < yLen) {
        var ry = yRows[py]
        var cy = yColumns[py]
        if (fun(0, yValues[py])) return true //[ry, cy]
        py++
        count++
    }

    if (count == xNumbers.nrRows * xNumbers.nrColumns) {
        return false
    } else {
        return zero_zero_case
    }
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

Pacioli.projectNumbersAlt = function (numbers, shape, cols) {

    // Determine the projected shape
    var projectedShape = shape.project(cols);
    var m = projectedShape.nrRows();
    var n = projectedShape.nrColumns();

    // Determine which columns are not projected
    var colsComp = [];
    for (var i = 0; i < shape.rowOrder(); i++) {
        if (cols.indexOf(i) == -1) {
            colsComp.push(i);
        }
    }

    // Determine the size of the complement coordinates index set.
    var nrRows = shape.project(colsComp).nrRows();

    // Create a map from the complement coordinates to the projected matrices.
    // Matrix map(x) is the sum of all rows where the compound index contains x.
    var map = new Map();
    var coo = Pacioli.getCOONumbers(numbers)
    var rows = coo[0]
    var values = coo[2]
    for (var i = 0; i < rows.length; i++) {
        var coords = shape.rowCoordinates(rows[i])
        var coordsComp = coords.project(colsComp).position();
        var pos = coords.project(cols).position()
        if (!map.has(coordsComp)) {
            map.set(coordsComp, Pacioli.zeroNumbers(m, n))
        }
        var mat = map.get(coordsComp);
        var sum = Pacioli.getNumber(mat, pos, 0)
        Pacioli.set(mat, pos, 0, sum === undefined ? values[i] : sum + values[i])
    }

    // Turn the map into the desired list
    var result = [];
    map.forEach(function (value, key) {
        var pair = Pacioli.tagKind([{kind: "coordinates", position: key, size: nrRows}, value], "tuple");
        result.push(pair)
    });

    // Return the list
    return Pacioli.tagKind(result, "list");
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
    var keys = glbl_Matrix_row_domain(matrix)
    for (var i = 0; i < keys.length; i++) {
        var item = document.createElement("li")
        item.appendChild(Pacioli.DOM(keys[i]))
        item.appendChild(Pacioli.DOMtop(n, glbl_Matrix_row(matrix, keys[i])))
        list.appendChild(item)
    }
    return list
}

Pacioli.DOMrowBottoms = function(n, matrix) {
    var list = document.createElement("ul")
    var keys = glbl_Matrix_row_domain(matrix)
    for (var i = 0; i < keys.length; i++) {
        var item = document.createElement("li")
        item.appendChild(Pacioli.DOM(keys[i]))
        item.appendChild(Pacioli.DOMbottom(n, glbl_Matrix_row(matrix, keys[i])))
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
        if (fixedBases.length !== 0) {
            throw "Contradiction in unit match: 1 = " + unit.toText()
        }
        return {}
    }

    var firstVar = varBases[0]
    var power = unit.powers[firstVar]
    
    if (varBases.length === 1) {

        var rest = new Pacioli.PowerProduct()
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

    var rest = new Pacioli.PowerProduct()
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

// Used in b_ primitives for performance experiment:

Pacioli.Type.prototype.div = function (other) {
    return new Pacioli.Type(this.kind, this.param.div(other.param));
}

Pacioli.Type.prototype.mult = function (other) {
    return new Pacioli.Type(this.kind, this.param.mult(other.param));
}

Pacioli.Type.prototype.scale = function (other) {
    return new Pacioli.Type(this.kind, this.param.scale(other.param));
}

Pacioli.Type.prototype.per = function (other) {
    return new Pacioli.Type(this.kind, this.param.per(other.param));
}

Pacioli.Type.prototype.dot = function (other) {
    return new Pacioli.Type(this.kind, this.param.dot(other.param));
}

Pacioli.Type.prototype.transpose = function () {
    return new Pacioli.Type(this.kind, this.param.transpose());
}

Pacioli.Type.prototype.reciprocal = function () {
    return new Pacioli.Type(this.kind, this.param.reciprocal());
}

Pacioli.Type.prototype.dim_inv = function () {
    return new Pacioli.Type(this.kind, this.param.dim_inv());
}

Pacioli.Type.prototype.dimensionless = function () {
    return new Pacioli.Type(this.kind, this.param.dimensionless());
}

Pacioli.Type.prototype.expt = function (n) {
    return new Pacioli.Type(this.kind, this.param.expt(n));
}

Pacioli.Type.prototype.factor = function () {
    return new Pacioli.Type(this.kind, this.param.factor());
}

Pacioli.Type.prototype.row = function () {
    return new Pacioli.Type(this.kind, this.param.row());
}

Pacioli.Type.prototype.column = function () {
    return new Pacioli.Type(this.kind, this.param.column());
}

Pacioli.Type.prototype.equals = function (other) {
    return this.kind == other.kind && this.param.equals(other.param);
}

Pacioli.Type.prototype.leftIdentity = function () {
    return new Pacioli.Type(this.kind, this.param.leftIdentity());
}
/* Runtime Support for the Pacioli language
 *
 * Copyright (c) 2013-2018 Paul Griffioen
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
    return new Pacioli.Box(Pacioli.lookupItem("u_glbl_" + module + "_" + name),
                           Pacioli.lookupItem("glbl_" + module + "_" + name))
}

Pacioli.fun = function (module, name) {
    return new Pacioli.Box(Pacioli.lookupItem("u_glbl_" + module + "_" + name),
                           Pacioli.lookupItem("glbl_" + module + "_" + name))
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
    // added coords for b_Matrix_make_matrix
    return {kind: "coordinates", position: coords.position(), size: coords.size(), coords: coords}
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

Pacioli.oneMatrix = function (shape) {
    return new Pacioli.Box(new Pacioli.Type("matrix", shape),
                           Pacioli.oneNumbers(shape.nrRows(), shape.nrColumns()))
}

Pacioli.initialMatrix = function (shape, data) {
    return new Pacioli.Box(new Pacioli.Type("matrix", shape),
                           Pacioli.initialNumbers(shape.nrRows(), shape.nrColumns(), data))
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

Pacioli.dimNum = function (a, b) {
    return new Pacioli.DimensionedNumber(a, b);
}

// -----------------------------------------------------------------------------
// 1. The Store
// -----------------------------------------------------------------------------

Pacioli.cache = {};

Pacioli.fetchValue = function (home, name) {
    return Pacioli.lookupItem("glbl_" + home + "_" + name);
}

Pacioli.bfetchValue = function (home, name) {
    return Pacioli.lookupItem("b_glbl_" + home + "_" + name);
}

Pacioli.fetchIndex = function (id) {
    return Pacioli.lookupItem("index_" + id);
}

Pacioli.storeIndex = function (id, index) {
    Pacioli.cache["index_" + id] = index;
}

// todo: replace unit_ by sbase_
Pacioli.storeScalarBase = function (id, base) {
    Pacioli.cache["unit_" + id] = base;
}

// todo: replace unit_ by sbase_
Pacioli.fetchScalarBase = function (id) {
    return Pacioli.lookupItem("unit_" + id);
}

// todo: replace unit_ by sbase_
Pacioli.storeVectorBase = function (id, base) {
    Pacioli.cache["unitvec_" + id] = base;
}

// todo: replace unit_ by sbase_
Pacioli.fetchVectorBase = function (id) {
    return Pacioli.lookupItem("unitvec_" + id);
}

Pacioli.fetchType = function (home, name) {
    alert('Who used fetchType?');
    return Pacioli.lookupItem("u_glbl_" + home + "_" + name);
}

Pacioli.lookupItem = function (full) {
    if (Pacioli.cache[full] == undefined) {
        if (Pacioli[full]) {
            Pacioli.cache[full] = Pacioli[full];
        } else if (Pacioli["compute_" + full]) {
            Pacioli.cache[full] = Pacioli["compute_" + full]();
        } else {
            throw new Error("no function found to compute Pacioli item '" + full + "'");
        }
    }
    return Pacioli.cache[full];
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

Pacioli.ONE = Pacioli.unit()
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
// Each primitive function is named 'glbl_<module>_<name>'.
// -----------------------------------------------------------------------------

Pacioli.glbl_base_tuple = function () {
    var tuple = Array.prototype.slice.call(arguments);
    tuple.kind = 'tuple'
    return tuple
}

Pacioli.glbl_base_apply = function (fun,arg) {
    return fun.apply(this, arg);
}

Pacioli.glbl_base_new_ref = function (value) {
    return [value];
}

Pacioli.glbl_base_empty_ref = function () {
    return new Array(1);
}

Pacioli.glbl_base_ref_set = function (ref, value) {
    ref[0] = value;
    return ref;
}

Pacioli.glbl_base_ref_get = function (ref) {
    return ref[0];
}

Pacioli.glbl_base_not = function (boole) {
  return !boole;
}

Pacioli.glbl_base_skip = function () {
    return null
}

Pacioli.glbl_base_while_function = function (test, body) {
    while (test()) {
        body();
    }
    return null;
}

Pacioli.glbl_base_catch_result = function (code, ref) {
    try {
        code();
    } catch(err) {
        if (err == "jump") {
            return ref[0];
        } else {
            throw err
        }
    }
}

Pacioli.glbl_base_throw_result = function (ref, value) {
    ref[0] = value;
    throw "jump";
}

Pacioli.glbl_base_seq = function (x, y) {
    return y;
}

Pacioli.glbl_base_not_equal = function (x,y) {
    return !Pacioli.glbl_base_equal(x, y);
}

Pacioli.b_glbl_base_not_equal = function (x,y) {
    return !Pacioli.b_glbl_base_equal(x, y);
}

Pacioli.glbl_base_equal = function (x,y) {

    if (x.kind !== y.kind) return false

    if (x === y) {
        return true
    } else if (x.kind === "coordinates") { //(x instanceof Pacioli.Coordinates && y instanceof Pacioli.Coordinates) {
     alert('duh')
        return x.equals(y)
    } else if (x.kind === "matrix") { //(x instanceof Pacioli.Matrix && y instanceof Pacioli.Matrix) {
        return !Pacioli.findNonZero(x, y, function (a, b) {return a !== b}, false) // === null
        //return x.equals(y)
    } else if (x instanceof Array && y instanceof Array) { 
        var n = x.length
        if (y.length !== n) {
            return false
        }
        for (var i = 0; i < n; i++) {
            if (!glbl_base_equal(x[i], y[i])) {
                return false
            }
        }
        return true
    } else {
        return false
    }
}

Pacioli.b_glbl_base_equal = function (x,y) {

    if (x instanceof Pacioli.Box || y instanceof Pacioli.Box) {
        if (x instanceof Pacioli.Box && y instanceof Pacioli.Box) {
            if (!x.type.equals(y.type)) {
                throw 'Type ' + x.type.param.toText() + ' not compatible for equality with type ' + y.type.param.toText();
            }
            return !Pacioli.findNonZero(x.value, y.value, function (a, b) {return a !== b}, false) // === null
        } else {
            return false;
        }
    }

    if (x.kind !== y.kind) return false

    if (x === y) {
        return true
    } else if (x.kind === "coordinates") { //(x instanceof Pacioli.Coordinates && y instanceof Pacioli.Coordinates) {
     alert('duh')
        return x.equals(y)
    } else if (x.kind === "matrix") { //(x instanceof Pacioli.Matrix && y instanceof Pacioli.Matrix) {
        return !Pacioli.findNonZero(x.value, y.value, function (a, b) {return a !== b}, false) // === null
        //return x.equals(y)
    } else if (x instanceof Array && y instanceof Array) { 
        var n = x.length
        if (y.length !== n) {
            return false
        }
        for (var i = 0; i < n; i++) {
            if (!b_glbl_base_equal(x[i], y[i])) {
                return false
            }
        }
        return true
    } else {
        return false
    }
}

Pacioli.glbl_base_print = function (x) {
    return Pacioli.printValue(x)
}

Pacioli.glbl_base_is_zero = function (x) {
    var values = Pacioli.getCOONumbers(x)[2]
    for (var i = 0; i < values.length; i++) {
        if (values[i] != 0) return false;
    }
    return true;
}

Pacioli.compute_glbl_base__ = function () {
    return Pacioli.createCoordinates([], []);
}

Pacioli.compute_b_glbl_base__ = function () {
    return Pacioli.compute_glbl_base__();
}

Pacioli.glbl_base_unit_factor = function (x) { 
    return Pacioli.oneNumbers(1, 1)
}

Pacioli.b_glbl_base_unit_factor = function (x) { 
    return new Pacioli.Box(x.type.factor(), Pacioli.oneNumbers(1, 1));
}

Pacioli.glbl_base_magnitude = function (x) {
    return x
}

Pacioli.b_glbl_base_magnitude = function (x) {
    return new Pacioli.Box(x.type.dimensionless(), x.value);
}

Pacioli.glbl_base_row = function (x, coord) {
    var row = coord.position
    var matrix = Pacioli.zeroNumbers(1, x.nrColumns)
    var numbers = Pacioli.getCOONumbers(x)
    var rows = numbers[0]
    var columns = numbers[1]
    var values = numbers[2]
    for (var i = 0; i < rows.length; i++) {
            if (rows[i] === row) {
                Pacioli.set(matrix, 0, columns[i], values[i])
            }
    }
    return matrix
}

Pacioli.glbl_base_row_unit = function (x) {
    return Pacioli.oneNumbers(x.nrRows, 1)
}

Pacioli.glbl_base_row_domain = function (matrix) {
    var n = matrix.nrRows;
    var domain = new Array(n);
    for (var i = 0; i < n; i++) {
        domain[i] = {kind: "coordinates", position: i, size: n}
    }
    return Pacioli.tagKind(domain, "list");
}

Pacioli.glbl_base_column = function (x, coord) {
    // todo: reconsider this and the glbl_base_row implementation 
    return Pacioli.glbl_base_transpose(Pacioli.glbl_base_row(Pacioli.glbl_base_transpose(x), coord))
}

Pacioli.glbl_base_column_domain = function (matrix) {
    var n = matrix.nrColumns;
    var domain = new Array(n);
    for (var i = 0; i < n; i++) {
        domain[i] = {kind: "coordinates", position: i, size: n}
    }
    return Pacioli.tagKind(domain, "list");
}

Pacioli.glbl_base_column_unit = function (x) {
    return Pacioli.oneNumbers(x.nrColumns, 1)
}

Pacioli.glbl_base_get_num = function (matrix, i, j) {
    return Pacioli.get(matrix, i.position, j.position)
}

Pacioli.glbl_base_get = function (matrix, i, j) {
    return Pacioli.get(matrix, i.position, j.position)
}

Pacioli.b_glbl_base_get = function (matrix, i, j) {
    return new Pacioli.Box(matrix.type.factor(), Pacioli.glbl_base_get(matrix.value, i, j));
}

Pacioli.glbl_base_make_matrix = function (tuples) {
    var first = tuples[0]
    var numbers = Pacioli.zeroNumbers(first[0].size, first[1].size)
    for (var i = 0; i < tuples.length; i++) {
        var tup = tuples[i];
        Pacioli.set(numbers, tup[0].position, tup[1].position, Pacioli.getNumber(tup[2], 0, 0))
    }
    return numbers;
}

Pacioli.b_glbl_base_make_matrix = function (tuples) {

    var first = tuples[0];

    var shape = first[0].coords.shape().per(first[1].coords.shape()).scale(first[2].type.param.factor());
    //shape.multiplier = first[2].type.param.multiplier;

    var numbers = Pacioli.zeroNumbers(first[0].size, first[1].size)
    for (var i = 0; i < tuples.length; i++) {
        var tup = tuples[i];
        Pacioli.set(numbers, tup[0].position, tup[1].position, Pacioli.getNumber(tup[2].value, 0, 0))
    }
    
    return new Pacioli.Box(new Pacioli.Type("matrix", shape), numbers);
}

Pacioli.glbl_base_support = function (x) {
    return Pacioli.unaryNumbers(x, function (val) { return 1})
}

Pacioli.glbl_base_positive_support = function (x) {
    return Pacioli.unaryNumbers(x, function (val) { return 0 < val ? 1 : 0})
}

Pacioli.glbl_base_negative_support = function (x) {
    return Pacioli.unaryNumbers(x, function (val) { return val < 0 ? 1 : 0})
}

Pacioli.glbl_base_top = function (cnt, x) {
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

Pacioli.glbl_base_bottom = function (cnt, x) {
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

Pacioli.glbl_base_left_identity = function (x) {
    var numbers = Pacioli.zeroNumbers(x.nrRows, x.nrRows)
    for (var i = 0; i < x.nrRows; i++) {
        Pacioli.set(numbers, i, i, 1);
    }
    return numbers
}

Pacioli.b_glbl_base_left_identity = function (x) {
    return new Pacioli.Box(x.type.leftIdentity(), Pacioli.glbl_base_left_identity(x.value));
}

Pacioli.glbl_base_right_identity = function (x) {
    var numbers = Pacioli.zeroNumbers(x.nrColumns, x.nrColumns)
    for (var i = 0; i < x.nrColumns; i++) {
        Pacioli.set(numbers, i, i, 1);
    }
    return numbers
}

Pacioli.glbl_base_reciprocal = function (x) {
    return Pacioli.unaryNumbers(x, function (val) { return val == 0 ? 0 : 1 / val})
}

Pacioli.b_glbl_base_reciprocal = function (x) {
    return new Pacioli.Box(x.type.reciprocal(), Pacioli.glbl_base_reciprocal(x.value));
}

Pacioli.glbl_base_transpose = function (x) {
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

Pacioli.b_glbl_base_transpose = function (x) {
    return new Pacioli.Box(x.type.transpose(), Pacioli.glbl_base_transpose(x.value));
}

Pacioli.glbl_base_dim_inv = function (x) {
    return Pacioli.glbl_base_transpose(Pacioli.glbl_base_reciprocal(x));
}

Pacioli.glbl_base_dim_div = function (x, y) {
    return Pacioli.glbl_base_mmult(x, Pacioli.glbl_base_dim_inv(y));
}

Pacioli.glbl_base_mmult = function (x, y) {
    return Pacioli.tagNumbers(numeric.ccsDot(Pacioli.getCCSNumbers(x), Pacioli.getCCSNumbers(y)), x.nrRows, y.nrColumns, 3);
}

Pacioli.b_glbl_base_mmult = function (x, y) {
    return new Pacioli.Box(x.type.dot(y.type), Pacioli.glbl_base_mmult(x.value, y.value));
}

Pacioli.glbl_base_multiply = function (x,y) {
    if (x.storage === 13) {
        return Pacioli.tagNumbers(numeric.ccsmul(Pacioli.getCCSNumbers(x), Pacioli.getCCSNumbers(y)), x.nrRows, y.nrColumns, 3);
    } else {
        return Pacioli.elementWiseNumbers(x, y, function(a, b) { return a*b});
    }
}

Pacioli.b_glbl_base_multiply = function (x,y) {
    return new Pacioli.Box(x.type.mult(y.type), Pacioli.glbl_base_multiply(x.value, y.value));
}

Pacioli.glbl_base_kronecker = function (x,y) {
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

Pacioli.glbl_base_divide = function (x,y) {
    return Pacioli.elementWiseNumbers(x, y, function(a, b) { return b !== 0 ? a/b : 0})
}

Pacioli.b_glbl_base_divide = function (x,y) {
    return new Pacioli.Box(x.type.div(y.type), Pacioli.glbl_base_divide(x.value, y.value));
}

Pacioli.glbl_base_gcd = function (x,y) {
    return Pacioli.elementWiseNumbers(x, y, function(a, b) { 
    if (a < 0) a = -a;
    if (b < 0) b = -b;
    if (b > a) {var temp = a; a = b; b = temp;}
    if (a == 0) return b;
    if (b == 0) return a;
    while (true) {
        a %= b;
        if (a == 0) return b;
        b %= a;
        if (b == 0) return a;
    }
    })
}

Pacioli.glbl_base_sum = function (x,y) {
    if (x.storage === 13) {
        return Pacioli.tagNumbers(numeric.ccsadd(Pacioli.getCCSNumbers(x), Pacioli.getCCSNumbers(y)), x.nrRows, y.nrColumns, 3);
    } else {
        return Pacioli.elementWiseNumbers(x, y, function (a, b) { return a+b});
    }
    //return Pacioli.elementWiseNumbers(x, y, function (a, b) { return a+b})
}

Pacioli.b_glbl_base_sum = function (x,y) {
    if (!x.type.equals(y.type)) {
        throw 'Type ' + x.type.param.toText() + ' not compatible for sum with type ' + y.type.param.toText();
    }
    return new Pacioli.Box(x.type, Pacioli.glbl_base_sum(x.value, y.value));
}

Pacioli.glbl_base_minus = function (x,y) {
    //return Pacioli.elementWiseNumbers(x, y, function(a, b) { return a-b})
    if (x.storage === 13) {
        return Pacioli.tagNumbers(numeric.ccssub(Pacioli.getCCSNumbers(x), Pacioli.getCCSNumbers(y)), x.nrRows, y.nrColumns, 3);
    } else {
        return Pacioli.elementWiseNumbers(x, y, function(a, b) { return a-b});
    }
}

Pacioli.b_glbl_base_minus = function (x,y) {
    if (!x.type.equals(y.type)) {
        throw 'Type ' + x.type.param.toText() + ' not compatible for minus with type ' + y.type.param.toText();
    }
    return new Pacioli.Box(x.type, Pacioli.glbl_base_minus(x.value, y.value));
}

Pacioli.glbl_base_negative = function (x) { 
    return Pacioli.unaryNumbers(x, function (val) { return -val})
}

Pacioli.b_glbl_base_negative = function (x) {
    return new Pacioli.Box(x.type, Pacioli.glbl_base_negative(x.value));
}

Pacioli.glbl_base_scale = function (x,y) { 
    var factor = Pacioli.getNumber(x, 0, 0)
    return Pacioli.unaryNumbers(y, function (val) { return factor * val})
}

Pacioli.b_glbl_base_scale = function (x,y) { 
    return new Pacioli.Box(y.type.scale(x.type), Pacioli.glbl_base_scale(x.value, y.value));
}

Pacioli.glbl_base_scale_down = function (x,y) {
    return Pacioli.glbl_base_scale(Pacioli.glbl_base_reciprocal(y), x);
}

Pacioli.b_glbl_base_scale_down = function (x,y) {
    return Pacioli.b_glbl_base_scale(Pacioli.b_glbl_base_reciprocal(y), x);
}

Pacioli.glbl_base_total = function (x) { 
    var values = Pacioli.getCOONumbers(x)[2]
    var total = 0
    for (var i = 0; i < values.length; i++) {
        total += values[i]
    }
    var result = Pacioli.zeroNumbers(1, 1)
    Pacioli.set(result, 0, 0, total)
    return result
}

Pacioli.glbl_base_mod = function (x, y) {
    return Pacioli.tagNumbers(numeric.mod(Pacioli.getFullNumbers(x), Pacioli.getFullNumbers(y)), x.nrRows, x.nrColumns, 0);
}

Pacioli.b_glbl_base_mod = function (x, y) {
    return new Pacioli.Box(x.type, Pacioli.glbl_base_mod(x.value, y.value));
}

Pacioli.glbl_base_max = function (x, y) {
    return Pacioli.tagNumbers(numeric.max(Pacioli.getFullNumbers(x), Pacioli.getFullNumbers(y)), x.nrRows, y.nrRows, 0)
}

Pacioli.b_glbl_base_max = function (x, y) {
    return new Pacioli.Box(x.type, Pacioli.glbl_base_max(x.value, y.value));
}

Pacioli.glbl_base_min = function (x, y) {
    return Pacioli.tagNumbers(numeric.min(Pacioli.getFullNumbers(x), Pacioli.getFullNumbers(y)), x.nrRows, y.nrRows, 0)
}

Pacioli.glbl_base_sin = function (x) {
    return Pacioli.tagNumbers(numeric.sin(Pacioli.getFullNumbers(x)), x.nrRows, x.nrColumns, 0);
}

Pacioli.b_glbl_base_sin = function (x) {
    return Pacioli.num(numeric.sin(Pacioli.getFullNumbers(x.value)));
}

Pacioli.glbl_base_cos = function (x) {
    return Pacioli.tagNumbers(numeric.cos(Pacioli.getFullNumbers(x)), x.nrRows, x.nrColumns, 0);
}

Pacioli.b_glbl_base_cos = function (x) {
    return Pacioli.num(numeric.cos(Pacioli.getFullNumbers(x.value)));
}

Pacioli.glbl_base_tan = function (x) {
    return Pacioli.tagNumbers(numeric.tan(Pacioli.getFullNumbers(x)), x.nrRows, x.nrColumns, 0);
}

Pacioli.glbl_base_asin = function (x) {
    return Pacioli.tagNumbers(numeric.asin(Pacioli.getFullNumbers(x)), x.nrRows, x.nrColumns, 0);
}

Pacioli.glbl_base_acos = function (x) {
    return Pacioli.tagNumbers(numeric.acos(Pacioli.getFullNumbers(x)), x.nrRows, x.nrColumns, 0);
}

Pacioli.glbl_base_atan = function (x) {
    return Pacioli.tagNumbers(numeric.atan(Pacioli.getFullNumbers(x)), x.nrRows, x.nrColumns, 0);
}

Pacioli.glbl_base_atan2 = function (x, y) {
    return Pacioli.tagNumbers(numeric.atan2(Pacioli.getFullNumbers(x), Pacioli.getFullNumbers(y)), x.nrRows, x.nrColumns, 0);
}

Pacioli.glbl_base_abs = function (x) { 
    return Pacioli.unaryNumbers(x, function (val) { return Math.abs(val)})
}

Pacioli.b_glbl_base_abs = function (x) {
    return new Pacioli.Box(x.type, Pacioli.glbl_base_abs(x.value));
}

Pacioli.glbl_base_power = function (x,y) {
    var n = Pacioli.getNumber(y, 0, 0)
    if (n === 0) {
        return Pacioli.glbl_base_left_identity(x)
    } else if (n === 1) {
        return x
    } else if (n < 0) {
        return Pacioli.glbl_base_power(Pacioli.glbl_standard_inverse(x), Pacioli.glbl_base_negative(y))
    } else { 
        var result = x
        for (var i = 1; i < n; i++) {
            result = Pacioli.glbl_base_mmult(result, x)
        }
        return result
    }
}

Pacioli.glbl_base_expt = function (x,y) {
    var n = Pacioli.getNumber(y, 0, 0)
    return Pacioli.tagNumbers(numeric.pow(Pacioli.getFullNumbers(x), n), x.nrRows, x.nrColumns, 0);
}

Pacioli.glbl_base_log = function (x, y) {
    return Pacioli.glbl_base_divide(Pacioli.tagNumbers(numeric.log(Pacioli.getFullNumbers(x)), x.nrRows, x.nrColumns, 0),
                                Pacioli.tagNumbers(numeric.log(Pacioli.getFullNumbers(y)), x.nrRows, x.nrColumns, 0));
}

Pacioli.glbl_base_exp = function (x) {
    return Pacioli.tagNumbers(numeric.exp(Pacioli.getFullNumbers(x)), x.nrRows, x.nrColumns, 0);
}

Pacioli.b_glbl_base_exp = function (x) {
    return new Pacioli.Box(x.type, Pacioli.glbl_base_exp(x.value));
}

Pacioli.glbl_base_ln = function (x) {
    return Pacioli.tagNumbers(numeric.log(Pacioli.getFullNumbers(x)), x.nrRows, x.nrColumns, 0);
}

Pacioli.b_glbl_base_ln = function (x) {
    return new Pacioli.Box(x.type, Pacioli.glbl_base_ln(x.value));
}

Pacioli.glbl_base_less = function (x,y) { 
    return !Pacioli.findNonZero(x, y, function (a, b) {return a >= b}, true) //=== null
}

Pacioli.b_glbl_base_less = function (x,y) { 
    if (!x.type.equals(y.type)) {
        throw 'Type ' + x.type.param.toText() + ' not compatible for less with type ' + y.type.param.toText();
    }
    return !Pacioli.findNonZero(x.value, y.value, function (a, b) {return a >= b}, true) //=== null
}

Pacioli.glbl_base_less_eq = function (x,y) { 
    return !Pacioli.findNonZero(x, y, function (a, b) {return a > b}, false) //=== null
}

Pacioli.glbl_base_greater = function (x,y) { 
    return !Pacioli.findNonZero(x, y, function (a, b) {return a <= b}, true) //=== null
}

Pacioli.glbl_base_greater_eq = function (x,y) { 
    return !Pacioli.findNonZero(x, y, function (a, b) {return a < b}, false) //=== null
}

Pacioli.glbl_base_sqrt = function (x) { 
    return Pacioli.unaryNumbers(x, function (val) { return Math.sqrt(val)})
}

Pacioli.b_glbl_base_sqrt = function (x) { 
    return new Pacioli.Box(x.type.expt(0.5), Pacioli.glbl_base_sqrt(x.value));
}

Pacioli.glbl_base_solve = function (x, ignored) {
    return Pacioli.tagNumbers(numeric.inv(Pacioli.getFullNumbers(x)), x.nrColumns, x.nrRows, 0);
}

Pacioli.b_glbl_base_solve = function (x, ignored) {
    var type = x.type.column().dim_inv().per(ignored.type.column().dim_inv()).scale(x.type.factor()).scale(ignored.type.factor().reciprocal());
    return new Pacioli.Box(type, Pacioli.glbl_base_solve(x.value, ignored));
}

Pacioli.glbl_base_random = function () { 
    return Pacioli.tagNumbers([[Math.random()]], 1, 1, 0);
}

Pacioli.glbl_base_ranking = function (x) { 
    var result = Pacioli.zeroNumbers(x.nrRows, x.nrColumns)
    var numbers = Pacioli.getCOONumbers(x)
    var rows = numbers[0]
    var columns = numbers[1]
    var values = numbers[2]

    var tmp = [];
    for (var i = 0; i < rows.length; i++) {
        tmp[i] = [rows[i], columns[i], values[i]]
    }
    tmp.sort(function (a, b) {
       if (a[2] > b[2])
          return 1;
       if (a[2] < b[2])
          return -1;
       return 0;
    })
    for (var i = 0; i < tmp.length; i++) {
        Pacioli.set(result, tmp[i][0], tmp[i][1], i+1)
    }
    return result
}

Pacioli.glbl_base_mapnz = function (fun, x) { 
    var result = Pacioli.zeroNumbers(x.nrRows, x.nrColumns)
    var numbers = Pacioli.getCOONumbers(x)
    var rows = numbers[0]
    var columns = numbers[1]
    var values = numbers[2]

    for (var i = 0; i < rows.length; i++) {
        Pacioli.set(result, rows[i], columns[i], Pacioli.getNumber(fun.call(this, Pacioli.tagNumbers([[values[i]]], 1, 1, 0)), 0, 0))
    }
    return result
}

Pacioli.glbl_base_zip = function (x,y) {
    var list = new Array(Math.min(x.length, y.length));
    for (var i = 0; i < list.length; i++) {
        list[i] = [x[i], y[i]];
    }
    return Pacioli.tagKind(list, "list");
}

Pacioli.glbl_base_add_mut = function (list,item) {
    list.push(item);
    return list;
}

Pacioli.glbl_base_append = function (x,y) {
    return Pacioli.tagKind(x.concat(y), "list")
}

Pacioli.glbl_base_reverse = function (x) {
    return Pacioli.tagKind(x.slice(0).reverse(), "list");
}

Pacioli.glbl_base_tail = function (x) {
    var array = new Array(x.length-1);
    for (var i = 0; i < array.length; i++) {
        array[i] = x[i+1];
    }
    return Pacioli.tagKind(array, "list");
}

Pacioli.glbl_base_singleton_list = function (x) {
    return Pacioli.tagKind([x], "list");
}

Pacioli.glbl_base_nth = function (x,y) {
    return y[Pacioli.getNumber(x, 0, 0)];
}

Pacioli.b_glbl_base_nth = function (x,y) {
    return y[Pacioli.getNumber(x.value, 0, 0)];
}

Pacioli.glbl_base_naturals = function (num) {
    var n = Pacioli.getNumber(num, 0, 0)
    var list = new Array(n);
    for (var i = 0; i < n; i++) {
        list[i] = Pacioli.initialNumbers(1, 1, [[0, 0, i]]);
    }
    return Pacioli.tagKind(list, "list");
}

Pacioli.b_glbl_base_naturals = function (num) {
    var n = Pacioli.getNumber(num.value, 0, 0)
    var list = new Array(n);
    for (var i = 0; i < n; i++) {
        list[i] = Pacioli.num(i);
    }
    return Pacioli.tagKind(list, "list");
}

Pacioli.glbl_base_loop_list = function (init, fun, list) {
    var accu = init;
    for (var i = 0; i < list.length; i++) {
        accu = Pacioli.glbl_base_apply(fun, [accu, list[i]]);
    }
    return accu;
}

Pacioli.glbl_base_list_size = function (x) {
    return Pacioli.initialNumbers(1, 1, [[0, 0, x.length]]);
}

Pacioli.b_glbl_base_list_size = function (x) {
    return Pacioli.num(x.length);
}

Pacioli.glbl_base_head = function (x) {
    return x[0];
}

Pacioli.glbl_base_fold_list = function (fun, list) {
    if (list.length == 0) {
        throw new Error("Cannot fold an empty list")
    }
    var accu = list[0];
    for (var i = 1; i < list.length; i++) {
        accu = Pacioli.glbl_base_apply(fun, [accu, list[i]]);
    }
    return accu;
}

Pacioli.glbl_base_sort_list = function (list, fun) {
    //return list;
    return Pacioli.tagKind(list.slice(0).sort(function (a, b) {
            if (Pacioli.glbl_base_apply(fun, [a, b]))
                return 1;
            if (Pacioli.glbl_base_apply(fun, [b, a]))
                return -1;
            return 0;
        }),
        "list");
}

Pacioli.glbl_base_cons = function (item,list) {
    return Pacioli.glbl_base_append(Pacioli.glbl_base_singleton_list(item), list);
}

Pacioli.glbl_base_empty_list = function () {
   return Pacioli.tagKind([], "list");
}


Pacioli.glbl_shells_csg_polygon = function (vectors) {
    var vertices = vectors.map(function (x) {
        var v = Pacioli.getFullNumbers(x)
        return new CSG.Vertex(v, [0,1,0])
    })
    console.log(vertices)
    return Pacioli.tagKind(new CSG.Polygon(vertices), "csg");
}

Pacioli.glbl_shells_csg_mesh = function (polygons) {
    console.log(polygons)
   return Pacioli.tagKind(CSG.fromPolygons(polygons), "csg");
}

Pacioli.glbl_shells_csg_sphere = function (radius, slices, stacks) {
   return Pacioli.tagKind(CSG.sphere({ radius: Pacioli.getNumber(radius, 0, 0) , slices: Pacioli.getNumber(slices, 0, 0), stacks: Pacioli.getNumber(stacks, 0, 0)}), "csg");
}

Pacioli.glbl_shells_csg_cube = function (radius) { 
   return Pacioli.tagKind(CSG.cube({ radius: Pacioli.getNumber(radius, 0, 0) }), "csg");
}

Pacioli.glbl_shells_csg_subtract = function (x, y) {
   return Pacioli.tagKind(x.subtract(y), "csg");
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
        margin: {left: 60, top: 20, right: 10, bottom: 30},
        unit: null,
        label: "",
        xlabel: "",
        norm: null,
        ymin: null,
        ymax: null,
        xticks: 5,
        yticks: 5,
        rotate: false,
        smooth: false
    }

    this.options = Pacioli.copyOptions(options, defaultOptions)
}

Pacioli.LineChart.prototype.draw = function () {

    try {

        // Transform the data to a usable format
        var unit = this.options.unit || Pacioli.dataUnit(this.data);
        var data = Pacioli.transformData(this.data, unit);

        // Make the parent node empty
        var parent = this.parent
        while (parent.firstChild) {
            parent.removeChild(parent.firstChild);
        }
    
        // Define dimensions of graph
        var m = this.options.margin;
        var w = this.options.width - m.left - m.right;
        var h = this.options.height - m.top - m.bottom;
    
        // Add an SVG element with the desired dimensions and margin.
        var graph = d3.select(this.parent)
                      .append("svg:svg")
                      .attr("width", w + m.left + m.right)
                      .attr("height", h + m.top + m.bottom)
                      .attr("class", "chart")
                      .append("svg:g")
                      .attr("width", w)
                      .attr("height", h)
                      .attr("transform", "translate(" + m.left + "," + m.top + ")");
    
        // Determine data ranges
        //var xScale = d3.scale.linear().domain([0, data.values.length]).range([0, w]);
        var xScale = d3.scale.ordinal()
                             //.rangeRoundBands([0, w], .1)
                             .rangePoints([0, w], .1)
                             .domain(data.labels);
        var yMin = this.options.ymin ? this.options.ymin : d3.min(data.values);
        var yMax = this.options.ymax ? this.options.ymax : d3.max(data.values);
        var yScale = d3.scale.linear()
                             .domain([yMin, yMax])
                             .range([h, 0]);
    
        // Create a line function that converts the data into x and y points
        var line = d3.svg.line()
                     .x(function(d,i) { return xScale(i); })
                     .y(function(d) { return yScale(d); });
        if (this.options.smooth) {
            line.interpolate("basis");
        }
    
        // Create the x axis
        var mod = this.options.xticks ? Math.ceil(data.values.length / this.options.xticks) : 1
        var xAxis = d3.svg.axis().scale(xScale)
                                 .orient("bottom")
                                 .tickSize(-h)
                                 .tickValues(xScale.domain().filter(function(d, i) { return !(i % mod); }))
        var xElt = graph.append("svg:g")
             .attr("class", "x axis")
             .attr("transform", "translate(0," + h + ")")
             .call(xAxis)
        if (this.options.rotate) {
             xElt.selectAll("text")	
            .style("text-anchor", "end")
            .attr("transform","rotate(-45)")
        } else {
            xElt.selectAll("text")	
                .attr("transform","translate(0, 5)")
        }

        xElt.append("text")
            .attr("x", w)
            .attr("y", 20)
            .attr("dy", "0.71em")
            .style("text-anchor", "end")
            .text(this.options.xlabel);

        // create left yAxis
        var yAxisLeft = d3.svg.axis()
                              .scale(yScale)
                              .ticks(this.options.yticks)
                              .orient("left");
        graph.append("svg:g")
             .attr("class", "y axis axisLeft")
             .attr("transform", "translate(0,0)")
             .call(yAxisLeft)
             .append("text")
             .attr("x", -30)
             .attr("y", -10)
             .style("text-anchor", "begin")
             .text(this.options.label + " [" + unit.symbolized().toText() + "]");
    
        // Add a norm line if requested
        var norm = this.options.norm;
        if (norm) {
            var normline = d3.svg.line().x(function(d,i) { return xScale(i); })
                                        .y(function(d) { return yScale(norm); });
            graph.append("svg:path")
                 .attr("d", normline(data.values))
                 .attr("class", "")
                 .attr("stroke", "green");
        }

        // Add lines AFTER the axes above so that the line is above the tick-lines
        graph.append("svg:path")
             .attr("d", line(data.values))
             .attr("class", "data");
    
    } catch (err) {
        Pacioli.displayChartError(this.parent, "While drawing line chart '" + this.options.label + "':", err);
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
        radius: 100,
        left: 10,
        top: 10,
        right: 10,
        bottom: 10,
        unit: null,
        label: "",
        labelOffset: 0.5,
        decimals: 1
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
        var uom = unit.symbolized().toText();
        var decimals = this.options.decimals;
        for (var i = 0; i < numbers.nrRows; i++) {
            var factor = shape.unitAt(i, 0).conversionFactor(unit)
            var num = Pacioli.getNumber(numbers, i, 0) * factor;
            if (num != 0) {
            data.push({
                number: num,
                label: shape.rowCoordinates(i).shortText()
//                label: shape.rowCoordinates(i).shortText() + ' ' + num.toFixed(decimals) + (uom === "1" ? '' : ' ' + uom)
            })
            }
        }

        var width = this.options.width;
        var height = this.options.height;
        //var radius = Math.min(width, height) / 2
        var radius = this.options.radius;

        var svg = d3.select(this.parent).append("svg");
        svg.attr("class", "pacioli-pie-chart");
        svg.attr("width", width);
        svg.attr("height", height);
//        svg.attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

        svg = svg.append("g");

        if (data.length === 0) {
            svg.append("text")
//               .attr("dy", ".35em")
               .attr('text-anchor', 'middle')
               .text("No data available");
        }

        svg.append("g")
                .attr("class", "slices");
        svg.append("g")
                .attr("class", "labels");
        svg.append("g")
                .attr("class", "lines");

        var pie = d3.layout.pie()
                .sort(null)
                .value(function(d) {
                        return d.number;
                });

        var arc = d3.svg.arc()
                .outerRadius(radius * 0.8)
                .innerRadius(radius * 0.4);

        var outerArc = d3.svg.arc()
                .innerRadius(radius * 0.9)
                .outerRadius(radius * 0.9);


        svg.attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

        var key = function(d){ return d.data.label; };

        var color = d3.scale.ordinal()
                .domain(["Lorem ipsum", "dolor sit", "amet", "consectetur", "adipisicing", "elit", "sed", "do", "eiusmod", "tempor", "incididunt"])
                .range(["#98abc5", "#8a89a6", "#7b6888", "#6b486b", "#a05d56", "#d0743c", "#ff8c00"]);

        function randomData (){
                var labels = color.domain();
                return labels.map(function(label){
                        return { label: label, number: Math.random() }
                });
        }

        function change(data) {

                /* ------- PIE SLICES -------*/
                var slice = svg.select(".slices").selectAll("path.slice")
                        .data(pie(data), key);

                slice.enter()
                        .insert("path")
                        .style("fill", function(d) { return color(d.data.label); })
                        .attr("class", "slice");

                slice		
                        .transition().duration(1000)
                        .attrTween("d", function(d) {
                                this._current = this._current || d;
                                var interpolate = d3.interpolate(this._current, d);
                                this._current = interpolate(0);
                                return function(t) {
                                        return arc(interpolate(t));
                                };
                        })

                slice.exit()
                        .remove();

                /* ------- TEXT LABELS -------*/

                var text = svg.select(".labels").selectAll("text")
                        .data(pie(data), key);

                text.enter()
                        .append("text")
                        .attr("dy", ".35em")
                        .text(function(d) {
                                return d.data.label;
                        });

                function midAngle(d){
                        return d.startAngle + (d.endAngle - d.startAngle)/2;
                }

                text.transition().duration(1000)
                        .attrTween("transform", function(d) {
                                this._current = this._current || d;
                                var interpolate = d3.interpolate(this._current, d);
                                this._current = interpolate(0);
                                return function(t) {
                                        var d2 = interpolate(t);
                                        var pos = outerArc.centroid(d2);
                                        var pos2 = outerArc.centroid(d2);
                                        pos2[0] = radius * (midAngle(d2) < Math.PI ? 1 : -1);
                                        pos2[1] = (1 + 0.2 * Math.abs(Math.cos(midAngle(d2)))) * pos2[1];
                                        return "translate("+ pos2 +")";
                                };
                        })
                        .styleTween("text-anchor", function(d){
                                this._current = this._current || d;
                                var interpolate = d3.interpolate(this._current, d);
                                this._current = interpolate(0);
                                return function(t) {
                                        var d2 = interpolate(t);
                                        return midAngle(d2) < Math.PI ? "start":"end";
                                };
                        });

                text.exit()
                        .remove();

                /* ------- SLICE TO TEXT POLYLINES -------*/

                var polyline = svg.select(".lines").selectAll("polyline")
                        .data(pie(data), key);

                polyline.enter()
                        .append("polyline");

                polyline.transition().duration(1000)
                        .attrTween("points", function(d){
                                this._current = this._current || d;
                                var interpolate = d3.interpolate(this._current, d);
                                this._current = interpolate(0);
                                return function(t) {
                                        var d2 = interpolate(t);
                                        var pos = outerArc.centroid(d2);
                                        var pos2 = outerArc.centroid(d2);
                                        //pos2[0] = radius * 0.95 * (midAngle(d2) < Math.PI ? 1 : -1);
                                        pos2[0] = radius * 0.95 * (midAngle(d2) < Math.PI ? 1 : -1);
                                        //pos2[1] = (1 - Math.sin(midAngle(d2))) * pos2[1];
                                        pos[1] = (1 + 0.2 * Math.abs(Math.cos(midAngle(d2)))) * pos[1];
                                        pos2[1] = (1 + 0.2 * Math.abs(Math.cos(midAngle(d2)))) * pos2[1];
                                        return [arc.centroid(d2), pos, pos2];
                                };			
                        });

                polyline.exit()
                        .remove();
        };

  //console.log('chart', data.filter(function (x) {return x.number != 0; }));

        change(data.filter(function (x) {return x.number != 0; }));
//        change(randomData());

    } catch (err) {
        Pacioli.displayChartError(this.parent, "While drawing pie chart '" + this.options.label + "':", err)
    }

    return this
};


Pacioli.PieChart.prototype.drawOLD = function () {

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
        var decimals = this.options.decimals;
        for (var i = 0; i < numbers.nrRows; i++) {
            var factor = shape.unitAt(i, 0).conversionFactor(unit)
            data.push({
                number: Pacioli.getNumber(numbers, i, 0) * factor,
                label: shape.rowCoordinates(i).shortText()
            })
        }
            
        var width = this.options.width - this.options.left - this.options.right
        var height = this.options.height - this.options.top - this.options.bottom
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
                    .attr("width", width + this.options.left + this.options.right)
                    .attr("height", height + this.options.top + this.options.bottom)
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
         .text(function(d) {
             if (0 < d.data.number) {
                 uom = unit.symbolized().toText();
                 return d.data.label + ' = ' + d.data.number.toFixed(decimals) + (uom === "1" ? '' : ' ' + uom);
             } else {
                 return "";
             }
             //return 0 < d.data.number ? d.data.label + ' = ' + d.data.number.toFixed(this.options.decimals) + ' ' + unit.symbolized().toText() : ""
         });    
    } catch (err) {
        Pacioli.displayChartError(this.parent, "While drawing pie chart '" + this.options.label + "':", err)
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
        left: 0,
        top: 0,
        right: 0,
        bottom: 0,
        unit: null,
        ymin: null,
        ymax: null,
        label: "",
        onclick: function (data) {
            alert("Values for " + data.label + " is " + data.number.toFixed(2));
        }
    }

    this.options = Pacioli.copyOptions(options, defaultOptions)
}

Pacioli.BarChart.prototype.draw = function () {

    try {

        var shape = this.data.type.param;
        var numbers = this.data.value;
        var parent = this.parent;
        var options = this.options;

        // Determine the value's unit
        var unit = options.unit || shape.unitAt(0, 0)
        var yUnitText = unit.symbolized().toText();

        // Convert the Pacioli vector to an array with labels (x
        // dimension) and numbers (y dimension)
        var data = []
        for (var i = 0; i < numbers.nrRows; i++) {
            var factor = shape.unitAt(i, 0).conversionFactor(unit)
            data.push({
                number: Pacioli.getNumber(numbers, i, 0) * factor,
                label: shape.rowCoordinates(i).shortText()
            })
        }

        // Determine the min and max data values
        var yMin = options.ymin != null ? options.ymin : d3.min(data, function(d) { return d.number; });
        var yMax = options.ymax != null ? options.ymax : d3.max(data, function(d) { return d.number; });

        // todo: show this text on x axis
        var xSet = shape.rowName() //vector.shape.rowSets.map(function (x) {return x.name})
      
        // Make the parent node empty
        while (parent.firstChild) {
            parent.removeChild(parent.firstChild);
        }

        // Add an svg element
        var svg = d3.select(parent).append("svg");
        svg.attr("width", options.width)
           .attr("height", options.height);
  
        // Create a margin object following the D3 convention
        var margin = {
            left:   40 + options.left, 
            top:    20 + options.top, 
            right:  10 + options.right, 
            bottom: 50 + options.bottom
        };
        var width = options.width - margin.left - margin.right;
        var height = options.height - margin.top - margin.bottom;
        
        // Create the x and y scales 
        var x = d3.scale.ordinal();
        //x.rangePoints([0, width], .1)
        x.rangeRoundBands([0, width], .1)
         .domain(data.map(function(d) { return d.label; }));

        var y = d3.scale.linear();
        y.range([height, 0])
         .domain([yMin, yMax]);

        // Add an inner group according to the margins
        var inner = svg.append("g")
        inner.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        // Create an x and y axis for the inner group
        var xAxis = d3.svg.axis();
        xAxis.scale(x)
             .orient("bottom");
        
        var yAxis = d3.svg.axis();
        yAxis.scale(y)
             .orient("left")
             .ticks(5, "%");
    
        // Add the x axis to the inner group
        inner.append("g")
           .attr("class", "x axis")
           .attr("transform", "translate(0," + height + ")")
           .call(xAxis)
           .selectAll("text")  
           .style("text-anchor", "end")
           .attr("dx", "-.8em")
           .attr("dy", ".15em")
           .attr("transform", function(d) { return "rotate(-65)" });

        // Add the y axis to the inner group
        inner.append("g")
           .attr("class", "y axis")
           .call(yAxis)

        // Add the bars the inner group
        inner.selectAll(".bar")
           .data(data)
           .enter().append("rect")
           .attr("class", "bar")
           .attr("x", function(d) { return x(d.label); })
           .attr("width", x.rangeBand())
           .attr("y", function(d) { return Math.min(y(0), y(d.number)); })
           .attr("height", function(d) { return Math.abs(y(0) - y(d.number)); })
           .on("click", function (d, i) {
                            var dat = {
                                description: this.options.label,
                                number: new Pacioli.DimensionedNumber(d.number, unit),
                                label: d.label,
                                index: xSet
                            };
                            this.options.onclick(dat);
                        }.bind(this))

        // Add the y axis label to the inner group
        inner.append("text")
           .attr("dx", "0.5em")
           .style("text-anchor", "start")
           .text(this.options.label + (yUnitText === "1" ? "" : " [" + yUnitText + "]"));

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
        upper: null,
        onclick: function (data) {
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
            div.appendChild(Pacioli.DOM(data.value))
            div.style.overflow = "auto"
        }
    }

    this.options = Pacioli.copyOptions(options, defaultOptions)
}

Pacioli.Histogram.prototype.draw = function () {

    try {
        console.log('hist', this.options);
        var unit = this.options.unit || Pacioli.dataUnit(this.data)
        var data = Pacioli.transformData(this.data, unit)
        console.log('hist this.data', this.data);
        console.log('hist data', data);
        // Create an array with the bin tresholds and generate a histogram layout from it for the data
        var lower = (typeof this.options.lower === "number") ? this.options.lower : data.min; //d3.min(data)
        var upper = (typeof this.options.upper === "number") ? this.options.upper : data.max; //d3.max(data)
        var binScale = d3.scale.linear().domain([0, this.options.bins]).range([lower, upper]);
        var binArray = d3.range(this.options.bins + 1).map(binScale);
        var layout = d3.layout.histogram().bins(binArray)(data.values);   
console.log('hist lower', lower);
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
        var yAxis = d3.svg.axis().scale(y).orient("left").ticks(5, "%");
        
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
        var label = this.options.label || this.data.type.param.rowName() //vector.shape.rowSets.map(function (x) {return x.name})
        svg.append("g")
           .attr("class", "x axis")
           .attr("transform", "translate(0," + height + ")")
           .call(xAxis)
           .append("text")
           .attr("x", width)
           .attr("y", 26)
           .attr("dy", ".71em")
           .style("text-anchor", "end")
           .text(label + " [" + unit.symbolized().toText() + "]");

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
           .on("click", function (d, i) {this.onClick(d.x, d.x + d.dx, data.max, d.y)}.bind(this));

    } catch (err) {
        Pacioli.displayChartError(this.parent, "While drawing histogram '" + this.options.label + "':", err)
    }

    return this

};

Pacioli.Histogram.prototype.onClick = function (lower, upper, max, frequency) {
    console.log('onclick', lower, upper);
    var result
    var unit = this.options.unit || Pacioli.dataUnit(this.data)
    var unitShape = new Pacioli.Shape(unit);

    if (this.data.type.kind === "matrix") {

        // Find the displayed vector and its units
        var vector = this.data.value
        var shape = this.data.type.param
    
        // Filter the chart's vector for the given bounds
        var filtered = Pacioli.zeroNumbers(vector.nrRows, vector.nrColumns)
        for (var i = 0; i < vector.nrRows; i++) {
            var num = Pacioli.getNumber(vector, i, 0) * shape.unitAt(i, 0).conversionFactor(unit)
            if (lower <= num && (num < upper || (num === max && upper === max))) {
                 //Pacioli.set(filtered, i, 0, Pacioli.getNumber(vector, i, 0))
                 Pacioli.set(filtered, i, 0, num)
            }
        }

        // Create a copy of the original object
        //result = new Pacioli.Box(this.data.type, filtered)
        result = new Pacioli.Box(new Pacioli.Type("matrix", shape.dimensionless().scale(unitShape)), filtered)
        

    } else if (this.data.type.kind === "list") {

        // Todo: convert to chart unit of measurement. See vector case above.
        var factor = this.data.type.param.param.multiplier.conversionFactor(unit)
        var filtered = []
        for (var i = 0; i < this.data.value.length; i++) {
            var num = Pacioli.getNumber(this.data.value[i], 0, 0) * factor
            if (lower <= num && (num < upper || (num === max && upper === max))) {
                 filtered.push(this.data.value[i])
            }
        }
        filtered.kind = this.data.value.kind
        result = new Pacioli.Box(this.data.type, filtered)
        //console.log(this.data)
        //console.log(result)
    }

    // Show the filtered vector in a popup window
    this.options.onclick({
        value: result,
        frequency: new Pacioli.DimensionedNumber(frequency),
        lower: new Pacioli.DimensionedNumber(lower, unit),
        upper: new Pacioli.DimensionedNumber(upper, unit)
    });

}


// -----------------------------------------------------------------------------
// ScatterPlot
// -----------------------------------------------------------------------------

Pacioli.ScatterPlot = function (parent, dataX, dataY, options) {

    this.parent = parent
    this.dataX = dataX 
    this.dataY = dataY 

    var defaultOptions = {
        width: 640,
        height: 360,
        margin: {left: 40, top: 20, right: 20, bottom: 50},
        xunit: null,
        yunit: null,
        lowerX: null,
        lowerXa: null,
        upperX: null,
        lowerY: null,
        upperY: null,
        labelX: "",
        labelY: "",
        radius: 2.5,
        trendline: false,
        onclick: function (data) {
                     alert("Values at coordinates " + data.coordinates.names + " of index sets (" +
                           data.coordinates.indexSets.map(function (x) {return x.name}) + ") are \n\n" +
                           data.xlabel + " = " + data.xnumber.toFixed(2) + "\n" +
                           data.ylabel + " = " + data.ynumber.toFixed(2));
                 }
    }

    this.options = Pacioli.copyOptions(options, defaultOptions)
}

Pacioli.ScatterPlot.prototype.draw = function () {

    try {

        var unitX = this.options.xunit || Pacioli.dataUnit(this.dataX)
        var unitY = this.options.yunit || Pacioli.dataUnit(this.dataY)

        var data = Pacioli.mergeData(this.dataX, unitX, this.dataY, unitY)
        var values = data.values

        // Create an array with the bin tresholds and generate a scatterplot layout from it for the data
        var lowerX = this.options.lowerX === null ? data.minX : this.options.lowerX
        var upperX = this.options.upperX === null ? data.maxX : this.options.upperX
        var lowerY = this.options.lowerY === null ? data.minY : this.options.lowerY
        var upperY = this.options.upperY === null ? data.maxY : this.options.upperY
//        var upperX = this.options.upperX || data.maxX // dataX.max //d3.max(data)
//        var lowerY = this.options.lowerY || data.minY // dataY.min //d3.min(data)
//        var upperY = this.options.upperY || data.maxY // dataY.max //d3.max(data)
// alert(this.options.lowerXa === null);

        // Determine the drawing dimensions
        var margin = this.options.margin
        var width = this.options.width - margin.left - margin.right
        var height = this.options.height - margin.top - margin.bottom

        // Create x and y scales mapping the scatterplot layout to the drawing dimensions
        var x = d3.scale.linear().domain([lowerX, upperX]).range([0, width]);
        var y = d3.scale.linear()
                  .domain([lowerY, upperY])
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
        var labelX = this.options.labelX || this.dataX.type.param.rowName()
        svg.append("g")
           .attr("class", "x axis")
           .attr("transform", "translate(0," + height + ")")
           .call(xAxis)
           .append("text")
           .attr("x", width)
           .attr("y", 26)
           .attr("dy", ".71em")
           .style("text-anchor", "end")
           .text(labelX + " [" + unitX.symbolized().toText() + "] (n=" + values.length + ")");

        // Add the y axis
        var labelY = this.options.labelY || this.dataY.type.param.rowName()
        svg.append("g")
           .attr("class", "y axis")
           .call(yAxis)
           .append("text")
           .attr("x", 2)
           .attr("dy", "-.71em")
           //.style("text-anchor", "centers")
           .text(labelY + " [" + unitY.symbolized().toText() + "]");
           //.text("Frequency");

        var color = d3.scale.category20();     //builtin range of colors

        // Add dots for the data
        svg.selectAll(".dot")
           .data(values)
           .enter().append("circle")
           .attr("class", "dot")
           .attr("r", this.options.radius)
           .attr("cx", function(d) { return x(d.x); })
           .attr("cy", function(d) { return y(d.y); })
           //.attr("cy", function(d) { console.log( d.x + ' - ' + d.y); return d.y; })
           //.attr("cy", function(d) { console.log( d.x + ' - ' + d.y); return y(d.y); })
           //.attr("cy", function(d) { console.log( x(d.x) + '-' + y(d.y)); return y(d.y); })
           //.attr("cy", function(d) { return y(d.y); })
           .style("fill", function(d) { return color(d.species); })
           .on("click", function (d, i) {
                            var dat = {
                                coordinates: data.values[i].coordinates,
                                xnumber: new Pacioli.DimensionedNumber(data.values[i].x, unitX),
                                ynumber: new Pacioli.DimensionedNumber(data.values[i].y, unitY),
                                xlabel: labelX,
                                ylabel: labelY
                            };
                            this.options.onclick(dat);
                        }.bind(this));

//  var legend = svg.selectAll(".legend")
//      .data(color.domain())
//    .enter().append("g")
//      .attr("class", "legend")
//      .attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });

//  legend.append("rect")
//      .attr("x", width - 18)
//      .attr("width", 18)
//      .attr("height", 18)
//      .style("fill", color);
//
//  legend.append("text")
//      .attr("x", width - 24)
//      .attr("y", 9)
//      .attr("dy", ".35em")
//      .style("text-anchor", "end")
//      .text(function(d) { return d; });

        if (this.options.trendline) {

            var xs = []
            var ys = []
            var max, min
            for (var i = 0; i < values.length; i++) {
                var xi = values[i].x
                var yi = values[i].y
                xs.push(xi)
                ys.push(yi)
                if (max === undefined || max < xi) max = xi
                if (min === undefined || xi < min) min = xi

            }
            var lr = Pacioli.linearRegression(xs, ys)

            var x1 = min
            var y1 = x1*lr.slope + lr.intercept
            var x2 = max
            var y2 = x2*lr.slope + lr.intercept

            svg.append("line")
               .attr("x1",x(x1))
               .attr("y1",y(y1))
               .attr("x2",x(x2))
               .attr("y2",y(y2))
               .attr("stroke", "#ccc")
	       .attr("stroke-width", 1);
        }

    } catch (err) {
        Pacioli.displayChartError(this.parent, "While drawing scatterplot '" + this.options.labelX + "':", err)
    }

    return this

    };

// from http://trentrichardson.com/2010/04/06/compute-linear-regressions-in-javascript/
Pacioli.linearRegression = function (x,y){
		var lr = {};
		var n = y.length;
		var sum_x = 0;
		var sum_y = 0;
		var sum_xy = 0;
		var sum_xx = 0;
		var sum_yy = 0;
		
		for (var i = 0; i < y.length; i++) {
			
			sum_x += x[i];
			sum_y += y[i];
			sum_xy += (x[i]*y[i]);
			sum_xx += (x[i]*x[i]);
			sum_yy += (y[i]*y[i]);
		} 
		
		lr['slope'] = (n * sum_xy - sum_x * sum_y) / (n*sum_xx - sum_x * sum_x);
		lr['intercept'] = (sum_y - lr.slope * sum_x)/n;
		lr['r2'] = Math.pow((n*sum_xy - sum_x*sum_y)/Math.sqrt((n*sum_xx-sum_x*sum_x)*(n*sum_yy-sum_y*sum_y)),2);
		
		return lr;
}

// -----------------------------------------------------------------------------
// Word Cloud
// -----------------------------------------------------------------------------

Pacioli.WordCloud = function (parent, data, options) {

    this.parent = parent
    this.data = data

    var defaultOptions = {
        width: 640,
        height: 360,
        margin: {left: 40, top: 20, right: 20, bottom: 50},
        xunit: null,
        yunit: null,
        lowerX: null,
        lowerXa: null,
        upperX: null,
        lowerY: null,
        upperY: null,
        labelX: "",
        labelY: "",
        radius: 2.5,
        trendline: false,
        onclick: function (data) {
                     alert("Values at coordinates " + data.coordinates.names + " of index sets (" +
                           data.coordinates.indexSets.map(function (x) {return x.name}) + ") are \n\n" +
                           data.xlabel + " = " + data.xnumber.toFixed(2) + "\n" +
                           data.ylabel + " = " + data.ynumber.toFixed(2));
                 }
    }

    this.options = Pacioli.copyOptions(options, defaultOptions)
}

Pacioli.WordCloud.prototype.draw = function () {

    try {

      console.log("drawing wordcloud option", this.options);
      console.log("drawing wordcloud data", this.data);

      var words = this.data.map( function (d) {
          return {text: d[0],
                  size: d[1]}
      })

      console.log("words", words);

        // Determine the drawing dimensions
        var margin = this.options.margin
        var width = this.options.width - margin.left - margin.right
        var height = this.options.height - margin.top - margin.bottom

       var w = width + margin.left + margin.right;
       var h = height + margin.top + margin.bottom;
       
        // Create an svg element under the parent        
        var svg = d3.select(this.parent).append("svg")
                    .attr("width", w)
                    .attr("height", h)
                    .append("g")
                    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");


        var layout = d3.layout.cloud()
            .size([w, h])
            .words(

            /*[
              "Hello", "world", "normally", "you", "want", "more", "words",
              "than", "this"].map(function(d) {
              return {text: d, size: 10 + Math.random() * 90, test: "haha"};
            })*/
             words)
            .padding(5)
            .rotate(function() { return ~~(Math.random() * 2) * 90; })
            .font("Impact")
            .fontSize(function(d) { return d.size; })
            .on("end", draw);

        layout.start();

        function draw(words) {
//          d3.select("body").append("svg")
//              .attr("width", layout.size()[0])
//              .attr("height", layout.size()[1])

            svg.append("g")
              .attr("transform", "translate(" + layout.size()[0] / 2 + "," + layout.size()[1] / 2 + ")")
            .selectAll("text")
              .data(words)
            .enter().append("text")
              .style("font-size", function(d) { return d.size + "px"; })
              .style("font-family", "Impact")
              .attr("text-anchor", "middle")
              .attr("transform", function(d) {
                return "translate(" + [d.x, d.y] + ")rotate(" + d.rotate + ")";
              })
              .text(function(d) { return d.text; });
        }

    } catch (err) {
        Pacioli.displayChartError(this.parent, "While drawing word cloud '" + this.options.labelX + "':", err)
    }

    return this

    };

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

 if (false) {
    var nums = Pacioli.getCOONumbers(numbers)
    var rows = nums[0]
    var columns = nums[1]
    var vals = nums[2]
    for (var i = 0; i < rows.length; i++) {
            var factor = shape.unitAt(rows[i], 0).conversionFactor(unit)
            var value = vals[i] * factor
            values.push(value)
            labels.push(shape.rowCoordinates(rows[i]).shortText())
            if (max === undefined || max < value) max = value
            if (min === undefined || value < min) min = value
    }
    } else {

        for (var i = 0; i < numbers.nrRows; i++) {
            var factor = shape.unitAt(i, 0).conversionFactor(unit)
            var value = Pacioli.getNumber(numbers, i, 0) * factor
            if (false || value !== 0) { 
                values.push(value)
                labels.push(shape.rowCoordinates(i).shortText())
            }
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
}


Pacioli.mergeData = function (dataX, unitX, dataY, unitY) {

    var values = []
    var labels = [] // todo X and Y
    var minX, maxX, minY, maxY

    switch (dataX.type.kind) {
    case "list":
        throw "todo"
        break;
    case "matrix":
        var numbersX = dataX.value
        var numbersY = dataY.value
        var shapeX = dataX.type.param
        var shapeY = dataY.type.param

        var numsX = Pacioli.getCOONumbers(numbersX)
        var rowsX = numsX[0]
        var columnsX = numsX[1]
        var valsX = numsX[2]
    
        var numsY = Pacioli.getCOONumbers(numbersY)
        var rowsY = numsY[0]
        var columnsY = numsY[1]
        var valsY = numsY[2]

        var m = rowsX.length
        var n = rowsY.length
        var ptrX = 0
        var ptrY = 0

        while (ptrX < m && ptrY < n) {
            rowX = rowsX[ptrX]
            rowY = rowsY[ptrY]
            if (rowX < rowY) {
                var valueX = valsX[ptrX] * shapeX.unitAt(rowX, 0).conversionFactor(unitX)
                if (valueX !== 0) {
                values.push({x: valueX, y: 0, coordinates: shapeX.rowCoordinates(rowX)})
                if (minX === undefined || valueX < minX) minX = valueX
                if (maxX === undefined || valueX > maxX) maxX = valueX
                }
                ptrX++
            } else if (rowX > rowY) {
                var valueY = valsY[ptrY] * shapeY.unitAt(rowY, 0).conversionFactor(unitY)
                if (valueY !== 0) {
                values.push({x: 0, y: valueY, coordinates: shapeY.rowCoordinates(rowY)})
                if (minY === undefined || valueY < minY) minY = valueY
                if (maxY === undefined || valueY > maxY) maxY = valueY
                }
                ptrY++
            } else {
                var valueX = valsX[ptrX] * shapeX.unitAt(rowX, 0).conversionFactor(unitX)
                var valueY = valsY[ptrY] * shapeY.unitAt(rowY, 0).conversionFactor(unitY)
                if (valueX !== 0 && valueY !== 0) {
                values.push({x: valueX, y: valueY, coordinates: shapeX.rowCoordinates(rowX)})
                if (minX === undefined || valueX < minX) minX = valueX
                if (maxX === undefined || valueX > maxX) maxX = valueX
                if (minY === undefined || valueY < minY) minY = valueY
                if (maxY === undefined || valueY > maxY) maxY = valueY
                }
                ptrX++
                ptrY++
            }
        }
        while (ptrX < m) {
            rowX = rowsX[ptrX]
            var valueX = valsX[ptrX] * shapeX.unitAt(rowX, 0).conversionFactor(unitX)
            if (valueX !== 0) {
            values.push({x: valueX, y: 0, coordinates: shapeX.rowCoordinates(rowX)})
            if (minX === undefined || valueX < minX) minX = valueX
            if (maxX === undefined || valueX > maxX) maxX = valueX
            }
            ptrX++
        }
        while (ptrY < n) {
            rowY = rowsY[ptrY]
            var valueY = valsY[ptrY] * shapeY.unitAt(rowY, 0).conversionFactor(unitY)
            if (valueY !== 0) {
            values.push({x: 0, y: valueY, coordinates: shapeY.rowCoordinates(rowY)})
            if (minY === undefined || valueY < minY) minY = valueY
            if (maxY === undefined || valueY > maxY) maxY = valueY
            }
            ptrY++
        }
        break;
    default:
        throw "exptected a vector or a list of numbers but got a " + data.type.kind
    }
    return {
        values: values,
        labels: labels,
        maxX: maxX,
        minX: minX,
        maxY: maxY,
        minY: minY
    }
}
/* A THREE.js 3D space for Pacioli 
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
        unit: options.unit || this.options.unit || Pacioli.unit()
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
        this.axes = newAxes(this.options.axisSize, this.options.unit.isDimensionless() ? "  " : " (" + this.options.unit.symbolized().toText() + ")");
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
/* Runtime Support for the Pacioli language
 *
 * Copyright (c) 2015 Paul Griffioen
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
// 1. Dimensioned Numbers
//
// A DimensionedNumber pairs a number and a unit
//
// -----------------------------------------------------------------------------

Pacioli.DimensionedNumber = function (factor, unit) {
    this.factor = typeof factor === "number" ? factor : 1;
    this.unit = unit || Pacioli.unit();
}

Pacioli.DimensionedNumber.prototype.equals = function (other) {
    return this.factor === other.factor && this.unit.equals(other.unit);
}

Pacioli.DimensionedNumber.prototype.isDimensionless = function () {
    return this.unit.isDimensionless();
}

Pacioli.DimensionedNumber.prototype.flat = function () {
    var flatUnit = this.unit.flat();
    return new Pacioli.DimensionedNumber(this.factor * flatUnit.factor, flatUnit.unit);
}

Pacioli.DimensionedNumber.prototype.toText = function () {
    var unitText = this.unit.equals(Pacioli.unit()) ? "" : " " + this.unit.symbolized().toText();
    return this.factor + unitText;
}

Pacioli.DimensionedNumber.prototype.toFixed = function (n) {
    var unitText = this.unit.equals(Pacioli.unit()) ? "" : " " + this.unit.symbolized().toText();
    return this.factor.toFixed(n) + unitText;
}

Pacioli.DimensionedNumber.prototype.toDOM = function () {
    var fragment = document.createDocumentFragment()
    fragment.appendChild(document.createTextNode(this.factor))
    fragment.appendChild(document.createTextNode(" "))
    fragment.appendChild(this.unit.toDOM())
    if (this.factor == 1 && !this.isDimensionless()) {
        fragment.removeChild(fragment.firstChild)
        fragment.removeChild(fragment.firstChild)
    } 
    //fragment.normalize()
    return fragment
}

Pacioli.DimensionedNumber.prototype.mult = function (other) {
    return new Pacioli.DimensionedNumber(this.factor * other.factor, this.unit.mult(other.unit));
}

Pacioli.DimensionedNumber.prototype.div = function (other) {
    return new Pacioli.DimensionedNumber(this.factor / other.factor, this.unit.div(other.unit));
}

Pacioli.DimensionedNumber.prototype.reciprocal = function () {
    return new Pacioli.DimensionedNumber(1 / this.factor, this.unit.reciprocal());
}

Pacioli.DimensionedNumber.prototype.expt = function (power) {
    return new Pacioli.DimensionedNumber(Math.pow(this.factor, power), this.unit.expt(power));
}

Pacioli.DimensionedNumber.prototype.map = function (fun) {
    throw "is map on dimensioned numbers used?"
    return new Pacioli.DimensionedNumber(this.factor, this.unit.map(fun));
}

Pacioli.DimensionedNumber.prototype.symbolized = function () {
    throw "is symbolized on dimensioned numbers used?"
    return this.factor + " " + this.unit.symbolized();
}

Pacioli.DimensionedNumber.prototype.conversionFactor = function (to) {
    throw "is conversionFactor on dimensioned numbers used?"
}