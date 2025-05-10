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

import { SIUnit, UOM } from "uom-ts";
import { getNumber } from "../values/numbers";
import { num, unit } from "../api";
import { PacioliFunction } from "../values/function";
import { PacioliValue } from "../boxing";
import { PacioliScene, StatefulAnimation, Animation } from "./scene";
import { EnvironmentOptions, ThreeJsEnvironment } from "./threejs-environment";

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
  unitX: SIUnit;
  unitY: SIUnit;
  unitZ: SIUnit;
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
  labelColor: string;
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
  unitX: UOM.ONE,
  unitY: UOM.ONE,
  unitZ: UOM.ONE,
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
  labelColor: "#333333",
  autoRotation: false,
  secondsPerRotation: 30,
};

function units(options: SpaceOptions): { x: SIUnit; y: SIUnit; z: SIUnit } {
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
export class Space {
  // Constants
  private readonly TIME_UNIT = unit("second");

  // Space configuration
  public options: SpaceOptions;

  private environment: ThreeJsEnvironment;

  // Three.js properties
  // private renderer: THREE.WebGLRenderer;
  // private labelRenderer: CSS2DRenderer;
  // private scene: THREE.Scene;
  // private camera: THREE.Camera;
  // private body: THREE.Object3D<THREE.Event>;
  // private controls: OrbitControls;

  // private axis?: THREE.AxesHelper;
  // private axisLabels: CSS2DObject[] = [];
  // private grid?: THREE.GridHelper;
  // private ambientLight?: THREE.AmbientLight;

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

  // renderersDiv: HTMLDivElement;

  // addedMeshes: THREE.Mesh<THREE.BufferGeometry, THREE.Material>[] = [];

  public units(): {
    x: SIUnit;
    y: SIUnit;
    z: SIUnit;
  } {
    return units(this.options);
  }

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

    this.environment = new ThreeJsEnvironment(
      this.options as EnvironmentOptions
    );

    this.parent.appendChild(this.environment.getRoot());

    this.log("Constructing space");

    // Make the parent node empty
    // while (this.parent.firstChild) {
    //   this.parent.removeChild(this.parent.firstChild);
    // }

    // Create a parent for the two renderers
    // const renderersDiv = document.createElement("div");
    // renderersDiv.style.position = "relative";
    // this.parent.appendChild(renderersDiv);

    // this.renderersDiv = renderersDiv;

    // // Create the 3D WebGL renderer and append it to the given parent
    // this.renderer = new THREE.WebGLRenderer({
    //   antialias: true,
    //   preserveDrawingBuffer: true, // Required for snaphshot images
    // });
    // this.renderer.setSize(width, height);
    // renderersDiv.appendChild(this.renderer.domElement);

    // // Create the label renderer and append it to the given parent
    // // It is placed exactly on top of the WebGL renderer.
    // this.labelRenderer = new CSS2DRenderer();
    // this.labelRenderer.setSize(width, height);
    // this.labelRenderer.domElement.style.position = "absolute";
    // this.labelRenderer.domElement.style.top = "0px";
    // this.labelRenderer.domElement.style.zIndex = "99";
    // renderersDiv.appendChild(this.labelRenderer.domElement);

    // // Create the scene
    // this.scene = new THREE.Scene();
    // this.scene.background = new THREE.Color(this.options.background);

    // // Create the camera and add it to the scene
    // const kind = this.options.orthographic ? "orthographic" : "perspective";
    // this.camera = createCamera(
    //   kind,
    //   width,
    //   height,
    //   this.options.perspectiveMax
    // );
    // this.scene.add(this.camera);

    // // Connect orbit controls to the renderer and to the draw method
    // this.controls = createOrbitControls(
    //   this.camera,
    //   this.renderersDiv,
    //   this.options.zoomMin,
    //   this.options.zoomMax
    // );
    // this.controls.addEventListener("change", this.onChangeOrbit.bind(this));

    // Add a grid if requested
    if (this.options.grid) {
      this.showGrid();
    }

    // Add axis if requested. Don't put it below the grid.
    if (this.options.axis) {
      this.showAxis();
    }

    // Create the body and add it to the scene
    // this.body = new THREE.Object3D();
    // this.scene.add(this.body);

    // // Let the camera look at the body
    // this.camera.position.set(
    //   this.options.cameraX,
    //   this.options.cameraY,
    //   this.options.cameraZ
    // );
    // this.camera.lookAt(this.body.position);
    // this.controls.update();

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

    this.environment.clear();

    // this.addedMeshes.forEach((mesh) => {
    //   mesh.material.dispose();
    //   mesh.geometry.dispose();
    // });

    // this.addedMeshes = [];

    // // Remove any element that has been added to the scene's body
    // while (0 < this.body.children.length) {
    //   this.body.remove(this.body.children[0]);
    // }
  }

  /**
   * Frees all resources.
   */
  dispose() {
    this.environment.dispose();

    // this.clear();

    // // this.renderer.renderLists.dispose();
    // this.renderer.dispose();
    // this.controls.dispose();
    // this.axis?.dispose();
    // this.grid?.dispose();
    // this.ambientLight?.dispose();
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

    const environment = this.environment;

    // Remove previous scene elements
    this.clear();

    // Add all scene elements
    const [name, arrows, meshes, paths, lights, ambientLight, labels] = scene;

    for (const mesh of meshes) {
      environment.addMesh(mesh);
    }

    for (const arrow of arrows) {
      environment.addArrow(arrow);
    }

    // for (const [origin, vector, name, label, color] of vectors) {
    //   this.addVector(origin, vector, name, label, color);
    // }
    for (const path of paths) {
      environment.addPath(path);
    }
    for (const [position, target, color, intensity] of lights) {
      environment.addSpotLight(position, target, color, intensity);
    }
    for (const [characters, position, direction, color, font] of labels) {
      environment.addLabel(characters, position, direction, color, font);
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

  resize(width: number, height: number) {
    this.environment.resize(width, height);
    this.draw();
  }

  hasLabels(): boolean {
    return this.environment.hasLabels();
  }

  showLabels() {
    this.environment.showLabels();
    this.draw();
  }

  hideLabels() {
    this.environment.hideLabels();
    this.draw();
  }

  hasGrid(): boolean {
    return this.environment.hasGrid();
  }

  showGrid() {
    this.environment.showGrid();
    this.draw();
  }

  hideGrid() {
    this.environment.hideGrid();
    this.draw();
  }

  hasAxis(): boolean {
    return this.environment.hasAxis();
  }

  showAxis() {
    this.environment.showAxis();
    this.draw();
  }

  hideAxis() {
    this.environment.hideAxis();
    this.draw();
  }

  hasAxisLabels() {
    return this.environment.hasAxisLabels();
  }

  showAxisLabels() {
    this.environment.showAxisLabels();
    this.draw();
  }

  hideAxisLabels() {
    this.environment.hideAxisLabels();
    this.draw();
  }

  /**
   * Starts auto rotation with the given speed. Uses the speed from the
   * options if no speed is given.
   *
   * @param secondsPerRotation Rotation speed in seconds per rotation.
   */
  startAutoRotation(secondsPerRotation?: number) {
    this.environment.startAutoRotation(secondsPerRotation);
    this.draw();
  }

  /**
   * Stops auto rotation
   */
  stopAutoRotation() {
    this.environment.stopAutoRotation();
  }

  autoRotateSpeed(): number {
    return this.environment.autoRotateSpeed();
  }

  setAmbientLight(color: string, intensity: number) {
    this.environment.setAmbientLight(color, intensity);
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
    if (this.animationRequest && !this.environment.isAutoRotating()) {
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

    this.environment.render();

    if (this.animating || this.environment.isAutoRotating()) {
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
        this.environment.updateArrow(name.value, from, to, label, color);
      }
    }
    for (const mesh of meshes) {
      this.environment.updateMesh(mesh);
    }
  }

  private log(text: string) {
    if (this.options.verbose) {
      console.log(text);
    }
  }

  // public addObject(object: THREE.Object3D<THREE.Event>) {
  //   this.body.add(object);
  // }

  // private addMesh(mesh: PacioliMesh) {
  //   this.log(`Adding mesh ${mesh}`);

  //   // Create a THREE mesh object from the Pacioli mesh and add it to the body
  //   const meshObject = createTHREEMesh(mesh, units(this.options));
  //   this.body.add(meshObject);

  //   this.addedMeshes.push(meshObject);

  //   if (false && meshObject.geometry.attributes.normal) {
  //     const helper = new VertexNormalsHelper(meshObject, 1, 0xff0000);
  //     this.body.add(helper);
  //   }
  // }

  // private updateMesh(name: string, position: PacioliMatrix) {
  //   const mesh = this.scene.getObjectByName(name);
  //   if (mesh) {
  //     const jsVector = vector2THREE(position, units(this.options));
  //     mesh.position.set(jsVector.x, jsVector.y, jsVector.z);
  //   }
  // }

  // private rotateMesh(
  //   name: string,
  //   x: PacioliMatrix,
  //   y: PacioliMatrix,
  //   z: PacioliMatrix
  // ) {
  //   const mesh = this.scene.getObjectByName(name);
  //   if (mesh) {
  //     mesh.rotation.x = getNumber(x.numbers, 0, 0);
  //     mesh.rotation.y = getNumber(y.numbers, 0, 0);
  //     mesh.rotation.z = getNumber(z.numbers, 0, 0);
  //   }
  // }

  // private addPath(path: PacioliPath) {
  //   this.log(`Adding path ${path[0].map(vec2String)}`);

  //   // Create a THREE line object from the Pacioli path and add it to the body
  //   var lineObject = createTHREEPath(path, units(this.options));
  //   this.body.add(lineObject);
  // }

  // private addSpotLight(
  //   position: PacioliMatrix,
  //   target: PacioliMatrix,
  //   color: PacioliString,
  //   intensity: PacioliMatrix
  // ) {
  //   const positionVector = vector2THREE(position, units(this.options));
  //   const targetVector = vector2THREE(target, units(this.options));

  //   const light = new THREE.SpotLight(
  //     new THREE.Color(color.value),
  //     getNumber(intensity.numbers, 0, 0)
  //   );

  //   light.position.set(positionVector.x, positionVector.y, positionVector.z);
  //   light.target.position.set(targetVector.x, targetVector.y, targetVector.z);

  //   this.body.add(light);
  //   this.body.add(light.target);
  // }

  // private addLabel(
  //   characters: PacioliString,
  //   position: PacioliMatrix,
  //   direction: PacioliMatrix,
  //   color: PacioliString,
  //   font: PacioliString
  // ) {
  //   console.log("Adding label", characters, position, direction, color, font);

  //   const label = newLabel(characters.value, 0.5);

  //   if (label) {
  //     label.position.x = 0;
  //     label.position.y = 5;
  //     label.position.z = 0;

  //     this.body.add(label);
  //   } else {
  //     console.log("no label to add");
  //   }
  //   // this.body.add(arrowLabel);

  //   console.log("Added label", characters, position, direction, color, font);
  // }

  // // TODO: updatePath

  // // private addVector(
  // //   origin: PacioliMatrix,
  // //   vector: PacioliMatrix,
  // //   name: PacioliString,
  // //   label: PacioliString,
  // //   color: PacioliString
  // // ) {
  // //   const vectorColor = color.value === "" ? "blue" : color.value;

  // //   this.log(
  // //     `Adding vector from ${vec2String(origin)} to ${vec2String(
  // //       vector
  // //     )} with color '${vectorColor}', name '${name.value}' and label '${
  // //       label.value
  // //     }'`
  // //   );

  // //   // Add an ArrowHelper
  // //   const arrowHelper = createTHREEArrowHelper(
  // //     origin,
  // //     vector,
  // //     name,
  // //     color,
  // //     units(this.options)
  // //   );
  // //   this.body.add(arrowHelper);

  // //   // Add a label. Only skip if it is empty and will always stay empty (no name given for updates)
  // //   if (name.value !== "" || label.value !== "") {
  // //     const arrowLabel = createTHREELabel(
  // //       origin,
  // //       vector,
  // //       name,
  // //       label,
  // //       units(this.options),
  // //       this.options.labelColor
  // //     );
  // //     this.body.add(arrowLabel);
  // //   }
  // // }

  // /**
  //  * Called during animation.
  //  *
  //  * @param name
  //  * @param from
  //  * @param to
  //  * @param label
  //  * @param color
  //  */
  // private updateVector(
  //   name: string,
  //   from: PacioliMatrix,
  //   to: PacioliMatrix,
  //   label: PacioliString,
  //   color: PacioliString
  // ) {
  //   // Update the ArrowHelper if needed
  //   const arrow = this.scene.getObjectByName(name) as THREE.ArrowHelper;
  //   if (arrow) {
  //     const [dirVec, vectorLength] = arrowDirectionAndLength(
  //       to,
  //       units(this.options)
  //     );
  //     const vectorColor = color.value === "" ? "blue" : color.value;
  //     const jsVector = vector2THREE(from, units(this.options));

  //     arrow.position.set(jsVector.x, jsVector.y, jsVector.z);
  //     arrow.setDirection(dirVec);
  //     arrow.setLength(vectorLength);
  //     arrow.setColor(vectorColor);
  //   }

  //   // Update the label if needed
  //   const labelObj = this.scene.getObjectByName(name + "_label") as CSS2DObject;
  //   if (labelObj) {
  //     const vec = vector2THREE(to, units(this.options));
  //     const labelPos = vector2THREE(from, units(this.options))
  //       .multiplyScalar(1.1)
  //       .add(vec);

  //     labelObj.position.set(labelPos.x, labelPos.y, labelPos.z);
  //     labelObj.element.innerHTML = label.value;
  //   }
  // }
}
