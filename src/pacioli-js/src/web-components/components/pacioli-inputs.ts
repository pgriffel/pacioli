import { PacioliWebController } from "../pacioli-web-controller";
import { PacioliParameter, parameterNodes, parseParameterNode } from "../utils";

const TEMPLATE = document.createElement("template");

TEMPLATE.innerHTML = `
  <style>
  </style>
  <table class="parameters"></table>
  <button class="apply">Apply</button>
`;

/**
 * Web component with controls for the PacioliScene web component.
 *
 * @example
 * <pacioli-scene id="my_scene" ... >
 *    <parameter> ... </parameter>
 *    ...
 * </pacioli-scene>
 *
 * <pacioli-inputs for="my_scene"></pacioli-inputs>
 */
export class PacioliInputsComponent extends PacioliWebController {
  /**
   * Web component field.
   */
  static observedAttributes = ["for"];

  /**
   * Inputs for the scene parameters
   */
  private inputs?: {
    parameter: PacioliParameter;
    element: HTMLInputElement;
  }[];

  /**
   * Web component life-cycle event.
   */
  attributeChangedCallback(name: string, prev: string | null, next: string) {
    switch (name) {
      case "for": {
        // Only handle changes after the initial construction. Initial
        // construction is done in connectedCallback.
        if (prev !== null) {
          // Detach from previous component
          this.unfollow();
          this.removeTableRows();

          // Attach to new component. Same sequence as in connectedCallback.
          this.createAndAppendTableRows();
          this.follow(next, () => this.updateControls());
          this.updateControls();
        }
        break;
      }
    }
  }

  /**
   * Web component life-cycle event.
   */
  connectedCallback() {
    super.connectedCallback();

    // Set the CSS class name for styling
    this.contentParent().className = "pacioli-inputs-content";

    // Create the content from the template
    this.contentParent().appendChild(TEMPLATE.content.cloneNode(true));

    // Connect the apply button handler
    this.findElement("button").addEventListener("click", () =>
      this.applyButtonClicked()
    );

    // Add input rows to the parameter table
    this.createAndAppendTableRows();

    // If we are connected to a scene, then we need to keep the
    // state of the buttons synchronized with the scene animation.
    this.followAttached(() => this.updateControls());

    // Make sure the proper buttons are shown and enabled
    this.updateControls();
  }

  /**
   * Creates a row for each parameter and adds it to the parameter table
   */
  private createAndAppendTableRows() {
    // Remember the inputs so we can access them seperately
    this.inputs = this.createInputs();

    // Add the inputs to the table
    addParameterRows(this.tableElement(), this.inputs);
  }

  /**
   * Remove all rows from the parameter table
   */
  private removeTableRows() {
    while (this.tableElement().rows.length > 0) {
      this.tableElement().deleteRow(0);
    }

    // Keep invariant that the inputs member and the parameter table rows match.
    this.inputs = undefined;
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
    const scene = this.attachedComponent();
    if (scene) {
      return createParameterInputs(
        parameterNodes(scene).map(parseParameterNode),
        () => this.applyButtonClicked()
      );
    } else {
      return [];
    }
  }

  /**
   * Handler for the apply button
   */
  private applyButtonClicked() {
    const scene = this.attachedComponent();
    if (scene && this.inputs) {
      try {
        scene.clearErrors(); // Better if the caller does this!?
        scene.setParameters(this.inputs.map((input) => input.element.value));
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
    const scene = this.attachedComponent();
    this.applyButton().disabled = scene ? scene.isBusy() : true;
  }

  private tableElement(): HTMLTableElement {
    return this.findElement(`.parameters`) as HTMLTableElement;
  }

  private applyButton(): HTMLButtonElement {
    return this.findElement(`button`) as HTMLButtonElement;
  }
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
 * Adds input elements to the parameter table
 *
 * @param table The parameter table
 * @param inputs A list of parameter/input pairs.
 */
function addParameterRows(
  table: HTMLTableElement,
  inputs: {
    parameter: PacioliParameter;
    element: HTMLInputElement;
  }[]
) {
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
}

customElements.define("pacioli-inputs", PacioliInputsComponent);
