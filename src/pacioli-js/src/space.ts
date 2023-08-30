/* Runtime Support for the Pacioli language
 *
 * Copyright (c) 2023 Paul Griffioen
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

import { si, SIUnit, UOM } from "uom-ts";
import { getNumber } from "./values/numbers";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { Matrix } from "./values/matrix";
import { PacioliString } from "./values/string";

export interface SpaceOptions {
  perspective: boolean;
  axis: boolean;
  axisSize: number;
  width: number;
  height: number;
  unit: SIUnit;
  animating: boolean;
  verbose: boolean;
}

/**
 * A 3D environment for graphical display with Three.js.
 */
export class Space {
  private options: SpaceOptions;

  private renderer: THREE.Renderer;
  private scene: THREE.Scene;
  private camera: THREE.Camera;
  private body: THREE.Object3D<THREE.Event>;

  constructor(
    public readonly parent: HTMLElement,
    options: Partial<SpaceOptions>
  ) {
    this.options = this.copyOptions(options);

    this.log("Constructing space");

    const width = this.options.width;
    const height = this.options.height;

    // Make the parent node empty
    while (this.parent.firstChild) {
      this.parent.removeChild(this.parent.firstChild);
    }

    // Create the renderer and append it to the given parent
    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.renderer.setSize(width, height);
    this.parent.appendChild(this.renderer.domElement);

    // Create the scene
    this.scene = new THREE.Scene();
    //this.scene.background = new THREE.Color( 0xffffff );
    this.scene.background = new THREE.Color(0xeeeeee);

    // Create the camera and add it to the scene
    if (this.options.perspective) {
      this.camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 10000);
    } else {
      this.camera = new THREE.OrthographicCamera(
        -width / 2,
        width / 2,
        height / 2,
        -height / 2,
        -1000,
        1000
      );
    }
    this.scene.add(this.camera);

    // Connect orbit controls to the renderer and to the draw method
    const controls = new OrbitControls(this.camera, this.renderer.domElement);
    controls.minDistance = 2;
    controls.maxDistance = 50;
    controls.maxPolarAngle = Math.PI / 1;
    controls.addEventListener("change", this.draw.bind(this));

    // Create the body and add it to the scene
    this.body = new THREE.Object3D();
    this.body.scale.set(10, 10, 10);
    this.scene.add(this.body);

    // Add axis
    if (this.options.axis) {
      const axis = new THREE.AxesHelper(500);
      axis.setColors(
        new THREE.Color("#ffaaaa"),
        new THREE.Color("#aaffaa"),
        new THREE.Color("#aaaaff")
      );
      this.scene.add(axis);
    }

