import { SIUnit } from "uom-ts";
import { conversionFactor } from "../api";
import { PacioliMatrix } from "../values/matrix";
import { getNumber } from "../values/numbers";
import * as THREE from "three";
import { CSS2DObject } from "three/examples/jsm/renderers/CSS2DRenderer";
import { PacioliTuple } from "../values/tuple";
// import { PacioliLabel } from "./text";

export function createGridHelper(
  size: number,
  divisions: number,
  color: string
) {
  const gridColor = new THREE.Color(color);
  return new THREE.GridHelper(size, divisions, gridColor, gridColor);
}

/**
 * Moves a THREE.js Object3D to a new position specified by a PacioliMatrix.
 *
 * @param object - The THREE.Object3D instance to move.
 * @param position - The target position as a PacioliMatrix.
 * @param units - An object specifying the SI units for each axis (x, y, z).
 */
export function moveObject(
  object: THREE.Object3D<THREE.Event>,
  position: PacioliMatrix,
  units: { unitX: SIUnit; unitY: SIUnit; unitZ: SIUnit; scale: number }
) {
  const jsVector = vector2THREE(position, units);
  object.position.set(jsVector.x, jsVector.y, jsVector.z);
}

export function rotateObject(
  object: THREE.Object3D<THREE.Event>,
  rotations: PacioliTuple
) {
  const [x, y, z] = rotations;

  if (object) {
    object.rotation.x = getNumber((x as PacioliMatrix).numbers, 0, 0);
    object.rotation.y = getNumber((y as PacioliMatrix).numbers, 0, 0);
    object.rotation.z = getNumber((z as PacioliMatrix).numbers, 0, 0);
  }
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
  options: { unitX: SIUnit; unitY: SIUnit; unitZ: SIUnit; scale: number }
) {
  const extraFactor = options.scale ?? 1;
  const numbers = vector.numbers;

  // Find the conversion factor between the vectors' units and the space's unit. Assume
  // that the vector units are homogeneous (the same for x, y and z), and the unit is in
  // the type's multiplier.
  var factorx =
    extraFactor *
    conversionFactor(vector.shape.unitAt(0, 0), options.unitX).toNumber();
  var factory =
    extraFactor *
    conversionFactor(vector.shape.unitAt(1, 0), options.unitY).toNumber();
  var factorz =
    extraFactor *
    conversionFactor(vector.shape.unitAt(2, 0), options.unitZ).toNumber();

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

export function makeCanvasLabelObject(
  text: string,
  scale: number,
  options: {
    fontFamily: string;
    fontSize: number;
    labelColor: string;
    labelScale: number;
  }
): THREE.Mesh<THREE.PlaneGeometry, THREE.MeshBasicMaterial> {
  // See https://threejs.org/manual/#en/canvas-textures

  const completeFont = `${options.fontSize}px ${options.fontFamily}`;

  // Write the text on a new canvas.
  var canvas = document.createElement("canvas");
  var context = canvas.getContext("2d");
  if (context) {
    context.font = completeFont;

    // measureText gives css pixels. 2.54cm = 96px
    var width = context.measureText(text).width;
    var height = options.fontSize;

    // Create a picture of the text.
    canvas.width = width;
    canvas.height = height;

    context.font = completeFont;
    context.fillStyle = options.labelColor;
    context.textBaseline = "top";
    context.fillText(text, 0, 0);

    // Put the canvas in a texture and make a plane.
    var texture = new THREE.CanvasTexture(canvas);

    // texture.minFilter = THREE.LinearFilter;
    texture.wrapS = THREE.ClampToEdgeWrapping;
    texture.wrapT = THREE.ClampToEdgeWrapping;

    texture.needsUpdate = true;
    var cover = new THREE.MeshBasicMaterial({
      map: texture,
      transparent: true,
      side: THREE.DoubleSide,
    });

    var fudge = (options.labelScale * scale) / options.fontSize;
    var shape = new THREE.PlaneGeometry(width * fudge, height * fudge);

    // Create the label
    var label = new THREE.Mesh(shape, cover);
    // label.needsUpdate = true;

    label.visible = true;
    return label;
  } else {
    throw new Error("could not create context for label");
  }
}
