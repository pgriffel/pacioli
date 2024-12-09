import { si, SIUnit } from "uom-ts";
import { PacioliScene, Space, Animation, StatefulAnimation } from "./space";
import { fun, num, string } from "./api";
import { PacioliString } from "./values/string";
import { Matrix } from "./values/matrix";

type PacioliParameter = NumberParameter | StringParameter;

type NumberParameter = {
  type: "number";
  name: string;
  value: string;
  unit: string;
  pacioliValue: Matrix;
  pacioliUnit: SIUnit;
};

type StringParameter = {
  type: "string";
  name: string;
  value: string;
  pacioliValue: PacioliString;
};

/**
 * Web component for a 3D Pacioli space.
 *
 * A wrapper around Pacioli.Space.
 */
export class PacioliSceneComponent extends HTMLElement {
  /**
   * List of registered callbacks. The callback mechanism is used by connected PacioliControls
   * elements to get informed about relevant changes.
   */
  callbacks: (() => void)[] = [];

  width = 800;
  height = 600;
  axis = true;
  axisSize = 10;
  grid: [number, number] = [20, 20];
  perspective = true;
  zoomRange: [number, number] = [1, 1000];
  camera: [number, number, number] = [20, 10, 20];
  verbose = false;

  kind: "scene" | "animation" | "stateful-animation" = "scene";
  unit = "metre";
  script?: string;
  function?: string;
  space?: Space;

  // TODO: complete this list
  static observedAttributes = [
    "width",
    "height",
    "script",
    "function",
    "parameters",
    "kind",
    "unit",
  ];

  /**
   * Static space options. Might become part of PacioliControls and thus dynamic in the future.
   */
  spaceOptions() {
    return {
      width: this.width || 800,
      height: this.height || 600,
      axis: this.axis ?? true,
      axisSize: this.axisSize || 10,
      grid: this.grid || [20, 20],
      perspective: this.perspective ?? true,
      zoomRange: this.zoomRange || [1, 1000],
      camera: this.camera || [20, 10, 20],
      verbose: this.verbose || false,
    };
  }

  constructor() {
    super();
    // TODO: fix any
    // const shadow: any = this.attachShadow({ mode: "open" });

    // Create a Pacioli space and attach it to the shadow DOM parent.
    // this.space = new Space(shadow, {
    //   ...this.spaceOptions(),
    //   unit: this.parsedUnit(),
    // });
  }