    // Let the camera look at the body
    this.camera.position.set(10, 10, 10);
    this.camera.lookAt(this.body.position);
    controls.update();
  }

  private copyOptions(options: Partial<SpaceOptions>): SpaceOptions {
    return {
      perspective: options.perspective || false,
      axis: !!options.axis,
      axisSize: options.axisSize || 10,
      width: options.width || 640,
      height: options.height || 360,
      unit: options.unit || UOM.ONE,
      animating: options.animating || false,
      verbose: options.verbose || false,
    };
  }

  clear() {
    this.log("Clearing space");
    while (0 < this.body.children.length) {
      this.body.remove(this.body.children[0]);
    }
  }

  addMesh(
    mesh: [[Matrix, PacioliString][], [Matrix, Matrix, Matrix][]],
    options: any
  ) {
    this.log(`Adding mesh ${mesh[0]}, ${JSON.stringify(options)}`);

    var graphics = options || {};

    // Create the proper material
    var material = graphics.material || "OTHERnormal";
    var transparent = graphics.transparent || false;

    var wireframe = graphics.wireframe || false;
    var transparent = graphics.transparent || false;
    var props = {
      //        overdraw: !(wireframe || transparent),
      wireframe: wireframe,
      side: THREE.DoubleSide,
      transparent: transparent,
      //        opacity: (transparent) ? 0.5 : 1.0,
      color: 0xaaaaff,
      vertexColors: true,
    };

    let mat;
    if (material == "normal") {
      mat = new THREE.MeshNormalMaterial(props);
    } else if (material == "Lambert") {
      mat = new THREE.MeshLambertMaterial(props);
    } else if (material == "Phong") {
      mat = new THREE.MeshPhongMaterial(props);
    } else {
      //props['color'] = 0Xaaaaff;
      mat = new THREE.MeshBasicMaterial(props);
    }

    // Create a mesh object with the material and add it to the body
    var meshObject = mesh2THREE(mesh, mat, this.options.unit, wireframe);
    this.body.add(meshObject);

    // const plane = new THREE.Triangle(new THREE.Vector3(1,1,1), new THREE.Vector3(1,1,4), new THREE.Vector3(2,1,1));
    // const planeMesh = new THREE.Mesh( plane, mat );
    // this.body.add(planeMesh);

    // const plane = new THREE.PlaneGeometry(10, 10);
    // const planeMesh = new THREE.Mesh( plane, mat );
    // this.body.add(planeMesh);

    // Return the mesh object to the caller as reference
    return meshObject;
  }

  addPath(points: Matrix[]) {
    this.log(`Adding path ${points.map(vec2String)}`);
    var geometry = new THREE.BufferGeometry();
    var material = new THREE.LineBasicMaterial({
      color: 0xaaaaaa,
      transparent: true,
      opacity: 0.3,
    });

    var factor = si.conversionFactor(
      points[0].shape.multiplier,
      this.options.unit
    );

    geometry.setFromPoints(
      points.map((point: Matrix) => vec2THREE(point.numbers, factor))
    );

    var lineObject = new THREE.Line(geometry, material);
    this.body.add(lineObject);

    return lineObject;
  }

  addVector(origin: Matrix, vector: Matrix, color: PacioliString) {
    const vectorColor = color ? color.value : "blue";

    this.log(
      `Adding vector from ${vec2String(origin)} to ${vec2String(
        vector
      )} with color ${vectorColor}`
    );

    // Find the conversion factor between the vectors' units and the space's unit. Assume
    // that the vector units are homogeneous (the same for x, y and z), and the unit is in
    // the type's multiplier.
    var originFactor =
      si.conversionFactor(origin.shape.multiplier, this.options.unit) * 1;
    var vectorFactor =
      si.conversionFactor(vector.shape.multiplier, this.options.unit) * 1;

    // Convert the vectors from Pacioli to javascript/three.js. Since the vector is just
    // used for direction its unit factor is ignored here and applied to the length below.
    const jsOrigin = vec2THREE(origin.numbers, originFactor);
    const jsVector = vec2THREE(vector.numbers, 1);

    // Determine the vector's length before normalizing, taking the unit factor into
    // account. (Is there some existing function to compute the vector's length?)
    const vectorLength =
      vectorFactor *
      Math.sqrt(jsVector.x ** 2 + jsVector.y ** 2 + jsVector.z ** 2);

    // Normalize the direction vector (convert to vector of length 1)
    jsVector.normalize();

    // Use three.js's ArrowHelper to display the vector.
    let arrow = new THREE.ArrowHelper(
      jsVector,
      jsOrigin,
      (1.12 * vectorLength) / 1.12,
      vectorColor
    ); //, 1, 0.2)
    this.body.add(arrow);
  }

  /**
   * Must be called after making changes to the space.
   */
  draw() {
    requestAnimationFrame(this.animate.bind(this));
  }

  isAnimating(): boolean {
    return this.options.animating;
  }

  setAnimating(animating: boolean) {
    this.options.animating = animating;
    if (animating) {
      this.draw();
    }
  }

  private animate() {
    // Render the scene
    this.renderer.render(this.scene, this.camera);

    // Loop the animation.
    if (this.options.animating) {
      this.draw();
    }
  }

  private log(text: string) {
    if (this.options.verbose) {
      console.log(text);
    }
  }
}

/**
 * Assume the input numbers is a 3d vector and converts it to a THREE vector
 *
 * @param vector A matrix's numbers
 * @param factor A fudge factor
 * @returns A THREE vector
 */
function vec2THREE(vector: number[][], factor: number) {
  return new THREE.Vector3(
    getNumber(vector, 0, 0) * factor,
    getNumber(vector, 2, 0) * factor,
    getNumber(vector, 1, 0) * factor
  );
}

/**
 * Assume the input numbers is a 3d vector and converts it to a string
 *
 * @param vector A matrix's numbers
 * @returns A string of the form (x, y, z)
 */
function vec2String(vector: Matrix) {
  return `(${getNumber(vector.numbers, 0, 0).toFixed(5)}, ${getNumber(
    vector.numbers,
    1,
    0
  ).toFixed(5)}, ${getNumber(vector.numbers, 2, 0).toFixed(5)})`;
}

// TODO: fix any type.
function mesh2THREE(
  mesh: [[Matrix, PacioliString][], [Matrix, Matrix, Matrix][]],
  material: any,
  unit: SIUnit,
  wireframe: boolean
) {
  const [vertices, faces] = mesh;

  var factor = si.conversionFactor(vertices[0][0].shape.multiplier, unit);

  var geometry = new THREE.BufferGeometry();

  var indices = new Uint32Array(faces.length * 3); // indices for 4 faces
  var positions = new Float32Array(vertices.length * 3); // buffer arrray, position of 4 vertices

  for (var i = 0; i < vertices.length; i++) {
    const vec = vec2THREE(vertices[i][0].numbers, factor);
    positions[i * 3 + 0] = vec.x;
    positions[i * 3 + 1] = vec.y;
    positions[i * 3 + 2] = vec.z;
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
  // TODO: fix material

  // geometry.mergeVertices();
  // geometry.computeFaceNormals();
  // geometry.computeCentroids();
  // geometry.computeVertexNormals;

  geometry.setIndex(new THREE.BufferAttribute(indices, 1));
  geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute("color", new THREE.Float32BufferAttribute(colors, 3));

  var geo = new THREE.EdgesGeometry(geometry); // or WireframeGeometry( geometry )

  var mat = new THREE.LineBasicMaterial({ color: 0x222222, linewidth: 2 });

  var wireframeSegment = new THREE.LineSegments(geo, mat);

  if (wireframe) {
    return wireframeSegment;
  } else {
    return new THREE.Mesh(geometry, material);
  }
}
