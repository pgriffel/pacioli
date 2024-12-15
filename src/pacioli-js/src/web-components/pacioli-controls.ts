import { PacioliSceneComponent } from "./pacioli-scene";
import { PacioliParameter, parameterNodes, parseParameterNode } from "./utils";

/**
 * Web component with controls for the PacioliScene web component.
 *
 *
 * @example
 * <pacioli-scene id="my_scene" ... >
 *    <parameter> ... </parameter>
 *    ...
 * </pacioli-scene>
 *
 * <pacioli-controls for="my_scene"></pacioli-controls>
 */
export class PacioliControlsComponent extends HTMLElement {
  // Auto-rotation speed
  static SECONDS_PER_ROTATION = 30;

  // Web component field
  static observedAttributes = ["for"];

  // Id of the connected PacioliScene
  for?: string;

  // The controls are divided into animation controls and configuration
  // controls
  animationElement: HTMLDivElement = document.createElement("div");
  configurationElement: HTMLDivElement = document.createElement("div");

  // Inputs for the scene parameters
  inputs?: {
    parameter: PacioliParameter;
    element: HTMLInputElement;
  }[];

  // Table of parameters inputs
  table?: HTMLTableElement;

  // The buttons
  stepButton = createButton("Step", () => this.stepButtonClicked());
  startButton = createButton("Run", () => this.startButtonClicked());
  resetButton = createButton("Reset", () => this.resetButtonClicked());
  axisCheckBox = createCheckBox("axis", (checked) =>
    this.axisCheckBoxClicked(checked)
  );
  gridCheckBox = createCheckBox("grid", (checked) =>
    this.gridCheckBoxClicked(checked)
  );
  labelsCheckBox = createCheckBox("labels", (checked) =>
    this.labelsCheckBoxClicked(checked)
  );
  autoRotateButton = createCheckBox("rotate", (checked) =>
    this.autoRotateCheckboxClicked(checked)
  );

