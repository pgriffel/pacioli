import { SIUnit } from "uom-ts";
import { PacioliMatrix } from "../values/matrix";
import { PacioliString } from "../values/string";
import { arrowDirectionAndLength, vector2THREE } from "./threejs";
import * as THREE from "three";

/**
 * Matches the Arrow type from the graphics Pacioli library
 */
export type PacioliArrow = [
  PacioliMatrix, // from
  PacioliMatrix, // to
  PacioliString, // name
  PacioliString, // label
  PacioliString // color
];

export function createTHREEArrowHelper(
  origin: PacioliMatrix,
  vector: PacioliMatrix,
  name: PacioliString,
  color: PacioliString,
  unit: { x: SIUnit; y: SIUnit; z: SIUnit }
): THREE.ArrowHelper {
  const vectorColor = color.value === "" ? "blue" : color.value;
  const from = vector2THREE(origin, unit);
  const [dirVec, vectorLength] = arrowDirectionAndLength(vector, unit);

  // Use three.js's ArrowHelper to display the vector.
  let arrow = new THREE.ArrowHelper(dirVec, from, vectorLength, vectorColor);

  if (name.value !== "") {
    arrow.name = name.value;
  }

  return arrow;
}
