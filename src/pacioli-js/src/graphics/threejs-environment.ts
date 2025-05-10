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

import { SIUnit } from "uom-ts";
import { getNumber } from "../values/numbers";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { PacioliMatrix } from "../values/matrix";
import {
  CSS2DObject,
  CSS2DRenderer,
} from "three/examples/jsm/renderers/CSS2DRenderer";
import { VertexNormalsHelper } from "three/examples/jsm/helpers/VertexNormalsHelper.js";
import { createGridHelper, vector2THREE, makeLabelObject } from "./threejs";
import { createTHREEMesh, PacioliMesh } from "./mesh";
import { PacioliPath } from "./path";
import {
  arrowDirectionAndLength,
  createTHREEArrowHelper,
  createTHREELabel,
  PacioliArrow,
} from "./arrow";
import { SpaceOptions } from "./space";
import { PacioliScene } from "./scene";
import { PacioliSpotLight } from "./lights";
import { PacioliLabel } from "./text";

function units(options: SpaceOptions): {
  x: SIUnit;
  y: SIUnit;
  z: SIUnit;
} {
  return {
    x: options.unitX,
    y: options.unitY,
    z: options.unitZ,
  };
}

/**
 * A 3D environment for graphical display with Three.js.
 *
 * Renders 3D elements, and renders labels on top of the 3D scene.
 */
export class ThreeJsEnvironment {
  // Space configuration
  public options: SpaceOptions;

  private readonly root: HTMLDivElement; // root noemen

  // Three.js properties
  private readonly renderer: THREE.WebGLRenderer;
  private readonly labelRenderer: CSS2DRenderer;
  private readonly scene: THREE.Scene;
  private readonly camera: THREE.Camera;
  private readonly body: THREE.Object3D<THREE.Event>;
  private readonly controls: OrbitControls;

  private axis?: THREE.AxesHelper;
  private axisLabels: CSS2DObject[] = [];
  private grid?: THREE.GridHelper;
  private ambientLight?: THREE.AmbientLight;

  private addedMeshes: THREE.Mesh<THREE.BufferGeometry, THREE.Material>[] = [];

  /**
   * Constructs a space element and adds it to the DOM.
   *
   * @param parent DOM element to which the space is added
   * @param options Configuration of the space element
   */
  constructor(options: SpaceOptions) {
    // Store the options
    this.options = options;

    // Create a 3D WebGL renderer and a label renderer. The label renderer
    // is placed exactly on top of the WebGL renderer.
    this.renderer = createWebGLRenderer(options.width, options.height);
    this.labelRenderer = createLabelRenderer(options.width, options.height);

    // Create the root element and attach the renderers
    this.root = createRootElement(
      this.renderer.domElement,
      this.labelRenderer.domElement
    );

    // Create the scene
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(options.background);

    // Create the camera and add it to the scene
    this.camera = createCamera(options);
    this.scene.add(this.camera);

    // Connect orbit controls to the renderer and to the draw method
    this.controls = createOrbitControls(this.camera, this.root, options);
    this.controls.addEventListener("change", this.onChangeOrbit.bind(this));

    // Create the body and add it to the scene
    this.body = new THREE.Object3D();
    this.scene.add(this.body);

    // Let the camera look at the body
    this.camera.position.set(options.cameraX, options.cameraY, options.cameraZ);
    this.camera.lookAt(this.body.position);
    this.controls.update();
  }

  /**
   * Root HTML element for the Threejs scene. Add this to the DOM.
   *
   * @returns A HTML element
   */
  getRoot(): HTMLElement {
    return this.root;
  }

  /**
   * Removes any element that has been loaded previously.
   */
  clear() {
    this.log("Clearing space");

    this.addedMeshes.forEach((mesh) => {
      mesh.material.dispose();
      mesh.geometry.dispose();
    });

    this.addedMeshes = [];

    // Remove any element that has been added to the scene's body
    while (0 < this.body.children.length) {
      this.body.remove(this.body.children[0]);
    }
  }