  /**
   * Web component life-cycle event.
   */
  connectedCallback() {
    // Delay loading the space until the DOM children exist. We need the children so we can get
    // the parameter values.
    const shadow: any = this.attachShadow({ mode: "open" });
    // Create a Pacioli space and attach it to the shadow DOM parent.
    this.space = new Space(shadow, {
      ...this.spaceOptions(),
      unit: this.parsedUnit(),
    });

    setTimeout(() => {
      this.loadScript();
      this.space!.draw();
      this.callCallbacks();
    }, 1);
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
          throw Error(
            `Cannot set kind ${newValue} on PacioliControlsComponent. Valid kinds are 'scene', 'animation' or 'stateful-animation'`
          );
        }
        break;
      }
      default: {
        throw Error(
          `Cannot set attribe ${name} on PacioliControlsComponent. Valid attributes are 'width', 'height', 'script', 'kind', 'unit' `
        );
      }
    }
  }

  /**
   * The component's DOM children. These contain the parameters for the scene function.
   */
  parameterNodes(): HTMLElement[] {
    return Array.from(this.childNodes).filter(
      (child) => child.nodeName === "PARAMETER"
    ) as HTMLElement[];
  }

  /**
   * Collect the parameter name, unit and value for the DOM children.
   */
  currentParameters(): {
    name: string;
    unit: string;
    value: string;
  }[] {
    return this.parameterNodes().map((child) => ({
      name: child.getAttribute("name") || "n/a",
      unit: child.getAttribute("unit") || "1",
      value: child.innerText,
    }));
  }

  /**
   * The unit for the scene's 3D space. The default is unit 'metre'.
   */
  parsedUnit() {
    console.log("space unit is ", this.unit);
    return si.parseDimNum(this.unit || "metre").unit;
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
   * @returns A list of objects with the 'name', 'value', 'unit', 'pacioliUnit' and 'pacioliValue' fields.
   */
  parsedParameters(): PacioliParameter[] {
    return this.currentParameters().map((node) => {
      if (node.unit === "string") {
        return {
          name: node.name,
          type: "string",
          value: node.value,
          pacioliValue: string(node.value),
        };
      } else {
        const dimNum = si.parseDimNum(node.value + " * " + node.unit);
        const magnitude = dimNum.magnitude;
        const unit = dimNum.unit;
        return {
          name: node.name,
          type: "number",
          value: node.value,
          unit: node.unit,
          pacioliUnit: unit,
          pacioliValue: num(Number(magnitude), unit),
        };
      }
    });
  }

  // /**
  //  * Calls the scene's script function. The function must return a Pacioli scene.
  //  *
  //  * @returns A Pacioli scene.
  //  */
  // callScript() {
  //   const params = this.parsedParameters().map(
  //     (parameter) => parameter.pacioliValue
  //   );
  //   if (this.script && this.function) {
  //     return fun(this.script, this.function).apply(params);
  //   } else {
  //     throw Error("no script function for scene");
  //   }
  // }

  loadScript() {
    const params = this.parsedParameters().map(
      (parameter) => parameter.pacioliValue
    );

    if (this.script && this.function) {
      const scene = fun(this.script, this.function).apply(params);
      const space = this.space!;
      switch (this.kind) {
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
        default: {
          throw new Error("Unknown kind");
        }
      }
    }
  }

  /**
   * Calls the script function with the current parameter values and loads the returned
   * scene into the Pacioli space. The animation is reset to time zero.
   *
   * No animation can be running when calling this method.
   */
  reset() {
    const space = this.space;
    if (!space!.isAnimating()) {
      this.loadScript();
      space!.draw();
    }
  }

  /**
   * Is an animation running?
   *
   * @returns True if an animation running.
   */
  isAnimating() {
    return this.space!.isAnimating();
  }

  /**
   * Starts or pauses an animation.
   *
   * @param {*} animating Start (true) or pause (false)
   */
  setAnimating(animating: boolean) {
    this.space!.setAnimating(animating);
  }

  /**
   * Performs a single animation step.
   *
   * No animation can be running when calling this method.
   */
  step() {
    if (!this.space!.isAnimating()) {
      this.space!.updateScene();
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
    this.table = this.createParameterTable(this.inputs);

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
    this.table = this.createParameterTable(this.inputs);

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
          `Cannot set attribe ${name} on PacioliControlsComponent. Valid attribute is 'for'`
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
      return scene.parsedParameters().map((parameter) => {
        const inputElement = document.createElement("input");
        inputElement.className = "pacioli-controls-input";
        inputElement.value = parameter.value;
        inputElement.type = parameter.type;

        // Make the return key reset the animation
        inputElement.addEventListener("keypress", (event) => {
          if (event.key === "Enter") {
            event.preventDefault();
            this.resetButton.click();
          }
        });
        return { parameter, input: inputElement };
      });
    } else {
      return [];
    }
  }

  createParameterTable(
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
      key.innerText = record.parameter.name;

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
    if (scene) {
      if (checked) {
        scene.space!.startAutoRotation(
          PacioliControlsComponent.SECONDS_PER_ROTATION
        );
      } else {
        scene.space!.stopAutoRotation();
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
      this.stepButton.disabled = scene.space!.isAnimating();
      this.resetButton.disabled = scene.space!.isAnimating();
      this.startButton.innerText = scene.space!.isAnimating() ? "Pause" : "Run";
      this.startButton.disabled = false;
      // this.table.disabled = false;
    } else {
      this.resetButton.disabled = true;
      this.stepButton.disabled = true;
      this.startButton.disabled = true;
      // this.table.disabled = true;
    }
  }
}

customElements.define("pacioli-scene", PacioliSceneComponent);
customElements.define("pacioli-controls", PacioliControlsComponent);
