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

    var names = this.names
    
    vecBaseItem = function (base, order) {
        var parts = base.split('$')
        if (parts[1] == order) {
            var vec = Pacioli.lookupItem('unitvec_' + parts[0]) 
            var pos = names[order]
            return vec.units[pos] || Pacioli.unit()
        } else {
            return Pacioli.unit()
        }
    }

    var newUnit = Pacioli.unit()
    for (var i = 0; i < this.order() ; i++) {
        newUnit = newUnit.mult(unit.map(function (base) {return vecBaseItem(base, i) }))
    }
    return newUnit;
}
