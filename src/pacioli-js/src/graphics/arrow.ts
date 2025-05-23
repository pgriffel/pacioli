import { SIUnit } from "uom-ts";
import { PacioliMatrix } from "../values/matrix";
import { PacioliString } from "../values/string";
import { makeLabelObject, vector2THREE } from "./threejs";
import * as THREE from "three";
import { CSS2DObject } from "three/examples/jsm/renderers/CSS2DRenderer";

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

export function arrowLabel(arrow: PacioliArrow): string {
  const [_origin, _vector, _name, label, _color] = arrow;
  return label.value;
}

export function arrowName(arrow: PacioliArrow): string {
  const [_origin, _vector, name, _label, _color] = arrow;
  return name.value;
}

export function addArrow(
  body: THREE.Object3D<THREE.Event>,
  arrow: PacioliArrow,
  units: { x: SIUnit; y: SIUnit; z: SIUnit },
  color: string
) {
  body.add(createTHREEArrowHelper(arrow, units));

  // Add a label. Only skip if it is empty and will always stay empty (no name given for updates)
  if (arrowName(arrow) !== "" || arrowLabel(arrow) !== "") {
    body.add(createTHREELabel(arrow, units, color));
  }
}

export function updateArrow(
  body: THREE.Object3D<THREE.Event>,
  pacioliArrow: PacioliArrow,
  units: { x: SIUnit; y: SIUnit; z: SIUnit }
) {
  const [from, to, name, label, color] = pacioliArrow;

  if (name.value !== "") {
    // Update the ArrowHelper if needed
    const arrow = body.getObjectByName(name.value) as THREE.ArrowHelper;

    if (arrow) {
      const [dirVec, vectorLength] = arrowDirectionAndLength(to, units);
      const vectorColor = color.value === "" ? "blue" : color.value;
      const jsVector = vector2THREE(from, units);

      arrow.position.set(jsVector.x, jsVector.y, jsVector.z);
      arrow.setDirection(dirVec);
      arrow.setLength(vectorLength);
      arrow.setColor(vectorColor);
    }

    // Update the label if needed
    const labelObj = body.getObjectByName(name + "_label") as CSS2DObject;
    if (labelObj) {
      const vec = vector2THREE(to, units);
      const labelPos = vector2THREE(from, units).multiplyScalar(1.1).add(vec);

      labelObj.position.set(labelPos.x, labelPos.y, labelPos.z);
      labelObj.element.innerHTML = label.value;
    }
  }
}

function createTHREEArrowHelper(
  arrow: PacioliArrow,
  unit: { x: SIUnit; y: SIUnit; z: SIUnit }
): THREE.ArrowHelper {
  const [origin, vector, name, _, color] = arrow;

  const vectorColor = color.value === "" ? "blue" : color.value;
  const from = vector2THREE(origin, unit);
  const [dirVec, vectorLength] = arrowDirectionAndLength(vector, unit);

  // Use three.js's ArrowHelper to display the vector.
  let arr = new THREE.ArrowHelper(dirVec, from, vectorLength, vectorColor);

  if (name.value !== "") {
    arr.name = name.value;
  }

  return arr;
}

function arrowDirectionAndLength(
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

function createTHREELabel(
  arrow: PacioliArrow,
  unit: { x: SIUnit; y: SIUnit; z: SIUnit },
  color: string
) {
  const [origin, vector, name, label, _] = arrow;

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
