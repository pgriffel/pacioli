import * as THREE from "three";
import { SIUnit } from "uom-ts";
import { PacioliBoole } from "../values/boole";
import { PacioliMatrix } from "../values/matrix";
import { PacioliMaybe } from "../values/maybe";
import { getNumber } from "../values/numbers";
import { PacioliString } from "../values/string";
import { PacioliTuple } from "../values/tuple";
import { vector2THREE } from "./threejs";

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

export function createTHREEMesh(
  mesh: PacioliMesh,
  unit: { x: SIUnit; y: SIUnit; z: SIUnit }
): THREE.Mesh<THREE.BufferGeometry, THREE.Material> {
  const [vs, fs, pos, rotations, name, hasWireframe, materialOption] = mesh;

  var material = materialOption.value.toLowerCase();

  var props = {
    // overdraw: !(wireframe || transparent),
    wireframe: hasWireframe.value,
    side: THREE.DoubleSide,
    transparent: false,
    // opacity: (transparent) ? 0.5 : 1.0,
    opacity: 1.0,
    vertexColors: true,
  };

  let mat;
  if (material === "normal") {
    mat = new THREE.MeshNormalMaterial(props);
  } else if (material === "lambert") {
    mat = new THREE.MeshLambertMaterial(props);
  } else if (material === "phong") {
    mat = new THREE.MeshPhongMaterial(props);
  } else {
    mat = new THREE.MeshBasicMaterial(props);
  }

  // Create a mesh object with the material and add it to the body
  var meshObject = mesh2THREE(
    [vs, fs],
    mat,
    unit,
    hasWireframe.value
  ) as THREE.Mesh<THREE.BufferGeometry, THREE.Material>;

  if (name.value !== "") {
    meshObject.name = name.value;
  }

  // Place the mesh at the origin. This is default.
  meshObject.position.x = 0;
  meshObject.position.y = 0;
  meshObject.position.z = 0;

  const [x, y, z] = rotations;
  const xRot = x as PacioliMatrix;
  const yRot = z as PacioliMatrix;
  const zRot = y as PacioliMatrix;

  meshObject.rotation.x = getNumber(xRot.numbers, 0, 0);
  meshObject.rotation.y = getNumber(yRot.numbers, 0, 0);
  meshObject.rotation.z = getNumber(zRot.numbers, 0, 0);

  // Place the mesh at the proper position if it is given
  if (pos.value) {
    if (pos.value.kind === "matrix") {
      const jsVector = vector2THREE(pos.value, unit);

      meshObject.position.x = jsVector.x;
      meshObject.position.y = jsVector.y;
      meshObject.position.z = jsVector.z;
    } else {
      throw Error("Mesh position must be a matrix");
    }
  }

  // Return the mesh object to the caller as reference
  return meshObject;
}

function mesh2THREE(
  mesh: [
    [PacioliMatrix, PacioliString][],
    [PacioliMatrix, PacioliMatrix, PacioliMatrix][]
  ],
  material: THREE.Material,
  unit: { x: SIUnit; y: SIUnit; z: SIUnit },
  wireframe: boolean
) {
  const [vertices, faces] = mesh;

  var geometry = new THREE.BufferGeometry();

  var indices = new Uint32Array(faces.length * 3); // indices for 4 faces
  var positions = new Float32Array(vertices.length * 3); // buffer arrray, position of 4 vertices

  // Compute our own normals instead of geometry.computeVertexNormals() below!?
  // Not used at the moment.
  var normals = [];

  for (var i = 0; i < vertices.length; i++) {
    const vec = vector2THREE(vertices[i][0], unit);
    positions[i * 3 + 0] = vec.x;
    positions[i * 3 + 1] = vec.y;
    positions[i * 3 + 2] = vec.z;

    normals.push(vec.x, vec.y, vec.z);
  }

  for (var i = 0; i < faces.length; i++) {
    var face = faces[i];
    indices[i * 3 + 0] = getNumber(face[0].numbers, 0, 0);
    indices[i * 3 + 1] = getNumber(face[1].numbers, 0, 0);
    indices[i * 3 + 2] = getNumber(face[2].numbers, 0, 0);
    // indices[i * 6 + 3] = getNumber(face[0].numbers, 0, 0);
    // indices[i * 6 + 4] = getNumber(face[2].numbers, 0, 0);
    // indices[i * 6 + 5] = getNumber(face[3].numbers, 0, 0);
  }

  const colors = [];
  const color = new THREE.Color();

  for (let i = 0; i < vertices.length; i++) {
    color.set(vertices[i][1].value);

    // define the same color for each vertex of a triangle
    colors.push(color.r, color.g, color.b);
    colors.push(color.r, color.g, color.b);
    colors.push(color.r, color.g, color.b);
  }
  // TODO: fix material. UPDATE: Fixed with computeVertexNormals call. See further comments.

  // geometry.mergeVertices();
  // geometry.computeFaceNormals();
  // geometry.computeCentroids();
  // geometry.computeVertexNormals();

  // Not used. See comment above.
  //geometry.setAttribute("normal", new THREE.Float32BufferAttribute(normals, 3));

  geometry.setIndex(new THREE.BufferAttribute(indices, 1));
  geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute("color", new THREE.Float32BufferAttribute(colors, 3));

  geometry = geometry.toNonIndexed();
  geometry.computeVertexNormals();

  if (wireframe) {
    var geo = new THREE.EdgesGeometry(geometry); // or WireframeGeometry( geometry )

    var mat = new THREE.LineBasicMaterial({ color: 0x222222, linewidth: 2 });

    var wireframeSegment = new THREE.LineSegments(geo, mat);
    return wireframeSegment;
  } else {
    return new THREE.Mesh(geometry, material);
  }
}
