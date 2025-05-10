import { SIUnit } from "uom-ts";
import { conversionFactor } from "../api";
import { PacioliMatrix } from "../values/matrix";
import { getNumber } from "../values/numbers";
import * as THREE from "three";
import { CSS2DObject } from "three/examples/jsm/renderers/CSS2DRenderer";

export function createGridHelper(gridX: number, gridY: number, color: string) {
  const gridColor = new THREE.Color(color);
  return new THREE.GridHelper(gridX, gridY, gridColor, gridColor);
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
  unit: { x: SIUnit; y: SIUnit; z: SIUnit },
  scale?: number
) {
  const extraFactor = scale ?? 1;
  const numbers = vector.numbers;

  // Find the conversion factor between the vectors' units and the space's unit. Assume
  // that the vector units are homogeneous (the same for x, y and z), and the unit is in
  // the type's multiplier.
  var factorx =
    extraFactor *
    conversionFactor(vector.shape.unitAt(0, 0), unit.x).toNumber();
  var factory =
    extraFactor *
    conversionFactor(vector.shape.unitAt(1, 0), unit.y).toNumber();
  var factorz =
    extraFactor *
    conversionFactor(vector.shape.unitAt(2, 0), unit.z).toNumber();

  return new THREE.Vector3(
    getNumber(numbers, 0, 0) * factorx,
    getNumber(numbers, 2, 0) * factory,
    getNumber(numbers, 1, 0) * factorz
  );
}

/**
 * Creates a three.js CSS2DObject for displaying a label with a CSS2DRenderer.
 *
 * @param text The label text
 * @param x The label x coordinate
 * @param y The label y coordinate
 * @param z The label z coordinate
 * @returns A new CSS2DObject object
 */
export function makeLabelObject(
  text: string,
  x: number,
  y: number,
  z: number,
  color: string
) {
  const labelDiv = document.createElement("div");
  labelDiv.className = "label";
  //labelDiv.textContent = label.value;
  labelDiv.innerHTML = text;
  labelDiv.style.backgroundColor = "transparent";
  labelDiv.style.color = color;

  const labelObject = new CSS2DObject(labelDiv);
  labelObject.position.set(x, y, z);
  // label.center.set(0, 1);
  // label.layers.set(0);
  return labelObject;
}