  /**
   * Frees all resources.
   */
  dispose() {
    this.clear();

    // this.renderer.renderLists.dispose();
    this.renderer.dispose();
    this.controls.dispose();
    this.axis?.dispose();
    this.grid?.dispose();
    this.ambientLight?.dispose();
  }

  resize(width: number, height: number) {
    // this.camera.aspect = width / height;
    // this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height);
    this.labelRenderer.setSize(width, height);
  }

  hasLabels(): boolean {
    // The label renderer is the second renderer. Is it present?
    return this.root.childElementCount === 2;
  }

  showLabels() {
    if (!this.hasLabels()) {
      // The label renderer is the second renderer. Add it.
      this.root.appendChild(this.labelRenderer.domElement);
    }
  }

  hideLabels() {
    if (this.hasLabels()) {
      // The label renderer is the second renderer. Remove it.
      this.root.removeChild(this.labelRenderer.domElement);
    }
  }

  hasGrid(): boolean {
    return this.grid !== undefined;
  }

  showGrid() {
    if (this.grid === undefined) {
      this.grid = createGridHelper(
        this.options.gridSizeX,
        this.options.gridSizeY,
        this.options.gridColor
      );
      this.scene.add(this.grid);
    }
  }

  hideGrid() {
    if (this.grid) {
      this.scene.remove(this.grid);
      this.grid.dispose();
      this.grid = undefined;
    }
  }

  hasAxis(): boolean {
    return this.axis !== undefined;
  }

  showAxis() {
    if (this.axis === undefined) {
      this.axis = createAxis(
        this.options.axisSize,
        this.options.axisColorsX,
        this.options.axisColorsY,
        this.options.axisColorsZ
      );
      this.scene.add(this.axis);
    }

    // Create axis labels if requested
    if (!this.options.hideLabels) {
      this.showAxisLabels();
    }
  }

  hideAxis() {
    this.hideAxisLabels();

    if (this.axis) {
      this.scene.remove(this.axis);
      this.axis.dispose();
      this.axis = undefined;
    }
  }

  hasAxisLabels() {
    this.axisLabels.length > 0;
  }

  showAxisLabels() {
    if (this.axisLabels.length === 0) {
      // Create axis labels
      const unitx = this.options.unitX.toText();
      const unity = this.options.unitY.toText();
      const unitz = this.options.unitZ.toText();
      const offset = this.options.axisSize * 1.05;
      this.axisLabels.push(
        makeLabelObject(`x[${unitx}]`, offset, 0, 0, this.options.labelColor)
      );
      this.axisLabels.push(
        makeLabelObject(`z[${unitz}]`, 0, offset, 0, this.options.labelColor)
      );
      this.axisLabels.push(
        makeLabelObject(`y[${unity}]`, 0, 0, offset, this.options.labelColor)
      );

      // Add the labels
      this.axisLabels.forEach((label) => this.scene.add(label));
    }
  }

  hideAxisLabels() {
    // Remove any axis labels.
    this.axisLabels.forEach((label) => this.scene.remove(label));
    this.axisLabels = [];
  }

  /**
   * Starts auto rotation with the given speed. Uses the speed from the
   * options if no speed is given.
   *
   * @param secondsPerRotation Rotation speed in seconds per rotation.
   */
  startAutoRotation(secondsPerRotation?: number) {
    // Convert to THREE's unit of speed
    this.controls.autoRotateSpeed =
      60 / (secondsPerRotation ?? this.options.secondsPerRotation);

    // Turn on THREE's built-in auto rotation
    this.controls.autoRotate = true;
  }

  /**
   * Stops auto rotation
   */
  stopAutoRotation() {
    // Turn off THREE's built-in auto rotation
    this.controls.autoRotate = false;
  }

  /**
   * Is auto rotation on?
   */
  isAutoRotating(): boolean {
    return this.controls.autoRotate;
  }

  autoRotateSpeed(): number {
    return this.controls.autoRotate ? 60 / this.controls.autoRotateSpeed : 0;
  }

