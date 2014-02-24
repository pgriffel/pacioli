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
