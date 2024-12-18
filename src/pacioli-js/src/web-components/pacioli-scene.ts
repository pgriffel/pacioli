import { si, SIUnit } from "uom-ts";
import {
  PacioliScene,
  Space,
  Animation,
  StatefulAnimation,
  SpaceOptions,
} from "../space";
import { PacioliValue } from "../value";
import { PacioliShadowTreeComponent } from "./pacioli-shadow-tree-component";
import {
  optionalBooleanAttributes,
  optionalNumberAttributes,
  optionalStringAttributes,
} from "./utils";

/**
 * Web component for a 3D Pacioli space. A wrapper around the Space class.
 *
 * Say we have a scene function foo from file bar.pacioli, and the function takes
 * a parameter for an object shape and one for mass, then
 *
 * @example
 * declare foo :: (String, gram) -> Scene(metre)
 *
 * define foo(shape, mass) = ...
 *
 * <pacioli-scene script="bar" function="foo" kind="scene">
 *       <parameter label="shape" type="string">sphere</parameter>
 *       <parameter label="mass" unit="gram">10</parameter>
 * </pacioli-scene>
 */
export class PacioliSceneComponent extends PacioliShadowTreeComponent {
  // The unit of measurement. Is CURRENTLY NOT derived from the data if no unit attribute
  // is given.
  unit?: SIUnit;

  // The Pacioli space
  space?: Space;

  // List of registered callbacks. The callback mechanism is used by connected PacioliControls
  // elements to get informed about relevant changes.
  callbacks: (() => void)[] = [];

  // Web component field.
  static observedAttributes = ["kind", "unit"];

  constructor() {
    super();
  }

  override dataAvailable(data: PacioliValue) {
    // Create a space and load the data
    this.space = new Space(this.rootElement(), this.spaceOptions());
    loadSpaceData(this.space, data, this.sceneKind());

    // Call the registered callbacks
    this.callCallbacks();

    // Update the screen to show the loaded data
    this.space.draw();
  }

  /**
   * Web component life-cycle event.
   */
  attributeChangedCallback(name: string, _: string, newValue: string) {
    switch (name) {
      case "unit": {
        this.unit = si.parseDimNum(newValue).unit;
        break;
      }
    }
  }

  /**
   * Is the scene a static scene, a simple animation, or a stateful
   * animation? Each case uses different data.
   *
   * @returns The scene kind
   */
  sceneKind(): "scene" | "animation" | "stateful-animation" {
    const kindAttribute = this.getAttribute("kind");
    if (kindAttribute === null) {
      throw Error(`no 'kind' attribute on pacioli-scene. Please `);
    } else {
      if (
        kindAttribute === "scene" ||
        kindAttribute === "animation" ||
        kindAttribute === "stateful-animation"
      ) {
        return kindAttribute;
      } else {
        throw Error(
          `cannot set kind '${kindAttribute}' on PacioliControlsComponent. Valid kinds are 'scene', 'animation' or 'stateful-animation'`
        );
      }
    }
  }

  /**
   *
   * @returns
   */
  spaceOptions(): Partial<SpaceOptions> {
    return {
      unit: this.unit || si.parseDimNum("metre").unit,
      width: 800,
      height: 600,
      axisSize: 10,
      gridSize: [20, 20],
      zoomRange: [1, 1000],
      camera: [20, 10, 20],
      verbose: false,
      ...optionalStringAttributes(this, []),
      ...optionalBooleanAttributes(this, ["axis", "grid", "perspective"]),
      ...optionalNumberAttributes(this, ["width", "height"]),
    };
  }

  /**
   * Calls the script function with the current parameter values and loads the returned
   * scene into the Pacioli space. The animation is reset to time zero.
   *
   * Should not be called when an animation is running
   */
  reset() {
    this.clearErrors();

    if (this.space && !this.space.isRunning()) {
      loadSpaceData(this.space, this.fetchData(), this.sceneKind());
      this.space.draw();
    }
  }

  /**
   * Is an animation running?
   *
   * @returns True if an animation running.
   */
  isRunning() {
    return this.space && this.space.isRunning();
  }

  /**
   * Starts or pauses an animation.
   *
   * @param {*} running Start (true) or pause (false)
   */
  setRunning(running: boolean) {
    if (this.space) {
      this.space.setRunning(running);
    }
  }

  /**
   * Performs a single animation step.
   *
   * Should not be called when an animation is running.
   */
  step() {
    if (this.space && !this.space.isRunning()) {
      this.space.updateScene();
    }
  }

  /**
   * Registers a callback. Currently only called after loading a scene. All other
   * methods are called by the control element, so it can update itself. More calls
   * can be added in the future if needed.
   *
   * @param {*} callback A function of zero arguments.
   */
  registerCallback(callback: () => void) {
    this.callbacks.push(callback);
  }

  /**
   * Calls all registered callbacks.
   */
  callCallbacks() {
    for (let callback of this.callbacks) {
      callback();
    }
  }
}

function loadSpaceData(
  space: Space,
  data: PacioliValue,
  kind: "scene" | "animation" | "stateful-animation"
) {
  // Cast the PacioliValue to the expected type and hope it works out at runtime.
  // TODO: Improve error handling with runtime checks on the returned value
  switch (kind) {
    case "scene": {
      space.loadScene(data as unknown as PacioliScene);
      break;
    }
    case "animation": {
      space.loadAnimation(data as unknown as Animation);
      break;
    }
    case "stateful-animation": {
      space.loadStatefulAnimation(data as unknown as StatefulAnimation);
      break;
    }
  }
}

customElements.define("pacioli-scene", PacioliSceneComponent);
