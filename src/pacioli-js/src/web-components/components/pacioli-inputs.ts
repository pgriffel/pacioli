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

import { PacioliShadowTreeComponent } from "../pacioli-shadow-tree-component";
import type { PacioliParameter } from "../utils/definition";
import {
  targetElements,
  parameterNodes,
  parseParameterNode,
  setParameterNodes,
} from "../utils/definition";

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
 * An HTML element that is the target of a pacioli-inputs element. The target is identified
 * with the 'for' attribute.
 */
type InputsTarget = {
  /**
   * The targeted element. The parent node of the parameter nodes. This element should
   * contain a definition attribute.
   */
  element: HTMLElement;

  /**
   * The parameters derived from the parameter nodes. Contains the initial values and is
   * not kept up to date.
   */
  inputs: {
    parameter: PacioliParameter;
    element: HTMLInputElement;
  }[];
};

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
  static readonly observedAttributes = ["for"];

  /**
   * Info about the elements that are connected via the 'for' attribute.
   */
  private targets?: InputsTarget[];

  /**
   * Web component life-cycle event.
   */
  attributeChangedCallback(
    name: string,
    _oldValue: string | null,
    _newValue: string,
  ) {
    try {
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
    } catch (err: unknown) {
      this.displayError(err instanceof Error ? err.message : String(err));
    }
  }

  /**
   * Web component life-cycle event.
   */
  connectedCallback() {
    try {
      super.connectedCallback();

      // Set the CSS class name for styling
      this.contentParent().className = "content";

      // Create the content from the template
      this.contentParent().appendChild(TEMPLATE.content.cloneNode(true));

      // Add input rows to the parameter table
      setTimeout(() => {
        try {
          // Connect the apply button handler
          this.findElement(".apply").addEventListener("click", () => {
            this.applyButtonClicked();
          });

          this.createAndAppendTableRows();
        } catch (err: unknown) {
          this.displayError(err instanceof Error ? err.message : String(err));
        }
      }, 1);
    } catch (err: unknown) {
      this.displayError(err instanceof Error ? err.message : String(err));
    }
  }

  /**
   * Creates a row for each parameter and adds it to the parameter table
   */
  private createAndAppendTableRows() {
    // Remember the inputs so we can access them seperately
    this.targets = this.createTargetsInfo();

    // Add the inputs to the table
    addParameterRows(this.tableElement(), this.targets);
  }

  /**
   * Remove all rows from the parameter table
   */
  private removeTableRows() {
    while (this.tableElement().rows.length > 0) {
      this.tableElement().deleteRow(0);
    }

    // Keep invariant that the inputs member and the parameter table rows match.
    this.targets = undefined;
  }

  /**
   * Create inputs for the scene parameters
   *
   * @returns List of objects with a 'paramater' and a 'element' field.
   */
  private createTargetsInfo(): InputsTarget[] {
    const booleansImmediate = !this.hasAttribute("calm");

    const targetsInfo: InputsTarget[] = [];

    for (const element of targetElements(this)) {
      const parameters: PacioliParameter[] = parameterNodes(element).map(
        (node) => parseParameterNode(node),
      );

      const inputs = createParameterInputs(
        parameters,
        booleansImmediate,
        () => {
          this.applyButtonClicked();
        },
      );

      targetsInfo.push({ element, inputs });
    }

    return targetsInfo;
  }

  /**
   * Handler for the apply button
   */
  private applyButtonClicked() {
    try {
      for (const target of this.targets ?? []) {
        setParameterNodes(
          target.element,
          target.inputs.map((input) => {
            if (input.parameter.type === "boole") {
              return input.element.checked ? "true" : "false";
            } else {
              return input.element.value;
            }
          }),
        );
      }
    } catch (error: unknown) {
      this.displayError(error instanceof Error ? error.message : String(error));
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
  enterKeyCallback?: () => void,
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
      inputElement.value =
        parameter.type === "number" ? parameter.value.trim() : parameter.value;
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
function addParameterRows(table: HTMLTableElement, targets: InputsTarget[]) {
  for (const target of targets) {
    for (const input of target.inputs) {
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
}

customElements.define("pacioli-inputs", PacioliInputsComponent);
