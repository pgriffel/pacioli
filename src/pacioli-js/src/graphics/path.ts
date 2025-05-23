import { SIUnit } from "uom-ts";
import { PacioliMatrix } from "../values/matrix";
import { PacioliString } from "../values/string";
import { vector2THREE } from "./threejs";
import * as THREE from "three";

/**
 * Matches the Path type from the graphics Pacioli library
 */
export type PacioliPath = [
  PacioliMatrix[], // path points
  PacioliString // color
];

export function addPath(
  body: THREE.Object3D<THREE.Event>,
  path: PacioliPath,
  units: { x: SIUnit; y: SIUnit; z: SIUnit }
) {
  body.add(createTHREEPath(path, units));
}

export function disposePath(line: THREE.Line) {
  line.geometry.dispose();
}

function createTHREEPath(
  path: PacioliPath,
  unit: { x: SIUnit; y: SIUnit; z: SIUnit }
) {
  var geometry = new THREE.BufferGeometry();
  var material = new THREE.LineBasicMaterial({
    color: path[1].value === "" ? "#222222" : path[1].value,
    transparent: true,
    opacity: 1.0,
  });

  geometry.setFromPoints(
    path[0].map((point: PacioliMatrix) => vector2THREE(point, unit))
  );

  var lineObject = new THREE.Line(geometry, material);

  return lineObject;
}
