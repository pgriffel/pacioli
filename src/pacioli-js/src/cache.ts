/**
 * Copyright 2026 Paul Griffioen
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

import type { DimNum, SIUnit } from "uom-ts";
import { PacioliCoordinates } from "./values/coordinates";
import { IndexSet } from "./values/index-set";
import { set } from "./raw-values/raw-matrix";
import type { PacioliType, PacioliUnit } from "./types/pacioli-type";
import { PacioliContext } from "./context";
import type { MatrixType } from "./types/matrix";
import type { RawCoordinates, RawValue } from "./raw-values/raw-value";
import { stringifyRawValue, tagMatrix } from "./raw-values/raw-value";
import {
  internUnit,
  matrixShapeFromType,
  rawValueFromValue,
  typeFromValue,
} from "./values/pacioli-value";
import type { PacioliValue } from "./values/pacioli-value";
import { UnitVector } from "./values/unit-vector";
import { PacioliString } from "./values/string";
import type { RawMatrix } from "./raw-values/raw-matrix";

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
  context: PacioliContext = defaultContext,
): RawCoordinates {
  const names = [];
  const indexSets = [];
  for (const [i, pair] of pairs.entries()) {
    names[i] = pair[0];
    indexSets[i] = fetchIndex(pair[1], context);
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
  return tagMatrix([], m, n, "DOK");
}

// No longer needs to export this since oneNumbersFromShape is used.
export function oneNumbers(m: number, n: number): RawMatrix {
  const numbers = tagMatrix([], m, n, "DOK");
  for (let i = 0; i < m; i++) {
    for (let j = 0; j < n; j++) {
      set(numbers, i, j, 1);
    }
  }
  return numbers;
}

export function oneNumbersFromShape(
  type: MatrixType,
  context: PacioliContext = defaultContext,
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
  data: number[][],
): RawMatrix {
  // Use an efficient representation. DOK!? And probably there is already
  // some function to do this. See e.g. the make_matrix implementation.
  const numbers = tagMatrix([], m, n, "DOK");
  for (const datum of data) {
    set(numbers, datum[0], datum[1], datum[2]);
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
    const elt = document.createElement("pre");

    elt.innerText = stringifyRawValue(x);

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

const cache: Map<string, PacioliType | RawValue> = new Map();

// const valueStore: Map<string, RawValue> = new Map();
// const typeStore: Map<string, PacioliType> = new Map();

export function fetchValue(home: string, name: string): RawValue {
  return lookupValue(home + "_" + name);
}

export function fetchIndex(
  id: string,
  context: PacioliContext = defaultContext,
): IndexSet {
  const indexSet = context.findIndexSet(id);
  if (indexSet === undefined) {
    const computed = findFunction<IndexSet>(id)();
    context.addIndexSet(computed);
    return computed;
  } else {
    return indexSet;
  }
}

export function fetchUnit(
  prefix: string,
  base: string,
  context: PacioliContext = defaultContext,
): SIUnit {
  const unit = context.lookupUnit(prefix, base);
  if (unit === undefined) {
    const parts = base.split(":");
    const baseName = parts.length === 2 ? parts[1] : base;
    // const prefix2 =
    //   prefix.length === 0 && parts.length === 2 ? parts[0] : prefix;

    const def: { definition?: DimNum; symbol: string } = computeItem(
      "sbase_" + baseName,
    );
    // TODO
    context.addBase(baseName, def.symbol, def.definition);

    return context.getUnit(prefix, base);
  } else {
    return unit;
  }
}

export function fetchUnitVector(
  id: string,
  indexSet: IndexSet,
  context: PacioliContext = defaultContext,
): UnitVector {
  const vec = context.findUnitVector(id);

  if (vec === undefined) {
    const unitObject = findFunction<{ units: object }>(id)().units;
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
// TODO Remove this disable if the type of this function is fixed. Two functions? And
// two caches?
// eslint-disable-next-line @typescript-eslint/no-unnecessary-type-parameters
export function lookupItem<T>(
  full: string,
  _context: PacioliContext = defaultContext,
): T {
  if (cache.get(full) === undefined) {
    // @ts-expect-error The compiled code uses Pacioli as namespace. It must exist
    const asValue = window["Pacioli"][full] as
      | PacioliType
      | RawValue
      | undefined;

    if (asValue === undefined) {
      cache.set(full, findFunction<T>(full)() as PacioliType | RawValue);
    } else {
      cache.set(full, asValue);
    }
  }

  return cache.get(full) as T;
}

export function lookupValue(full: string): RawValue {
  if (cache.get(full) === undefined) {
    // @ts-expect-error The compiled code uses Pacioli as namespace. It must exist
    const asValue = window["Pacioli"][full] as RawValue | undefined;

    if (asValue === undefined) {
      cache.set(full, findFunction<RawValue>(full)());
    } else {
      cache.set(full, asValue);
    }
  }

  return cache.get(full) as RawValue;
}

export function lookupType(id: string): PacioliType {
  const full = "u_" + id;
  if (cache.get(full) === undefined) {
    // @ts-expect-error The compiled code uses Pacioli as namespace. It must exist
    const asValue = window["Pacioli"][full] as PacioliType | undefined;

    if (asValue === undefined) {
      cache.set(full, findFunction<PacioliType>(full)());
    } else {
      cache.set(full, asValue);
    }
  }

  return cache.get(full) as PacioliType;
}

export function storeValue(module: string, name: string, value: PacioliValue) {
  cache.set(module + "_" + name, rawValueFromValue(value));
  cache.set("u_" + module + "_" + name, typeFromValue(value));
}

/**
 * Only used in fetchUnit
 */
function computeItem(full: string): { symbol: string; definition?: DimNum } {
  return findFunction<{ symbol: string; definition?: DimNum }>(full)();
}

declare global {
  var Pacioli: object;
}

globalThis.Pacioli = {};

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
// eslint-disable-next-line @typescript-eslint/no-unnecessary-type-parameters
function findFunction<T>(name: string): () => T {
  const nameSpace = globalThis.Pacioli;

  // @ts-expect-error The generated Pacioli code stores everything in the Pacioli namespace.
  const fun = nameSpace["compute_" + name] as (() => T) | undefined;

  if (fun === undefined) {
    throw new Error(`No function found to compute Pacioli item '${name}'`);
  }
  if (typeof fun === "function") {
    return fun;
  } else {
    throw new Error(
      `Expected a function to compute Pacioli item '${name}', but found a ${typeof fun}`,
    );
  }
}

// function loadDefFromValueNameSpace<T>(name: string): () => T {
//   const nameSpace = globalThis.Pacioli;

//   // @ts-expect-error The generated Pacioli code stores everything in the Pacioli namespace.
//   const val = nameSpace["v_" + name] as (() => T) | undefined;

//   if (val === undefined) {
//     throw new Error(`No definition found for Pacioli value '${name}'`);
//   }

//   return val;
// }

// function loadDefFromTypeNameSpace<T>(name: string): () => T {
//   const nameSpace = globalThis.Pacioli;

//   // @ts-expect-error The generated Pacioli code stores everything in the Pacioli namespace.
//   const val = nameSpace["t_" + name] as (() => T) | undefined;

//   if (val === undefined) {
//     throw new Error(`No definition found for Pacioli type item '${name}'`);
//   }

//   return val;
// }
