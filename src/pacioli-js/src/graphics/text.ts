import { PacioliMatrix } from "../values/matrix";
import { PacioliString } from "../values/string";

/**
 * Matches the Label type from the graphics Pacioli library.
 */
export type PacioliLabel = [
  PacioliString, // characters
  PacioliMatrix, // position
  PacioliMatrix, // direction
  PacioliString, // color
  PacioliString // font
];
