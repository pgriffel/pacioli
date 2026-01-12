/* Runtime Support for the Pacioli language
 *
 * Copyright (c) 2025 Paul Griffioen
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of
 * this software and associated documentation files (the "Software"), to deal in
 * the Software without restriction, including without limitation the rights to
 * use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of
 * the Software, and to permit persons to whom the Software is furnished to do so,
 * subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS
 * FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
 * COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER
 * IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
 * CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

import { PacioliShadowTreeComponent } from "../pacioli-shadow-tree-component";
import type { PacioliParameter } from "../utils";
import {
  attachedPacioliWebComponent,
  parameterNodes,
  parseParameterNode,
} from "../utils";

const TEMPLATE = document.createElement("template");

TEMPLATE.innerHTML = `
  <style>

    :host {
      display: block;
    }
    
    .content {
      padding: 8pt;
    }

    .apply {
      width: 80pt;
      margin-top: 8pt;
    }

    tr {
      padding: 4pt;
    }

    td {
      white-space: nowrap
    }
  </style>

  <table class="parameters" part="parameters"></table>

  <button class="apply" part="apply">Apply</button>
`;

/**
 * Web component with inputs for a Pacioli web component's parameters.
 *
 * @example
 * <pacioli-scene id="my_scene" ... >
 *    <parameter> ... </parameter>
 *    ...
 * </pacioli-scene>
 *
 * <pacioli-inputs for="my_scene"></pacioli-inputs>
 */
export class PacioliInputsComponent extends PacioliShadowTreeComponent {
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
  attributeChangedCallback(
    name: string,
    _oldValue: string | null,
    _newValue: string
  ) {
    switch (name) {
      case "for": {
        // Only handle changes after the initial construction. Initial
        // construction is done in connectedCallback.
        if (this.isConnected) {
          this.removeTableRows();

          // Attach to new component. Same as in connectedCallback.
          this.createAndAppendTableRows();
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
    this.contentParent().className = "content";

    // Create the content from the template
    this.contentParent().appendChild(TEMPLATE.content.cloneNode(true));

    // Add input rows to the parameter table and follow the attached component
    setTimeout(() => {
      // Connect the apply button handler
      this.findElement(".apply").addEventListener("click", () => {
        this.applyButtonClicked();
      });

      if (attachedPacioliWebComponent(this)) {
        this.createAndAppendTableRows();
      }
    }, 1);
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
   * @returns List of objects with a 'paramater' and a 'element' field.
   */
  private createInputs(): {
    parameter: PacioliParameter;
    element: HTMLInputElement;
  }[] {
    const scene = attachedPacioliWebComponent(this); //this.attachedComponent();
    if (scene) {
      return createParameterInputs(
        parameterNodes(scene).map((element) => parseParameterNode(element)),
        !this.hasAttribute("calm"),
        () => {
          this.applyButtonClicked();
        }
      );
    } else {
      return [];
    }
  }

  /**
   * Handler for the apply button
   */
  private applyButtonClicked() {
    const scene = attachedPacioliWebComponent(this);
    if (scene && this.inputs) {
      try {
        scene.clearErrors();
        scene.setParameters(
          this.inputs.map((input) =>
            input.parameter.type === "boole"
              ? input.element.checked
                ? "true"
                : "false"
              : input.element.value
          )
        );
      } catch (error: unknown) {
        scene.displayError(
          error instanceof Error ? error.message : String(error)
        );
      }
    }
  }

  private tableElement(): HTMLTableElement {
    return this.findElement(`.parameters`) as HTMLTableElement;
  }
}

/**
 * Does the enter key on a pacioli-inputs web-component trigger a
 * setParameters call on the connected scene?
 */
const FLAG_ENABLE_WEB_COMPONENT_INPUT_ENTER_KEY: boolean = true;

/**
 * Create HTML input elements for the PacioliSceneComponent parameters
 *
 * @param parsedParameters The parsed scene parameters
 * @param enterKeyCallback A function that is called when the enter key is pressed
 * @returns A list of objects with a 'parameter' and a 'element' field
 */
function createParameterInputs(
  parsedParameters: PacioliParameter[],
  booleansImmediate: boolean,
  enterKeyCallback?: () => void
): {
  parameter: PacioliParameter;
  element: HTMLInputElement;
}[] {
  return parsedParameters.map((parameter) => {
    // Create an input element for each parameter
    const inputElement = document.createElement("input");
    inputElement.className = "pacioli-controls-input";

    // Booleans need conversion between 'on' and 'true'/false
    if (parameter.type === "boole") {
      inputElement.checked = parameter.value === "true";
      inputElement.type = "checkbox";
    } else {
      inputElement.value = parameter.value;
      inputElement.type = parameter.type;
    }

    if (enterKeyCallback) {
      // Add a callback checkbox changes. Needed to make checkboxes reset
      // the animation.
      if (booleansImmediate && parameter.type === "boole") {
        inputElement.addEventListener("change", (event) => {
          if (FLAG_ENABLE_WEB_COMPONENT_INPUT_ENTER_KEY) {
            event.preventDefault();
            enterKeyCallback();
          }
        });
      }

      // Add a callback for the enter key. Needed to make the return
      // key reset the animation
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
      case "boole": {
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
