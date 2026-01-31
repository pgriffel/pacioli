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

import type { PacioliMatrix } from "../values/matrix";
import { TableBuilder } from "../table/table-builder";
import type { PacioliValue } from "../values/pacioli-value";
import type { PacioliList } from "../values/list";
import type { TableColumnOptions } from "../table/table-column";
import { TableColumn } from "../table/table-column";
import type { SIUnit } from "uom-ts";

type DOMOptions = {
  decimals: number;
  ignoredecimals: boolean;
  exponential: boolean;
  zero: string;
  nozerorows: boolean;
  totals: boolean;
  ascii: boolean;
  clipboard: boolean;
};

/**
 * Creates HTML for any PacioliValue.
 *
 * Recurses through containers like list and tuples, so the result can be a tree.
 *
 * TODO: connect nozerorows
 *
 * @param x The PacioliValue to display
 * @param options Various options to tune the output
 * @returns A tree of HTML elements that represent the value
 */
export function DOM(
  x: PacioliValue,
  options?: Partial<DOMOptions>,
): HTMLElement | Text {
  switch (x.kind) {
    case "matrix": {
      return x.tableBuilder("Value", options).dom();
    }
    case "string": {
      return document.createTextNode(x.value);
    }
    case "coordinates": {
      return document.createTextNode(x.shortText());
    }
    case "list": {
      return arrayElementsToDOM("ol", x, options);
    }
    case "tuple": {
      return arrayElementsToDOM("ul", x, options);
    }
    case "array": {
      return arrayElementsToDOM("ul", x, options);
    }
    case "maybe": {
      return x.value === undefined
        ? document.createTextNode("Nothing")
        : DOM(x.value, options);
    }
    case "map": {
      return x.dom();
    }
    case "boole": {
      return document.createTextNode(x.value ? "true" : "false");
    }
    case "ref": {
      return DOM(x.element);
    }
    case "function": {
      return document.createTextNode("|closure|");
    }
    case "void": {
      return document.createTextNode("|void|");
    }
  }
}

/**
 * Helper for function DOM
 */
function arrayElementsToDOM(
  tag: "ol" | "ul",
  items: PacioliValue[],
  options?: Partial<DOMOptions>,
): HTMLElement {
  const listElement = document.createElement(tag);

  for (const item of items) {
    const itemElement = document.createElement("li");

    itemElement.appendChild(DOM(item, options));

    listElement.appendChild(itemElement);
  }

  return listElement;
}

/**
 * Creates an HTML table element from a list of columns. All column values
 * must be a vector with the same index sets.
 *
 * @param columns A properties object for every column
 * @returns A 'table' HTML element
 */
export function DOMTable(
  columns: {
    header: string;
    value: PacioliMatrix | PacioliList;
    unit?: SIUnit;
    decimals?: number;
    ignoredecimals?: boolean;
    exponential?: boolean;
    showTotal?: boolean;
    total?: PacioliMatrix;
  }[],
  options: Partial<DOMOptions>,
) {
  const tableColumns: TableColumn[] = columns.map((column) => {
    const columnOptions: Partial<TableColumnOptions> = {
      decimals: column.decimals,
      unit: column.unit,
      ignoredecimals: column.ignoredecimals,
      exponential: column.exponential,
      showTotal: column.showTotal,
      total: column.total,
    };

    if (column.value.kind === "matrix") {
      return TableColumn.fromVector(column.value, column.header, columnOptions);
    } else {
      return TableColumn.fromList(column.value, column.header, columnOptions);
    }
  });

  return new TableBuilder(tableColumns, options).dom();
}
