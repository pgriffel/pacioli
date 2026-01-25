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
import {
  evaluateWebComponentDefinition,
  optionsFromAttributes,
  optionsFromScript,
} from "../utils";
import { DOMTable } from "../../dom/dom";
import type { PacioliTuple } from "../../values/tuple";
import type { PacioliValue } from "../../values/pacioli-value";
import type { PacioliMatrix } from "../../values/matrix";
import { PacioliError } from "../../pacioli-error";
import {
  getBooleAttribute,
  getNumberAttribute,
  getStringAttribute,
} from "../pacioli-web-component";
import type { PacioliList } from "../../values/list";

/**
 * Options for Pacioli's table component.
 */
export interface TableOptions {
  decimals: number;
  zero?: string;
  nozerorows: boolean;
  totals: boolean;
  ignoredecimals: boolean;
  exponential: boolean;
  ascii: boolean;
  clipboard: boolean;
}

interface ColumnData {
  header: string;
  value: PacioliMatrix | PacioliList;
  decimals?: number;
  ignoredecimals?: boolean;
  exponential?: boolean;
  showTotal?: boolean;
  total?: PacioliMatrix;
}

/**
 * Attribues supported by the table component
 */
const SUPPORTED_ATTRIBUTES = {
  strings: ["zero"],
  booleans: [
    "nozerorows",
    "ignoredecimals",
    "exponential",
    "totals",
    "ascii",
    "clipboard",
  ],
  numbers: ["decimals"],
};

function pacioliTableError(message: string): PacioliError {
  return new PacioliError(
    `Unexpected data for table. ${message}\n\n${VALID_TABLE_DATA_MESSAGE}`,
  );
}

const VALID_TABLE_DATA_MESSAGE = `Valid chart data for a table is 
  - a list of (number, number) pairs
  - a pair of number lists
  - a pair of number vectors
  - a vector
  - a list of numbers`;

/**
 * Style sheet for the table component
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
 * Web component for a table. A wrapper around the DOMTable function.
 */
export class PacioliTableComponent extends PacioliShadowTreeComponent {
  /**
   * Is a total row added?
   */
  get totals(): string {
    return this.getStringAttribute("totals");
  }

  set totals(value: string) {
    this.setStringAttribute("totals", value);
  }

  /**
   * Is a total row added?
   */
  get nozerorows(): boolean {
    return this.getBooleAttribute("nozerorows");
  }

  set nozerorows(value: boolean) {
    this.setBooleAttribute("nozerorows", value);
  }

  /**
   * Is the decimals attribute ignored?
   */
  get ignoredecimals(): boolean {
    return this.getBooleAttribute("ignoredecimals");
  }

  set ignoredecimals(value: boolean) {
    this.setBooleAttribute("ignoredecimals", value);
  }

  /**
   * Is the table displayed in ASCII format?
   */
  get ascii(): boolean {
    return this.getBooleAttribute("ascii");
  }

  set ascii(value: boolean) {
    this.setBooleAttribute("ascii", value);
  }

  /**
   * Is the table displayed in clipboard format?
   */
  get clipboard(): boolean {
    return this.getBooleAttribute("clipboard");
  }

  set clipboard(value: boolean) {
    this.setBooleAttribute("clipboard", value);
  }

  /**
   * Is exponential notation for numbers used?
   */
  get exopnential(): boolean {
    return this.getBooleAttribute("exopnential");
  }

  set exopnential(value: boolean) {
    this.setBooleAttribute("exopnential", value);
  }

  /**
   * The Pacioli value displayed in the table.
   */
  // data?: PacioliValue;
  columns?: ColumnData[];

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
    "totals",
    "nozerorows",
    "ignoredecimals",
    "exopnential",
    "ascii",
    "clipboard",
  ];

  /**
   * Web component life-cycle event.
   */
  attributeChangedCallback(name: string, _oldValue: string, _newValue: string) {
    try {
      if (this.columns !== undefined) {
        // Reload the data if the definition changes. The initial load is done in
        // parametersChanged.
        if (name === "definition") {
          this.columns = this.collectColumns();
        }

        this.drawTable(this.columns);
      }
    } catch (err: unknown) {
      this.displayError(err instanceof Error ? err.message : String(err));
    }
  }

  /**
   * Pacioli web component life-cycle event.
   */
  override parametersChanged(): void {
    this.columns = this.collectColumns();

    this.drawTable(this.columns);
  }

  collectColumns(): ColumnData[] {
    return [
      ...columnDataFromDefinition(this),
      ...columnDataFromChildElements(this),
    ];
  }

  drawTable(columns: ColumnData[]) {
    this.clearContent();
    this.clearErrors();

    const options = {
      ...optionsFromScript<TableOptions>(this, SUPPORTED_ATTRIBUTES),
      ...optionsFromAttributes<TableOptions>(this, SUPPORTED_ATTRIBUTES),
    };

    this.contentParent().appendChild(DOMTable(columns, options));
  }
}

