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

import type { DimNum } from "uom-ts";
import { SIUnit } from "uom-ts";
import { UOM, parseDimNum as uomParseDimNum } from "uom-ts";
import { PacioliMatrix } from "./values/matrix";
import { MatrixShape, SIVector } from "./values/matrix-shape";
import type { PacioliUnit } from "./types/pacioli-type";
import type { PacioliContext } from "./context";
import { PacioliFunction } from "./values/function";
import type { PacioliValue } from "./values/pacioli-value";
import { boxRawValue } from "./values/pacioli-value";
import { SIBaseType, VectorBaseType } from "./types/bases";
import { TypeVar, UnitVar } from "./types/variables";
import {
  defaultContext,
  fetchIndex,
  fetchUnit,
  fetchUnitVector,
  initialNumbers,
  lookupValue,
} from "./cache";
import { PacioliTuple } from "./values/tuple";
import { PacioliList } from "./values/list";
import type BigNumber from "bignumber.js";
import { MatrixDimension } from "./values/matrix-dimension";
import { VectorBase } from "./values/vector-base";
import { UnitVector } from "./values/unit-vector";

// -----------------------------------------------------------------------------
// New
// -----------------------------------------------------------------------------

export function createMatrixType(
  multiplier: [string, number][],
  rowSets: string[],
  rowUnit: [string, number, number][],
  columnSets: string[],
  columnUnit: [string, number, number][],
): MatrixShape {
  // fetches doen om te interen!
  const rowDim = new MatrixDimension(
    rowSets.map((name) => fetchIndex(name, defaultContext)),
  );
  const columnDim = new MatrixDimension(
    columnSets.map((name) => fetchIndex(name, defaultContext)),
  );
  return new MatrixShape(
    parseSIUnit(multiplier),
    rowDim,
    parseVectorShapeUnit(rowDim, rowUnit),
    columnDim,
    parseVectorShapeUnit(columnDim, columnUnit),
  );
}

function parseSIUnit(parts: [string, number][]): SIUnit {
  let uni = SIUnit.ONE;
  for (const [base, power] of parts) {
    uni = uni.mult(unit(base).expt(power));
  }
  return uni;
}

function parseVectorShapeUnit(
  dimension: MatrixDimension,
  parts: [string, number, number][],
): SIVector {
  let unit = SIVector.ONE;

  for (const [id, position, power] of parts) {
    const unitVector = fetchUnitVector(
      id,
      dimension.indexSets[position].id,
      defaultContext,
    );
    unit = unit.mult(
      UOM.fromBase(new VectorBase(unitVector, position, id)).expt(power),
    );
  }
  return unit;
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

// -----------------------------------------------------------------------------
// Upgrade
// -----------------------------------------------------------------------------

export function value(module: string, name: string): PacioliValue {
  return boxRawValue(lookupValue(module + "_" + name));
}

// Just a synonym for value
export function fun(module: string, name: string): PacioliFunction {
  const box = boxRawValue(lookupValue(module + "_" + name));

  if (box instanceof PacioliFunction) {
    return box;
  } else {
    throw new Error(
      `Expected a PacioliFunction when creating fun ${module}_${name} but got a '${box.kind}'`,
    );
  }
}

export function convertUnit(
  matrix: PacioliMatrix,
  unit: SIUnit,
): PacioliMatrix {
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
}

// Used in generated code
export function unitType(name1: string, name2?: string): UOM<SIBaseType> {
  return UOM.fromBase(
    name2 === undefined
      ? new SIBaseType("", name1)
      : new SIBaseType(name1, name2),
  );
}

// Used only by VectorBase. In asJs method.
export function unitVectorType(
  id: string,
  position: number,
): UOM<VectorBaseType> {
  return UOM.fromBase(new VectorBaseType(id, position));
}

// Used only by ScalarUnitVar. In asJs method.
export function unitFromVarName(id: string): PacioliUnit {
  return UOM.fromBase(new UnitVar(id));
}

export function typeFromVarName(varName: string): TypeVar {
  return new TypeVar("_" + varName + "_");
}

export function num(
  num: string | number,
  unit: SIUnit = SIUnit.ONE,
): PacioliMatrix {
  const shape = MatrixShape.scalar(unit);
  const numbers = initialNumbers(
    1,
    1,
    [[0, 0, typeof num === "string" ? Number.parseFloat(num) : num]],
    shape,
  );
  return new PacioliMatrix(shape, numbers);
}

export function parseUnit(
  input: string,
  context: PacioliContext = defaultContext,
): SIUnit {
  return uomParseDimNum(
    input,
    (x) => fetchUnit("", x, context),
    (x, y) => fetchUnit(x, y, context),
  ).unit;
}

export function stringifyUnit(unit: SIUnit): string {
  return unit.fold(
    (base, power) =>
      power === 1 ? base.name : `${base.name}^${power.toString()}`,
    (x, y) => x + "*" + y,
    "",
  );
}

export function parseDimNum(
  input: string,
  context: PacioliContext = defaultContext,
): DimNum {
  return uomParseDimNum(
    input,
    (x) => fetchUnit("", x, context),
    (x, y) => fetchUnit(x, y, context),
  );
}

export function tuple(array: PacioliValue[]): PacioliValue {
  return new PacioliTuple(array);
}

export function list(array: PacioliValue[]): PacioliValue {
  if (array.length === 0) {
    throw new Error("Cannot make empty list (yet)");
  }

  return new PacioliList(array);
}
