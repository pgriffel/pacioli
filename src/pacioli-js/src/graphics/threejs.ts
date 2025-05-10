import { SIUnit } from "uom-ts";
import { conversionFactor } from "../api";
import { PacioliMatrix } from "../values/matrix";
import { getNumber } from "../values/numbers";
import { PacioliString } from "../values/string";
import * as THREE from "three";
import { CSS2DObject } from "three/examples/jsm/renderers/CSS2DRenderer";

export function createGridHelper(gridX: number, gridY: number, color: string) {
  const gridColor = new THREE.Color(color);
  return new THREE.GridHelper(gridX, gridY, gridColor, gridColor);
}

export function mesh2THREE(
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

export function createTHREELabel(
  origin: PacioliMatrix,
  vector: PacioliMatrix,
  name: PacioliString,
  label: PacioliString,
  unit: { x: SIUnit; y: SIUnit; z: SIUnit },
  color: string
) {
  const vec = vector2THREE(vector, unit);
  const labelPos = vector2THREE(origin, unit).multiplyScalar(1.1).add(vec);

  // Add a label if required
  const labelObject = makeLabelObject(
    label.value,
    labelPos.x,
    labelPos.y,
    labelPos.z,
    color
  );

  // Add a name if given, so the label can be found during an update.
  if (name.value !== "") {
    labelObject.name = name.value + "_label";
  }

  return labelObject;
}

export function arrowDirectionAndLength(
  vector: PacioliMatrix,
  unit: { x: SIUnit; y: SIUnit; z: SIUnit }
): [THREE.Vector3, number] {
  const threeVector = vector2THREE(vector, unit);

  const vectorLength = Math.sqrt(
    threeVector.x ** 2 + threeVector.y ** 2 + threeVector.z ** 2
  );

  threeVector.normalize();

  return [threeVector, vectorLength];
}

/**
 * Assume the input numbers is a 3d vector and converts it to a THREE vector
 *
 * @param vector A matrix's numbers
 * @param factor A fudge factor
 * @returns A THREE vector
 */
export function vector2THREE(
  vector: PacioliMatrix,
  unit: { x: SIUnit; y: SIUnit; z: SIUnit },
  scale?: number
) {
  const extraFactor = scale ?? 1;
  const numbers = vector.numbers;

  // Find the conversion factor between the vectors' units and the space's unit. Assume
  // that the vector units are homogeneous (the same for x, y and z), and the unit is in
  // the type's multiplier.
  var factorx =
    extraFactor *
    conversionFactor(vector.shape.unitAt(0, 0), unit.x).toNumber();
  var factory =
    extraFactor *
    conversionFactor(vector.shape.unitAt(1, 0), unit.y).toNumber();
  var factorz =
    extraFactor *
    conversionFactor(vector.shape.unitAt(2, 0), unit.z).toNumber();

  return new THREE.Vector3(
    getNumber(numbers, 0, 0) * factorx,
    getNumber(numbers, 2, 0) * factory,
    getNumber(numbers, 1, 0) * factorz
  );
}

/**
 * Creates a three.js CSS2DObject for displaying a label with a CSS2DRenderer.
 *
 * @param text The label text
 * @param x The label x coordinate
 * @param y The label y coordinate
 * @param z The label z coordinate
 * @returns A new CSS2DObject object
 */
export function makeLabelObject(
  text: string,
  x: number,
  y: number,
  z: number,
  color: string
) {
  const labelDiv = document.createElement("div");
  labelDiv.className = "label";
  //labelDiv.textContent = label.value;
  labelDiv.innerHTML = text;
  labelDiv.style.backgroundColor = "transparent";
  labelDiv.style.color = color;

  const labelObject = new CSS2DObject(labelDiv);
  labelObject.position.set(x, y, z);
  // label.center.set(0, 1);
  // label.layers.set(0);
  return labelObject;
}
