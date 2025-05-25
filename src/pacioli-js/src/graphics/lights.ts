import { SIUnit } from "uom-ts";
import { PacioliMatrix } from "../values/matrix";
import { PacioliString } from "../values/string";
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
  body: THREE.Object3D<THREE.Event>,
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
