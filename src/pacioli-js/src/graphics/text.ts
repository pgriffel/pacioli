import { SIUnit } from "uom-ts";
import { PacioliMatrix } from "../values/matrix";
import { PacioliString } from "../values/string";
import * as THREE from "three";

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

export function addLabel(
  body: THREE.Object3D<THREE.Event>,
  pacioliLabel: PacioliLabel,
  _units: { x: SIUnit; y: SIUnit; z: SIUnit }
) {
  const [characters, position, direction, color, font] = pacioliLabel;

  const label = newLabel(characters.value, 0.5);

  if (label) {
    label.position.x = 0;
    label.position.y = 5;
    label.position.z = 0;

    body.add(label);
  } else {
    console.log("no label to add");
  }
  // this.body.add(arrowLabel);

  console.log("Added label", characters, position, direction, color, font);
}

function newLabel(
  text: string,
  size: number
): THREE.Mesh<THREE.PlaneGeometry, THREE.MeshBasicMaterial> {
  // Write the text on a new canvas.
  var canvas = document.createElement("canvas");
  var context = canvas.getContext("2d");
  if (context) {
    context.font = "256px sans-serif";

    // measureText gives css pixels. 2.54cm = 96px
    var width = context.measureText(text).width;
    var height = 256;

    console.log("width = ", width);

    // Create a picture of the text. It must be square to maintain
    // size ratios and large enough to hold the text. Assume the width
    // is larger than the height.
    canvas.width = width;
    canvas.height = height;

    context.font = "256px sans-serif";
    context.textBaseline = "top";
    context.fillText(text, 0, 0);

    // Put the canvas in a texture and make a plane.
    var texture = new THREE.CanvasTexture(canvas);

    texture.minFilter = THREE.LinearFilter;
    texture.wrapS = THREE.ClampToEdgeWrapping;
    texture.wrapT = THREE.ClampToEdgeWrapping;

    texture.needsUpdate = true;
    var cover = new THREE.MeshBasicMaterial({
      map: texture,
      transparent: true,
      side: THREE.DoubleSide,
    });

    var scale = size / 256;
    // var shape = new THREE.PlaneGeometry(width, height);
    var shape = new THREE.PlaneGeometry(width * scale, height * scale);

    // Create the label
    var label = new THREE.Mesh(shape, cover);
    // label.needsUpdate = true;

    return label;
  } else {
    throw new Error("no context for label");
  }
}
