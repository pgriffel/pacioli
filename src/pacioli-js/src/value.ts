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

import { StringifiedTableData } from "./dom/table";
import { NR_DECIMALS } from "./primitives";
import type { PacioliCoordinates } from "./values/coordinates";
import type { PacioliMap } from "./values/map";
import type { MatrixShape } from "./values/matrix-shape";
import { RawMaybe } from "./values/maybe";
import { getFullNumbers } from "./values/numbers";
import type { PacioliVoid } from "./values/void";

/**
 * All possible raw Pacioli values. The unboxed values used by the primitive
 * functions.
 */
export type RawValue =
  | RawMatrix
  | RawList
  | RawTuple
  | RawArray
  | RawRef
  | RawCoordinates
  | RawFunction
  | RawBoole
  | RawString
  | RawMap
  | RawMaybe
  | RawVoid;

// export type MatrixStorage = 0 | 1 | 2 | 3; // Full, DOK, COO or CCS

// export const STORAGE_FULL = 0;
// export const STORAGE_DOK = 1;
// export const STORAGE_COO = 2;
// export const STORAGE_CCS = 3;

export type MatrixStorage = "0" | "1" | "2" | "3"; // Full, DOK, COO or CCS

export const STORAGE_FULL = "0";
export const STORAGE_DOK = "1";
export const STORAGE_COO = "2";
export const STORAGE_CCS = "3";

/**
 * The RawValue kind is not complete. It is undefined for strings, booleans and functions.
 *
 * This label is an alternative that is complete. Useful to display to the user, etc.
 *
 * @param value Any raw value
 * @returns One of the labels.
 */
export function rawValueLabel(
  value: RawValue
):
  | "matrix"
  | "list"
  | "tuple"
  | "array"
  | "ref"
  | "coordinates"
  | "map"
  | "maybe"
  | "void"
  | "string"
  | "boolean"
  | "function" {
  if (typeof value === "string") {
    return "string";
  } else if (typeof value === "boolean") {
    return "boolean";
  } else if (typeof value === "function") {
    return "function";
  } else {
    return value.kind;
  }
}

/**
 * String representation of a raw Pacioli value.
 *
 * Does not include unit information.
 *
 * Satisfies
 *
 *  x equals y in Pacioli
 *    <=>
 *  stringifyRawValue(x) === stringifyRawValue(y)
 *
 * when units are ignored and equality is defined.
 *
 * The last is important for e.g. boolean true and string
 * "true", but also for list and tuples, because it does
 * not hold in these cases. Function stringifyRawValue
 * treats list and tuples as equal. This is not a problem
 * because Pacioli does not allow equality between a list
 * and a tuple.
 *
 * Is not a method because we use primitive javascript values.
 * For PacioliValue there is the toText method. Where possible
 * we reuse that.
 *
 * @param value
 */
export function stringifyRawValue(value: RawValue): string {
  if (typeof value === "string") {
    return value;
  }

  if (typeof value === "function") {
    return "|closure|";
  }

  if (typeof value === "boolean") {
    return value ? "true" : "false";
  }

  switch (value.kind) {
    case "matrix": {
      return tableDataFromRawMatrix(value, "Value", false).ascii();
      // return `mat(${value.nrRows.toString()}, ${value.nrColumns.toString()}) ${value.join(
      //   " + "
      // )} ${value.storage.toString()}`;
    }
    case "list": {
      return `[${value.map(stringifyRawValue).join(", ")}]`;
    }
    case "tuple": {
      return `[${value.map(stringifyRawValue).join(", ")}]`;
    }
    case "array": {
      return `<${value.map(stringifyRawValue).join(", ")}>`;
    }
    case "ref": {
      return `<${value.map(stringifyRawValue).join(", ")}>`;
    }
    case "coordinates": {
      return `${value.size.toString()}@${value.position.toString()}`;
    }
    case "map": {
      const pairs: string[] = [];

      for (const key of value.keyMap.keys()) {
        const k = value.keyMap.get(key);
        const v = value.valueMap.get(key);
        if (k !== undefined && v !== undefined) {
          pairs.push(`${stringifyRawValue(k)}->${stringifyRawValue(v)}`);
        }
      }
      return `<${pairs.join(", ")}>`;
    }
    case "void": {
      return "Void";
    }
    case "maybe": {
      return value.value === undefined
        ? "Nothing"
        : `just<${stringifyRawValue(value.value)}>`;
    }
  }
}

