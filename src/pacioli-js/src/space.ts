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
import { num, unit } from "./api";
import { Maybe } from "./values/maybe";
import { PacioliBoole } from "./values/boole";
import { PacioliFunction } from "./values/function";
import { PacioliValue } from "./value";
import {
  CSS2DObject,
  CSS2DRenderer,
} from "three/examples/jsm/renderers/CSS2DRenderer";

/**
 * Matches the Scene type from the graphics Pacioli library
 */
type PacioliScene = [
  PacioliString,
  PacioliArrow[],
  PacioliMesh[],
  PacioliPath[]
];

/**
 * Matches the Animation type from the graphics Pacioli library
 */
type Animation = [PacioliFunction, PacioliScene];

/**
 * Matches the StatefulAnimation type from the graphics Pacioli library
 */
type StatefulAnimation = [PacioliValue, PacioliFunction, PacioliScene];

/**
 * Matches the Arrow type from the graphics Pacioli library
 */
type PacioliArrow = [
  Matrix, // from
  Matrix, // to
  PacioliString, // name
  PacioliString, // label
  Maybe<PacioliString> // color
];

/**
 * Matches the Mesh type from the graphics Pacioli library
 */
type PacioliMesh = [
  [Matrix, PacioliString][], // vertices
  [Matrix, Matrix, Matrix][], // faces
  Matrix, // position
  Maybe<PacioliString>, // name
  PacioliBoole // wireframe
];

/**
 * Matches the Path type from the graphics Pacioli library
 */
type PacioliPath = Matrix[];

/**
 * Configuration options for the Space class
 */
export interface SpaceOptions {
  perspective: boolean;
  axis: boolean;
  axisSize: number;
  axisColors: [string, string, string];
  width: number;
  height: number;
  unit: SIUnit;
  verbose: boolean;
  fps: number;
  background: string;
  grid?: [number, number];
  gridColor: string;
  zoomRange: [number, number];
  perspectiveMax: number;
  camera: [number, number, number];
  showLabels: boolean;
  autoRotation: boolean;
  secondsPerRotation: number;
}

/**
 * Default configuration options for the Space class
 */
const defaultOptions: SpaceOptions = {
  perspective: true,
  axis: true,
  axisSize: 10,
  axisColors: ["#eeaaaa", "#aaeeaa", "#aaaaee"],
  width: 640,
  height: 360,
  unit: UOM.ONE,
  verbose: false,
  fps: 60,
  background: "#eeeeee",
  grid: [20, 20],
  gridColor: "#dddddd",
  zoomRange: [1, 50],
  perspectiveMax: 5000,
  camera: [10, 5, 10],
  showLabels: true,
  autoRotation: false,
  secondsPerRotation: 30,
};

/**
 * A 3D environment for graphical display with Three.js.
 */
export class Space {
  // Constants
  private readonly TIME_UNIT = unit("second");

  // Space configuration
  private options: SpaceOptions;

  // Three.js properties
  private renderer: THREE.Renderer;
  private labelRenderer: CSS2DRenderer;
  private scene: THREE.Scene;
  private camera: THREE.Camera;
  private body: THREE.Object3D<THREE.Event>;
  private controls: OrbitControls;

  // Pacioli scene properties, set when a Pacioli scene or
  // animation is loaded
  private initialScene?: PacioliScene;
  private callback?: PacioliFunction;
  private statefulCallback?: PacioliFunction;
  private initialState?: PacioliValue;

  // Animation state
  private animating: boolean = false;
  private frameCounter: number = 0;
  private startTime: number = 0.0;
  private extraTime: number = 0.0;
  private prevFrameTime: number = 0.0;
  private animationRequest?: number;
  private animationState?: PacioliValue;
  private animationScene?: PacioliScene;

