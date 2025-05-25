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
  options: { unitX: SIUnit; unitY: SIUnit; unitZ: SIUnit; scale: number }
) {
  body.add(createTHREEPath(path, options));
}

export function disposePath(line: THREE.Line) {
  line.geometry.dispose();
}

function createTHREEPath(
  path: PacioliPath,
  options: { unitX: SIUnit; unitY: SIUnit; unitZ: SIUnit; scale: number }
) {
  var geometry = new THREE.BufferGeometry();
  var material = new THREE.LineBasicMaterial({
    color: path[1].value === "" ? "#222222" : path[1].value,
    transparent: true,
    opacity: 1.0,
  });

  geometry.setFromPoints(
    path[0].map((point: PacioliMatrix) => vector2THREE(point, options))
  );

  var lineObject = new THREE.Line(geometry, material);

  return lineObject;
}
