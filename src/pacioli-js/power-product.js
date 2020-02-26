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
