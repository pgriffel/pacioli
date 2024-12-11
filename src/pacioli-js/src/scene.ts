import { si, SIUnit } from "uom-ts";
import { PacioliScene, Space, Animation, StatefulAnimation } from "./space";
import { fun, num, string } from "./api";
import { PacioliString } from "./values/string";
import { Matrix } from "./values/matrix";

/**
 * Web component for a 3D Pacioli space.
 *
 * A wrapper around the Space class.
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

  // Parameters for function LoadPacioliScript that computes the scene.
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

    // Append the div for errors after the space. Hide it until the first
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
   * Parses the DOM children and returns a list of parameters.
   *
   * @returns A list of objects with the 'label', 'value', 'unit', 'pacioliUnit' and 'pacioliValue' fields.
   */
  parsedParameters(): PacioliParameter[] {
    return parseParameters(this.currentParameters());
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
   * No animation can be running when calling this method.
   */
  reset() {
    this.clearErrors();

    if (this.space && !this.space.isAnimating()) {
      this.loadSpace();
      this.space.draw();
    }
  }

  /**
   * Is an animation running?
   *
   * @returns True if an animation running.
   */
  isAnimating() {
    return this.space && this.space.isAnimating();
  }

  /**
   * Starts or pauses an animation.
   *
   * @param {*} animating Start (true) or pause (false)
   */
  setAnimating(animating: boolean) {
    if (this.space) {
      this.space.setAnimating(animating);
    }
  }

  /**
   * Performs a single animation step.
   *
   * No animation can be running when calling this method.
   */
  step() {
    if (this.space && !this.space.isAnimating()) {
      try {
        this.space.updateScene();
      } catch (error: any) {
        this.displayError("Step failed: " + error);
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
   * Registers a callback. Currently only called after creation. All other methods
   * are called by the control element, so it can update itself. More calls can be
   * added in the future if needed.
   *
   * @param {*} callback A function of zero arguments.
   */
  registerCallback(callback: () => void) {
    this.callbacks.push(callback);
  }

  displayError(message: string) {
    this.errorDiv.hidden = false;
    this.errorDiv.innerText = message + "\n\n" + this.errorDiv.innerText;
  }

  clearErrors() {
    this.errorDiv.innerText = "";
    this.errorDiv.hidden = true;
  }
}

/**
 * Web component with controls for the PacioliScene web component.
 */
export class PacioliControlsComponent extends HTMLElement {
  static SECONDS_PER_ROTATION = 30;

  static observedAttributes = ["for"];

  for?: string;

  inputs: {
    parameter: PacioliParameter;
    input: HTMLInputElement;
  }[];
  table: HTMLTableElement;
  stepButton: HTMLButtonElement;
  startButton: HTMLButtonElement;
  resetButton: HTMLButtonElement;
  autoRotateButton: HTMLLabelElement;

  constructor() {
    super();
    this.inputs = this.createInputs();
    this.table = createParameterTable(this.inputs);

    // Create the buttons
    this.stepButton = this.createStepButton();
    this.startButton = this.createStartButton();
    this.resetButton = this.createResetButton();
    this.autoRotateButton = this.createAutoRotationButton();
  }

  /**
   * Web component life-cycle event.
   */
  connectedCallback() {
    // The parent to which elements will be added
    const parent = this;

    // Alternative that uses a shadow DOM with its own style sheet.
    // How can we use the shadow DOM and still allow overriding the
    // style of the controls?

    // const parent = this.attachShadow({ mode: "open" });
    // const sheet = new CSSStyleSheet();
    // sheet.replaceSync("button { color: red; border: 2px dotted black;}");
    // parent.adoptedStyleSheets = [sheet];

    // The controls are divided into animation controls and configuration
    // controls
    const animationElement = document.createElement("div");
    const configurationElement = document.createElement("div");

    animationElement.className = "pacioli-controls-animation";
    configurationElement.className = "pacioli-controls-configuration";

    parent.appendChild(animationElement);
    parent.appendChild(configurationElement);

    // Create a table of inputs for the scene parameters
    this.inputs = this.createInputs();
    this.table = createParameterTable(this.inputs);

    // Add the new elements to the parent
    animationElement.appendChild(this.startButton);
    animationElement.appendChild(this.stepButton);
    animationElement.appendChild(this.table);
    animationElement.appendChild(this.resetButton);

    configurationElement.appendChild(this.autoRotateButton);

    // Make sure the proper buttons are shown and enabled
    this.updateButtons();

    // If we are connected to a scene, then we need to keep the
    // state of the buttons synchronized with the scene animation.
    const scene = this.sceneElement();
    if (scene) {
      scene.registerCallback(() => this.updateButtons());
    }
  }

  /**
   * Web component life-cycle event.
   */
  attributeChangedCallback(name: string, _: string, newValue: string) {
    switch (name) {
      case "for": {
        this.for = newValue;
        break;
      }
      default: {
        throw Error(
          `cannot set attribe ${name} on PacioliControlsComponent. Valid attribute is 'for'`
        );
      }
    }
  }

  /**
   * The PacioliScene element to which this element is connected via the id in
   * the 'for' field.
   *
   * @returns The connected PacioliScene, or undefined if no connected scene exists.
   */
  sceneElement(): PacioliSceneComponent | undefined {
    return this.for
      ? (document.getElementById(this.for) as PacioliSceneComponent)
      : undefined;
  }

  createInputs(): {
    parameter: PacioliParameter;
    input: HTMLInputElement;
  }[] {
    const scene = this.sceneElement();
    if (scene) {
      return createParameterInputs(scene.parsedParameters(), () =>
        this.resetButton.click()
      );
    } else {
      return [];
    }
  }

  createStartButton() {
    let runButton = document.createElement("button");

    runButton.innerText = "Start";
    runButton.className = "pacioli-controls-button";
    runButton.onclick = () => this.startButtonClicked();

    return runButton;
  }

  createStepButton() {
    let stepButton = document.createElement("button");

    stepButton.className = "pacioli-controls-button";
    stepButton.onclick = () => this.stepButtonClicked();

    return stepButton;
  }

  createResetButton() {
    let inputButton = document.createElement("button");

    inputButton.innerText = "Apply";
    inputButton.className = "pacioli-controls-button";
    inputButton.onclick = () => this.resetButtonClicked();

    return inputButton;
  }

  createAutoRotationButton() {
    let rotateLabel = document.createElement("label");
    let rotateCheckbox = document.createElement("input");

    rotateLabel.innerText = "Rotate";
    rotateCheckbox.type = "checkbox";
    rotateLabel.className = "pacioli-controls-checkbox";
    rotateCheckbox.onchange = (event) =>
      this.autoRotateCheckboxClicked(
        (event.target as HTMLInputElement).checked
      );

    rotateLabel.appendChild(rotateCheckbox);
    return rotateLabel;
  }

  startButtonClicked() {
    const scene = this.sceneElement();
    if (scene) {
      scene.setAnimating(!scene.isAnimating());
      this.updateButtons();
    }
  }

  stepButtonClicked() {
    const scene = this.sceneElement();
    if (scene) {
      scene.step();
      this.updateButtons();
    }
  }

  resetButtonClicked() {
    const scene = this.sceneElement();
    if (scene) {
      scene.setParameters(
        this.inputs.map((record) => {
          return {
            value: record.input.value,
          };
        })
      );
      scene.reset();
      this.updateButtons();
    }
  }

  autoRotateCheckboxClicked(checked: boolean) {
    const scene = this.sceneElement();
    if (scene && scene.space) {
      if (checked) {
        scene.space.startAutoRotation(
          PacioliControlsComponent.SECONDS_PER_ROTATION
        );
      } else {
        scene.space.stopAutoRotation();
      }
    }
  }

  updateButtons() {
    const scene = this.sceneElement();

    if (scene) {
      this.stepButton.hidden = !scene.space!.isAnimation();
      this.startButton.hidden = !scene.space!.isAnimation();

      this.stepButton.innerText =
        "Step " + scene.space!.animationTime().toFixed(2) + "s";
      this.startButton.innerText = scene.space!.isAnimating() ? "Pause" : "Run";

      this.stepButton.disabled = scene.space!.isAnimating();
      this.resetButton.disabled = scene.space!.isAnimating();
      this.startButton.disabled = false;
    } else {
      this.resetButton.disabled = true;
      this.stepButton.disabled = true;
      this.startButton.disabled = true;
    }
  }
}

/**
 * Types for the parsed scene parameters. The parameters are passed via
 * child DOM elements.
 */
type PacioliParameter = NumberParameter | StringParameter;

type NumberParameter = {
  type: "number";
  label: string;
  value: string;
  unit: string;
  pacioliValue: Matrix;
  pacioliUnit: SIUnit;
};

type StringParameter = {
  type: "string";
  label: string;
  value: string;
  pacioliValue: PacioliString;
};

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
          return {
            label: node.label,
            type: "string",
            value: node.value,
            pacioliValue: string(node.value),
          };
        }

        case "number": {
          // FireFox gives an empty string on invalid input. This gives a
          // unclear error message in si.parseDimNum below.
          if (node.value === "") {
            throw Error(
              `invalid value for for ${node.type} parameter ${node.label}`
            );
          }

          const dimNum = si.parseDimNum(node.value + " * " + node.unit);

          return {
            label: node.label,
            type: "number",
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
        `cannot read value ${node.value} for ${node.type} parameter ${node.label}: ${error}.`
      );
    }
  });
}

