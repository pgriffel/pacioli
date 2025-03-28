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

import { DimNum, SIUnit, UOM, parseDimNum as uomParseDimNum } from "uom-ts";
import { Matrix } from "./values/matrix";
import { MatrixShape } from "./values/matrix-shape";
import { PacioliUnit, PacioliVector } from "./type";
import { PacioliContext } from "./context";
import { PacioliFunction } from "./values/function";
import { MatrixType, PacioliIndex } from "./types/matrix";
import { boxRawValue, PacioliValue, typeFromValue } from "./boxing";
import { SIBaseType, VectorBaseType } from "./types/bases";
import { TypeVar, UnitVar } from "./types/variables";
import { defaultContext, fetchUnit, initialNumbers, lookupItem } from "./cache";
import { PacioliTuple } from "./values/tuple";
import { PacioliList } from "./values/list";
import { GenericType } from "./types/generic";
import BigNumber from "bignumber.js";

// -----------------------------------------------------------------------------
// New
// -----------------------------------------------------------------------------

export function createMatrixType(
  multiplier: PacioliUnit,
  rowSets: PacioliIndex,
  rowUnit: PacioliVector,
  columnSets: PacioliIndex,
  columnUnit: PacioliVector
): MatrixType {
  return new MatrixType(multiplier, rowSets, rowUnit, columnSets, columnUnit);
}

// -----------------------------------------------------------------------------
// Upgrade
// -----------------------------------------------------------------------------

export function value(
  module: string,
  name: string,
  context: PacioliContext = defaultContext
): PacioliValue {
  return boxRawValue(
    lookupItem(module + "_" + name, context),
    lookupItem("u_" + module + "_" + name, context),
    context
  );
}

// Just a synonym for value
export function fun(
  module: string,
  name: string,
  context: PacioliContext = defaultContext
): PacioliFunction {
  const type = lookupItem("u_" + module + "_" + name, context);
  const value = lookupItem(module + "_" + name, context);
  const box = boxRawValue(value, type, context);
  if (box instanceof PacioliFunction) {
    return box;
  } else {
    throw new Error(
      `Expected a PacioliFunction when creating fun ${module}_${name} but got ${box}`
    );
  }
}

export function convertUnit(matrix: Matrix, unit: SIUnit): Matrix {
  return matrix.convertUnit(unit, defaultContext.unitContext);
}

export function conversionFactor(from: SIUnit, to: SIUnit): BigNumber {
  return defaultContext.unitContext.conversionFactor(from, to);
}

export function unit(name: string): SIUnit {
  const parts = name.split(":");

  const prefix = parts.length === 2 ? parts[0] : "";
  const base = parts.length === 2 ? parts[1] : name;

  return fetchUnit(prefix, base);
  // return si.getUnit(name2 ? name1 + ":" + name2 : name1);
}

// Used in generated code
export function unitType(name1: string, name2?: string): UOM<SIBaseType> {
  return UOM.fromBase(new SIBaseType(name2 ? name1 : "", name2 ?? name1));
}

// Used only by VectorBase. In asJs method.
export function unitVectorType(
  module: string,
  type: string,
  position: number
): UOM<VectorBaseType> {
  return UOM.fromBase(new VectorBaseType(module + "_" + type, position));
}

// export function unitFromBase<T extends UOMBase>(base: T): UOM<T> {
//   return UOM.fromBase(base);
// }

// Used only by ScalarUnitVar. In asJs method.
export function unitFromVarName(varName: string): PacioliUnit {
  return UOM.fromBase(new UnitVar("_" + varName + "_"));
}

export function typeFromVarName(varName: string): TypeVar {
  return new TypeVar("_" + varName + "_");
}

export function num(num: string | number, unit: SIUnit = UOM.ONE): Matrix {
  const shape = MatrixShape.scalar(unit === undefined ? UOM.ONE : unit);
  const numbers = initialNumbers(1, 1, [
    [0, 0, typeof num === "string" ? parseFloat(num) : num],
  ]);
  return new Matrix(shape, numbers);
}

export function parseUnit(
  input: string,
  context: PacioliContext = defaultContext
): SIUnit {
  return uomParseDimNum(
    input,
    (x) => fetchUnit("", x, context),
    (x, y) => fetchUnit(x, y, context)
  ).unit;
}

export function parseDimNum(
  input: string,
  context: PacioliContext = defaultContext
): DimNum {
  return uomParseDimNum(
    input,
    (x) => fetchUnit("", x, context),
    (x, y) => fetchUnit(x, y, context)
  );
}

// Pacioli.tuple = function (array) {
//     var uTuple = array.map(function (elt) {return elt.type})
//     var vTuple = array.map(function (elt) {return elt.value})
//     vTuple.kind = 'tuple'
//     return new Pacioli.Box(new Pacioli.Type('tuple', uTuple), vTuple)
// }

export function tuple(array: PacioliValue[]): PacioliValue {
  return new PacioliTuple(...array);
}

export function list(array: PacioliValue[]): PacioliValue {
  if (array.length === 0) {
    throw new Error("Cannot make empty list (yet)");
  }
  var vList = array.map(function (elt) {
    return elt; //.value;
  });
  return new PacioliList(
    new GenericType("List", [typeFromValue(array[0])]),
    ...vList
  );

  // throw new Error("Is Pacioli.list(...) used?");

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
