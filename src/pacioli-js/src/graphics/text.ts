import { SIUnit } from "uom-ts";
import { PacioliMatrix } from "../values/matrix";
import { PacioliString } from "../values/string";
import { makeCanvasLabelObject, moveObject } from "./threejs";
import { getNumber } from "../values/numbers";
import * as THREE from "three";

/**
 * Matches the Label type from the graphics Pacioli library.
 */
export type PacioliLabel = [
  PacioliString, // characters
  PacioliMatrix, // position
  PacioliString, // color
  PacioliString, // font
  PacioliMatrix // scale
];

export function addLabel(
  body: THREE.Object3D<THREE.Event>,
  pacioliLabel: PacioliLabel,
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
  const [characters, position, color, font, scale] = pacioliLabel;

  const factor = getNumber(scale.numbers, 0, 0);

  const label = makeCanvasLabelObject(characters.value, factor, {
    fontFamily: font.value === "" ? options.fontFamily : font.value,
    fontSize: options.fontSize * factor,
    labelColor: color.value === "" ? options.labelColor : color.value,
    labelScale: options.labelScale,
  });

  moveObject(label, position, options);

  body.add(label);
}
