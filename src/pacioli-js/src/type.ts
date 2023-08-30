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

import { UOM } from "uom-ts";
import { IndexType, MatrixType } from "./types/matrix";
import { GenericType } from "./types/generic";
import { FunctionType } from "./types/function";
import { TypeVar, UnitVar } from "./types/variables";
import { SIBaseType, VectorBaseType } from "./types/bases";

/**
 * The type of a Pacioli value.
 *
 * A major difference between a type and a shape is that a type is not interned. This means
 * that it is build just from names of index sets and units, not from actual index sets
 * and units. Consequently a type can be read without any context. Only when a context is
 * available it can be instantiated to a shape.
 *
 * A second difference is that a type can contain variables. A shape cannot contain
 * variables.
 */
export type PacioliType =
  | MatrixType
  | GenericType
  | FunctionType
  | IndexType
  | TypeVar;

/**
 * Unit of measurement scalar used in Pacioli types
 */
export type PacioliUnit = UOM<SIBaseType | UnitVar>;

/**
 * Unit of measurement vector used in Pacioli types
 */
export type PacioliVector = UOM<VectorBaseType | UnitVar>;
