/* Runtime Support for the Pacioli language
 *
 * Copyright (c) 2023-2025 Paul Griffioen
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of
 * this software and associated documentation files (the "Software"), to deal in
 * the Software without restriction, including without limitation the rights to
 * use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of
 * the Software, and to permit persons to whom the Software is furnished to do so,
 * subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS
 * FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
 * COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER
 * IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
 * CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

import * as THREE from "three";
import type { SIUnit } from "uom-ts";
import type { PacioliBoole } from "../values/boole";
import type { PacioliMatrix } from "../values/matrix";
import type { PacioliMaybe } from "../values/maybe";
import { getNumber } from "../values/numbers";
import type { PacioliString } from "../values/string";
import type { PacioliTuple } from "../values/tuple";
import { moveObject, rotateObject, vector2THREE } from "./threejs";
import { VertexNormalsHelper } from "three/examples/jsm/helpers/VertexNormalsHelper";

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

export function addMesh(
  body: THREE.Object3D<THREE.Object3DEventMap>,
  mesh: PacioliMesh,
  options: { unitX: SIUnit; unitY: SIUnit; unitZ: SIUnit; scale: number }
) {
  // Create a THREE mesh object from the Pacioli mesh and add it to the body
  const meshObject = createTHREEMesh(mesh, options);
  body.add(meshObject);

  const ADD_NORMALS = false;
  if (ADD_NORMALS && meshObject.geometry.attributes.normal) {
    const helper = new VertexNormalsHelper(meshObject, 1, 0xff0000);
    body.add(helper);
  }
}

export function updateMesh(
  body: THREE.Object3D<THREE.Object3DEventMap>,
  mesh: PacioliMesh,
  units: { unitX: SIUnit; unitY: SIUnit; unitZ: SIUnit; scale: number }
) {
  const [, , position, rotations, name] = mesh;

  if (name.value !== "") {
    const object = body.getObjectByName(name.value);

    if (object) {
      if (position.value) {
        if (position.value.kind === "matrix") {
          moveObject(object, position.value, units);
        } else {
          throw Error("Mesh position must be a matrix");
        }
      }
      rotateObject(object, rotations);
    } else {
      throw Error(`Mesh with name ${name.value} not found`);
    }
  }
}

export function disposeMesh(
  mesh: THREE.Mesh<THREE.BufferGeometry, THREE.Material>
) {
  mesh.material.dispose();
  mesh.geometry.dispose();
}

function createTHREEMesh(
  mesh: PacioliMesh,
  options: { unitX: SIUnit; unitY: SIUnit; unitZ: SIUnit; scale: number }
): THREE.Mesh<THREE.BufferGeometry, THREE.Material> {
  const [vs, fs, pos, rotations, name, hasWireframe, materialOption] = mesh;

  const material = materialOption.value.toLowerCase();

  const props = {
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
  const meshObject = mesh2THREE(
    [vs, fs],
    mat,
    options,
    hasWireframe.value
  ) as THREE.Mesh<THREE.BufferGeometry, THREE.Material>;

  if (name.value !== "") {
    meshObject.name = name.value;
  }

  // Place the mesh at the origin. This is default.
  meshObject.position.x = 0;
  meshObject.position.y = 0;
  meshObject.position.z = 0;

  // Place the mesh at the proper position if it is given
  if (pos.value) {
    if (pos.value.kind === "matrix") {
      moveObject(meshObject, pos.value, options);
    } else {
      throw Error("Mesh position must be a matrix");
    }
  }

  rotateObject(meshObject, rotations);

  // Return the mesh object to the caller as reference
  return meshObject;
}

function mesh2THREE(
  mesh: [
    [PacioliMatrix, PacioliString][],
    [PacioliMatrix, PacioliMatrix, PacioliMatrix][]
  ],
  material: THREE.Material,
  options: { unitX: SIUnit; unitY: SIUnit; unitZ: SIUnit; scale: number },
  wireframe: boolean
) {
  const [vertices, faces] = mesh;

  let geometry = new THREE.BufferGeometry();

  const indices = new Uint32Array(faces.length * 3); // indices for 4 faces
  const positions = new Float32Array(vertices.length * 3); // buffer arrray, position of 4 vertices

  // Compute our own normals instead of geometry.computeVertexNormals() below!?
  // Not used at the moment.
  const normals = [];

  for (let i = 0; i < vertices.length; i++) {
    const vec = vector2THREE(vertices[i][0], options);
    positions[i * 3 + 0] = vec.x;
    positions[i * 3 + 1] = vec.y;
    positions[i * 3 + 2] = vec.z;

    normals.push(vec.x, vec.y, vec.z);
  }

  for (let i = 0; i < faces.length; i++) {
    const face = faces[i];
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
    const geo = new THREE.EdgesGeometry(geometry); // or WireframeGeometry( geometry )

    const mat = new THREE.LineBasicMaterial({ color: 0x222222, linewidth: 2 });

    const wireframeSegment = new THREE.LineSegments(geo, mat);
    return wireframeSegment;
  } else {
    return new THREE.Mesh(geometry, material);
  }
}