  constructor() {
    super();
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

    // Add the parent elements
    this.animationElement.className = "pacioli-controls-animation";
    this.configurationElement.className = "pacioli-controls-configuration";

    parent.appendChild(this.animationElement);
    parent.appendChild(this.configurationElement);

    // Create a table of inputs for the scene parameters
    this.inputs = this.createInputs();
    this.table = createParameterTable(this.inputs);

    // Add the new elements to the parent
    this.animationElement.appendChild(this.startButton);
    this.animationElement.appendChild(this.stepButton);
    this.animationElement.appendChild(this.table);
    this.animationElement.appendChild(this.resetButton);

    this.configurationElement.appendChild(this.axisCheckBox);
    this.configurationElement.appendChild(this.gridCheckBox);
    this.configurationElement.appendChild(this.labelsCheckBox);
    this.configurationElement.appendChild(this.autoRotateButton);

    // Make sure the proper buttons are shown and enabled
    this.updateControls();

    // If we are connected to a scene, then we need to keep the
    // state of the buttons synchronized with the scene animation.
    const scene = this.sceneElement();
    if (scene) {
      scene.registerCallback(() => this.updateControls());
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

  /**
   * Create inputs for the scene parameters
   *
   * @returns List of objects with a 'paramater' and a 'input' field.
   */
  private createInputs(): {
    parameter: PacioliParameter;
    element: HTMLInputElement;
  }[] {
    const scene = this.sceneElement();
    if (scene) {
      return createParameterInputs(
        parameterNodes(scene).map(parseParameterNode),
        () => this.resetButton.click()
      );
    } else {
      return [];
    }
  }

  /**
   * Handler for the start button
   */
  private startButtonClicked() {
    const scene = this.sceneElement();
    if (scene) {
      scene.setRunning(!scene.isRunning());
      this.updateControls();
    }
  }

  /**
   * Handler for the step button
   */
  private stepButtonClicked() {
    const scene = this.sceneElement();
    if (scene) {
      scene.step();
      this.updateControls();
    }
  }

  /**
   * Handler for the reset button
   */
  private resetButtonClicked() {
    const scene = this.sceneElement();
    if (scene && this.inputs) {
      try {
        scene.setParameters(this.inputs.map((input) => input.element.value));
        scene.reset();
        this.updateControls();
      } catch (error: any) {
        scene.displayError(error);
      }
    }
  }

  /**
   * Handler for the axis checkbox
   */
  private axisCheckBoxClicked(checked: boolean) {
    const scene = this.sceneElement();
    if (scene && scene.space) {
      if (checked) {
        scene.space.showAxis();
      } else {
        scene.space.hideAxis();
      }
    }
  }

  /**
   * Handler for the axis checkbox
   */
  private labelsCheckBoxClicked(checked: boolean) {
    const scene = this.sceneElement();
    if (scene && scene.space) {
      if (checked) {
        scene.space.showLabels();
      } else {
        scene.space.hideLabels();
      }
    }
  }

  /**
   * Handler for the axis checkbox
   */
  private gridCheckBoxClicked(checked: boolean) {
    const scene = this.sceneElement();
    if (scene && scene.space) {
      if (checked) {
        scene.space.showGrid();
      } else {
        scene.space.hideGrid();
      }
    }
  }

  /**
   * Handler for the auto-rotate button
   */
  private autoRotateCheckboxClicked(checked: boolean) {
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

  /**
   * Set the disabled and hidden state of the buttons. Also set the
   * button labels for the animation buttons.
   */
  private updateControls() {
    const scene = this.sceneElement();

    if (scene && scene.space) {
      // If we get here the space must have been created
      const space = scene.space!;

      const box = this.axisCheckBox.children[0] as HTMLInputElement;
      box.checked = space.hasAxis();

      const gridCheckBox = this.gridCheckBox.children[0] as HTMLInputElement;
      gridCheckBox.checked = space.hasGrid();

      const labelsCheckBox = this.labelsCheckBox
        .children[0] as HTMLInputElement;
      labelsCheckBox.checked = space.hasLabels();

      // Distinguish animations and static scenes
      if (space.isAnimation()) {
        const isRunning = space.isRunning();

        this.animationElement.hidden = false;
        this.stepButton.hidden = false;
        this.startButton.hidden = false;

        this.stepButton.innerText =
          "Step " + space.runningTime().toFixed(2) + "s";
        this.startButton.innerText = isRunning ? "Pause" : "Run";

        this.stepButton.disabled = isRunning;
        this.resetButton.disabled = isRunning;
        this.startButton.disabled = false;
      } else {
        this.animationElement.hidden =
          this.inputs === undefined || this.inputs.length === 0;

        this.stepButton.hidden = true;
        this.startButton.hidden = true;

        this.resetButton.disabled = false;
      }
    } else {
      // No scene, just disable the buttons
      this.resetButton.disabled = true;
      this.stepButton.disabled = true;
      this.startButton.disabled = true;
    }
  }
}

/**
 * Creates a HTML button. De buttons has css class 'pacioli-controls-button'.
 *
 * @param label The text on the button
 * @param callback Function called when the button is clicked
 * @returns The new button
 */
function createButton(label: string, callback: () => void) {
  let buttonElement = document.createElement("button");

  buttonElement.innerText = label;
  buttonElement.className = "pacioli-controls-button";
  buttonElement.onclick = callback;

  return buttonElement;
}

/**
 * Creates a HTML checkbox (a label with nested input). De checkbox has css
 * class 'pacioli-controls-checkbox'.
 *
 * @param label The text on the checkbox
 * @param callback Function called when the checkbox is changed
 * @returns The new checkbox
 */
function createCheckBox(label: string, callback: (checked: boolean) => void) {
  let labelElement = document.createElement("label");
  let checkboxElement = document.createElement("input");

  labelElement.innerText = label;
  checkboxElement.type = "checkbox";
  labelElement.className = "pacioli-controls-checkbox";
  checkboxElement.onchange = (event) =>
    callback((event.target as HTMLInputElement).checked);

  labelElement.appendChild(checkboxElement);
  return labelElement;
}

/**
 * Create HTML input elements for the PacioliSceneComponent parameters
 *
 * @param parsedParameters The parsed scene parameters
 * @param enterKeyCallback A function that is called when the enter key is pressed
 * @returns A list of objects with a 'parameter' and a 'element' field
 */
function createParameterInputs(
  parsedParameters: PacioliParameter[],
  enterKeyCallback?: () => void
): {
  parameter: PacioliParameter;
  element: HTMLInputElement;
}[] {
  return parsedParameters.map((parameter) => {
    // Create an input element for each parameter
    const inputElement = document.createElement("input");
    inputElement.className = "pacioli-controls-input";
    inputElement.value = parameter.value;
    inputElement.type = parameter.type;

    // Add a callback for the enter key. Needed to make the return
    // key reset the animation
    if (enterKeyCallback) {
      inputElement.addEventListener("keypress", (event) => {
        if (event.key === "Enter") {
          event.preventDefault();
          enterKeyCallback();
        }
      });
    }

    return { parameter, element: inputElement };
  });
}

/**
 * Create a HMTML table for the PacioliSceneComponent parameters
 *
 * @param inputs A list of objects with a 'parameter' and a 'element' field
 * @returns A HTML table
 */
function createParameterTable(
  inputs: {
    parameter: PacioliParameter;
    element: HTMLInputElement;
  }[]
) {
  // Create a HTML table
  const table = document.createElement("table");
  table.className = "pacioli-controls-table";

  for (const input of inputs) {
    // Create a row with a label, a value and a unit entry
    const row = document.createElement("tr");
    const labelEntry = document.createElement("td");
    const valueEntry = document.createElement("td");
    const unitEntry = document.createElement("td");

    // Set the label
    labelEntry.innerText = input.parameter.label;

    // Append the input to the value entry
    valueEntry.appendChild(input.element);

    // Set the unit
    switch (input.parameter.type) {
      case "string": {
        unitEntry.innerText = "";
        break;
      }
      case "number": {
        unitEntry.innerText = input.parameter.pacioliUnit.toText();
        break;
      }
    }

    // Append the entries to the row
    row.appendChild(labelEntry);
    row.appendChild(valueEntry);
    row.appendChild(unitEntry);

    // Append the row to the table
    table.appendChild(row);
  }

  return table;
}

customElements.define("pacioli-controls", PacioliControlsComponent);
