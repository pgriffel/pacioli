/**
 * Copyright 2026 Paul Griffioen
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

import type { SIUnit } from "uom-ts";
import type { SpaceOptions } from "../../graphics/space";
import { Space } from "../../graphics/space";
import type { PacioliValue } from "../../values/pacioli-value";
import { PacioliShadowTreeComponent } from "../pacioli-shadow-tree-component";
import { optionsFromAttributes } from "../utils";
import { parseUnit } from "../../api";
import type {
  PacioliScene,
  StatefulAnimation,
  Animation,
} from "../../graphics/scene";

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
    "gridSize",
    "gridDivisions",
    "cameraNear",
    "cameraFar",
    "cameraX",
    "cameraY",
    "cameraZ",
    "secondsPerRotation",
  ],
};

/**
 * Style sheet for the bar chart
 */
const STYLES = ` 
  .content{ display: inline; }`;

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
 * <pacioli-scene definition="bar:foo" kind="scene">
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

  constructor() {
    super();
    this.adoptStyles(STYLES);
  }

  /**
   * Web component life-cycle event.
   */
  connectedCallback() {
    super.connectedCallback();

    // Set the CSS styles
    // this.contentParent().className = "content";

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
          this.unit = parseUnit(newValue);
          break;
        }
        case "unitx": {
          this.unitX = parseUnit(newValue);
          break;
        }
        case "unity": {
          this.unitY = parseUnit(newValue);
          break;
        }
        case "unitz": {
          this.unitZ = parseUnit(newValue);
          break;
        }
      }
    } catch (err: unknown) {
      this.displayError(err instanceof Error ? err.message : String(err));
    }
  }

  /**
   * Pacioli web component life-cycle event.
   */
  override parametersChanged() {
    if (this.space !== undefined) {
      this.fetchedData = this.evaluateDefinition();

      this.loadData(this.space);
    }
  }

  /**
   * Is the scene a static scene, a simple animation, or a stateful
   * animation? Each case uses different data.
   *
   * @returns The scene kind
   */
  kind(): "scene" | "animation" | "stateful-animation" {
    const kindAttribute = this.getAttribute("kind");

    if (kindAttribute === null) {
      return "scene";
    } else {
      if (
        kindAttribute === "scene" ||
        kindAttribute === "animation" ||
        kindAttribute === "stateful-animation"
      ) {
        return kindAttribute;
      } else {
        throw new Error(
          `cannot set kind '${kindAttribute}' on PacioliControlsComponent. Valid kinds are 'scene', 'animation' or 'stateful-animation'`,
        );
      }
    }
  }

  isAnimation(): boolean {
    const kind = this.kind();
    return kind === "animation" || kind === "stateful-animation";
  }

  /**
   * Creates an options for the scene from the element's attributes.
   *
   * @returns An object with only the entries that are found in the attributes.
   */
  spaceOptions(): Partial<SpaceOptions> {
    return {
      unitX: this.unitX || this.unit || parseUnit("metre"),
      unitY: this.unitY || this.unit || parseUnit("metre"),
      unitZ: this.unitZ || this.unit || parseUnit("metre"),
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
   * Creates a snapshot of the displayed scene.
   *
   * If a name is provided the image is downloaded under that name. Otherwise
   * a new window is opened displaying the image.
   *
   * @param name Optional name for the download file
   */
  openImage(name?: string) {
    const canvas = this.findElement("canvas") as HTMLCanvasElement;

    const dataURL = canvas.toDataURL("image/png");

    if (name === undefined) {
      window.open(dataURL, "_blank");
    } else {
      const link = document.createElement("a");
      link.href = dataURL;
      link.download = `${name}.png`;
      link.click();
    }
  }

  /**
   * Loads the fetched data into the Pacioli space.
   */
  private loadData(space: Space) {
    if (this.fetchedData) {
      // Load the computed data into the space
      loadSpaceData(space, this.fetchedData, this.kind());

      // Update the screen to show the loaded data
      space.draw();
    }
  }
}

function loadSpaceData(
  space: Space,
  data: PacioliValue,
  kind: "scene" | "animation" | "stateful-animation",
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
