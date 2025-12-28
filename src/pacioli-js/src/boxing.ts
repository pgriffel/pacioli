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

import type { SIUnit } from "uom-ts";
import { UOM } from "uom-ts";
import type { PacioliType, PacioliUnit, PacioliVector } from "./type";
import type { PacioliIndex } from "./types/matrix";
import { IndexType, MatrixType } from "./types/matrix";
import type {
  RawCoordinates,
  RawList,
  RawMatrix,
  RawTuple,
  RawValue,
} from "./value";
import { NOTHING, tagList, tagTuple } from "./value";
import type { PacioliBoole } from "./values/boole";
import { pacioliFalse, pacioliTrue } from "./values/boole";
import { PacioliFunction } from "./values/function";
import { PacioliMatrix } from "./values/matrix";
import { MatrixDimension } from "./values/matrix-dimension";
import type { SIVector } from "./values/matrix-shape";
import { MatrixShape } from "./values/matrix-shape";
import { PacioliString } from "./values/string";
import { VectorBase } from "./values/vector-base";
import type { PacioliVoid } from "./values/void";
import { VOID } from "./values/void";
import { GenericType } from "./types/generic";
import { SIBaseType, VectorBaseType } from "./types/bases";
import { PacioliMaybe, RawMaybe } from "./values/maybe";
import type { PacioliContext } from "./context";
import { PacioliCoordinates } from "./values/coordinates";
import { fetchIndex, fetchUnit, fetchUnitVector } from "./cache";
import { PacioliTuple } from "./values/tuple";
import { PacioliList } from "./values/list";
import type { PacioliArray } from "./values/array";
import type { PacioliRef } from "./values/ref";
import type { PacioliMap } from "./values/map";

export type PacioliValue =
  | PacioliMatrix
  | PacioliCoordinates
  | PacioliTuple
  | PacioliList
  | PacioliArray
  | PacioliRef
  | PacioliBoole
  | PacioliFunction
  | PacioliString
  | PacioliMap
  | PacioliVoid
  | PacioliMaybe;

export interface ToText {
  toText(): string;
}

/**
 * Casts assumes the value is a matrix. Type system should guarantee that.
 *
 * @param value
 * @param type
 * @param context
 * @returns
 */
export function boxRawValue(
  value: RawValue,
  type: PacioliType,
  context: PacioliContext
): PacioliValue {
  switch (type.kind) {
    case "generic": {
      if (type.name === "Tuple") {
        const values = value as RawTuple;
        const tuple = new PacioliTuple();
        for (let i = 0; i < values.length; i++) {
          tuple.push(boxRawValue(values[i], type.items[i], context));
        }
        return tuple;
      } else if (type.name === "Boole") {
        if (typeof value === "boolean") {
          return value ? pacioliTrue : pacioliFalse;
        } else {
          throw new Error(
            `Expected a boolean instead of ${value} when boxing raw boolean value`
          );
        }
      } else if (type.name === "String") {
        if (typeof value === "string") {
          return new PacioliString(value);
        } else {
          throw new Error(
            `Expected a string instead of ${value} when boxing raw string value`
          );
        }
      } else if (type.name === "Void") {
        return VOID;
      } else if (type.name === "Maybe") {
        const val = (value as RawMaybe).value;
        return new PacioliMaybe(
          type,
          val ? boxRawValue(val, type.items[0], context) : undefined
        );
      } else if (type.name === "List") {
        if (typeof value === "object") {
          const values = value as RawList;
          const list = new PacioliList(type);
          for (let i = 0; i < values.length; i++) {
            list.push(boxRawValue(values[i], type.items[0], context));
          }
          return list;
        } else {
          throw new Error(
            `Expected an array object instead of ${value} when boxing raw list value`
          );
        }
      } else {
        throw new Error(`Unxpected type '${type.name}' for value ${value} `);
      }
    }
    case "function": {
      if (typeof value === "function") {
        return new PacioliFunction(value, type, context);
      } else {
        throw new Error(
          `Expected a function instead of ${value} when boxing raw function value`
        );
      }
    }
    case "matrix": {
      return new PacioliMatrix(
        matrixShapeFromType(type, context),
        value as RawMatrix
      );
    }
    case "typevar": {
      throw Error(
        `Unxpected typevar '${
          type.kind
        }' for type ${typeof value} with value ${value} `
      );
    }
    case "index": {
      const coord = value as RawCoordinates;
      const dim = matrixDimensionFromIndex(type, context);
      return PacioliCoordinates.fromIndex(dim.indexSets, coord.position);
    }
    // // TODO: "coordinates"
    // default: {
    //   console.log("boxing", value);
    //   throw new Error(
    //     `Unxpected kind '${
    //       type.kind
    //     }' for type ${typeof value} with value ${value} `
    //   );
    // }
  }
}

