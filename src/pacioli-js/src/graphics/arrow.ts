import { SIUnit } from "uom-ts";
import { PacioliMatrix } from "../values/matrix";
import { PacioliString } from "../values/string";
import {
  makeCanvasLabelObject,
  updateCanvasLabelObject,
  vector2THREE,
} from "./threejs";
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
  body.add(createTHREEArrowHelper(arrow, options));

  // Add a label. Only skip if it is empty and will always stay empty (no name given for updates)
  if (arrowName(arrow) !== "" || arrowLabel(arrow) !== "") {
    body.add(createTHREELabel(arrow, options));
  }
}

export function updateArrow(
  body: THREE.Object3D<THREE.Event>,
  pacioliArrow: PacioliArrow,
  options: {
    unitX: SIUnit;
    unitY: SIUnit;
    unitZ: SIUnit;
    scale: number;
    labelScale: number;
  }
) {
  const [from, to, name, label, color] = pacioliArrow;

  if (name.value !== "") {
    // Update the arrow helper
    const arrow = body.getObjectByName(name.value) as THREE.ArrowHelper;

    if (arrow) {
      const [dirVec, vectorLength] = arrowDirectionAndLength(to, options);
      const vectorColor = color.value === "" ? "blue" : color.value;
      const jsVector = vector2THREE(from, options);

      arrow.position.set(jsVector.x, jsVector.y, jsVector.z);
      arrow.setDirection(dirVec);
      arrow.setLength(vectorLength);
      arrow.setColor(vectorColor);
    }

    // Update the label
    const labelObj = body.getObjectByName(name.value + "_label") as THREE.Mesh<
      THREE.PlaneGeometry,
      THREE.MeshBasicMaterial
    >;

    if (labelObj) {
      const labelPos = vector2THREE(from, options).add(
        vector2THREE(to, options)
      );

      labelObj.position.set(
        labelPos.x,
        labelPos.y + 0.5 * options.labelScale,
        labelPos.z
      );

      updateCanvasLabelObject(labelObj, label.value);
    }
  }
}

function createTHREEArrowHelper(
  arrow: PacioliArrow,
  options: { unitX: SIUnit; unitY: SIUnit; unitZ: SIUnit; scale: number }
): THREE.ArrowHelper {
  const [origin, vector, name, _, color] = arrow;

  const vectorColor = color.value === "" ? "blue" : color.value;
  const from = vector2THREE(origin, options);
  const [dirVec, vectorLength] = arrowDirectionAndLength(vector, options);

  let arr = new THREE.ArrowHelper(dirVec, from, vectorLength, vectorColor);

  if (name.value !== "") {
    arr.name = name.value;
  }

  return arr;
}

function arrowDirectionAndLength(
  vector: PacioliMatrix,
  options: { unitX: SIUnit; unitY: SIUnit; unitZ: SIUnit; scale: number }
): [THREE.Vector3, number] {
  const threeVector = vector2THREE(vector, options);

  const vectorLength = Math.sqrt(
    threeVector.x ** 2 + threeVector.y ** 2 + threeVector.z ** 2
  );

  threeVector.normalize();

  return [threeVector, vectorLength];
}

function createTHREELabel(
  arrow: PacioliArrow,
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
  const [origin, vector, name, label, _] = arrow;

  const labelObject = makeCanvasLabelObject(label.value, 0.7, options);

  const labelPos = vector2THREE(origin, options).add(
    vector2THREE(vector, options)
  );

  labelObject.position.set(
    labelPos.x,
    labelPos.y + 0.5 * options.labelScale,
    labelPos.z
  );

  // Add a name if given, so the label can be found during an update.
  if (name.value !== "") {
    labelObject.name = name.value + "_label";
  }

  return labelObject;
}