  setAmbientLight(color: string, intensity: number) {
    if (this.ambientLight === undefined) {
      this.ambientLight = new THREE.AmbientLight();
      this.scene.add(this.ambientLight);
    }
    this.ambientLight.color = new THREE.Color(color);
    this.ambientLight.intensity = intensity;
  }

  private onChangeOrbit() {
    requestAnimationFrame(() => {
      this.renderer.render(this.scene, this.camera);
      this.labelRenderer.render(this.scene, this.camera);
    });
  }

  public render() {
    this.renderer.render(this.scene, this.camera);
    this.labelRenderer.render(this.scene, this.camera);

    if (this.controls.autoRotate) {
      this.controls.update();
    }
  }

  private log(text: string) {
    if (this.options.verbose) {
      console.log(text);
    }
  }

  /**
   * Loads all meshes, vectors and patsh from the given scene into this
   * space. Clears any previous content first.
   *
   * See also loadAnimation and loadStatefulAnimation
   *
   * @param scene
   */
  loadScene(scene: PacioliScene) {
    // Add all scene elements
    const [_, arrows, meshes, paths, lights, ambientLight, labels] = scene;

    for (const mesh of meshes) {
      this.addMesh(mesh);
    }

    for (const arrow of arrows) {
      this.addArrow(arrow);
    }

    for (const path of paths) {
      this.addPath(path);
    }

    for (const light of lights) {
      this.addSpotLight(light);
    }

    for (const label of labels) {
      this.addLabel(label);
    }

    // Don't overrule light that is set via options. This allows
    // the web components to change the ambient light.
    this.setAmbientLight(
      this.options.ambientColor || ambientLight[0].value,
      this.options.ambientIntensity || getNumber(ambientLight[1].numbers, 0, 0)
    );
  }

  public addObject(object: THREE.Object3D<THREE.Event>) {
    this.body.add(object);
  }

  public addMesh(mesh: PacioliMesh) {
    // Create a THREE mesh object from the Pacioli mesh and add it to the body
    const meshObject = createTHREEMesh(mesh, units(this.options));
    this.body.add(meshObject);

    this.addedMeshes.push(meshObject);

    if (false && meshObject.geometry.attributes.normal) {
      const helper = new VertexNormalsHelper(meshObject, 1, 0xff0000);
      this.body.add(helper);
    }
  }

  public addArrow(arrow: PacioliArrow) {
    const [origin, vector, name, label, color] = arrow;

    // const vectorColor = color.value === "" ? "blue" : color.value;

    // Add an ArrowHelper
    const arrowHelper = createTHREEArrowHelper(
      origin,
      vector,
      name,
      color,
      units(this.options)
    );
    this.body.add(arrowHelper);

    // Add a label. Only skip if it is empty and will always stay empty (no name given for updates)
    if (name.value !== "" || label.value !== "") {
      const arrowLabel = createTHREELabel(
        origin,
        vector,
        name,
        label,
        units(this.options),
        this.options.labelColor
      );
      this.body.add(arrowLabel);
    }
  }

  public updateMesh(mesh: PacioliMesh) {
    const [, , position, rotations, name] = mesh;
    if (name.value !== "" && position.value) {
      if (position.value.kind === "matrix") {
        const [x, y, z] = rotations;
        this.updateMesh2(name.value, position.value);
        this.rotateMesh(
          name.value,
          x as PacioliMatrix,
          z as PacioliMatrix,
          y as PacioliMatrix
        );
      } else {
        throw Error("Mesh position must be a matrix");
      }
    }
  }

  public updateMesh2(name: string, position: PacioliMatrix) {
    const mesh = this.scene.getObjectByName(name);
    if (mesh) {
      const jsVector = vector2THREE(position, units(this.options));
      mesh.position.set(jsVector.x, jsVector.y, jsVector.z);
    }
  }

