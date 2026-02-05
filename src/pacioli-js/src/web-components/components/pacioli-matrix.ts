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

import type { PacioliMatrix } from "../../values/matrix";
import { PacioliError } from "../../pacioli-error";
import { MatrixBuilder } from "../../table/matrix-builder";
import type { NumberOptions } from "../pacioli-number-component";
import {
  NUMBER_ATTRIBUTES,
  PacioliNumberComponent,
} from "../pacioli-number-component";
import { COMMON_ATTRIBUTES } from "../pacioli-web-component";
import {
  mergeAttributeSpecs,
  collectAllAttributes,
  optionsFromScript,
  optionsFromAttributes,
} from "../utils/attributes";
import { evaluateWebComponentDefinition } from "../utils/definition";

/**
 * Options for Pacioli's matrix component.
 */
export interface MatrixOptions extends NumberOptions {
  headers: boolean;
  headerunits: boolean;
  nounits: boolean;
  evenwidth: boolean;
  order: string;
}

const STYLES = `
.pacioli-table {

border-spacing: 0;
border-collapse: collapse;

tr {
   height: 28px;
}

td {
  border-bottom: solid lightgrey;
}

th {
  border-width: 1px 1px 1px 1px;
  padding-left: 1em;
  text-align: left;
}

td.key {
  padding-left: 1em;
  padding-right: 0.25em;
  border-width: 1px 1px 1px 1px;
}

td.value {
  padding-left: 1em;
  border-width: 1px 0px 1px 1px;
  text-align: right;
}

td.unit {
  padding-left: 0.25em;
  padding-right: 0.25em;
  border-width: 1px 1px 1px 0px;
  text-align: left;
  white-space: nowrap;
}

td.total {
  font-weight: bold;
}
}
`;

export const MATRIX_ATTRIBUTES = {
  strings: ["order"],
  booleans: ["headers", "headerunits", "nounits", "evenwidth"],
  numbers: [],
};

const SUPPORTED_ATTRIBUTES = mergeAttributeSpecs(
  COMMON_ATTRIBUTES,
  NUMBER_ATTRIBUTES,
  MATRIX_ATTRIBUTES,
);

function pacioliMatrixError(message: string): PacioliError {
  return new PacioliError(`Invalid matrix for pacioli-matrix. ${message}`);
}

export class PacioliMatrixComponent extends PacioliNumberComponent {
  get headers(): boolean {
    return this.getBooleAttribute("headers");
  }

  set headers(value: boolean) {
    this.setBooleAttribute("headers", value);
  }

  get evenwidth(): boolean {
    return this.getBooleAttribute("evenwidth");
  }

  set evenwidth(value: boolean) {
    this.setBooleAttribute("evenwidth", value);
  }

  get order(): string | undefined {
    return this.getAttribute("order") ?? undefined;
  }

  set order(value: string | undefined) {
    this.setStringAttribute("order", value);
  }

  get nounits(): boolean {
    return this.getBooleAttribute("nounits");
  }

  set nounits(value: boolean) {
    this.setBooleAttribute("nounits", value);
  }

  get headerunits(): boolean {
    return this.getBooleAttribute("headerunits");
  }

  set headerunits(value: boolean) {
    this.setBooleAttribute("headerunits", value);
  }

  /** The matrix to display. Set by `parametersChanged` or attribute updates. */
  matrix?: PacioliMatrix;

  constructor() {
    super();
    this.adoptStyles(STYLES);
  }

  static readonly observedAttributes =
    collectAllAttributes(SUPPORTED_ATTRIBUTES);

  attributeChangedCallback(name: string, _oldValue: string, _newValue: string) {
    try {
      if (this.matrix !== undefined) {
        // Reload the data if the definition changes. The initial load is done in
        // parametersChanged.
        if (name === "definition") {
          this.matrix = this.readDefinition();
        }

        this.drawMatrix(this.matrix);
      }
    } catch (err: unknown) {
      this.displayError(err instanceof Error ? err.message : String(err));
    }
  }

  override parametersChanged(): void {
    this.matrix = this.readDefinition();

    this.drawMatrix(this.matrix);
  }

  private readDefinition(): PacioliMatrix {
    const value = evaluateWebComponentDefinition(this);

    if (value.kind === "matrix") {
      return value;
    }

    throw pacioliMatrixError(`Expected a matrix, got ${value.kind}`);
  }

  private drawMatrix(matrix: PacioliMatrix) {
    this.clearContent();
    this.clearErrors();

    const options = {
      ...optionsFromScript<MatrixOptions>(this, SUPPORTED_ATTRIBUTES),
      ...optionsFromAttributes<MatrixOptions>(this, SUPPORTED_ATTRIBUTES),
    };

    this.contentParent().appendChild(createMatrixHTMLTable(matrix, options));
  }
}

/**
 * Helper for drawMatrix.
 *
 * Handles the 'reorder', 'ascii' and 'clipboard' options. The other options
 * are handled by MatrixBuilder.
 *
 * @param matrix
 * @param options
 * @returns
 */
function createMatrixHTMLTable(
  matrix: PacioliMatrix,
  options: Partial<MatrixOptions>,
): HTMLElement {
  let effMatrix = matrix;

  if (options.order !== undefined) {
    const [rowOrder, columnOrder] = parseOrderAttribute(options.order);

    effMatrix = matrix.reorder(rowOrder, columnOrder);
  }

  const builder = MatrixBuilder.fromMatrix(effMatrix, options);

  if (options.ascii !== true && options.clipboard !== true) {
    return builder.dom();
  }

  const preElement = document.createElement("pre");

  if (options.ascii === true) {
    preElement.innerText = builder.ascii();
  } else if (options.clipboard === true) {
    preElement.innerText = builder.clipboardText();
  }

  return preElement;
}

/**
 * Helper for createMatrixHTMLTable.
 *
 * Parses the 'order' attribute. Throws an error if the attribute value is not a valid
 * integer pair.
 */
function parseOrderAttribute(attribute: string): [number, number] {
  const parts = attribute.split(",");

  if (parts.length !== 2) {
    throw new PacioliError(
      `Invalid order '${attribute}'. Expected two integers separated by a comma, for example 2,0`,
    );
  }

  const rowOrder = Number.parseInt(parts[0].trim());
  const columnOrder = Number.parseInt(parts[1].trim());

  if (!Number.isInteger(rowOrder)) {
    throw new PacioliError(
      `Invalid row order in '${attribute}'. Expected an integer`,
    );
  }

  if (!Number.isInteger(columnOrder)) {
    throw new PacioliError(
      `Invalid column order in '${attribute}'. Expected an integer`,
    );
  }

  return [rowOrder, columnOrder];
}

customElements.define("pacioli-matrix", PacioliMatrixComponent);
