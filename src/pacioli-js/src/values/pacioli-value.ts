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

import {
  makeRawMaybe,
  NOTHING,
  tagArray,
  tagList,
  tagSet,
  tagTuple,
  type RawValue,
} from "../raw-values/raw-value";
import { type CustomPacioliValue } from "./custom";
import { PacioliBoole } from "./boole";
import { PacioliFunction } from "./function";
import { PacioliString } from "./string";
import { VOID, type PacioliVoid } from "./void";
import { PacioliMaybe } from "./maybe";
import { PacioliCoordinates } from "./coordinates";
import { PacioliTuple } from "./tuple";
import { PacioliList } from "./list";
import { PacioliSet } from "./set";
import { PacioliArray } from "./array";
import type { PacioliRef } from "./ref";
import { PacioliMap } from "./map";
import { PacioliMatrix } from "./matrix";

export type PacioliKind =
  | "matrix"
  | "list"
  | "set"
  | "tuple"
  | "array"
  | "ref"
  | "coordinates"
  | "map"
  | "maybe"
  | "void"
  | "string"
  | "boole"
  | "function"
  | "custom";

export type PacioliValue =
  | PacioliMatrix
  | PacioliCoordinates
  | PacioliTuple
  | PacioliList
  | PacioliSet
  | PacioliArray
  | PacioliRef
  | PacioliBoole
  | PacioliFunction
  | PacioliString
  | PacioliMap
  | PacioliVoid
  | PacioliMaybe
  | CustomPacioliValue; // CustomPacioliValue

export interface ToText {
  toText(): string;
}

/**
 * Wraps a RawValue in a PacioliValue.
 *
 * Dual of unboxPacioliValue
 *
 * @param value A raw value
 * @returns A boxed value
 */
export function boxRawValue(value: RawValue): PacioliValue {
  if (typeof value === "string") {
    return new PacioliString(value);
  }

  if (typeof value === "function") {
    return new PacioliFunction(value);
  }

  if (typeof value === "boolean") {
    return new PacioliBoole(value);
  }
  if (value === undefined) {
    // dispatch was previously based on type:
    // case "Void": {
    //   return VOID;
    // }
    // This avoided the undefined. The compiler has to generate return VOID for all statements!?
    return VOID;
  }

  switch (value.kind) {
    case "tuple": {
      return new PacioliTuple(value.items.map((entry) => boxRawValue(entry)));
    }
    case "list": {
      return new PacioliList(value.items.map((entry) => boxRawValue(entry)));
    }
    case "set": {
      return new PacioliSet(value.items.map((entry) => boxRawValue(entry)));
    }
    case "array": {
      return new PacioliArray(value.items.map((entry) => boxRawValue(entry)));
    }
    case "void": {
      return VOID;
    }
    case "maybe": {
      const val = value.value;
      return new PacioliMaybe(val === undefined ? undefined : boxRawValue(val));
    }
    case "map": {
      return new PacioliMap(value);
    }
    case "matrix": {
      return new PacioliMatrix(value.shape, value);
    }
    case "coordinates": {
      return new PacioliCoordinates(value.names, value.indexSets);
    }
    case "custom": {
      return value;
    }
    case "ref": {
      throw new Error("ref is deprecated!?");
    }
  }
}

/**
 * Gets a RawValue from a PacioliValue.
 *
 * Dual of boxRawValue
 *
 * @param value a Pacioli value
 * @returns a raw value
 */
export function unboxPacioliValue(value: PacioliValue): RawValue {
  switch (value.kind) {
    case "matrix": {
      return value.numbers;
    }
    case "tuple": {
      return tagTuple(value.map((element) => unboxPacioliValue(element)));
    }
    case "list": {
      return tagList(value.map((element) => unboxPacioliValue(element)));
    }
    case "set": {
      return tagSet(value.map((element) => unboxPacioliValue(element)));
    }
    case "array": {
      return tagArray(value.map((element) => unboxPacioliValue(element)));
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
        : makeRawMaybe(unboxPacioliValue(value.value));
    }
    case "map": {
      return value.rawMap;
    }
    case "void": {
      return VOID;
    }
    case "ref": {
      throw Error("ref is deprecated?!");
    }
    case "coordinates": {
      return {
        kind: "coordinates",
        names: value.names,
        indexSets: value.indexSets,
        size: value.size,
        position: value.position,
      };
    }
    case "custom": {
      return value;
    }
  }
}
