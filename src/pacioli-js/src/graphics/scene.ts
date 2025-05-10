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

import { PacioliString } from "../values/string";
import { PacioliFunction } from "../values/function";
import { PacioliValue } from "../boxing";
import { PacioliArrow } from "./arrow";
import { AmbientLight, PacioliSpotLight } from "./lights";
import { PacioliMesh } from "./mesh";
import { PacioliPath } from "./path";
import { PacioliLabel } from "./text";

/**
 * Matches the Scene type from the graphics Pacioli library
 */
export type PacioliScene = [
  PacioliString,
  PacioliArrow[],
  PacioliMesh[],
  PacioliPath[],
  PacioliSpotLight[],
  AmbientLight,
  PacioliLabel[]
];

/**
 * Matches the Animation type from the graphics Pacioli library
 */
export type Animation = [PacioliFunction, PacioliScene];

/**
 * Matches the StatefulAnimation type from the graphics Pacioli library
 */
export type StatefulAnimation = [PacioliValue, PacioliFunction, PacioliScene];