function createParameterInputs(
  parsedParameters: PacioliParameter[],
  enterKeyCallback?: () => void
): {
  parameter: PacioliParameter;
  input: HTMLInputElement;
}[] {
  return parsedParameters.map((parameter) => {
    const inputElement = document.createElement("input");

    inputElement.className = "pacioli-controls-input";
    inputElement.value = parameter.value;
    inputElement.type = parameter.type;

    if (enterKeyCallback) {
      // Needed to make the return key reset the animation
      inputElement.addEventListener("keypress", (event) => {
        if (event.key === "Enter") {
          event.preventDefault();
          enterKeyCallback();
        }
      });
    }

    return { parameter, input: inputElement };
  });
}

function createParameterTable(
  inputs: {
    parameter: PacioliParameter;
    input: HTMLInputElement;
  }[]
) {
  const table = document.createElement("table");

  table.className = "pacioli-controls-table";

  for (const record of inputs) {
    const row = document.createElement("tr");
    const key = document.createElement("td");
    const value = document.createElement("td");
    const un = document.createElement("td");

    key.innerText = record.parameter.label;

    switch (record.parameter.type) {
      case "string": {
        un.innerText = "";
        break;
      }
      case "number": {
        un.innerText = record.parameter.pacioliUnit.toText();
        break;
      }
    }

    value.appendChild(record.input);

    row.appendChild(key);
    row.appendChild(value);
    row.appendChild(un);

    table.appendChild(row);
  }

  return table;
}

/**
 * Calls the script function and loads the scene. The function must return
 * a Pacioli scene, animation or stateful animation.
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
  const params = parameters.map((parameter) => parameter.pacioliValue);

  const scene = fun(script, func).apply(params);

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
customElements.define("pacioli-controls", PacioliControlsComponent);