function columnDataFromChildElements(element: HTMLElement): ColumnData[] {
  const columns: ColumnData[] = [];

  for (const child of element.children) {
    if (child.nodeName === "COLUMN") {
      const element = child as HTMLElement;

      const header = getStringAttribute(
        element,
        "header",
        "No 'header' attribute",
      );
      const decimals = element.hasAttribute("decimals")
        ? getNumberAttribute(element, "decimals")
        : undefined;
      const ignoredecimals = getBooleAttribute(element, "ignoredecimals");
      const exponential = getBooleAttribute(element, "exponential");
      const showTotal = getBooleAttribute(element, "totals");

      const value = evaluateWebComponentDefinition(element);

      if (value.kind !== "matrix" && value.kind !== "list") {
        throw pacioliTableError(
          `Invalid column '${header}'. Expected a matrix or a list, got a '${value.kind}'`,
        );
      }

      columns.push({
        header: header,
        value: value,
        decimals,
        ignoredecimals,
        exponential,
        showTotal,
      });
    }
  }

  return columns;
}

function columnDataFromDefinition(element: HTMLElement): ColumnData[] {
  if (element.hasAttribute("definition")) {
    return columnsFromValue(evaluateWebComponentDefinition(element));
  } else {
    return [];
  }
}

/**
 * Converts a PacioliValue into a list of columns options for the DOMTable function.
 *
 * @param value
 * @returns
 */
function columnsFromValue(value: PacioliValue): ColumnData[] {
  if (value.kind === "tuple") {
    const columns = value.map((item: PacioliValue) => {
      if (item.kind === "tuple") {
        return columnData(item);
      } else {
        throw pacioliTableError(
          `Invalid column. Expected a tuple, got a '${item.kind}'`,
        );
      }
    });
    return columns;
  } else {
    throw pacioliTableError(
      `Expected a tuple of columns, got a '${value.kind}'`,
    );
  }
}

/**
 * Helper for columnsFromValue. Converts a single column spec.
 */
function columnData(value: PacioliTuple): ColumnData {
  if (value.length >= 2 && value.length <= 5) {
    if (value[0].kind !== "string") {
      throw pacioliTableError(
        `Invalid column. Expected a (string, vector, ...) tuple, but the first tuple element is a '${value[0].kind}'.`,
      );
    }

    const title: string = value[0].value;

    if (value[1].kind !== "matrix") {
      throw pacioliTableError(
        `Column '${title}'' is invalid. Expected a (string, vector, ...) tuple, but the second tuple element is a '${value[1].kind}'.`,
      );
    }

    let decimals = undefined;
    let showTotal = undefined;
    let total = undefined;

    if (value.length >= 3) {
      if (value[2].kind === "matrix") {
        decimals = value[2].getNum(0, 0);
      } else if (value[2].kind === "maybe") {
        const val = value[2].value;
        if (val === undefined || val.kind === "matrix") {
          decimals = val?.getNum(0, 0);
        } else {
          throw pacioliTableError(
            `Invalid decimals for column '${title}'. Expected a number in the maybe, got a '${val.kind}'`,
          );
        }
      } else {
        throw pacioliTableError(
          `Invalid decimals for column '${title}'. Expected a number or a maybe number, got a '${value[2].kind}'`,
        );
      }
    }

    if (value.length >= 4) {
      if (value[3].kind === "maybe") {
        const val = value[3].value;
        if (val === undefined || val.kind === "boole") {
          showTotal = val?.value;
        } else {
          throw pacioliTableError(
            `Invalid showTotal for column '${title}'. Expected a boole in the maybe, got a '${val.kind}'`,
          );
        }
      } else if (value[3].kind === "boole") {
        showTotal = value[3].value;
      } else {
        throw pacioliTableError(
          `Invalid showTotal for column '${title}'. Expected a boole or a maybe boole, got a '${value[3].kind}'`,
        );
      }
    }

    if (value.length >= 5) {
      if (value[4].kind === "maybe") {
        const val = value[4].value;
        if (val === undefined || val.kind === "matrix") {
          total = val;
        } else {
          throw pacioliTableError(
            `Invalid total for column '${title}'. Expected a number in the maybe, got a '${val.kind}'`,
          );
        }
      } else {
        throw pacioliTableError(
          `Invalid total for column '${title}'. Expected a maybe number, got a '${value[3].kind}'`,
        );
      }
    }

    return {
      header: value[0].value,
      value: value[1],
      decimals,
      showTotal,
      total,
    };
  } else {
    throw pacioliTableError(
      `Invalid column. Expected a (string, vector) pair or (string, vector, scalar) triple, got ${value.length.toString()} tuple elements instead of 2 or 3.`,
    );
  }
}

customElements.define("pacioli-table", PacioliTableComponent);
