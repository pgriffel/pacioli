import { si } from "uom-ts";
import { Space } from "../space";
import { PacioliParameter, parseParameters, loadPacioliSpace } from "./utils";

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
export class PacioliSceneComponent extends HTMLElement {
  // Options for the Pacioli space.
  unit = "metre";
  width = 800;
  height = 600;
  axis = true;
  axisSize = 10;
  grid: [number, number] = [20, 20];
  perspective = true;
  zoomRange: [number, number] = [1, 1000];
  camera: [number, number, number] = [20, 10, 20];
  verbose = false;

  // Parameters for function loadPacioliSpace that computes the scene.
  script?: string;
  function?: string;
  kind?: "scene" | "animation" | "stateful-animation";

  // The Pacioli space
  space?: Space;

  // List of registered callbacks. The callback mechanism is used by connected PacioliControls
  // elements to get informed about relevant changes.
  callbacks: (() => void)[] = [];

  // HTML element to display errors.
  errorDiv = document.createElement("div");

  // Web component field. TODO: complete this list
  static observedAttributes = [
    "width",
    "height",
    "script",
    "function",
    "parameters",
    "kind",
    "unit",
  ];

  constructor() {
    super();
  }

  /**
   * Web component life-cycle event.
   */
  connectedCallback() {
    const shadow: ShadowRoot = this.attachShadow({ mode: "open" });

    // Append the div for errors before the space. Hide it until the first
    // error is displayed.
    this.errorDiv.style.color = "red";
    this.errorDiv.style.background = "yellow";
    this.errorDiv.style.padding = "8pt";
    this.errorDiv.hidden = true;
    shadow.appendChild(this.errorDiv);

    try {
      // Create a Pacioli space and attach it to the shadow DOM parent.
      const options = {
        ...this,
        unit: this.parsedUnit(),
      };
      const space = new Space(shadow as unknown as HTMLElement, options);

      this.space = space;

      // Delay loading the space until the DOM children exist. We need the children so we can get
      // the parameter values.
      setTimeout(() => {
        this.loadSpace();
        space.draw();
      }, 1);
    } catch (error: any) {
      this.displayError(error);
    }
  }

  /**
   * Web component life-cycle event.
   */
  attributeChangedCallback(name: string, _: string, newValue: string) {
    switch (name) {
      case "width": {
        this.width = parseInt(newValue);
        break;
      }
      case "height": {
        this.height = parseInt(newValue);
        break;
      }
      case "script": {
        this.script = newValue;
        break;
      }
      case "function": {
        this.function = newValue;
        break;
      }
      case "unit": {
        this.unit = newValue;
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
   * The unit for the scene's 3D space. The default is unit 'metre'.
   */
  parsedUnit() {
    try {
      return si.parseDimNum(this.unit || "metre").unit;
    } catch (error: any) {
      throw Error(`failed to parse scene unit '${this.unit}'`);
    }
  }

  /**
   * The component's DOM children. They contain the parameters for the scene function.
   */
  parameterNodes(): HTMLElement[] {
    return Array.from(this.childNodes).filter(
      (child) => child.nodeName === "PARAMETER"
    ) as HTMLElement[];
  }

  /**
   * Collect the parameter label, type, unit and value for the DOM children.
   */
  currentParameters(): {
    label: string;
    type: string;
    unit: string;
    value: string;
  }[] {
    return this.parameterNodes().map((child) => ({
      label: child.getAttribute("label") || "n/a",
      type: child.getAttribute("type") || "number",
      unit: child.getAttribute("unit") || "1",
      value: child.innerText,
    }));
  }

  /**
   * Parses the DOM children and returns a list of parameters.
   *
   * @returns The parsed parameters
   */
  parsedParameters(): PacioliParameter[] {
    return parseParameters(this.currentParameters());
  }

  /**
   * Set the parameter values programmatically. Updates the values in the DOM children. Only sets the
   * magnitudes. The units are fixed.
   *
   * @param {*} parameters The parameter values. List of objects with a 'value' field, one for each
   * script function parameter. Must match the parameter child nodes.
   */
  setParameters(parameters: { value: string }[]) {
    const children = this.parameterNodes();

    for (let i = 0; i < children.length; i++) {
      children[i].innerText = parameters[i].value;
    }
  }

  /**
   * Calls the scene's script function and loads the scene. The function must return
   * a Pacioli scene.
   *
   * Calls the registered callbacks when loading has finished.
   */
  loadSpace() {
    try {
      if (this.kind === undefined) {
        throw new Error(
          `scene kind unknown. Please give a 'kind' attribute. The value must be 'scene', 'animation' or 'stateful-animation'`
        );
      }

      if (this.script === undefined || this.function === undefined) {
        throw new Error(
          `script function is unknown. Please give a 'script' attribute with the Pacioli filename, and a 'function' attribute with the scene function name.`
        );
      }

      if (this.space) {
        loadPacioliSpace(
          this.space,
          this.script,
          this.function,
          this.kind,
          this.parsedParameters()
        );
        this.callCallbacks();
      }
    } catch (error: any) {
      this.displayError("Could not load script:\n\n" + error);
    }
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
      this.loadSpace();
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
    this.errorDiv.innerText = message + "\n\n" + this.errorDiv.innerText;
  }

  /**
   * Clears the text of the error output and hides the error element.
   */
  clearErrors() {
    this.errorDiv.innerText = "";
    this.errorDiv.hidden = true;
  }
}

customElements.define("pacioli-scene", PacioliSceneComponent);
