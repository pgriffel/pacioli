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

import { DimNum, SIUnit } from "uom-ts";
import { PacioliCoordinates } from "./values/coordinates";
import { IndexSet } from "./values/index-set";
import { set } from "./raw-values/raw-matrix";
import { PacioliContext } from "./context";
import type { RawList, RawString, RawValue } from "./raw-values/raw-value";
import { stringifyRawValue, tagMatrix } from "./raw-values/raw-value";
import { unboxPacioliValue } from "./values/pacioli-value";
import type { PacioliValue } from "./values/pacioli-value";
import { UnitVector } from "./values/unit-vector";
import { PacioliString } from "./values/string";
import type { RawMatrix } from "./raw-values/raw-matrix";
import { MatrixShape } from "./values/matrix-shape";
import { createMatrixType } from "./api";

export const defaultContext = PacioliContext.empty();

// -----------------------------------------------------------------------------
// 0. Functions used by generated code
//
// Inspection
//
// General:
// - tagList                                          _list
// - tagSet                                           _set
//
// JSTranspiler:
// - IndexSet             makeIndexSet                _index
// - ScalarBase           DimNum.fromNumber (and {})  _sbase
// - VectorBase           vectorBase                  _uvec
//
// JSGenerator:
// - ConstNode            dimlessScalar               _const
// - ConversionNode       conversionNumbers           _conv
// - IdentifierNode       fetchValue                  _get
// - KeyNode              createCoordinates           _coords
// - MatrixLiteralNode    initialNumbersFromType      _mat
// - MatrixTypeNode       oneNumbersFromShape         _unitmat
// - ProjectionNode       projectNumbers              _proj
//
// conversionNumbers is NOT USED!, uses initialNumbersFromType instead. We can
//  now fix this!? Conversion is currently only compile time!?
//
// conventions for generated code:
// - fetch functions in generated code get values via cache based on id. If not in cache it computes. Functions for accessing the context.
// - intern functions are for constructing interned values from strings, booleans, etc. in compute functions
// - parse functions parse strings
// the rest is for use from user code (html, etc.)
//
// -----------------------------------------------------------------------------

export function _mat(
  values: [number, number, number][],
  multiplier: [string, number][],
  rowSets: string[],
  rowUnit: [string, number, number][],
  columnSets: string[],
  columnUnit: [string, number, number][],
): RawMatrix {
  const shape = createMatrixType(
    multiplier,
    rowSets,
    rowUnit,
    columnSets,
    columnUnit,
  );
  return initialNumbersFromType(
    shape.nrRows(),
    shape.nrColumns(),
    values,
    shape,
  );
}

export function _unitmat(
  multiplier: [string, number][],
  rowSets: string[],
  rowUnit: [string, number, number][],
  columnSets: string[],
  columnUnit: [string, number, number][],
): RawMatrix {
  return oneNumbersFromShape(
    createMatrixType(multiplier, rowSets, rowUnit, columnSets, columnUnit),
  );
}

export function makeIndexSet(id: string, name: string, items: RawList) {
  // TODO: wat is de id?
  return IndexSet.fromItems(
    id,
    name,
    items.items.map((o) => o as RawString),
  );
}

export function createCoordinates(
  pairs: string[][],
  context: PacioliContext = defaultContext,
): PacioliCoordinates {
  const names = [];
  const indexSets = [];

  for (const [i, pair] of pairs.entries()) {
    names[i] = pair[0];
    indexSets[i] = fetchIndex(pair[1], context);
  }

  return new PacioliCoordinates(names, indexSets);
}

// Pacioli.scalarShape = function (unit) {
//     var result = new Pacioli.Shape();
//     result.multiplier = unit;
//     return result;
// }

export function zeroNumbers(
  m: number,
  n: number,
  shape: MatrixShape,
): RawMatrix {
  return tagMatrix([], m, n, "DOK", shape);
}

// No longer needs to export this since oneNumbersFromShape is used.
export function oneNumbers(
  m: number,
  n: number,
  shape: MatrixShape,
): RawMatrix {
  const numbers = tagMatrix([], m, n, "DOK", shape);
  for (let i = 0; i < m; i++) {
    for (let j = 0; j < n; j++) {
      set(numbers, i, j, 1);
    }
  }
  return numbers;
}

/**
 * Runtime function used for literal unit nodes. The compiler generates type information for literal
 * unit nodes (class MatrixTypeNode). This is done for num2string and unit2string. These functions
 * require a literal unit as argument. In this way we can print units.
 *
 * @param type
 * @param context
 * @returns
 */
export function oneNumbersFromShape(
  shape: MatrixShape, // TODO: change to MatrixShape!?
  _context: PacioliContext = defaultContext,
): RawMatrix {
  const numbers = oneNumbers(shape.nrRows(), shape.nrColumns(), shape);
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
  shape: MatrixShape,
): RawMatrix {
  if (shape === undefined) {
    debugger;
  }
  // Use an efficient representation. DOK!? And probably there is already
  // some function to do this. See e.g. the make_matrix implementation.
  const numbers = tagMatrix(
    [],
    m,
    n,
    "DOK",
    shape, //matrixShapeFromType(type, defaultContext), // How to get context?
  );
  for (const datum of data) {
    set(numbers, datum[0], datum[1], datum[2]);
  }
  return numbers;
}

export function initialNumbersFromType(
  m: number,
  n: number,
  data: number[][],
  shape: MatrixShape,
  _context: PacioliContext = defaultContext,
): RawMatrix {
  // Use an efficient representation. DOK!? And probably there is already
  // some function to do this. See e.g. the make_matrix implementation.
  const numbers = tagMatrix([], m, n, "DOK", shape);
  for (const datum of data) {
    set(numbers, datum[0], datum[1], datum[2]);
  }
  return numbers;
}

export function dimlessScalar(value: number): RawMatrix {
  const numbers = tagMatrix([], 1, 1, "DOK", MatrixShape.scalar(SIUnit.ONE));
  set(numbers, 0, 0, value);
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

const cache: Map<string, RawValue> = new Map();

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
  if (base === undefined) {
    console.log("oeps");
  }
  // const yo = base;
  // console.log(yo);
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
  vectorId: string,
  _indexId: string,
  context: PacioliContext = defaultContext,
): UnitVector {
  const candidate = context.findUnitVector(vectorId);

  if (candidate === undefined) {
    const UnitVector = findFunction<UnitVector>(vectorId)();

    context.addUnitVector(UnitVector);
    return UnitVector;
  } else {
    return candidate;
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
    const asValue = window["Pacioli"][full] as RawValue | undefined;

    if (asValue === undefined) {
      cache.set(full, findFunction<T>(full)() as RawValue);
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

export function storePacioliValue(
  module: string,
  name: string,
  value: PacioliValue,
) {
  cache.set(module + "_" + name, unboxPacioliValue(value));
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
