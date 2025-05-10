import { PacioliMatrix } from "../values/matrix";
import { PacioliString } from "../values/string";

/**
 * Matches the Path type from the graphics Pacioli library
 */
export type PacioliPath = [
  PacioliMatrix[], // path points
  PacioliString // color
];