  /**
   * Constructs a space element
   *
   * @param parent DOM element to which the space is added
   * @param options Configuration of the space element
   */
  constructor(
    public readonly parent: HTMLElement,
    options: Partial<SpaceOptions>
  ) {
    this.options = { ...defaultOptions, ...options };

    this.log("Constructing space");

    const width = this.options.width;
    const height = this.options.height;

    // Make the parent node empty
    while (this.parent.firstChild) {
      this.parent.removeChild(this.parent.firstChild);
    }

    // Create a parent for the two renderers
    const renderersDiv = document.createElement("div");
    renderersDiv.style.position = "relative";
    this.parent.appendChild(renderersDiv);

    // Create the 3D WebGL renderer and append it to the given parent
    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.renderer.setSize(width, height);
    renderersDiv.appendChild(this.renderer.domElement);

    // Create the label renderer and append it to the given parent
    // It is placed exactly on top of the WebGL renderer.
    this.labelRenderer = new CSS2DRenderer();
    this.labelRenderer.setSize(width, height);
    this.labelRenderer.domElement.style.position = "absolute";
    this.labelRenderer.domElement.style.top = "0px";
    this.labelRenderer.domElement.style.zIndex = "99";
    renderersDiv.appendChild(this.labelRenderer.domElement);

    // Create the scene
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(this.options.background);

    // Create the camera and add it to the scene
    const kind = this.options.perspective ? "perspective" : "orthographic";
    this.camera = createCamera(
      kind,
      width,
      height,
      this.options.perspectiveMax
    );
    this.scene.add(this.camera);

    // Connect orbit controls to the renderer and to the draw method
    this.controls = createOrbitControls(
      this.camera,
      this.labelRenderer.domElement,
      this.options.zoomRange
    );
    this.controls.addEventListener("change", this.onChangeOrbit.bind(this));

    // Add a grid if requested
    if (this.options.grid) {
      this.scene.add(
        createGridHelper(this.options.grid, this.options.gridColor)
      );
    }

    // Add axis if requested
    if (this.options.axis) {
      this.scene.add(
        createAxis(this.options.axisSize, this.options.axisColors)
      );

      // Add axis labels if requested
      if (this.options.showLabels) {
        const unit = this.options.unit.toText();
        const offset = this.options.axisSize * 1.05;
        this.scene.add(makeLabelObject(`x[${unit}]`, offset, 0, 0));
        this.scene.add(makeLabelObject(`z[${unit}]`, 0, offset, 0));
        this.scene.add(makeLabelObject(`y[${unit}]`, 0, 0, offset));
      }
    }

    // Create the body and add it to the scene
    this.body = new THREE.Object3D();
    this.scene.add(this.body);

    // Let the camera look at the body
    const camPos = this.options.camera;
    this.camera.position.set(camPos[0], camPos[1], camPos[2]);
    this.camera.lookAt(this.body.position);
    this.controls.update();

    // Start auto rotation if the options is true. Requires this.controls to be set.
    if (this.options.autoRotation) {
      this.startAutoRotation(this.options.secondsPerRotation);
    }
  }

  getDescription(): string | undefined {
    return this.initialScene ? this.initialScene[0].value : undefined;
  }

  isAnimation(): boolean {
    return this.callback !== undefined || this.statefulCallback !== undefined;
  }

  frameNr(): number {
    return this.frameCounter;
  }

  isAnimating(): boolean {
    return this.animating;
  }

  animationTime(): number {
    return this.extraTime + this.frameCounter / this.options.fps;
  }

  clear() {
    this.log("Clearing space");
    while (0 < this.body.children.length) {
      this.body.remove(this.body.children[0]);
    }
  }

  addMesh(mesh: PacioliMesh) {
    this.log(`Adding mesh ${mesh}`);

    // Create a THREE mesh object from the Pacioli mesh and add it to the body
    const meshObject = createTHREEMesh(mesh, this.options.unit);
    this.body.add(meshObject);
  }

  addPath(points: PacioliPath) {
    this.log(`Adding path ${points.map(vec2String)}`);

    // Create a THREE line object from the Pacioli path and add it to the body
    var lineObject = createTHREEPath(points, this.options.unit);
    this.body.add(lineObject);
  }

  addVector(
    origin: Matrix,
    vector: Matrix,
    name: PacioliString,
    label: PacioliString,
    color: Maybe<PacioliString>
  ) {
    const vectorColor = color.value ? color.value.value : "blue";

    this.log(
      `Adding vector from ${vec2String(origin)} to ${vec2String(
        vector
      )} with color '${vectorColor}', name '${name.value}' and label '${
        label.value
      }'`
    );

    // Add an ArrowHelper
    const arrowHelper = createTHREEArrowHelper(
      origin,
      vector,
      name,
      color,
      this.options.unit
    );
    this.body.add(arrowHelper);

    // Add a label. Only skip if it is empty and will always stay empty (no name given for updates)
    if (name.value !== "" || label.value !== "") {
      const arrowLabel = createTHREELabel(
        origin,
        vector,
        name,
        label,
        this.options.unit
      );
      this.body.add(arrowLabel);
    }
  }

