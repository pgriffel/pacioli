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
import type { PacioliMatrix } from "../values/matrix";
import type { PacioliString } from "../values/string";
import { vector2THREE } from "./threejs";
import { getNumber } from "../values/numbers";
import * as THREE from "three";

/**
 * Matches the SpotLight type from the graphics Pacioli library
 */
export type PacioliSpotLight = [
  PacioliMatrix, // position
  PacioliMatrix, // target
  PacioliString, // color
  PacioliMatrix // intensity
];

/**
 * Matches the ambient light part of the Scene type from the
 * graphics Pacioli library.
 */
export type AmbientLight = [
  PacioliString, // color
  PacioliMatrix // intensity
];

export function addSpotLight(
  body: THREE.Object3D<THREE.Object3DEventMap>,
  spotlight: PacioliSpotLight,
  options: { unitX: SIUnit; unitY: SIUnit; unitZ: SIUnit; scale: number }
) {
  const [position, target, color, intensity] = spotlight;

  const positionVector = vector2THREE(position, options);
  const targetVector = vector2THREE(target, options);

  const light = new THREE.SpotLight(
    new THREE.Color(color.value),
    getNumber(intensity.numbers, 0, 0)
  );

  light.position.set(positionVector.x, positionVector.y, positionVector.z);
  light.target.position.set(targetVector.x, targetVector.y, targetVector.z);

  body.add(light);
  body.add(light.target);
}