export function tableDataFromRawMatrix(
  matrix: RawMatrix,
  header: string,
  _showTotal: boolean,
  total?: string
): StringifiedTableData {
  const indexSets = {
    row: matrix.nrRows === 1 ? [] : ["row"],
    column: matrix.nrColumns === 1 ? [] : ["column"],
  };
  const index: {
    row: string[];
    column: string[];
  }[] = [];
  const columnHeaders: string[] = [header];
  const columns: {
    row: { magnitude: string; unit: string }[];
    isZero: boolean;
  }[] = [];

  const nrRows = matrix.nrRows;
  const nrColumns = matrix.nrColumns;

  let effectiveTotal = 0;

  if (nrRows === 0 || nrColumns === 0) {
    throw new Error("No rows and columns?");
  } else {
    const numbers = getFullNumbers(matrix);

    // Add the data rows
    for (let i = 0; i < nrRows; i++) {
      for (let j = 0; j < nrColumns; j++) {
        const indexEntry = {
          row: [i.toString()],
          column: [j.toString()],
        };

        index.push(indexEntry);

        const num = numbers[i][j];

        const dimNum = { magnitude: num.toFixed(NR_DECIMALS), unit: "" };

        columns.push({ row: [dimNum], isZero: num === 0 });

        effectiveTotal += num;
      }
    }
  }

  return new StringifiedTableData(indexSets, index, columnHeaders, columns, [
    {
      magnitude: total === undefined ? effectiveTotal.toString() : total,
      unit: "",
    },
  ]);
}

/**
 * Type of an unboxed matrix. Implemented as a nested array of numbers with some
 * extra properties (nr rows, nr columns, and storage kind). The meaning of the
 * numbers depends on the storage kind.
 */
export interface RestMatrix extends Array<Array<number>> {
  kind: "matrix";
  nrRows: number;
  nrColumns: number;
  shape?: MatrixShape; // see oneNumbersFromShape
  storage: "0" | "1" | "2" | "3";
}

export type RawMatrix = RestMatrix; // | DOKMatrix;

export interface DOKMatrix extends Array<Array<number> | undefined> {
  kind: "matrix";
  nrRows: number;
  nrColumns: number;
  shape?: MatrixShape; // see oneNumbersFromShape
  storage: "1";
}

/**
 * Type of an unboxed Pacioli tuple. A javascript array tagged with kind 'tuple'.
 */
export interface RawTuple extends Array<RawValue> {
  kind: "tuple";
}

/**
 * Type of an unboxed Pacioli list. A javascript array tagged with kind 'list'.
 */
export interface RawList extends Array<RawValue> {
  kind: "list";
}

/**
 * Type of an unboxed Pacioli array. A javascript array tagged with kind 'array'.
 */
export interface RawArray extends Array<RawValue> {
  kind: "array";
}

/**
 * Type of an unboxed Pacioli map. The same as a non-raw map.
 */
export type RawMap = PacioliMap;

/**
 * Type of raw Void. The same as the non-raw type.
 */
export type RawVoid = PacioliVoid;

/**
 * Type of an unboxed mutable Pacioli value. A javascript array tagged with kind 'ref'.
 */
export interface RawRef extends Array<RawValue> {
  kind: "ref";
}

/**
 * Type of an unboxed Pacioli coordinates object. Index sets elements are represented by
 * the position in the index set. The size is the size of the index set.
 */
export interface RawCoordinates {
  kind: "coordinates";
  position: number;
  size: number;
  coords?: PacioliCoordinates; // TODO: check when it exists. $base_matrix_row_domain does not provide it!
}

/**
 * Type of the raw (unboxed) Pacioli functions generated by the compiler.
 *
 * Conceptually Pacioli's functions are of type:
 *
 *   RawTuple => RawValue.
 *
 * The compiler maps this to a vararg function:
 *
 *   (...RawValue[]) => RawValue.
 *
 */
export type RawFunction = (...args: RawValue[]) => RawValue;

/**
 * Type of an unboxed Pacioli string. Maps directly to a javascript string.
 */
export type RawString = string;

/**
 * Type of an unboxed Pacioli boolean. Maps directly to a javascript boolean.
 */
export type RawBoole = boolean;

/**
 * Pacioli's nothing value.
 */
export const NOTHING = new RawMaybe();

export function tagList(value: Array<RawValue>): RawList {
  (value as RawList).kind = "list";
  return value as RawList;
}

export function tagTuple(value: Array<RawValue>): RawTuple {
  (value as RawTuple).kind = "tuple";
  return value as RawTuple;
}

export function tagArray(value: Array<RawValue>): RawArray {
  (value as RawArray).kind = "array";
  return value as RawArray;
}

export function tagRef(value: Array<RawValue>): RawRef {
  (value as RawRef).kind = "ref";
  return value as RawRef;
}
