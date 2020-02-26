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
