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
  strings: [
    "background",
    "axisColorsX",
    "axisColorsY",
    "axisColorsZ",
    "gridColor",
    "ambientColor",
    "labelColor",
  ],
  booleans: ["axis", "grid", "orthographic", "hideLabels", "autoRotation"],
  numbers: [
    "width",
    "height",
    "axisSize",
    "ambientIntensity",
    "fps",
    "gridSizeX",
    "gridSizeY",
    "zoomMin",
    "zoomMax",
    "perspectiveMax",
    "cameraX",
    "cameraY",
    "cameraZ",
    "secondsPerRotation",
  ],
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
  unitX?: SIUnit;
  unitY?: SIUnit;
  unitZ?: SIUnit;

  /**
   * The Pacioli space
   */
  space?: Space;

  /**
   * Fetched data. Stored for resetting the scene.
   */
  fetchedData?: PacioliValue;

  /**
   * Web component field.
   */
  static observedAttributes = ["unit", "unitx", "unity", "unitz"];

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
        case "unitx": {
          this.unitX = si.parseDimNum(newValue).unit;
          break;
        }
        case "unity": {
          this.unitY = si.parseDimNum(newValue).unit;
          break;
        }
        case "unitz": {
          this.unitZ = si.parseDimNum(newValue).unit;
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
        this.fetchedData = this.fetchData();
        this.loadData(this.space);
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
   * Creates an options for the scene from the element's attributes.
   *
   * @returns An object with only the entries that are found in the attributes.
   */
  spaceOptions(): Partial<SpaceOptions> {
    return {
      unitX: this.unitX || this.unit || si.parseDimNum("metre").unit,
      unitY: this.unitY || this.unit || si.parseDimNum("metre").unit,
      unitZ: this.unitZ || this.unit || si.parseDimNum("metre").unit,
      ...optionsFromAttributes<SpaceOptions>(this, SUPPORTED_ATTRIBUTES),
    };
  }

  /**
   * Loads the previously computed initial scene into the Pacioli space. The
   * animation is reset to time zero.
   *
   * Should not be called when an animation is running
   */
  reset() {
    if (this.space && !this.space.isRunning()) {
      this.loadData(this.space);
    }
  }

  /**
   * Hints that the scene should not be adjusted.
   *
   * @returns True if an animation running.
   */
  override isBusy(): boolean {
    return this.isRunning() ?? false;
  }

  /**
   * Is an animation running?
   *
   * @returns True if an animation is running.
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
   * Loads the fetched data into the Pacioli space.
   */
  private loadData(space: Space) {
    if (this.fetchedData) {
      // Load the computed data into the space
      loadSpaceData(space, this.fetchedData, this.sceneKind());

      // Update the screen to show the loaded data
      space.draw();

      // Synchronize any connected controls and inputs
      this.callCallbacks();
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
