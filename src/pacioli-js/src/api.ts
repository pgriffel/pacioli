/* Runtime Support for the Pacioli language
 *
 * Copyright (c) 2023 Paul Griffioen
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

import { DimNum, si, SIBase, SIUnit, UOM, UOMBase } from "uom-ts";
import { Coordinates } from "./values/coordinates";
import { DOM } from "./dom";
import { IndexSet } from "./values/index-set";
import { Matrix } from "./values/matrix";
import { set, tagNumbers } from "./values/numbers";
import { MatrixShape } from "./values/matrix-shape";
import { PacioliUnit, PacioliVector } from "./type";
import { PacioliContext } from "./context";
import { PacioliFunction } from "./values/function";
import { MatrixType, PacioliIndex } from "./types/matrix";
import { PacioliValue } from "./value";
import { boxRawValue, matrixShapeFromType } from "./boxing";
import { SIBaseType, VectorBaseType } from "./types/bases";
import { TypeVar, UnitVar } from "./types/variables";

// -----------------------------------------------------------------------------
// New
// -----------------------------------------------------------------------------

export function createMatrixType(
  multiplier: PacioliUnit,
  rowSets: PacioliIndex,
  rowUnit: PacioliVector,
  columnSets: PacioliIndex,
  columnUnit: PacioliVector
) {
  return new MatrixType(multiplier, rowSets, rowUnit, columnSets, columnUnit);
}

// -----------------------------------------------------------------------------
// Upgrade
// -----------------------------------------------------------------------------

export function value(module: string, name: string) {
  return boxRawValue(
    lookupItem(module + "_" + name),
    lookupItem("u_" + module + "_" + name)
  );
}

// Just a synonym for value
export function fun(module: string, name: string) {
  const type = lookupItem("u_" + module + "_" + name);
  const value = lookupItem(module + "_" + name);
  const box = boxRawValue(value, type);
  if (box instanceof PacioliFunction) {
    return box;
  } else {
    throw new Error(
      `Expected a PacioliFunction when creating fun ${module}_${name} but got ${box}`
    );
  }
}

export function unit(name1: string, name2?: string) {
  return si.getUnit(name2 ? name1 + ":" + name2 : name1);
}

export function unitType(name1: string, name2?: string) {
  return UOM.fromBase(new SIBaseType(name2 ? name1 : "", name2 ?? name1));
}

export function unitVectorType(module: string, type: string, position: number) {
  return UOM.fromBase(new VectorBaseType(module + "_" + type, position));
}

export function unitFromBase<T extends UOMBase>(base: T): UOM<T> {
  return UOM.fromBase(base);
}

export function unitFromVarName(varName: string): PacioliUnit {
  return UOM.fromBase(new UnitVar("_" + varName + "_"));
}

export function typeFromVarName(varName: string): TypeVar {
  return new TypeVar("_" + varName + "_");
}

export function num(num: string | number, unit: SIUnit = UOM.ONE) {
  const shape = MatrixShape.scalar(unit === undefined ? UOM.ONE : unit);
  const numbers = initialNumbers(1, 1, [
    [0, 0, typeof num === "string" ? parseFloat(num) : num],
  ]);
  return new Matrix(shape, numbers);
}

// Pacioli.tuple = function (array) {
//     var uTuple = array.map(function (elt) {return elt.type})
//     var vTuple = array.map(function (elt) {return elt.value})
//     vTuple.kind = 'tuple'
//     return new Pacioli.Box(new Pacioli.Type('tuple', uTuple), vTuple)
// }

export function list(array: any[]): PacioliValue {
  if (array.length === 0) {
    throw new Error("Cannot make empty list (yet)");
  }

  throw new Error("Is Pacioli.list(...) used?");

  // // var uList = array[0].type
  // var vList = array.map(function (elt) {return elt.value})
  // tagKind(vList, 'list')

  // // This is no longer working since Box is removed.
  // //return new Box(new GenericType('List', [uList]), vList)

  // // Copied this from boxRawValue below as tmp hack. TODO: fix this.
  // const values = (value as unknown as Array<RawValue>) // Cast!!!
  // var array = []
  // for (var i = 0; i < values.length; i++) {
  //     //array.push(boxRawValue(values[i], type.items[0]));
  // }
  // return tagKind(array, 'list') // Cast!!!
}

// -----------------------------------------------------------------------------
// 0. Functions used by generated code
// -----------------------------------------------------------------------------

export function makeIndexSet(id: string, name: string, items: string[]) {
  // TODO: wat is de id?
  return IndexSet.fromItems(id, name, items);
}

export function createCoordinates(pairs: string[][]) {
  var names = [];
  var indexSets = [];
  for (var i = 0; i < pairs.length; i++) {
    names[i] = pairs[i][0];
    indexSets[i] = lookupItem(pairs[i][1]);
  }
  var coords = new Coordinates(names, indexSets);
  // added coords for b_Matrix_make_matrix
  return {
    kind: "coordinates",
    position: coords.position(),
    size: coords.size(),
    coords: coords,
  };
}

// Pacioli.scalarShape = function (unit) {
//     var result = new Pacioli.Shape();
//     result.multiplier = unit;
//     return result;
// }

export function zeroNumbers(m: number, n: number) {
  return tagNumbers([], m, n, 1);
}

// No longer needs to export this since oneNumbersFromShape is used.
export function oneNumbers(m: number, n: number) {
  var numbers = tagNumbers([], m, n, 1);
  for (var i = 0; i < m; i++) {
    for (var j = 0; j < n; j++) {
      set(numbers, i, j, 1);
    }
  }
  return numbers;
}

export function oneNumbersFromShape(type: MatrixType) {
  const shape = matrixShapeFromType(type);
  const numbers = oneNumbers(shape.nrRows(), shape.nrColumns());
  numbers.shape = shape;
  return numbers;
}

// Pacioli.oneMatrix = function (shape) {
//     return new Pacioli.Box(new Pacioli.Type("matrix", shape),
//                            Pacioli.oneNumbers(shape.nrRows(), shape.nrColumns()))
// }

// Pacioli.initialMatrix = function (shape, data) {
//     return new Pacioli.Box(new Pacioli.Type("matrix", shape),
//                            Pacioli.initialNumbers(shape.nrRows(), shape.nrColumns(), data))
// }

export function initialNumbers(m: number, n: number, data: number[][]): any {
  // Use an efficient representation. DOK!? And probably there is already
  // some function to do this. See e.g. the make_matrix implementation.
  var numbers = tagNumbers([], m, n, 1);
  for (var i = 0; i < data.length; i++) {
    set(numbers, data[i][0], data[i][1], data[i][2]);
  }
  return numbers;
}

// Pacioli.conversionNumbers = function (shape) {
//     var numbers = Pacioli.zeroNumbers(shape.nrRows(), shape.nrColumns())
//     for (var i = 0; i < shape.nrRows(); i++) {
//         var flat = shape.unitAt(i, i).reciprocal().flat()
//         if (flat.isDimensionless()) {
//             Pacioli.set(numbers, i, i, flat.factor)
//         } else {
//             /* throw new Error("Cannot convert unit '" +
//                             shape.findColumnUnit(i).toText() +
//                             "' to unit '" +
//                             shape.findRowUnit(i).toText() +
//                             "' for entry '" +
//                             shape.rowCoordinates(i).toText() +
//                             "' during the construction of a matrix of type '" +
//                             shape.toText() +
//                             "'.") */
//             Pacioli.set(numbers, i, i, "unit conversion error")
//         }

