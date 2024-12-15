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

  // Kind of the scene. Each uses different data.
  kind?: "scene" | "animation" | "stateful-animation";

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
    const space = new Space(this.rootElement(), this.spaceOptions());

    this.space = space;

    if (this.kind !== undefined) {
      loadSpaceData(space, data, this.kind);
    } else {
      this.displayError("No kind (yet)");
    }

    this.callCallbacks();

    space.draw();
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
      case "kind": {
        if (
          newValue === "scene" ||
          newValue === "animation" ||
          newValue === "stateful-animation"
        ) {
          this.kind = newValue;
        } else {
          this.displayError(
            `Cannot set kind '${newValue}' on PacioliControlsComponent. Valid kinds are 'scene', 'animation' or 'stateful-animation'`
          );
        }
        break;
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

    if (this.space && !this.space.isRunning() && this.kind != undefined) {
      loadSpaceData(this.space, this.fetchData(), this.kind);
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
   * Performs a single animation step.
   *
   * Should not be called when an animation is running.
   */
  step() {
    if (this.space && !this.space.isRunning()) {
      try {
        this.space.updateScene();
      } catch (error: any) {
        this.displayError("Step failed:\n\n" + error);
      }
    }
  }

  /**
   * Calls all registered callbacks.
   */
  callCallbacks() {
    for (let callback of this.callbacks) {
      callback();
    }
  }

  /**
   * Adds a line to the error output. Makes sure the error element is unhidden.
   *
   * @param message The text to add
   */
  displayError(message: string) {
    this.errorDiv.hidden = false;
    this.errorText.innerText = message + "\n\n" + this.errorText.innerText;
  }

  /**
   * Clears the text of the error output and hides the error element.
   */
  clearErrors() {
    this.errorText.innerText = "";
    this.errorDiv.hidden = true;
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
