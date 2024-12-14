import { si } from "uom-ts";
import { PacioliScene, Space, Animation, StatefulAnimation } from "../space";
import { pacioliFunction, PacioliParameter } from "./utils";
import { PacioliValue } from "../value";
import { num, string } from "../api";

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
  grid = true;
  gridSize: [number, number] = [20, 20];
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
  errorText = document.createElement("div");
  closeErrorButton = document.createElement("button");

  // Web component field.
  static observedAttributes = [
    "width",
    "height",
    "script",
    "function",
    "parameters",
    "kind",
    "unit",
    "axis",
    "grid",
  ];

  shadow: ShadowRoot;

  constructor() {
    super();

    // We use the Web component shadow DOM mechanism
    this.shadow = this.attachShadow({ mode: "open" });

    // Append the div for errors before the space. Hide it until the first
    // error is displayed.
    this.errorDiv.style.color = "red";
    this.errorDiv.style.background = "yellow";
    this.errorDiv.style.padding = "8pt";
    this.errorDiv.hidden = true;
    this.shadow.appendChild(this.errorDiv);

    this.errorDiv.appendChild(this.errorText);
    this.errorDiv.appendChild(this.closeErrorButton);
    this.closeErrorButton.innerText = "Close";
    this.closeErrorButton.onclick = (_: Event) => this.clearErrors();
  }

  /**
   * Web component life-cycle event.
   */
  connectedCallback() {
    try {
      // Create a Pacioli space and attach it to the shadow DOM parent.
      const options = {
        ...this,
        unit: this.parsedUnit(),
      };
      const space = new Space(this.shadow as unknown as HTMLElement, options);

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
        const parsed = parseInt(newValue);
        if (Number.isFinite(parsed)) {
          this.width = parsed;
        } else {
          this.displayError(
            `Width ${newValue} invalid. Please give a valid number.`
          );
        }
        break;
      }
      case "height": {
        const parsed = parseInt(newValue);
        if (Number.isFinite(parsed)) {
          this.height = parsed;
        } else {
          this.displayError(
            `Height ${newValue} invalid. Please give a valid number.`
          );
        }
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
      case "axis": {
        this.axis = newValue === "true";
        break;
      }
      case "grid": {
        this.grid = newValue === "true";
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
   * @param {*} values The parameter values. List of objects with a 'value' field, one for each
   * script function parameter. Must match the parameter child nodes.
   */
  setParameters(values: string[]) {
    const children = this.parameterNodes();

    for (let i = 0; i < children.length; i++) {
      children[i].innerText = values[i];
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
          `scene kind unknown.\n\n Please give a 'kind' attribute. The value must be 'scene', 'animation' or 'stateful-animation'`
        );
      }

      if (this.script === undefined || this.function === undefined) {
        throw new Error(
          `script function is unknown.\n\n Please give a 'script' attribute with the Pacioli filename, and a 'function' attribute with the scene function name.`
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

/**
 * Turns the raw parameter attribues from the PacioliSceneComponent child nodes
 * into PacioliParameter objects.
 *
 * @param parameters List of attribute values for the scene parameters
 * @returns A list of parsed parameters.
 */
function parseParameters(
  parameters: {
    label: string;
    type: string;
    unit: string;
    value: string;
  }[]
): PacioliParameter[] {
  return parameters.map((node) => {
    try {
      switch (node.type) {
        case "string": {
          // Create a StringParameter
          return {
            type: "string",
            label: node.label,
            value: node.value,
            pacioliValue: string(node.value),
          };
        }

        case "number": {
          // Browsers give an empty string on invalid input. This gives a
          // unclear error message in si.parseDimNum below.
          if (node.value === "") {
            throw Error(
              `invalid value for ${node.type} parameter ${node.label}`
            );
          }

          // Parse the number and the unit
          const dimNum = si.parseDimNum(node.value + " * " + node.unit);

          // Create a NumberParameter
          return {
            type: "number",
            label: node.label,
            value: node.value,
            unit: node.unit,
            pacioliUnit: dimNum.unit,
            pacioliValue: num(Number(dimNum.magnitude), dimNum.unit),
          };
        }

        default: {
          throw new Error(
            `unexpected parameter type '${node.type}' for parameter '${node.label}'. Expected 'string' or 'number'.`
          );
        }
      }
    } catch (error: any) {
      throw Error(
        `cannot read value ${node.value} for ${node.type} parameter ${node.label}:\n\n ${error}.`
      );
    }
  });
}

/**
 * Calls the script function and loads the result into a space. The function must
 * return a Pacioli scene, animation or stateful animation.
 *
 * Here we pass from static to the dynamic typing. Loading will crash if the
 * parameter types do no match the function's type.
 */
function loadPacioliSpace(
  space: Space,
  script: string,
  func: string,
  kind: "scene" | "animation" | "stateful-animation",
  parameters: PacioliParameter[]
) {
  // Lookup the Pacioli function and apply it to the parameter values
  const params: PacioliValue[] = parameters.map((param) => param.pacioliValue);
  const scene: PacioliValue = pacioliFunction(script, func).apply(params);

  // Cast the PacioliValue to the expected type and hope it works out at runtime.
  // TODO: Improve error handling with runtime checks on the returned value
  switch (kind) {
    case "scene": {
      space.loadScene(scene as unknown as PacioliScene);
      break;
    }
    case "animation": {
      space.loadAnimation(scene as unknown as Animation);
      break;
    }
    case "stateful-animation": {
      space.loadStatefulAnimation(scene as unknown as StatefulAnimation);
      break;
    }
  }
}

customElements.define("pacioli-scene", PacioliSceneComponent);