//     }
//     return numbers
// }

// Pacioli.conversionMatrixType = function (shape) {
//     return new Pacioli.Type("matrix", shape);
// }

export function printValue(x: any) {
  const cons = document.getElementById("console");
  if (cons) {
    const body = DOM(x);
    const elt = document.createElement(
      typeof x === "string" && x.toString() === "" ? "pre" : "pre"
    );
    elt.appendChild(body);
    cons.appendChild(elt);
  } else {
    console.log(x);
  }
  return x;
}

// Pacioli.dimNum = function (a, b) {
//     return new Pacioli.DimensionedNumber(a, b);
// }

// -----------------------------------------------------------------------------
// 1. The Store
// -----------------------------------------------------------------------------

const cache: any = {};
const context = PacioliContext.si();

export function fetchValue(home: string, name: string) {
  return lookupItem(home + "_" + name);
}

// Pacioli.bfetchValue = function (home: string, name: string) {
//     return Pacioli.lookupItem("b_glbl_" + home + "_" + name);
// }

export function fetchIndex(id: string) {
  //return lookupItem("index_" + id);
  return lookupIndexSet("index_" + id);
}

// export function storeIndex(id: string, index: IndexSet) {
//     Pacioli.cache["index_" + id] = index;
// }

// // todo: replace unit_ by sbase_
// Pacioli.storeScalarBase = function (id: string, base: string) {
//     Pacioli.cache["unit_" + id] = base;
// }

