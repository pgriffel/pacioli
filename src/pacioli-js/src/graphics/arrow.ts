import { SIUnit } from "uom-ts";
import { PacioliMatrix } from "../values/matrix";
import { PacioliString } from "../values/string";
import { makeLabelObject, vector2THREE } from "./threejs";
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

export function arrowDirectionAndLength(
  vector: PacioliMatrix,
  unit: { x: SIUnit; y: SIUnit; z: SIUnit }
): [THREE.Vector3, number] {
  const threeVector = vector2THREE(vector, unit);

  const vectorLength = Math.sqrt(
    threeVector.x ** 2 + threeVector.y ** 2 + threeVector.z ** 2
  );

  threeVector.normalize();

  return [threeVector, vectorLength];
}

// threeJsArrowLabel
export function createTHREELabel(
  origin: PacioliMatrix,
  vector: PacioliMatrix,
  name: PacioliString,
  label: PacioliString,
  unit: { x: SIUnit; y: SIUnit; z: SIUnit },
  color: string
) {
  const vec = vector2THREE(vector, unit);
  const labelPos = vector2THREE(origin, unit).multiplyScalar(1.1).add(vec);

  // Add a label if required
  const labelObject = makeLabelObject(
    label.value,
    labelPos.x,
    labelPos.y,
    labelPos.z,
    color
  );

  // Add a name if given, so the label can be found during an update.
  if (name.value !== "") {
    labelObject.name = name.value + "_label";
  }

  return labelObject;
}
