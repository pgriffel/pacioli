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
import { conversionFactor } from "../api";
import { PacioliMatrix } from "../values/matrix";
import { getNumber } from "../values/numbers";
import * as THREE from "three";
import { PacioliTuple } from "../values/tuple";

export function createGridHelper(
  size: number,
  divisions: number,
  color: string
) {
  const gridColor = new THREE.Color(color);
  return new THREE.GridHelper(size, divisions, gridColor, gridColor);
}

/**
 * Moves a THREE.js Object3D to a new position specified by a PacioliMatrix.
 *
 * @param object - The THREE.Object3D instance to move.
 * @param position - The target position as a PacioliMatrix.
 * @param units - An object specifying the SI units for each axis (x, y, z).
 */
export function moveObject(
  object: THREE.Object3D<THREE.Object3DEventMap>,
  position: PacioliMatrix,
  units: { unitX: SIUnit; unitY: SIUnit; unitZ: SIUnit; scale: number }
) {
  const jsVector = vector2THREE(position, units);
  object.position.set(jsVector.x, jsVector.y, jsVector.z);
}

export function rotateObject(
  object: THREE.Object3D<THREE.Object3DEventMap>,
  rotations: PacioliTuple
) {
  const [x, y, z] = rotations;

  if (object) {
    object.rotation.x = getNumber((x as PacioliMatrix).numbers, 0, 0);
    object.rotation.y = getNumber((z as PacioliMatrix).numbers, 0, 0);
    object.rotation.z = getNumber((y as PacioliMatrix).numbers, 0, 0);
  }
}

/**
 * Assume the input numbers is a 3d vector and converts it to a THREE vector
 *
 * @param vector A matrix's numbers
 * @param factor A fudge factor
 * @returns A THREE vector
 */
export function vector2THREE(
  vector: PacioliMatrix,
  options: { unitX: SIUnit; unitY: SIUnit; unitZ: SIUnit; scale: number }
) {
  const extraFactor = options.scale ?? 1;
  const numbers = vector.numbers;

  // Find the conversion factor between the vectors' units and the space's unit. Assume
  // that the vector units are homogeneous (the same for x, y and z), and the unit is in
  // the type's multiplier.
  var factorx =
    extraFactor *
    conversionFactor(vector.shape.unitAt(0, 0), options.unitX).toNumber();
  var factory =
    extraFactor *
    conversionFactor(vector.shape.unitAt(1, 0), options.unitY).toNumber();
  var factorz =
    extraFactor *
    conversionFactor(vector.shape.unitAt(2, 0), options.unitZ).toNumber();

  return new THREE.Vector3(
    getNumber(numbers, 0, 0) * factorx,
    getNumber(numbers, 2, 0) * factory,
    getNumber(numbers, 1, 0) * factorz
  );
}

export function makeCanvasLabelObject(
  text: string,
  scale: number,
  options: {
    fontFamily: string;
    fontSize: number;
    labelColor: string;
    labelScale: number;
  }
): THREE.Mesh<THREE.PlaneGeometry, THREE.MeshBasicMaterial> {
  // See https://threejs.org/manual/#en/canvas-textures

  const completeFont = `${options.fontSize}px ${options.fontFamily}`;

  // Write the text on a new canvas.
  var canvas = document.createElement("canvas");
  var context = canvas.getContext("2d");
  if (context) {
    context.font = completeFont;

    // measureText gives css pixels. 2.54cm = 96px. Add some slack. Does not matter since we align center.
    var width = 1.1 * Math.ceil(context.measureText(text).width);
    var height = options.fontSize;

    // Create a picture of the text.
    canvas.width = width;
    canvas.height = height;

    context.font = completeFont;
    context.fillStyle = options.labelColor;
    context.textAlign = "center";
    context.textBaseline = "middle";
    context.fillText(text, width / 2, height / 2);

    // Put the canvas in a texture and make a plane.
    var texture = new THREE.CanvasTexture(canvas);

    // texture.minFilter = THREE.LinearFilter;
    texture.wrapS = THREE.ClampToEdgeWrapping;
    texture.wrapT = THREE.ClampToEdgeWrapping;

    var cover = new THREE.MeshBasicMaterial({
      map: texture,
      transparent: true,
      side: THREE.DoubleSide,
    });

    var fudge = (options.labelScale * scale) / options.fontSize;
    var shape = new THREE.PlaneGeometry(width * fudge, height * fudge);

    // Create the label
    var label = new THREE.Mesh(shape, cover);

    label.visible = true;
    return label;
  } else {
    throw new Error("could not create context for label");
  }
}

export function updateCanvasLabelObject(
  labelObj: THREE.Mesh<THREE.PlaneGeometry, THREE.MeshBasicMaterial>,
  text: string
) {
  const texture = labelObj.material.map;

  if (texture !== null) {
    var canvas = texture.source.data as HTMLCanvasElement;

    var context = canvas.getContext("2d");

    if (context !== null) {
      const width = 1.1 * Math.ceil(context.measureText(text).width);
      const height = canvas.height;

      // Check if the canvas is wide enough to hold the text. Resize if necessary.
      if (width > canvas.width) {
        const font = context.font;

        canvas.width = width;

        // Resizing the canvas invalidates the context. We need to get a new context.
        const newContext = canvas.getContext("2d");

        if (newContext !== null) {
          newContext.textAlign = "center";
          newContext.font = font;
          newContext.textBaseline = "middle";

          context = newContext;
        } else {
          console.log("no context");
        }
      } else {
        context.clearRect(0, 0, canvas.width, canvas.height);
      }

      context.fillText(text, width / 2, height / 2);

      texture.needsUpdate = true;
    } else {
      console.log("no context");
    }
  } else {
    console.log("no texture");
  }
}
