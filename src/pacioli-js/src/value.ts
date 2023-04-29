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

import { PacioliType } from "./type";
import { PacioliBoole } from "./values/boole";
import { Coordinates } from "./values/coordinates";
import { PacioliFunction } from "./values/function";
import { Matrix } from "./values/matrix";
import { PacioliString } from "./values/string";
import { Void } from "./values/void";

/* Runtime Types
 *
 * A value's type is a Type object with a kind and a param according to
 * the following table:
 *
 *   Kind             | Type Param               | Value
 *   -----------------+--------------------------+-----------------------
 *   boole            | -                        | js boole
 *   matrix           | Shape Object             | Full, DOK, COO or CCS array
 *   coordinate       | Coordinate Object        | js Object {position: i, size: n} with 0<=i<n
 *   function         | Function                 | js Function
 *   tuple            | List of Element Type     | js Array
 *   list             | Element Type             | js Array
 *   reference        | Element Type             | Singleton js Array
 *   void             | null                     | null
 *
 * Notes:
 * - A value that is not a Boole or Function is tagged with its kind
 * - An unknown type (for empty lists and refs) is indicated with null.
 * - A matrix is additionally tagged with its storage, nrRows and nrColumns
 * - The coordinate object is a representative. Its names are ignored.
 * - See file numbers.js for the Full, DOK, COO or CCS arrays
 */

/**
 * Typescript type tags for all possible run time Pacioli values. The types form a
 * discriminating union.
 */

// TODO: strip!
export type RawTag =
  | "numbers"
  | "position"
  | "boole"
  | "function"
  | "tuple"
  | "list"
  | "reference"
  | "void"
  | "primitive";

// should be somehting like  type RawValue = RawTagged | string | boole | function

export type RawValue = RawTagged;

export interface RawTagged {
  readonly kind: RawTag;
}

/**
 * Not typesafe!
 *
 * @param value
 * @param kind
 * @returns
 */
export function tagKind(
  value: any,
  kind: "tuple" | "list" | "reference" | "void"
): Tagged {
  value.kind = kind;
  return value as Tagged;
}

export function tagType(value: any, type: PacioliType): Tagged {
  value.type = type;
  return value as Tagged;
}

// TaggedArray noemen
export interface Tagged {
  readonly kind: "tuple" | "list" | "reference";
}

export type PacioliValue =
  | Matrix
  | Coordinates
  | Tagged
  | PacioliBoole
  | PacioliFunction
  | PacioliString
  | Void;

export interface ToText {
  toText(): string;
}
