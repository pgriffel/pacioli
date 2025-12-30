/* Runtime Support for the Pacioli language
 *
 * Copyright (c) 2023-2025 Paul Griffioen
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

import type { DimNum, SIUnit } from "uom-ts";
import { PacioliCoordinates } from "./values/coordinates";
import { DOM } from "./dom/dom";
import { IndexSet } from "./values/index-set";
import { set, tagNumbers } from "./values/numbers";
import type { PacioliUnit } from "./type";
import { PacioliContext } from "./context";
import type { MatrixType } from "./types/matrix";
import type { RawCoordinates, RawMatrix, RawValue } from "./value";
import { STORAGE_DOK } from "./value";
import { internUnit, matrixShapeFromType } from "./boxing";
import { UnitVector } from "./values/unit-vector";
import { PacioliString } from "./values/string";

export const defaultContext = PacioliContext.empty();

// -----------------------------------------------------------------------------
// 0. Functions used by generated code
// -----------------------------------------------------------------------------

export function makeIndexSet(id: string, name: string, items: string[]) {
  // TODO: wat is de id?
  return IndexSet.fromItems(id, name, items);
}

export function createCoordinates(
  pairs: string[][],
  context: PacioliContext = defaultContext
): RawCoordinates {
  const names = [];
  const indexSets = [];
  for (let i = 0; i < pairs.length; i++) {
    names[i] = pairs[i][0];
    indexSets[i] = fetchIndex(pairs[i][1], context);
  }
  const coords = new PacioliCoordinates(names, indexSets);
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

export function zeroNumbers(m: number, n: number): RawMatrix {
  return tagNumbers([], m, n, STORAGE_DOK);
}

// No longer needs to export this since oneNumbersFromShape is used.
export function oneNumbers(m: number, n: number): RawMatrix {
  const numbers = tagNumbers([], m, n, STORAGE_DOK);
  for (let i = 0; i < m; i++) {
    for (let j = 0; j < n; j++) {
      set(numbers, i, j, 1);
    }
  }
  return numbers;
}

export function oneNumbersFromShape(
  type: MatrixType,
  context: PacioliContext = defaultContext
): RawMatrix {
  const shape = matrixShapeFromType(type, context);
  const numbers = oneNumbers(shape.nrRows(), shape.nrColumns());
  // TODO: check this. Was always in the code, but typing seems to show it is not necessary. Is it not used? Time wil tell.
  // THIS IS USED!!!
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

export function initialNumbers(
  m: number,
  n: number,
  data: number[][]
): RawMatrix {
  // Use an efficient representation. DOK!? And probably there is already
  // some function to do this. See e.g. the make_matrix implementation.
  const numbers = tagNumbers([], m, n, STORAGE_DOK);
  for (let i = 0; i < data.length; i++) {
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

export function printValue(x: RawValue) {
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

export function string(value: string): PacioliString {
  return new PacioliString(value);
}

// -----------------------------------------------------------------------------
// 1. The Store
// -----------------------------------------------------------------------------

const cache: object = {};

export function fetchValue(
  home: string,
  name: string,
  context: PacioliContext = defaultContext
): RawValue {
  return lookupItem<RawValue>(home + "_" + name, context);
}

export function fetchIndex(
  id: string,
  context: PacioliContext = defaultContext
): IndexSet {
  const indexSet = context.findIndexSet(id);
  if (indexSet == undefined) {
    const computed = findFunction<IndexSet>("compute_" + id)();
    context.addIndexSet(computed);
    return computed;
  } else {
    return indexSet;
  }
}

export function fetchUnit(
  prefix: string,
  base: string,
  context: PacioliContext = defaultContext
): SIUnit {
  const unit = context.lookupUnit(prefix, base);
  if (unit === undefined) {
    const parts = base.split(":");
    const baseName = parts.length === 2 ? parts[1] : base;
    // const prefix2 =
    //   prefix.length === 0 && parts.length === 2 ? parts[0] : prefix;

    const def: { definition?: DimNum; symbol: string } = computeItem(
      "sbase_" + baseName
    );
    // TODO
    context.addBase(baseName, def.symbol, def.definition);

    const retry = context.getUnit(prefix, base);
    if (retry === undefined) {
      throw new Error(`Could not add base ${baseName}`);
    } else {
      return retry;
    }
  } else {
    return unit;
  }
}

export function fetchUnitVector(
  id: string,
  indexSet: IndexSet,
  context: PacioliContext = defaultContext
): UnitVector {
  const vec = context.findUnitVector(id);
  if (vec == undefined) {
    const unitObject = findFunction<{ units: any }>("compute_vbase_" + id)()
      .units;
    const unitMap = new Map<string, SIUnit>();
    for (const [key, value] of Object.entries(unitObject)) {
      unitMap.set(key, internUnit(value as PacioliUnit, context));
    }
    const computed = UnitVector.fromMap(id, indexSet, unitMap);
    context.addUnitVector(computed);
    return computed;
  } else {
    return vec;
  }
}

/**
 * Gets a Pacioli item from the cache. If it is not found it computes the value
 * and puts it in the cache.
 *
 * Values can be stored as a value or as a function that computes the value. The
 * compiler generates both. Better to always generate functions instead of both
 * mechanisms at the same time?!
 *
 * The T type is a temporary hack to clarify the usage of this function.
 *
 * @param full
 * @param _context
 * @returns
 */
export function lookupItem<T>(
  full: string,
  _context: PacioliContext = defaultContext
): T {
  // @ts-expect-error Needed until cached is changed to a Map (or multiple Maps).
  if (cache[full] === undefined) {
    // @ts-expect-error The compiled code uses Pacioli as namespace. It must exist
    const asValue = window["Pacioli"][full];

    if (asValue) {
      // @ts-expect-error Needed until cached is changed to a Map (or multiple Maps).
      cache[full] = asValue;
    } else {
      // @ts-expect-error Needed until cached is changed to a Map (or multiple Maps).
      cache[full] = findFunction<T>("compute_" + full)();
    }
  }

  // @ts-expect-error Needed until cached is changed to a Map (or multiple Maps).
  return cache[full] as T;
}

/**
 * Only used in fetchUnit
 */
function computeItem(full: string): { symbol: string; definition?: DimNum } {
  return findFunction<{ symbol: string; definition?: DimNum }>(
    "compute_" + full
  )();
}

/**
 * Finds the generated javascript code for a PacioliValue.
 *
 * Note that a PacioliValue can also be stored as value.
 *
 * The T type is a temporary hack to clarify the usage of this function.
 *
 * @param name
 * @returns
 */
function findFunction<T>(name: string): () => T {
  if ("Pacioli" in window) {
    const nameSpace = window["Pacioli"] as object;

    // @ts-expect-error The generated Pacioli code stores everything in the Pacioli namespace.
    const fun = nameSpace[name] as unknown as () => T;

    if (fun === undefined) {
      throw new Error(`No function found to compute Pacioli item '${name}'`);
    }
    if (typeof fun === "function") {
      return fun;
    } else {
      throw new Error(
        `Expected a function to compute Pacioli item '${name}', but found a ${typeof fun}`
      );
    }
  } else {
    throw new Error(
      `No 'Pacioli' namespace found, cannot compute Pacioli item '${name}'`
    );
  }
}
