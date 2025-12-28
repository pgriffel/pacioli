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
import { optionsFromAttributes } from "../utils";
import { DOMTable } from "../../dom/dom";
import type { PacioliTuple } from "../../values/tuple";
import type { PacioliValue } from "../../boxing";
import type { PacioliString } from "../../values/string";
import type { PacioliMatrix } from "../../values/matrix";

/**
 * Attribues supported by the table component
 */
const SUPPORTED_ATTRIBUTES = {
  strings: ["zero"],
  booleans: ["nozeros", "totals"],
  numbers: ["decimals"],
};

/**
 * Style sheet for the table component
 */
const STYLES = ` 

border-spacing: 0;
border-collapse: collapse;

tr {
   height: 28px;
}

td, th {
  NOborder: solid lightgrey;
  border: solid white;
}

td {
  background-color: $table-bg;
  border-bottom: solid lightgrey;
}

th {
  font-weight: normal;
  border-width: 1px 1px 1px 1px;
  background-color: $app-toolbar-color;
  Nocolor: white;
  padding-left: 1em;
  padding-right: 1em;
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
  padding-left: 1em;
  border-width: 1px 0px 1px 1px;
  text-align: right;
  font-weight: bold;
} 
`;

/**
 * Web component for a table. A wrapper around the DOMTable function.
 */
export class PacioliTableComponent extends PacioliShadowTreeComponent {
  constructor() {
    super();
    this.adoptStyles(STYLES);
  }

  /**
   * Pacioli web component life-cycle event.
   */
  override parametersChanged(): void {
    try {
      // Compute the data using the new parameter values
      const data = this.fetchData();

      if (data.kind === "tuple") {
        const items = data as PacioliTuple;
        // Refresh the table
        this.clearContent();
        const columns = items.map((item: PacioliValue) => {
          if (item.kind === "tuple") {
            return {
              title: (item[0] as PacioliString).value,
              value: item[1] as PacioliMatrix,
              decimals: 2,
            };
          } else {
            throw Error(`Expected a tuple of columns.`);
          }
        });
        this.contentParent().appendChild(DOMTable(columns));
      } else {
        throw Error(`Expected a list of columns.`);
      }
    } catch (err: unknown) {
      this.displayError(err instanceof Error ? err.message : String(err));
    }
  }

  /**
   * Creates an options for the table from the element's attributes.
   *
   * @returns An object with only the entries that are found in the attributes.
   */
  chartOptions(): Partial<{
    decimals: number;
    zero?: string;
    zeroRows: boolean;
    totalsRow?: boolean;
  }> {
    return optionsFromAttributes<{
      decimals: number;
      zero?: string;
      zeroRows: boolean;
      totalsRow?: boolean;
    }>(this, SUPPORTED_ATTRIBUTES);
  }
}

customElements.define("pacioli-table", PacioliTableComponent);