  private rotateMesh(
    name: string,
    x: PacioliMatrix,
    y: PacioliMatrix,
    z: PacioliMatrix
  ) {
    const mesh = this.scene.getObjectByName(name);
    if (mesh) {
      mesh.rotation.x = getNumber(x.numbers, 0, 0);
      mesh.rotation.y = getNumber(y.numbers, 0, 0);
      mesh.rotation.z = getNumber(z.numbers, 0, 0);
    }
  }

  public addPath(path: PacioliPath) {
    this.log(`Adding path ${path[0].map(vec2String)}`);

    // Create a THREE line object from the Pacioli path and add it to the body
    var lineObject = createTHREEPath(path, units(this.options));
    this.body.add(lineObject);
  }

  public addSpotLight(spotlight: PacioliSpotLight) {
    const [position, target, color, intensity] = spotlight;

    const positionVector = vector2THREE(position, units(this.options));
    const targetVector = vector2THREE(target, units(this.options));

    const light = new THREE.SpotLight(
      new THREE.Color(color.value),
      getNumber(intensity.numbers, 0, 0)
    );

    light.position.set(positionVector.x, positionVector.y, positionVector.z);
    light.target.position.set(targetVector.x, targetVector.y, targetVector.z);

    this.body.add(light);
    this.body.add(light.target);
  }

  public addLabel(pacioliLabel: PacioliLabel) {
    const [characters, position, direction, color, font] = pacioliLabel;

    const label = newLabel(characters.value, 0.5);

    if (label) {
      label.position.x = 0;
      label.position.y = 5;
      label.position.z = 0;

      this.body.add(label);
    } else {
      console.log("no label to add");
    }
    // this.body.add(arrowLabel);

    console.log("Added label", characters, position, direction, color, font);
  }

  // TODO: updatePath

  // private addVector(
  //   origin: PacioliMatrix,
  //   vector: PacioliMatrix,
  //   name: PacioliString,
  //   label: PacioliString,
  //   color: PacioliString
  // ) {
  //   const vectorColor = color.value === "" ? "blue" : color.value;

  //   this.log(
  //     `Adding vector from ${vec2String(origin)} to ${vec2String(
  //       vector
  //     )} with color '${vectorColor}', name '${name.value}' and label '${
  //       label.value
  //     }'`
  //   );

  //   // Add an ArrowHelper
  //   const arrowHelper = createTHREEArrowHelper(
  //     origin,
  //     vector,
  //     name,
  //     color,
  //     units(this.options)
  //   );
  //   this.body.add(arrowHelper);

  //   // Add a label. Only skip if it is empty and will always stay empty (no name given for updates)
  //   if (name.value !== "" || label.value !== "") {
  //     const arrowLabel = createTHREELabel(
  //       origin,
  //       vector,
  //       name,
  //       label,
  //       units(this.options),
  //       this.options.labelColor
  //     );
  //     this.body.add(arrowLabel);
  //   }
  // }

  /**
   * Called during animation.
   *
   * @param name
   * @param from
   * @param to
   * @param label
   * @param color
   */
  public updateArrow(pacioliArrow: PacioliArrow) {
    const [from, to, name, label, color] = pacioliArrow;

    if (name.value !== "") {
      // Update the ArrowHelper if needed
      const arrow = this.scene.getObjectByName(name.value) as THREE.ArrowHelper;

      if (arrow) {
        const [dirVec, vectorLength] = arrowDirectionAndLength(
          to,
          units(this.options)
        );
        const vectorColor = color.value === "" ? "blue" : color.value;
        const jsVector = vector2THREE(from, units(this.options));

        arrow.position.set(jsVector.x, jsVector.y, jsVector.z);
        arrow.setDirection(dirVec);
        arrow.setLength(vectorLength);
        arrow.setColor(vectorColor);
      }

      // Update the label if needed
      const labelObj = this.scene.getObjectByName(
        name + "_label"
      ) as CSS2DObject;
      if (labelObj) {
        const vec = vector2THREE(to, units(this.options));
        const labelPos = vector2THREE(from, units(this.options))
          .multiplyScalar(1.1)
          .add(vec);

        labelObj.position.set(labelPos.x, labelPos.y, labelPos.z);
        labelObj.element.innerHTML = label.value;
      }
    }
  }
}

