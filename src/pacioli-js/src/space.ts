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
import { VertexNormalsHelper } from "three/examples/jsm/helpers/VertexNormalsHelper.js";

/**
 * Matches the Scene type from the graphics Pacioli library
 */
export type PacioliScene = [
  PacioliString,
  PacioliArrow[],
  PacioliMesh[],
  PacioliPath[],
  PacioliSpotLight[],
  AmbientLight
];

/**
 * Matches the Animation type from the graphics Pacioli library
 */
export type Animation = [PacioliFunction, PacioliScene];

/**
 * Matches the StatefulAnimation type from the graphics Pacioli library
 */
export type StatefulAnimation = [PacioliValue, PacioliFunction, PacioliScene];

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
  PacioliBoole, // wireframe
  PacioliString // material
];

/**
 * Matches the Path type from the graphics Pacioli library
 */
type PacioliPath = [
  Matrix[], // path points
  PacioliString // color
];

/**
 * Matches the SpotLight type from the graphics Pacioli library
 */
type PacioliSpotLight = [
  Matrix, // position
  Matrix, // target
  PacioliString, // color
  Matrix // intensity
];

/**
 * Matches the ambient light part of the Scene type from the
 * graphics Pacioli library.
 */
type AmbientLight = [
  PacioliString, // color
  Matrix // intensity
];

/**
 * Configuration options for the Space class
 */
export interface SpaceOptions {
  orthographic: boolean;
  axis: boolean;
  axisSize: number;
  axisColorsX: string;
  axisColorsY: string;
  axisColorsZ: string;
  width: number;
  height: number;
  unit: SIUnit;
  verbose: boolean; // undocumented feature
  fps: number;
  background: string;
  grid: boolean;
  gridSizeX: number;
  gridSizeY: number;
  gridColor: string;
  zoomMin: number;
  zoomMax: number;
  perspectiveMax: number;
  cameraX: number;
  cameraY: number;
  cameraZ: number;
  hideLabels: boolean;
  autoRotation: boolean;
  secondsPerRotation: number;
  ambientColor?: string;
  ambientIntensity?: number;
}

/**
 * Default configuration options for the Space class
 */
const defaultOptions: SpaceOptions = {
  orthographic: false,
  axis: false,
  axisSize: 10,
  axisColorsX: "#eeaaaa",
  axisColorsY: "#aaeeaa",
  axisColorsZ: "#aaaaee",
  width: 800,
  height: 450,
  unit: UOM.ONE,
  verbose: false,
  fps: 60,
  background: "#eeeeee",
  grid: false,
  gridSizeX: 20,
  gridSizeY: 20,
  gridColor: "#dddddd",
  zoomMin: 1,
  zoomMax: 500,
  perspectiveMax: 5000,
  cameraX: 20,
  cameraY: 10,
  cameraZ: 20,
  hideLabels: false,
  autoRotation: false,
  secondsPerRotation: 30,
};

/**
 * A 3D environment for graphical display with Three.js.
 *
 * Renders 3D elements, and renders labels on top of the 3D scene.
 */
export class Space {
  // Constants
  private readonly TIME_UNIT = unit("second");

  // Space configuration
  private options: SpaceOptions;

  // Three.js properties
  private renderer: THREE.WebGLRenderer;
  private labelRenderer: CSS2DRenderer;
  private scene: THREE.Scene;
  private camera: THREE.Camera;
  private body: THREE.Object3D<THREE.Event>;
  private controls: OrbitControls;

  private axis?: THREE.AxesHelper;
  private axisLabels: CSS2DObject[] = [];
  private grid?: THREE.GridHelper;
  private ambientLight?: THREE.AmbientLight;

  // Pacioli scene properties, set when a Pacioli scene or
  // animation is loaded
  private initialScene?: PacioliScene;
  private callback?: PacioliFunction;
  private statefulCallback?: PacioliFunction;
  private initialState?: PacioliValue;

  // Animation state
  private animating: boolean = false;
  private frameCounter: number = 0;
  private animationRequest?: number;
  private animationState?: PacioliValue;
  private animationScene?: PacioliScene;

  renderersDiv: HTMLDivElement;

  addedMeshes: THREE.Mesh<THREE.BufferGeometry, THREE.Material>[] = [];