// // todo: replace unit_ by sbase_
// todo2: is this a base or a unit? What does the compute_ function give?
export function fetchScalarBase(id: string): SIBase {
  return lookupItem("sbase_" + id);
}

export function fetchUnit(prefix: string, base: string): SIUnit {
  const unit = context.getUnit(prefix, base);
  if (unit === undefined) {
    const def: { definition?: DimNum; symbol: string } = computeItem(
      "sbase_" + base
    );
    // TODO
    context.addBase(base, def.symbol, def.definition);
    const retry = context.getUnit(prefix, base);
    if (retry === undefined) {
      throw new Error(`Could not add base ${base}`);
    } else {
      return retry;
    }
  } else {
    return unit;
  }
}

// // todo: replace unit_ by sbase_
// export function storeVectorBase(id: string, base: VectorBase) {
//     Pacioli.cache["unitvec_" + id] = base;
// }

// // todo: replace unit_ by sbase_
export function fetchVectorBase(id: string) {
  return lookupItem("vbase_" + id);
}

// Pacioli.fetchType = function (home: string, name: string) {
//     alert('Who used fetchType?');
//     return Pacioli.lookupItem("u_glbl_" + home + "_" + name);
// }

//const Pacioli: any = {}

//declare namespace Pacioli {};

export function lookupItem(full: string) {
  if (cache[full] == undefined) {
    if (window["Pacioli" as any][full as any]) {
      cache[full] = window["Pacioli" as any][full as any];
    } else if (window["Pacioli" as any][("compute_" + full) as any]) {
      const fn = window["Pacioli" as any][("compute_" + full) as any];
      if (typeof fn === "function") {
        cache[full] = (fn as any)();
      }
    } else {
      throw new Error(
        "no function found to compute Pacioli item '" + full + "'"
      );
    }
  }
  if (cache[full] === undefined || cache[full] === null) {
    throw new Error(
      "result of Pacioli item '" + full + "' computation is undefined"
    );
  }
  return cache[full];
}

export function lookupIndexSet(full: string) {
  if (context.findIndexSet(full) == undefined) {
    if (window["Pacioli" as any][full as any]) {
      context.addIndexSet(window["Pacioli" as any][full as any] as any);
    } else if (window["Pacioli" as any][("compute_" + full) as any]) {
      const fn = window["Pacioli" as any][("compute_" + full) as any];
      if (typeof fn === "function") {
        context.addIndexSet((fn as any)());
      }
    } else {
      throw new Error(
        "no function found to compute Pacioli item '" + full + "'"
      );
    }
  }
  if (
    context.findIndexSet(full) === undefined ||
    context.findIndexSet(full) === null
  ) {
    throw new Error(
      "result of Pacioli item '" + full + "' computation is undefined"
    );
  }
  return context.findIndexSet(full);
}

export function lookupBase(full: string) {
  if (cache(full) == undefined) {
    if (window["Pacioli" as any][full as any]) {
      context.addIndexSet(window["Pacioli" as any][full as any] as any);
    } else if (window["Pacioli" as any][("compute_" + full) as any]) {
      const fn = window["Pacioli" as any][("compute_" + full) as any];
      if (typeof fn === "function") {
        context.addIndexSet((fn as any)());
      }
    } else {
      throw new Error(
        "no function found to compute Pacioli item '" + full + "'"
      );
    }
  }
  if (
    context.findIndexSet(full) === undefined ||
    context.findIndexSet(full) === null
  ) {
    throw new Error(
      "result of Pacioli item '" + full + "' computation is undefined"
    );
  }
  return context.findIndexSet(full);
}

function computeItem(full: string): { symbol: string; definition?: DimNum } {
  if (window["Pacioli" as any][full as any]) {
    return window["Pacioli" as any][full as any] as any;
  } else if (window["Pacioli" as any][("compute_" + full) as any]) {
    const fn = window["Pacioli" as any][("compute_" + full) as any];
    if (typeof fn === "function") {
      return (fn as any)();
    } else {
      throw new Error(
        "expected a function to compute Pacioli item '" + full + "'"
      );
    }
  } else {
    throw new Error("no function found to compute Pacioli item '" + full + "'");
  }
}
