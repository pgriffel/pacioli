import { PacioliWebComponent } from "./pacioli-web-component";
import {
  attachedPacioliWebComponent,
  PacioliParameter,
  parameterNodes,
  parseParameterNode,
} from "./utils";

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
 * <pacioli-inputs for="my_scene"></pacioli-inputs>
 */
export class PacioliInputsComponent extends HTMLElement {
  // Parent for the controls.
  parentDiv: HTMLDivElement = document.createElement("div");

  // Inputs for the scene parameters
  inputs?: {
    parameter: PacioliParameter;
    element: HTMLInputElement;
  }[];

  // Table of parameters inputs
  table?: HTMLTableElement;

  // The button
  applyButton = createButton("Apply", () => this.resetButtonClicked());

  constructor() {
    super();
  }

  controlledElement(): PacioliWebComponent | undefined {
    return attachedPacioliWebComponent(this);
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
    this.parentDiv.className = "pacioli-inputs";

    parent.appendChild(this.parentDiv);

    this.createAndAppendElements();
    this.parentDiv.appendChild(this.applyButton);

    // If we are connected to a scene, then we need to keep the
    // state of the buttons synchronized with the scene animation.
    this.attachToControlledElement();

    // Make sure the proper buttons are shown and enabled
    this.updateControls();
  }

  createAndAppendElements() {
    // Create a table of inputs for the scene parameters
    this.inputs = this.createInputs();
    this.table = createParameterTable(this.inputs);

    // Add the new elements to the parent
    this.parentDiv.appendChild(this.table);
  }

  removeElements() {
    if (this.table) {
      this.parentDiv.removeChild(this.table);
      this.table = undefined;
      this.inputs = undefined;
    }
  }

  attachToControlledElement() {
    const element = this.controlledElement();
    if (element) {
      element.registerCallback(this.updateControls.bind(this)); // .bind(this) ?
    }
  }

  detachFromControlledElement() {
    const element = this.controlledElement();
    if (element) {
      element.unregisterCallback(this.updateControls.bind(this)); // .bind(this) ?
    }
  }

  /**
   * Web component life-cycle event.
   */
  attributeChangedCallback(name: string, _: string, __: string) {
    switch (name) {
      case "for": {
        this.detachFromControlledElement();
        this.removeElements();
        this.createAndAppendElements();
        this.attachToControlledElement();
        break;
      }
    }
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
    const scene = this.controlledElement();
    if (scene) {
      return createParameterInputs(
        parameterNodes(scene).map(parseParameterNode),
        () => this.applyButton.click()
      );
    } else {
      return [];
    }
  }

  /**
   * Handler for the reset button
   */
  private resetButtonClicked() {
    const scene = this.controlledElement();
    if (scene && this.inputs) {
      try {
        scene.setParameters(this.inputs.map((input) => input.element.value));
        // scene.reset();
        scene.parametersChanged();
        this.updateControls();
      } catch (error: any) {
        scene.displayError(error);
      }
    }
  }

  /**
   * Set the disabled and hidden state of the buttons. Also set the
   * button labels for the animation buttons.
   */
  private updateControls() {
    const scene = this.controlledElement();

    if (scene) {
      this.applyButton.disabled = scene.isBusy();
    } else {
      // No scene, just disable the buttons
      this.applyButton.disabled = true;
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

customElements.define("pacioli-inputs", PacioliInputsComponent);
