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

import type { SIUnit } from "uom-ts";
import type { PacioliMatrix } from "../values/matrix";
import type { PacioliString } from "../values/string";
import { vector2THREE } from "./threejs";
import * as THREE from "three";

/**
 * Matches the Path type from the graphics Pacioli library
 */
export type PacioliPath = {
  items: [
    { items: PacioliMatrix[] }, // path points
    PacioliString, // color
  ];
};

function pathPositions(path: PacioliPath): PacioliMatrix[] {
  return path.items[0].items;
}

function pathColor(path: PacioliPath): string {
  return path.items[1].value;
}

export function addPath(
  body: THREE.Object3D,
  path: PacioliPath,
  options: { unitX: SIUnit; unitY: SIUnit; unitZ: SIUnit; scale: number },
) {
  body.add(createTHREEPath(path, options));
}

export function disposePath(line: THREE.Line) {
  line.geometry.dispose();
}

function createTHREEPath(
  path: PacioliPath,
  options: { unitX: SIUnit; unitY: SIUnit; unitZ: SIUnit; scale: number },
) {
  const geometry = new THREE.BufferGeometry();
  const material = new THREE.LineBasicMaterial({
    color: pathColor(path) === "" ? "#222222" : pathColor(path),
    transparent: true,
    opacity: 1.0,
  });

  geometry.setFromPoints(
    pathPositions(path).map((point: PacioliMatrix) =>
      vector2THREE(point, options),
    ),
  );

  const lineObject = new THREE.Line(geometry, material);

  return lineObject;
}
