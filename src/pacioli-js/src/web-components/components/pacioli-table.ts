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

import {
  NUMBER_ATTRIBUTES,
  PacioliNumberComponent,
} from "../pacioli-number-component";
import { DOMTable } from "../../dom/dom";
import type { PacioliTuple } from "../../values/tuple";
import type { PacioliValue } from "../../values/pacioli-value";
import type { PacioliMatrix } from "../../values/matrix";
import { PacioliError } from "../../pacioli-error";
import type { PacioliList } from "../../values/list";
import type { SIUnit } from "uom-ts";
import { parseUnit } from "../../api";
import type { NumberOptions } from "../pacioli-number-component";
import { COMMON_ATTRIBUTES } from "../pacioli-web-component";
import {
  mergeAttributeSpecs,
  collectAllAttributes,
  optionsFromScript,
  optionsFromAttributes,
  getStringAttribute,
  getNumberAttribute,
  getBooleAttribute,
} from "../utils/attributes";
import { evaluateWebComponentDefinition } from "../utils/definition";

/**
 * Options for Pacioli's table component.
 */
export interface TableOptions extends NumberOptions {
  nozerorows: boolean;
  totals: boolean;
}

interface ColumnData {
  header: string;
  value: PacioliMatrix | PacioliList;
  unit?: SIUnit;
  decimals?: number;
  raw?: boolean;
  exponential?: boolean;
  showTotal?: boolean;
  total?: PacioliMatrix;
}

/**
 * Attribues supported by the table component
 */
const TABLE_ATTRIBUTES = {
  strings: [],
  booleans: ["nozerorows", "totals"],
  numbers: [],
};

const SUPPORTED_ATTRIBUTES = mergeAttributeSpecs(
  COMMON_ATTRIBUTES,
  NUMBER_ATTRIBUTES,
  TABLE_ATTRIBUTES,
);

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
table {
  border-spacing: 0;
  border-collapse: collapse;
}

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
`;

/**
 * Web component for a table. A wrapper around the DOMTable function.
 */
export class PacioliTableComponent extends PacioliNumberComponent {
  /**
   * Is a total row added?
   */
  get totals(): boolean {
    return this.getBooleAttribute("totals");
  }

  set totals(value: boolean) {
    this.setBooleAttribute("totals", value);
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
  static readonly observedAttributes =
    collectAllAttributes(SUPPORTED_ATTRIBUTES);

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
      const raw = getBooleAttribute(element, "raw");
      const exponential = getBooleAttribute(element, "exponential");
      const showTotal = getBooleAttribute(element, "totals");
      const unitAtt = getStringAttribute(element, "unit");
      const unit = unitAtt === undefined ? undefined : parseUnit(unitAtt);

      const value = evaluateWebComponentDefinition(element);

      if (value.kind !== "matrix" && value.kind !== "list") {
        throw pacioliTableError(
          `Invalid column '${header}'. Expected a matrix or a list, got a '${value.kind}'`,
        );
      }

      columns.push({
        header: header,
        value: value,
        unit,
        decimals,
        raw,
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
  if (value.kind === "tuple" || value.kind === "list") {
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
      `Expected a tuple or list of columns, got a '${value.kind}'`,
    );
  }
}

/**
 * Helper for columnsFromValue. Converts a single column spec.
 */
function columnData(value: PacioliTuple): ColumnData {
  if (value.length < 2 || value.length > 5) {
    throw pacioliTableError(
      `Invalid column. Expected a (string, value, ...) tuple, got ${value.length.toString()} tuple elements instead of 2 to 5.`,
    );
  }

  if (value[0].kind !== "string") {
    throw pacioliTableError(
      `Invalid column. Expected a (string, value, ...) tuple, but the first tuple element is a '${value[0].kind}'.`,
    );
  }

  const title: string = value[0].value;

  if (value[1].kind !== "matrix" && value[1].kind !== "list") {
    throw pacioliTableError(
      `Column '${title}'' is invalid. Expected a vector or list value, but the second tuple element is a '${value[1].kind}'.`,
    );
  }

  try {
    const decimals = value.length > 2 ? parseDecimals(value[2]) : undefined;
    const showTotal = value.length > 3 ? parseShowTotal(value[3]) : undefined;
    const total = value.length > 4 ? parseTotal(value[4]) : undefined;

    return {
      header: value[0].value,
      value: value[1],
      decimals,
      showTotal,
      total,
    };
  } catch (error) {
    throw pacioliTableError(
      `Error in column '${title}': ${
        error instanceof Error ? error.message : String(error)
      }`,
    );
  }
}

function parseDecimals(value: PacioliValue): number | undefined {
  if (value.kind === "matrix") {
    return value.getNum(0, 0);
  }

  if (value.kind === "maybe") {
    const val = value.value;

    if (val === undefined) {
      return undefined;
    }

    if (val.kind === "matrix") {
      return val.getNum(0, 0);
    }
  }

  throw pacioliTableError(
    `Invalid decimals. Expected a number or a maybe number, got a '${value.kind}'`,
  );
}

function parseShowTotal(value: PacioliValue): boolean | undefined {
  if (value.kind === "boole") {
    return value.value;
  }

  if (value.kind === "maybe") {
    const val = value.value;

    if (val === undefined) {
      return undefined;
    }

    if (val.kind === "boole") {
      return val.value;
    }
  }

  throw pacioliTableError(
    `Invalid show totals value. Expected a boole or a maybe, got a '${value.kind}'`,
  );
}

function parseTotal(value: PacioliValue): PacioliMatrix | undefined {
  if (value.kind === "matrix") {
    return value;
  }

  if (value.kind === "maybe") {
    const val = value.value;

    if (val === undefined || val.kind === "matrix") {
      return val;
    }
  }

  throw pacioliTableError(
    `Invalid total. Expected a number, got a '${value.kind}'`,
  );
}

customElements.define("pacioli-table", PacioliTableComponent);
