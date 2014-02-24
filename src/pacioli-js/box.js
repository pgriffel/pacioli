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
