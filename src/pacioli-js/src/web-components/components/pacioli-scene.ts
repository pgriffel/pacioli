import { si, SIUnit } from "uom-ts";
import {
  PacioliScene,
  Space,
  Animation,
  StatefulAnimation,
  SpaceOptions,
} from "../../space";
import { PacioliValue } from "../../value";
import { PacioliShadowTreeComponent } from "../pacioli-shadow-tree-component";
import { optionsFromAttributes } from "../utils";

/**
 * Attribues supported by the 3D scene component
 */
const SUPPORTED_ATTRIBUTES = {
  strings: [],
  booleans: ["axis", "grid", "perspective"],
  numbers: ["width", "height", "fps"],
};

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
  /**
   * The unit of measurement. Is CURRENTLY NOT derived from the data if no unit attribute
   * is given.
   */
  unit?: SIUnit;

  /**
   * The Pacioli space
   */
  space?: Space;

  /**
   * Web component field.
   */
  static observedAttributes = ["unit"];

  constructor() {
    super();
  }

  /**
   * Web component life-cycle event.
   */
  connectedCallback() {
    super.connectedCallback();

    // Create the Space
    this.space = new Space(this.contentParent(), this.spaceOptions());
  }

  /**
   * Web component life-cycle event.
   */
  attributeChangedCallback(name: string, _: string, newValue: string) {
    try {
      switch (name) {
        case "unit": {
          this.unit = si.parseDimNum(newValue).unit;
          break;
        }
      }
    } catch (err: any) {
      this.displayError(err);
    }
  }

  /**
   * Pacioli web component life-cycle event.
   */
  parametersChanged() {
    try {
      if (this.space) {
        this.fetchAndLoadData(this.space);
      }
    } catch (err: any) {
      this.displayError(err);
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
      throw Error(`no 'kind' attribute on pacioli-scene. Please provide one.`);
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
      ...optionsFromAttributes<SpaceOptions>(this, SUPPORTED_ATTRIBUTES),
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
      this.fetchAndLoadData(this.space);
    }
  }

  /**
   *
   * @returns
   */
  override isBusy(): boolean {
    return this.isRunning() ?? false;
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
      this.callCallbacks();
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
   * Calls the script function with the current parameter values and loads the returned
   * scene into the Pacioli space.
   */
  private fetchAndLoadData(space: Space) {
    // Compute the data and load it into the space
    loadSpaceData(space, this.fetchData(), this.sceneKind());

    // Update the screen to show the loaded data
    space.draw();

    // Synchronize any connected controls and inputs
    this.callCallbacks();
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