  updateVector(
    name: string,
    from: Matrix,
    to: Matrix,
    label: PacioliString,
    color: Maybe<PacioliString>
  ) {
    // Update the ArrowHelper if needed
    const arrow = this.scene.getObjectByName(name) as THREE.ArrowHelper;
    if (arrow) {
      const [dirVec, vectorLength] = arrowDirectionAndLength(
        to,
        this.options.unit
      );
      const vectorColor = color.value ? color.value.value : "blue";
      const jsVector = vector2THREE(from, this.options.unit);

      arrow.position.set(jsVector.x, jsVector.y, jsVector.z);
      arrow.setDirection(dirVec);
      arrow.setLength(vectorLength);
      arrow.setColor(vectorColor);
    }

    // Update the label if needed
    const labelObj = this.scene.getObjectByName(name + "_label") as CSS2DObject;
    if (labelObj) {
      const vec = vector2THREE(to, this.options.unit);
      const labelPos = vector2THREE(from, this.options.unit)
        .multiplyScalar(1.1)
        .add(vec);

      labelObj.position.set(labelPos.x, labelPos.y, labelPos.z);
      labelObj.element.innerHTML = label.value;
    }
  }

  updateMesh(name: string, vector: Matrix) {
    const mesh = this.scene.getObjectByName(name);
    if (mesh) {
      const jsVector = vector2THREE(vector, this.options.unit);
      mesh.position.set(jsVector.x, jsVector.y, jsVector.z);
    }
  }

  loadAnimation(animation: Animation) {
    const [callback, scene] = animation;
    this.callback = callback;
    this.statefulCallback = undefined;
    this.initialState = undefined;
    this.loadScene(scene);
  }

  loadStatefulAnimation(animation: StatefulAnimation) {
    const [initial, callback, scene] = animation;
    this.statefulCallback = callback;
    this.initialState = initial;
    this.callback = undefined;
    this.loadScene(scene);
  }

  loadScene(scene: PacioliScene) {
    this.initialScene = scene;

    const [, vectors, meshes, paths] = scene;

    this.clear();

    for (const mesh of meshes) {
      this.addMesh(mesh);
    }

    for (const [origin, vector, name, label, color] of vectors) {
      this.addVector(origin, vector, name, label, color);
    }

    for (const path of paths) {
      this.addPath(path);
    }

    this.resetAnimation();
    this.log("Initialized animation");
  }

  updateScene() {
    if (this.animationScene === undefined) {
      throw new Error("No scene elements to update");
    }
    if (!(this.callback || this.statefulCallback)) {
      throw new Error("No callback available in UpdateSpace");
    }
    if (this.statefulCallback && !this.initialState) {
      throw new Error("No initial value available in UpdateSpace");
    }
    this.log(`Stepping animation`);
    this.moveSceneForward();
  }

  private moveSceneForward() {
    // Update the animation time
    if (this.animating) {
      this.frameCounter++;
    } else {
      this.extraTime += 1 / this.options.fps;
    }

    // Call the animation callback
    // TODO: see if the performance can be improved. The call method on
    // the callback is expensive. It does unification of the types to
    // check the inputs. This catches unit errors etc., but it would
    // be nice if this could be checked earlier and omitted here.
    // Maybe just make the first call checked?!
    if (this.callback) {
      this.animationScene = this.callback.call(
        num(this.animationTime(), this.TIME_UNIT),
        this.animationScene as unknown as PacioliValue
      ) as unknown as PacioliScene;
    } else if (this.statefulCallback) {
      const [state, scene] = this.statefulCallback.call(
        num(this.animationTime(), this.TIME_UNIT),
        this.animationState ? this.animationState : this.initialState!,
        this.animationScene as unknown as PacioliValue
      ) as unknown as [PacioliValue, PacioliScene];
      this.animationState = state;
      this.animationScene = scene;
    } else {
      throw new Error("no callback to recalculate scene for animation");
    }

    // Update the space
    const [, vectors, meshes] = this.animationScene;
    for (const [from, to, name, label, color] of vectors) {
      if (name.value) {
        this.updateVector(name.value, from, to, label, color);
      }
    }
    for (const mesh of meshes) {
      const [, , position, name] = mesh;
      if (name.value) {
        this.updateMesh(name.value.value, position);
      }
    }
  }

  setAnimating(animating: boolean) {
    if (this.animating && !animating) {
      this.pauseAnimation();
      this.log("Paused animation");
    }
    if (!this.animating && animating) {
      if (this.animationScene === undefined) {
        throw new Error("No scene elements to update");
      }
      if (!this.isAnimation()) {
        throw new Error("No callback available in UpdateSpace");
      }
      this.log("Starting animation");
      this.startAnimation();
    }
    this.animating = animating;
    if (animating) {
      this.draw();
    }
  }

