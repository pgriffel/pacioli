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
import { num, unit } from "../api";
import { PacioliFunction } from "../values/function";
import { PacioliValue } from "../boxing";
import { PacioliScene, StatefulAnimation, Animation } from "./scene";
import { ThreeJsEnvironment } from "./threejs-environment";

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
  gridSize: number;
  gridDivisions: number;
  gridColor: string;
  cameraNear: number;
  cameraFar: number;
  cameraX: number;
  cameraY: number;
  cameraZ: number;
  hideLabels: boolean;
  labelColor: string;
  labelScale: number;
  fontFamily: string;
  fontSize: number;
  autoRotation: boolean;
  secondsPerRotation: number;
  ambientColor?: string;
  ambientIntensity?: number;
  scale: number;
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
  gridSize: 20,
  gridDivisions: 20,
  gridColor: "#dddddd",
  cameraNear: 0.1, // three.js default is 0.1
  cameraFar: 2000, // three.js default is 2000
  cameraX: 20,
  cameraY: 10,
  cameraZ: 20,
  hideLabels: false,
  labelColor: "#0A0A0A",
  labelScale: 1, // scale the labels
  fontFamily: "sans-serif",
  fontSize: 100, // font size in pixels, changing this does not change the label size, just the bluriness
  autoRotation: false,
  secondsPerRotation: 30,
  scale: 1, // scale the complete scene, except the labels
};

/**
 * A 3D environment for graphical display with Three.js.
 */
export class Space {
  // Time unit for the animation
  private readonly TIME_UNIT = unit("second");

  // Space configuration
  public options: SpaceOptions;

  private environment: ThreeJsEnvironment;

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

    this.environment = new ThreeJsEnvironment(this.options);

    this.parent.appendChild(this.environment.getRoot());

    // Add a grid if requested
    if (this.options.grid) {
      this.showGrid();
    }

    // Add axis if requested. Don't put it below the grid.
    if (this.options.axis) {
      this.showAxis();
    }

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
    this.environment.clear();
  }

  /**
   * Frees all resources.
   */
  dispose() {
    this.environment.dispose();
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

    this.environment.loadScene(scene);

    // Initialize the animation
    this.resetAnimation();
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

    this.environment.updateScene(this.animationScene);
  }
}
