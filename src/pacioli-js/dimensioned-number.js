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