  startAutoRotation(secondsPerRotation?: number) {
    this.controls.autoRotateSpeed =
      60 / (secondsPerRotation ?? this.options.secondsPerRotation);
    this.controls.autoRotate = true;
    this.draw();
  }

  stopAutoRotation() {
    this.controls.autoRotate = false;
  }

  private startAnimation() {
    this.startTime = Date.now();
    this.frameCounter = 0;
    this.prevFrameTime = Date.now();
  }

  private resetAnimation() {
    this.animationScene = this.initialScene;
    this.animationState = this.initialState;
    this.frameCounter = 0;
    this.extraTime = 0.0;
  }

  private pauseAnimation() {
    if (this.animationRequest) {
      window.cancelAnimationFrame(this.animationRequest);
    }
    this.extraTime += this.frameCounter / this.options.fps;
    this.frameCounter = 0;
  }

  draw() {
    this.animationRequest = requestAnimationFrame(this.render.bind(this));
  }

  private render() {
    if (this.animating && this.isAnimation()) {
      this.moveSceneForward();
    }

    this.renderer.render(this.scene, this.camera);
    this.labelRenderer.render(this.scene, this.camera);

    if (this.animating) {
      const frameLength = 1000 / this.options.fps;

      const target = this.startTime + (this.frameCounter + 1) * frameLength;
      const currentTime = Date.now();
      const delay = Math.max(0, target - currentTime);

      if (this.options.verbose && this.frameCounter % 10 === 0) {
        const util = 100 - (100 * delay) / frameLength;
        const elapsedSeconds = (currentTime - this.prevFrameTime) / 1000;
        const avgFps =
          (1000 * this.frameCounter) / (currentTime - this.startTime);
        this.log(
          `frame = ${this.frameCounter.toFixed(0).padStart(3)}  util = ${util
            .toFixed(3)
            .padStart(7)}%   avg fps = ${avgFps.toFixed(3)}  fps = ${(
            1 / elapsedSeconds
          ).toFixed(3)}  delay = ${delay
            .toFixed(3)
            .padStart(7)}ms  now = ${currentTime}`
        );
      }

      this.prevFrameTime = currentTime;

      window.setTimeout(() => this.draw(), delay);
    }

    if (this.controls.autoRotate) {
      this.controls.update();
      // Don't set timeout twice!
      if (!this.animating) {
        window.setTimeout(() => this.draw(), this.options.fps);
      }
    }
  }

  private onChangeOrbit() {
    requestAnimationFrame(() => {
      this.renderer.render(this.scene, this.camera);
      this.labelRenderer.render(this.scene, this.camera);
    });
  }

  private log(text: string) {
    if (this.options.verbose) {
      console.log(text);
    }
  }
}

function createOrbitControls(
  camera: THREE.Camera,
  domElement: HTMLElement,
  zoomRange: [number, number]
) {
  const controls = new OrbitControls(camera, domElement);
  controls.minDistance = zoomRange[0];
  controls.maxDistance = zoomRange[1];
  controls.maxPolarAngle = Math.PI / 1;
  return controls;
}

function createCamera(
  kind: "perspective" | "orthographic",
  width: number,
  height: number,
  perspectiveMax: number
) {
  switch (kind) {
    case "perspective": {
      return new THREE.PerspectiveCamera(
        50,
        width / height,
        0.1,
        perspectiveMax
      );
    }
    case "orthographic": {
      // This fudge factor makes the zoom more compatible with the
      // perspective camera. The orthographic works in 'pixel' units
      // instead of 'world' units. Is this what causes the mismatch?
      const fudge = 0.05;
      return new THREE.OrthographicCamera(
        (fudge * -width) / 2,
        (fudge * width) / 2,
        (fudge * height) / 2,
        (fudge * -height) / 2,
        -perspectiveMax,
        perspectiveMax
      );
    }
    default: {
      throw Error(`Camera kind $kind unknown`);
    }
  }
}