export function matrixShapeFromType(
  type: MatrixType,
  context: PacioliContext
): MatrixShape {
  const rowDim = matrixDimensionFromIndex(type.rowIndex, context);
  const columnDim = matrixDimensionFromIndex(type.columnIndex, context);
  return new MatrixShape(
    internUnit(type.multiplier, context),
    rowDim,
    internUnitVector(rowDim, type.rowUnit, context),
    columnDim,
    internUnitVector(columnDim, type.columnUnit, context)
  );
}

export function typeFromValue(value: PacioliValue): PacioliType {
  switch (value.kind) {
    case "matrix": {
      return new MatrixType(
        internUnitInv(value.shape.multiplier),
        matrixDimensionFromIndexInv(value.shape.rowDimension),
        internUnitVectorInv(value.shape.rowUnit),
        matrixDimensionFromIndexInv(value.shape.columnDimension),
        internUnitVectorInv(value.shape.columnUnit)
      );
    }
    case "list": {
      // TODO: fix any
      return value.type;
    }
    case "tuple": {
      const valueList = value as unknown as PacioliValue[];
      return new GenericType("Tuple", valueList.map(typeFromValue));
    }
    case "string": {
      return new GenericType("String", []);
    }
    case "function": {
      return value.type;
    }
    case "boole": {
      return new GenericType("Boole", []);
    }
    default: {
      throw new Error(`Unexpected value kind ${value.kind} in value ${value}`);
    }
  }
}

export function rawValueFromValue(value: PacioliValue): RawValue {
  switch (value.kind) {
    case "matrix": {
      return value.numbers;
    }
    case "tuple": {
      return tagTuple(value.map(rawValueFromValue));
    }
    case "list": {
      return tagList(value.map(rawValueFromValue));
    }
    case "string": {
      return value.value;
    }
    case "boole": {
      return value.value;
    }
    case "function": {
      return value.fun;
    }
    case "maybe": {
      return value.value === undefined
        ? NOTHING
        : new RawMaybe(rawValueFromValue(value.value));
    }
    default: {
      throw new Error(
        `unexpected value kind ${value.kind} in Pacioli value ${value}`
      );
    }
  }
}

function matrixDimensionFromIndex(
  index: PacioliIndex,
  context: PacioliContext
): MatrixDimension {
  if (index.kind === "index") {
    return new MatrixDimension(
      index.sets.map((name) => {
        const set = fetchIndex(name, context);
        if (set) return set;
        else {
          throw new Error(
            "index set " + name + " unknown when transforming type to shape"
          );
        }
      })
    );
  } else {
    throw new Error("index kind " + index.kind + " unexpected");
  }
}

function matrixDimensionFromIndexInv(dimension: MatrixDimension): PacioliIndex {
  return new IndexType(
    dimension.indexSets.map((set) => {
      return set.name;
    })
  );
}

/**
 * Transforms a type unit into an SI unit. See internUnitInv.
 *
 * @param unit
 * @returns
 */
export function internUnit(unit: PacioliUnit, context: PacioliContext): SIUnit {
  return unit.map((base) => {
    if (base.isVar) {
      throw new Error("cannot have variable");
    } else {
      const siUnit = fetchUnit(base.prefix, base.base, context);
      if (siUnit) {
        return siUnit;
      } else {
        throw new Error(
          "unit " + unit.toText() + " unknown when transforming type to shape"
        );
      }
    }
  });
}

/**
 * Transforms an SI unit into a type unit. Inverse of internUnit.
 *
 * @param unit
 * @returns
 */
function internUnitInv(unit: SIUnit): PacioliUnit {
  return unit.map((base) =>
    UOM.fromBase(new SIBaseType(base.prefix.name, base.base))
  );
}

/**
 * Transforms a vector type into an SI vector. See internUnitVectorInv.
 *
 * @param unit
 * @returns
 */
function internUnitVector(
  dimension: MatrixDimension,
  unit: PacioliVector,
  context: PacioliContext
): SIVector {
  const siUnit: SIVector = unit.map((base) => {
    if (base.isVar) {
      throw new Error("cannot have variable");
    } else {
      const unitVector = fetchUnitVector(
        base.name,
        dimension.indexSets[base.position],
        context
      );
      if (unitVector !== undefined) {
        const siUnitVec: SIVector = UOM.fromBase(
          new VectorBase(unitVector, base.position, base.name)
        );
        return siUnitVec;
      } else {
        throw new Error("invalid unit vector " + base.toText());
      }
    }
  });

  if (siUnit) {
    return siUnit;
  } else {
    throw new Error(
      "unit " + unit.toText() + " unknown when transforming type to shape"
    );
  }
}

/**
 * Transforms an SI vector into a vector type. Inverse of internUnitVector.
 *
 * @param unit
 * @returns
 */
function internUnitVectorInv(unit: SIVector): PacioliVector {
  return unit.map((base) => {
    return UOM.fromBase(new VectorBaseType(base.getName(), base.position));
  });
}
