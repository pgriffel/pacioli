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

import { SIUnit } from "uom-ts";
import { PacioliMatrix } from "../values/matrix";
import { PacioliString } from "../values/string";
import { makeCanvasLabelObject, moveObject } from "./threejs";
import { getNumber } from "../values/numbers";
import * as THREE from "three";

/**
 * Matches the Label type from the graphics Pacioli library.
 */
export type PacioliLabel = [
  PacioliString, // characters
  PacioliMatrix, // position
  PacioliString, // color
  PacioliString, // font
  PacioliMatrix // scale
];

export function addLabel(
  body: THREE.Object3D<THREE.Event>,
  pacioliLabel: PacioliLabel,
  options: {
    labelColor: string;
    labelScale: number;
    fontFamily: string;
    fontSize: number;
    unitX: SIUnit;
    unitY: SIUnit;
    unitZ: SIUnit;
    scale: number;
  }
) {
  const [characters, position, color, font, scale] = pacioliLabel;

  const factor = getNumber(scale.numbers, 0, 0);

  const label = makeCanvasLabelObject(characters.value, factor, {
    fontFamily: font.value === "" ? options.fontFamily : font.value,
    fontSize: options.fontSize * factor,
    labelColor: color.value === "" ? options.labelColor : color.value,
    labelScale: options.labelScale,
  });

  moveObject(label, position, options);

  body.add(label);
}
