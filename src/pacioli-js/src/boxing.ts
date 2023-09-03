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

import { SIUnit, UOM } from "uom-ts";
import { fetchIndex, fetchUnit, fetchVectorBase } from "./api";
import { PacioliType, PacioliUnit, PacioliVector } from "./type";
import { IndexType, MatrixType, PacioliIndex } from "./types/matrix";
import { PacioliValue, RawValue, tagKind, tagType } from "./value";
import { pacioliFalse, pacioliTrue } from "./values/boole";
import { PacioliFunction } from "./values/function";
import { Matrix } from "./values/matrix";
import { MatrixDimension } from "./values/matrix-dimension";
import { MatrixShape, SIVector } from "./values/matrix-shape";
import { PacioliString } from "./values/string";
import { VectorBase } from "./values/vector-base";
import { nothing } from "./values/void";
import { GenericType } from "./types/generic";
import { SIBaseType, VectorBaseType } from "./types/bases";
import { UnitVector } from "./values/unit-vector";
import { Maybe } from "./values/maybe";

export function boxRawValue(value: RawValue, type: PacioliType): PacioliValue {
  switch (type.kind) {
    case "generic": {
      if (type.name === "Tuple") {
        const values = value as unknown as Array<RawValue>; // Cast!!!
        var array = [];
        for (var i = 0; i < values.length; i++) {
          array.push(boxRawValue(values[i], type.items[i]));
        }
        return tagKind(array, "tuple");
      } else if (type.name === "Boole") {
        if (typeof value === "boolean") {
          return value ? pacioliTrue : pacioliFalse; // Cast!!!
        } else {
          throw new Error(
            `Expected a boolean instead of ${value} when boxing raw boolean value`
          );
        }
      } else if (type.name === "String") {
        if (typeof value === "string") {
          return new PacioliString(value as unknown as string); // Cast!!!
        } else {
          throw new Error(
            `Expected a string instead of ${value} when boxing raw string value`
          );
        }
      } else if (type.name === "Void") {
        return nothing;
      } else if (type.name === "Maybe") {
        return new Maybe(
          type,
          value ? boxRawValue(value, type.items[0]) : undefined
        );
      } else if (type.name === "List") {
        if (typeof value === "object") {
          const values = value as unknown as Array<RawValue>; // Cast!!!
          var array = [];
          for (var i = 0; i < values.length; i++) {
            array.push(boxRawValue(values[i], type.items[0]));
          }
          tagType(array, type);
          return tagKind(array, "list"); // Cast!!!
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
        return new PacioliFunction(value, type);
      } else {
        throw new Error(
          `Expected a function instead of ${value} when boxing raw function value`
        );
      }
    }
    case "matrix": {
      return new Matrix(matrixShapeFromType(type), value);
    }
    case "typevar": {
      throw Error(
        `Unxpected typevar '${
          type.kind
        }' for type ${typeof value} with value ${value} `
      );
    }
    default: {
      throw new Error(
        `Unxpected kind '${
          type.kind
        }' for type ${typeof value} with value ${value} `
      );
    }
  }
}

export function matrixShapeFromType(type: MatrixType): MatrixShape {
  const rowDim = matrixDimensionFromIndex(type.rowIndex);
  const columnDim = matrixDimensionFromIndex(type.columnIndex);
  return new MatrixShape(
    internUnit(type.multiplier),
    rowDim,
    internUnitVector(rowDim, type.rowUnit),
    columnDim,
    internUnitVector(columnDim, type.columnUnit)
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
      return (value as any).type;
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
      throw new Error("TODO");
    }
  }
}

export function rawValueFromValue(value: PacioliValue): any {
  switch (value.kind) {
    case "matrix": {
      return value.numbers;
    }
    case "tuple": {
      return (value as unknown as PacioliValue[]).map(rawValueFromValue);
    }
    case "list": {
      return (value as unknown as PacioliValue[]).map(rawValueFromValue);
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
        ? undefined
        : rawValueFromValue(value.value);
    }
    default: {
      throw new Error("TODO");
    }
  }
}

function matrixDimensionFromIndex(index: PacioliIndex): MatrixDimension {
  if (index.kind === "index") {
    return new MatrixDimension(
      index.sets.map((name) => {
        const set = fetchIndex(name);
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
function internUnit(unit: PacioliUnit): SIUnit {
  return unit.map((base) => {
    if (base.isVar) {
      throw new Error("cannot have variable");
    } else {
      const siUnit = fetchUnit(base.prefix, base.getName());
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
    UOM.fromBase(new SIBaseType(base.prefix.name, base.getName()))
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
  unit: PacioliVector
): SIVector {
  const siUnit: SIVector = unit.map((base) => {
    if (base.isVar) {
      throw new Error("cannot have variable");
    } else {
      const unitObject = fetchVectorBase(base.getName()).units;
      const unitMap = new Map<string, SIUnit>();
      for (const [key, value] of Object.entries(unitObject)) {
        unitMap.set(key, internUnit(value as PacioliUnit));
      }
      const unitVector = UnitVector.fromMap(
        base.getName(),
        dimension.indexSets[base.position],
        unitMap
      );
      if (unitVector !== undefined) {
        const siUnitVec: SIVector = UOM.fromBase(
          new VectorBase(unitVector, base.position, base.getName())
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
