import { PacioliBoole } from "../values/boole";
import { PacioliMatrix } from "../values/matrix";
import { PacioliMaybe } from "../values/maybe";
import { PacioliString } from "../values/string";
import { PacioliTuple } from "../values/tuple";

/**
 * Matches the Mesh type from the graphics Pacioli library
 */
export type PacioliMesh = [
  [PacioliMatrix, PacioliString][], // vertices
  [PacioliMatrix, PacioliMatrix, PacioliMatrix][], // faces
  PacioliMaybe, // position
  PacioliTuple, // rotations
  PacioliString, // name
  PacioliBoole, // wireframe
  PacioliString // material
];