function createRootElement(
  webGLElement: HTMLElement,
  labelElement: HTMLElement
) {
  const renderersDiv = document.createElement("div");

  renderersDiv.style.position = "relative";

  // Create the 3D WebGL renderer and append it to the given parent
  renderersDiv.appendChild(webGLElement);

  // Create the label renderer and append it to the given parent
  // It is placed exactly on top of the WebGL renderer.
  renderersDiv.appendChild(labelElement);

  return renderersDiv;
}

function createWebGLRenderer(
  width: number,
  height: number
): THREE.WebGLRenderer {
  const renderer = new THREE.WebGLRenderer({
    antialias: true,
    preserveDrawingBuffer: true, // Required for snaphshot images
  });
  renderer.setSize(width, height);
  return renderer;
}

function createLabelRenderer(width: number, height: number): CSS2DRenderer {
  const labelRenderer = new CSS2DRenderer();

  labelRenderer.setSize(width, height);
  labelRenderer.domElement.style.position = "absolute";
  labelRenderer.domElement.style.top = "0px";
  labelRenderer.domElement.style.zIndex = "99";

  return labelRenderer;
}

function createOrbitControls(
  camera: THREE.Camera,
  domElement: HTMLElement,
  options: {
    zoomMin: number;
    zoomMax: number;
  }
) {
  const controls = new OrbitControls(camera, domElement);
  controls.minDistance = options.zoomMin;
  controls.maxDistance = options.zoomMax;
  controls.maxPolarAngle = Math.PI / 1;
  return controls;
}

function createCamera(options: {
  orthographic: boolean;
  width: number;
  height: number;
  perspectiveMax: number;
}) {
  const kind = options.orthographic ? "orthographic" : "perspective";

  switch (kind) {
    case "perspective": {
      return new THREE.PerspectiveCamera(
        50,
        options.width / options.height,
        0.1,
        options.perspectiveMax
      );
    }
    case "orthographic": {
      // This fudge factor makes the zoom more compatible with the
      // perspective camera. The orthographic works in 'pixel' units
      // instead of 'world' units. Is this what causes the mismatch?
      const fudge = 0.05;
      return new THREE.OrthographicCamera(
        (fudge * -options.width) / 2,
        (fudge * options.width) / 2,
        (fudge * options.height) / 2,
        (fudge * -options.height) / 2,
        -options.perspectiveMax,
        options.perspectiveMax
      );
    }
    default: {
      throw Error(`Camera kind $kind unknown`);
    }
  }
}

function createAxis(
  size: number,
  colorX: string,
  colorY: string,
  colorZ: string
): THREE.AxesHelper {
  const axis = new THREE.AxesHelper(size);
  axis.setColors(
    new THREE.Color(colorX),
    new THREE.Color(colorY),
    new THREE.Color(colorZ)
  );
  return axis;
}

function createTHREEPath(
  path: PacioliPath,
  unit: { x: SIUnit; y: SIUnit; z: SIUnit }
) {
  var geometry = new THREE.BufferGeometry();
  var material = new THREE.LineBasicMaterial({
    color: path[1].value === "" ? "#222222" : path[1].value,
    transparent: true,
    opacity: 1.0,
  });

  geometry.setFromPoints(
    path[0].map((point: PacioliMatrix) => vector2THREE(point, unit))
  );

  var lineObject = new THREE.Line(geometry, material);

  return lineObject;
}

/**
 * Assume the input numbers is a 3d vector and converts it to a string
 *
 * @param vector A matrix's numbers
 * @returns A string of the form (x, y, z)
 */
function vec2String(vector: PacioliMatrix) {
  return `(${getNumber(vector.numbers, 0, 0).toFixed(5)}, ${getNumber(
    vector.numbers,
    1,
    0
  ).toFixed(5)}, ${getNumber(vector.numbers, 2, 0).toFixed(5)})`;
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