function createAxis(
  size: number,
  colors: [string, string, string]
): THREE.AxesHelper {
  const axis = new THREE.AxesHelper(size);
  axis.setColors(
    new THREE.Color(colors[0]),
    new THREE.Color(colors[1]),
    new THREE.Color(colors[2])
  );
  return axis;
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
function makeLabelObject(text: string, x: number, y: number, z: number) {
  const labelDiv = document.createElement("div");
  labelDiv.className = "label";
  //labelDiv.textContent = label.value;
  labelDiv.innerHTML = text;
  labelDiv.style.backgroundColor = "transparent";
  labelDiv.style.color = "#444444";

  const labelObject = new CSS2DObject(labelDiv);
  labelObject.position.set(x, y, z);
  // label.center.set(0, 1);
  // label.layers.set(0);
  return labelObject;
}

function createGridHelper(grid: [number, number], color: string) {
  const gridColor = new THREE.Color(color);
  return new THREE.GridHelper(grid[0], grid[1], gridColor, gridColor);
}

function createTHREEMesh(
  mesh: PacioliMesh,
  unit: SIUnit
): THREE.Mesh<THREE.BufferGeometry, THREE.Material> {
  // Dev setting for now, just as all other props
  var material = "OTHERnormal";

  const [vs, fs, pos, name, hasWireframe] = mesh;

  var props = {
    // overdraw: !(wireframe || transparent),
    wireframe: hasWireframe.value,
    side: THREE.DoubleSide,
    transparent: false,
    // // opacity: (transparent) ? 0.5 : 1.0,
    // color: 0xaaaaff,
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
    // props['color'] = 0Xaaaaff;
    mat = new THREE.MeshBasicMaterial(props);
  }

  // Create a mesh object with the material and add it to the body
  var meshObject = mesh2THREE(
    [vs, fs],
    mat,
    unit,
    hasWireframe.value
  ) as THREE.Mesh<THREE.BufferGeometry, THREE.Material>;

  if (name.value) {
    meshObject.name = (name.value as unknown as PacioliString).value;
  }

  // Place the mesh at the proper position
  const jsVector = vector2THREE(pos, unit);
  meshObject.position.x = jsVector.x;
  meshObject.position.y = jsVector.y;
  meshObject.position.z = jsVector.z;

  // Return the mesh object to the caller as reference
  return meshObject;
}

function mesh2THREE(
  mesh: [[Matrix, PacioliString][], [Matrix, Matrix, Matrix][]],
  material: THREE.Material,
  unit: SIUnit,
  wireframe: boolean
) {
  const [vertices, faces] = mesh;

  var geometry = new THREE.BufferGeometry();

  var indices = new Uint32Array(faces.length * 3); // indices for 4 faces
  var positions = new Float32Array(vertices.length * 3); // buffer arrray, position of 4 vertices

  for (var i = 0; i < vertices.length; i++) {
    const vec = vector2THREE(vertices[i][0], unit);
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

function createTHREEPath(points: PacioliPath, unit: SIUnit) {
  var geometry = new THREE.BufferGeometry();
  var material = new THREE.LineBasicMaterial({
    color: 0xaaaaaa,
    transparent: true,
    opacity: 0.3,
  });

  geometry.setFromPoints(
    points.map((point: Matrix) => vector2THREE(point, unit))
  );

  var lineObject = new THREE.Line(geometry, material);

  return lineObject;
}

function createTHREELabel(
  origin: Matrix,
  vector: Matrix,
  name: PacioliString,
  label: PacioliString,
  unit: SIUnit
) {
  const vec = vector2THREE(vector, unit);
  const labelPos = vector2THREE(origin, unit).multiplyScalar(1.1).add(vec);

  // Add a label if required
  const labelObject = makeLabelObject(
    label.value,
    labelPos.x,
    labelPos.y,
    labelPos.z
  );

  // Add a name if given, so the label can be found during an update.
  if (name.value !== "") {
    labelObject.name = name.value + "_label";
  }

  return labelObject;
}

function createTHREEArrowHelper(
  origin: Matrix,
  vector: Matrix,
  name: PacioliString,
  color: Maybe<PacioliString>,
  unit: SIUnit
): THREE.ArrowHelper {
  const vectorColor = color.value ? color.value.value : "blue";
  const from = vector2THREE(origin, unit);
  const [dirVec, vectorLength] = arrowDirectionAndLength(vector, unit);

  // Use three.js's ArrowHelper to display the vector.
  let arrow = new THREE.ArrowHelper(dirVec, from, vectorLength, vectorColor);

  if (name.value !== "") {
    arrow.name = name.value;
  }

  return arrow;
}

function arrowDirectionAndLength(
  vector: Matrix,
  unit: SIUnit
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
function vector2THREE(vector: Matrix, unit: SIUnit, scale?: number) {
  const extraFactor = scale ?? 1;
  const numbers = vector.numbers;

  // Find the conversion factor between the vectors' units and the space's unit. Assume
  // that the vector units are homogeneous (the same for x, y and z), and the unit is in
  // the type's multiplier.
  var factor =
    extraFactor * si.conversionFactor(vector.shape.multiplier, unit).toNumber();

  return new THREE.Vector3(
    getNumber(numbers, 0, 0) * factor,
    getNumber(numbers, 2, 0) * factor,
    getNumber(numbers, 1, 0) * factor
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
