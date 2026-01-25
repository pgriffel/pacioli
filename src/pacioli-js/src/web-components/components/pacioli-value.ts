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
import { optionsFromAttributes, optionsFromScript } from "../utils";
import { DOM } from "../../dom/dom";
import type { PacioliValue } from "../../values/pacioli-value";

/**
 * Options for Pacioli's value component.
 */
export interface ValueOptions {
  decimals: number;

  zero?: string;

  nozerorows: boolean;

  totals: boolean;

  ignoredecimals: boolean;

  ascii: boolean;

  clipboard: boolean;
}

/**
 * Attribues supported by the Pacioli value component
 */
const SUPPORTED_ATTRIBUTES = {
  strings: ["zero"],
  booleans: ["nozerorows", "ignoredecimals", "totals", "ascii", "clipboard"],
  numbers: ["decimals"],
};

/**
 * Style sheet for the Pacioli value component
 */
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

/**
 * Web component for a Pacioli value. A wrapper around the DOM function.
 */
export class PacioliValueComponent extends PacioliShadowTreeComponent {
  /**
   * The Pacioli value displayed in the table.
   */
  data?: PacioliValue;

  constructor() {
    super();
    this.adoptStyles(STYLES);
  }

  /**
   * Web component field.
   */
  static readonly observedAttributes = [
    "definition",
    "decimals",
    "ignoredecimals",
    "totals",
    "nozeros",
    "ascii",
    "clipboard",
  ];

  /**
   * Web component life-cycle event.
   */
  attributeChangedCallback(name: string, _oldValue: string, _newValue: string) {
    try {
      if (this.data !== undefined) {
        // Reload the data if the definition changes. The initial load is done in
        // parametersChanged.
        if (name === "definition") {
          this.data = this.evaluateDefinition();
        }

        this.drawTable(this.data);
      }
    } catch (err: unknown) {
      this.displayError(err instanceof Error ? err.message : String(err));
    }
  }

  /**
   * Pacioli web component life-cycle event.
   */
  override parametersChanged(): void {
    this.data = this.evaluateDefinition();

    this.drawTable(this.data);
  }

  drawTable(value: PacioliValue) {
    this.clearContent();
    this.clearErrors();

    const options = {
      ...optionsFromScript<ValueOptions>(this, SUPPORTED_ATTRIBUTES),
      ...optionsFromAttributes<ValueOptions>(this, SUPPORTED_ATTRIBUTES),
    };

    this.contentParent().appendChild(DOM(value, options));
  }
}

customElements.define("pacioli-value", PacioliValueComponent);
