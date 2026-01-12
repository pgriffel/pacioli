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
import type {
  PacioliType,
  PacioliUnit,
  PacioliVector,
} from "../types/pacioli-type";
import type { PacioliIndex } from "../types/matrix";
import { IndexType, MatrixType } from "../types/matrix";
import type {
  RawArray,
  RawCoordinates,
  RawList,
  RawMap,
  RawTuple,
  RawValue,
} from "../raw-values/raw-value";
import {
  NOTHING,
  rawValueLabel,
  tagList,
  tagTuple,
} from "../raw-values/raw-value";
import type { PacioliBoole } from "./boole";
import { pacioliFalse, pacioliTrue } from "./boole";
import { PacioliFunction } from "./function";
import { PacioliMatrix } from "./matrix";
import { MatrixDimension } from "./matrix-dimension";
import type { SIVector } from "./matrix-shape";
import { MatrixShape } from "./matrix-shape";
import { PacioliString } from "./string";
import { VectorBase } from "./vector-base";
import type { PacioliVoid } from "./void";
import { VOID } from "./void";
import { GenericType } from "../types/generic";
import { SIBaseType, VectorBaseType } from "../types/bases";
import { PacioliMaybe, RawMaybe } from "./maybe";
import type { PacioliContext } from "../context";
import { PacioliCoordinates } from "./coordinates";
import { fetchIndex, fetchUnit, fetchUnitVector } from "../cache";
import { PacioliTuple } from "./tuple";
import { PacioliList } from "./list";
import { PacioliArray } from "./array";
import type { PacioliRef } from "./ref";
import { PacioliMap } from "./map";
import type { RawMatrix } from "../raw-values/raw-matrix";

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
        for (const [i, entry] of values.entries()) {
          tuple.push(boxRawValue(entry, type.items[i], context));
        }
        return tuple;
      } else if (type.name === "Boole") {
        if (typeof value === "boolean") {
          return value ? pacioliTrue : pacioliFalse;
        } else {
          throw new Error(
            `Expected a boolean instead of ${typeof value} when boxing raw boolean value`
          );
        }
      } else if (type.name === "String") {
        if (typeof value === "string") {
          return new PacioliString(value);
        } else {
          throw new Error(
            `Expected a string instead of ${typeof value} when boxing raw string value`
          );
        }
      } else if (type.name === "Void") {
        return VOID;
      } else if (type.name === "Maybe") {
        const val = (value as RawMaybe).value;
        return new PacioliMaybe(
          type,
          val === undefined
            ? undefined
            : boxRawValue(val, type.items[0], context)
        );
      } else if (type.name === "List") {
        // TODO: This is called with value.kind undefined. Does generated code not tag lists?
        // Or is it better to be permissive here?
        // if (Array.isArray(value) && value.kind === "list") {
        if (Array.isArray(value)) {
          const values = value as RawList;
          const list = new PacioliList(type);
          for (const value_ of values) {
            list.push(boxRawValue(value_, type.items[0], context));
          }
          return list;
        } else {
          throw new Error(
            `Expected an array object instead of ${typeof value} when boxing raw list value`
          );
        }
      } else if (type.name === "Array") {
        if (Array.isArray(value)) {
          const values = value as RawArray;
          const array = new PacioliArray();
          for (const value_ of values) {
            array.push(boxRawValue(value_, type.items[0], context));
          }
          return array;
        } else {
          throw new Error(
            `Expected an array object instead of ${typeof value} when boxing raw array value`
          );
        }
      } else if (type.name === "Map") {
        return new PacioliMap(
          type.items[0],
          type.items[1],
          value as RawMap,
          context
        );
      } else {
        throw new Error(
          `Unxpected type '${type.name}' for value ${rawValueLabel(value)} `
        );
      }
    }
    case "function": {
      if (typeof value === "function") {
        return new PacioliFunction(value, type, context);
      } else {
        throw new Error(
          `Expected a function instead of ${typeof value} when boxing raw function value`
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
      throw new Error(
        `Unxpected typevar '${type.kind}' for type ${typeof value} with value ${
          type.name
        } `
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
      return new GenericType(
        "Tuple",
        valueList.map((element) => typeFromValue(element))
      );
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
      throw new Error(`Unexpected value kind ${value.kind}`);
    }
  }
}

export function rawValueFromValue(value: PacioliValue): RawValue {
  switch (value.kind) {
    case "matrix": {
      return value.numbers;
    }
    case "tuple": {
      return tagTuple(value.map((element) => rawValueFromValue(element)));
    }
    case "list": {
      return tagList(value.map((element) => rawValueFromValue(element)));
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
    // TODO:  "coordinates" | "array" | "ref" | "map" | "void"
    default: {
      throw new Error(`unexpected value kind ${value.kind}`);
    }
  }
}

function matrixDimensionFromIndex(
  index: PacioliIndex,
  context: PacioliContext
): MatrixDimension {
  if (index.kind === "index") {
    return new MatrixDimension(
      index.sets.map((name) => fetchIndex("index_" + name, context))
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
      return fetchUnit(base.prefix, base.base, context);
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
      throw new Error("cannot intern a unit containing a unit variable");
    } else {
      const unitVector = fetchUnitVector(
        base.name,
        dimension.indexSets[base.position],
        context
      );
      return UOM.fromBase(new VectorBase(unitVector, base.position, base.name));
    }
  });

  return siUnit;
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
