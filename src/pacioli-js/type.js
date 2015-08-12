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