  /**
   * Constructs a space element and adds it to the DOM.
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
    // while (this.parent.firstChild) {
    //   this.parent.removeChild(this.parent.firstChild);
    // }

    // Create a parent for the two renderers
    const renderersDiv = document.createElement("div");
    renderersDiv.style.position = "relative";
    this.parent.appendChild(renderersDiv);

    this.renderersDiv = renderersDiv;

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
    const kind = this.options.orthographic ? "orthographic" : "perspective";
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
      this.renderersDiv,
      this.options.zoomMin,
      this.options.zoomMax
    );
    this.controls.addEventListener("change", this.onChangeOrbit.bind(this));

    // Add a grid if requested
    if (this.options.grid) {
      this.showGrid();
    }

    // Add axis if requested. Don't put it below the grid.
    if (this.options.axis) {
      this.showAxis();
    }

    // Create the body and add it to the scene
    this.body = new THREE.Object3D();
    this.scene.add(this.body);

    // Let the camera look at the body
    this.camera.position.set(
      this.options.cameraX,
      this.options.cameraY,
      this.options.cameraZ
    );
    this.camera.lookAt(this.body.position);
    this.controls.update();

    // Start auto rotation if the options is true. Requires this.controls to be set.
    if (this.options.autoRotation) {
      this.startAutoRotation(this.options.secondsPerRotation);
    }
  }

  /**
   * The description of the last loaded scene (static or animation). Is undefined
   * when no scene has been loaded yet.
   *
   * @returns The scene's description
   */
  getDescription(): string | undefined {
    return this.initialScene ? this.initialScene[0].value : undefined;
  }

  /**
   * Has an animation been loaded instead of a static scene?
   *
   * See methods loadAnimation and loadStatefulAnimation.
   *
   * @returns True if the scene is an animation, false if it is static.
   */
  isAnimation(): boolean {
    return this.callback !== undefined || this.statefulCallback !== undefined;
  }

  /**
   * The current frame number in an animation
   *
   * @returns Elapsed number of frames.
   */
  frameNr(): number {
    return this.frameCounter;
  }

  /**
   * Is an animation running?
   *
   * See method setAnimating.
   *
   * @returns True if an animation is running.
   */
  isRunning(): boolean {
    return this.animating;
  }

