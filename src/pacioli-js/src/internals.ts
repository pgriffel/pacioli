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

import { set, type RawMatrix } from "./raw-values/raw-matrix";
import { createMatrixShape, parseSIUnit } from "./api";
import { defaultContext, fetchIndex } from "./cache";
import { DimNum, SIUnit } from "uom-ts";
import { UnitVector } from "./values/unit-vector";
import {
  RawCoordinates,
  RawList,
  RawString,
  RawValue,
  stringifyRawValue,
  tagMatrix,
} from "./raw-values/raw-value";
import { IndexSet } from "./values/index-set";
import { PacioliContext } from "./context";
import { MatrixShape } from "./values/matrix-shape";

// -----------------------------------------------------------------------------
// Functions used by generated code
//
// Inspection
//
// General:
// - tagList                                          _list
// - tagSet                                           _set
//
// JSTranspiler:
// - IndexSet             makeIndexSet                _index
// - ScalarBase           DimNum.fromNumber (and {})  _dimnum
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

export function _const(value: number): RawMatrix {
  const numbers = tagMatrix([], 1, 1, "DOK", MatrixShape.scalar(SIUnit.ONE));
  set(numbers, 0, 0, value);
  return numbers;
}

/**
 * Creates a DimNum for a unit definition.
 *
 * See fetchUnit
 */
export function _dimnum(factor: number, spec: [string, number][]): DimNum {
  return DimNum.fromNumber(factor, parseSIUnit(spec));
}

export function _mat(
  values: [number, number, number][],
  multiplier: [string, number][],
  rowSets: string[],
  rowUnit: [string, number, number][],
  columnSets: string[],
  columnUnit: [string, number, number][],
): RawMatrix {
  const shape = createMatrixShape(
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
    createMatrixShape(multiplier, rowSets, rowUnit, columnSets, columnUnit),
  );
}

/**
 * Called in generated code to construct a unit vector.
 *
 * @param spec A representation of the unit vector in strings and numbers
 */
export function _uvec(
  vectorId: string,
  indexId: string,
  spec: [string, [string, number][]][],
): UnitVector {
  const indexSet = fetchIndex(indexId, defaultContext);

  const unitMap = new Map<string, SIUnit>();

  for (const [key, unitSpec] of spec) {
    unitMap.set(key, parseSIUnit(unitSpec));
  }

  return UnitVector.fromMap(vectorId, indexSet, unitMap);
}

export function _coords(
  position: number,
  size: number,
  pairs: string[][],
): RawCoordinates {
  const names = [];
  const indexSets = [];

  for (const [i, pair] of pairs.entries()) {
    names[i] = pair[0];
    indexSets[i] = fetchIndex(pair[1]);
  }

  return { kind: "coordinates", names, indexSets, size, position };
}

export function _index(id: string, name: string, items: RawList): IndexSet {
  return IndexSet.fromItems(id, name, items.items as RawString[]);
}

// -----------------------------------------------------------------------------
// Helpers
// -----------------------------------------------------------------------------

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
  return _const(value);
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
