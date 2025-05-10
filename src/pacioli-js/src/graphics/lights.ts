import { PacioliMatrix } from "../values/matrix";
import { PacioliString } from "../values/string";

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