  /**
   * The elapsed animation time. Not real time, but logical time.
   *
   * @returns Elapsed time in seconds.
   */
  runningTime(): number {
    return this.frameCounter / this.options.fps;
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

  /**
   * Loads all meshes, vectors and paths from the given animation into this
   * space. Clears any previous content first.
   *
   * See also loadStatefulAnimation and loadScene.
   *
   * @param animation A Pacioli animation.
   */
  loadAnimation(animation: Animation) {
    const [callback, scene] = animation;

    // Set animation specific members
    this.callback = callback;
    this.statefulCallback = undefined;
    this.initialState = undefined;

    // Do a regular scene load
    this.loadScene(scene);
  }

  /**
   * Loads all meshes, vectors and patsh from the given animation into this
   * space. Clears any previous content first.
   *
   * See also loadAnimation and loadScene
   *
   * @param animation A stateful Pacioli animation.
   */
  loadStatefulAnimation(animation: StatefulAnimation) {
    const [initial, callback, scene] = animation;

    // Set stateful animation specific members
    this.statefulCallback = callback;
    this.initialState = initial;
    this.callback = undefined;

    // Do a regular scene load
    this.loadScene(scene);
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
    // Remember the scene for resetting
    this.initialScene = scene;

    // Remove previous scene elements
    this.clear();

    // Add all scene elements
    const [name, vectors, meshes, paths, lights, ambientLight] = scene;
    for (const mesh of meshes) {
      this.addMesh(mesh);
    }
    for (const [origin, vector, name, label, color] of vectors) {
      this.addVector(origin, vector, name, label, color);
    }
    for (const path of paths) {
      this.addPath(path);
    }
    for (const [position, target, color, intensity] of lights) {
      this.addSpotLight(position, target, color, intensity);
    }

    // Don't overrule light that is set via options. This allows
    // the web components to change the ambient light.
    this.setAmbientLight(
      this.options.ambientColor || ambientLight[0].value,
      this.options.ambientIntensity || getNumber(ambientLight[1].numbers, 0, 0)
    );

    // Initialize the animation
    this.resetAnimation();

    this.log(`Loaded scene ${name} and initialized the animation`);
  }

  /**
   * Starts or stops the animation. Does not reset the animation. Starting
   * an animation picks it up where it was last stopped.
   *
   * @param running Starting (true) or stopping (false)
   */
  setRunning(running: boolean) {
    // Pause animating if animation stop is requested
    if (this.animating && !running) {
      this.pauseAnimation();
      this.log("Paused animation");
    }

    // Check for callbacks if animation start is requested
    if (!this.animating && running) {
      if (this.animationScene === undefined) {
        throw new Error("No scene elements to update");
      }
      if (!this.isAnimation()) {
        throw new Error("No callback available in UpdateSpace");
      }
      this.startAnimation();
      this.draw();
      this.log("Started animation");
    }
  }

  hasLabels(): boolean {
    // The label renderer is the second renderer. Is it present?
    return this.renderersDiv.childElementCount === 2;
  }

  showLabels() {
    if (!this.hasLabels()) {
      // The label renderer is the second renderer. Add it.
      this.renderersDiv.appendChild(this.labelRenderer.domElement);

      // Ensure the screen gets updated
      this.draw();
    }
  }

  hideLabels() {
    if (this.hasLabels()) {
      // The label renderer is the second renderer. Remove it.
      this.renderersDiv.removeChild(this.labelRenderer.domElement);

      // Ensure the screen gets updated
      this.draw();
    }
  }

  hasGrid(): boolean {
    return this.grid !== undefined;
  }

  showGrid() {
    if (this.grid === undefined) {
      // Add the grid
      this.grid = createGridHelper(
        this.options.gridSizeX,
        this.options.gridSizeY,
        this.options.gridColor
      );
      this.scene.add(this.grid);

      // Update the screen
      this.draw();
    }
  }

  hideGrid() {
    if (this.grid) {
      // Remove the grid
      this.scene.remove(this.grid);
      this.grid.dispose();
      this.grid = undefined;

      // Update the screen
      this.draw();
    }
  }

  hasAxis(): boolean {
    return this.axis !== undefined;
  }

  showAxis() {
    if (this.axis === undefined) {
      // Add the axis
      this.axis = createAxis(
        this.options.axisSize,
        this.options.axisColorsX,
        this.options.axisColorsY,
        this.options.axisColorsZ
      );
      this.scene.add(this.axis);

      // Update the screen
      this.draw();
    }

    // Create axis labels if requested
    if (!this.options.hideLabels) {
      this.showAxisLabels();
    }
  }

  hideAxis() {
    // Remove any axis labels.
    this.hideAxisLabels();

    if (this.axis) {
      // Remove the axis
      this.scene.remove(this.axis);
      this.axis.dispose();
      this.axis = undefined;

      // Update the screen
      this.draw();
    }
  }

  hasAxisLabels() {
    this.axisLabels.length > 0;
  }

  showAxisLabels() {
    if (this.axisLabels.length === 0) {
      // Create axis labels
      const unit = this.options.unit.toText();
      const offset = this.options.axisSize * 1.05;
      this.axisLabels.push(makeLabelObject(`x[${unit}]`, offset, 0, 0));
      this.axisLabels.push(makeLabelObject(`z[${unit}]`, 0, offset, 0));
      this.axisLabels.push(makeLabelObject(`y[${unit}]`, 0, 0, offset));

      // Add the labels
      this.axisLabels.forEach((label) => this.scene.add(label));

      // Update the screen
      this.draw();
    }
  }

  hideAxisLabels() {
    // Remove any axis labels.
    this.axisLabels.forEach((label) => this.scene.remove(label));
    this.axisLabels = [];

    // Update the screen
    this.draw();
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

    // Ensure the controls get updated
    this.draw();
  }

  /**
   * Stops auto rotation
   */
  stopAutoRotation() {
    // Turn off THREE's built-in auto rotation
    this.controls.autoRotate = false;
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

  /**
   * Performs a single animation step. Schedules a screen update.
   */
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
    this.draw();
  }

  /**
   * Schedules rendering of the scene. Can be called multiple times. Ensures
   * only a single rendering is scheduled.
   *
   * Typically called to indicate that the scene is outdated after making
   * a change.
   */
  draw() {
    if (this.animationRequest === undefined) {
      this.animationRequest = requestAnimationFrame(this.render.bind(this));
    }
  }

  private startAnimation() {
    this.animating = true;
  }

  private resetAnimation() {
    this.animationScene = this.initialScene;
    this.animationState = this.initialState;
    this.frameCounter = 0;
  }

  private pauseAnimation() {
    if (this.animationRequest && !this.controls.autoRotate) {
      window.cancelAnimationFrame(this.animationRequest);
      this.animationRequest = undefined;
    }
    this.animating = false;
  }

  private render() {
    this.animationRequest = undefined;

    if (this.animating && this.isAnimation()) {
      this.moveSceneForward();
    }

    this.renderer.render(this.scene, this.camera);
    this.labelRenderer.render(this.scene, this.camera);

    if (this.controls.autoRotate) {
      this.controls.update();
    }

    if (this.animating || this.controls.autoRotate) {
      this.draw();
    }
  }

  private moveSceneForward() {
    // Update the animation time
    this.frameCounter++;

    // Call the animation callback
    // TODO: see if the performance can be improved. The call method on
    // the callback is expensive. It does unification of the types to
    // check the inputs. This catches unit errors etc., but it would
    // be nice if this could be checked earlier and omitted here.
    // Maybe just make the first call checked?!
    if (this.callback) {
      this.animationScene = this.callback.call(
        num(this.runningTime(), this.TIME_UNIT),
        this.animationScene as unknown as PacioliValue
      ) as unknown as PacioliScene;
    } else if (this.statefulCallback) {
      const [state, scene] = this.statefulCallback.call(
        num(this.runningTime(), this.TIME_UNIT),
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

  private addMesh(mesh: PacioliMesh) {
    this.log(`Adding mesh ${mesh}`);

    // Create a THREE mesh object from the Pacioli mesh and add it to the body
    const meshObject = createTHREEMesh(mesh, this.options.unit);
    this.body.add(meshObject);

    this.addedMeshes.push(meshObject);

    if (false && meshObject.geometry.attributes.normal) {
      const helper = new VertexNormalsHelper(meshObject, 1, 0xff0000);
      this.body.add(helper);
    }
  }

  private updateMesh(name: string, vector: Matrix) {
    const mesh = this.scene.getObjectByName(name);
    if (mesh) {
      const jsVector = vector2THREE(vector, this.options.unit);
      mesh.position.set(jsVector.x, jsVector.y, jsVector.z);
    }
  }

  private addPath(path: PacioliPath) {
    this.log(`Adding path ${path[0].map(vec2String)}`);

    // Create a THREE line object from the Pacioli path and add it to the body
    var lineObject = createTHREEPath(path, this.options.unit);
    this.body.add(lineObject);
  }

  private addSpotLight(
    position: Matrix,
    target: Matrix,
    color: PacioliString,
    intensity: Matrix
  ) {
    const positionVector = vector2THREE(position, this.options.unit);
    const targetVector = vector2THREE(target, this.options.unit);

    const light = new THREE.SpotLight(
      new THREE.Color(color.value),
      getNumber(intensity.numbers, 0, 0)
    );

    light.position.set(positionVector.x, positionVector.y, positionVector.z);
    light.target.position.set(targetVector.x, targetVector.y, targetVector.z);

    this.body.add(light);
    this.body.add(light.target);
  }

  // TODO: updatePath

  private addVector(
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

  /**
   * Called during animation.
   *
   * @param name
   * @param from
   * @param to
   * @param label
   * @param color
   */
  private updateVector(
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
}

function createOrbitControls(
  camera: THREE.Camera,
  domElement: HTMLElement,
  zoomMin: number,
  zoomMax: number
) {
  const controls = new OrbitControls(camera, domElement);
  controls.minDistance = zoomMin;
  controls.maxDistance = zoomMax;
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

function createGridHelper(gridX: number, gridY: number, color: string) {
  const gridColor = new THREE.Color(color);
  return new THREE.GridHelper(gridX, gridY, gridColor, gridColor);
}

function createTHREEMesh(
  mesh: PacioliMesh,
  unit: SIUnit
): THREE.Mesh<THREE.BufferGeometry, THREE.Material> {
  const [vs, fs, pos, name, hasWireframe, materialOption] = mesh;

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

function createTHREEPath(path: PacioliPath, unit: SIUnit) {
  var geometry = new THREE.BufferGeometry();
  var material = new THREE.LineBasicMaterial({
    color: path[1].value,
    transparent: true,
    opacity: 1.0,
  });

  geometry.setFromPoints(
    path[0].map((point: Matrix) => vector2THREE(point, unit))
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
