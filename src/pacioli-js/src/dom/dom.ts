/* Runtime Support for the Pacioli language
 *
 * Copyright (c) 2023-2025 Paul Griffioen
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

import type { PacioliMatrix } from "../values/matrix";
import { mergeTableDatas, TableData } from "./table";
import { NR_DECIMALS } from "../primitives";
import type { PacioliValue } from "../boxing";

/**
 * Creates HTML for any PacioliValue.
 *
 * Recurses through containers like list and tuples, so the result can be a tree.
 *
 * TODO: remove any type
 * TODO: connect nozerorows
 *
 * @param x The PacioliValue to display
 * @param options Various options to tune the output
 * @returns A tree of HTML elements that represent the value
 */
export function DOM(
  x: PacioliValue,
  options?: Partial<{
    decimals: number;
    ignoredecimals: boolean;
    zero: string;
    nozerorows: boolean;
    totals: boolean;
  }>
): HTMLElement | Text {
  if (
    typeof x === "boolean" ||
    typeof x === "string" ||
    typeof x === "function"
  ) {
    // return document.createTextNode(x.toString());
    throw Error("Typescript says this cannot happen");
  } else {
    switch (x.kind) {
      case "matrix": {
        // if (x.shape) {
        //   const mat = x as PacioliMatrix;
        //   return mat
        //     .tableData("Value")
        //     .stringify(
        //       options?.zero,
        //       [options?.decimals ?? NR_DECIMALS],
        //       options?.ignoredecimals ?? false
        //     )
        //     .dom(options?.totals ?? false);
        // } else {
        //   // hack to debug without shape info via print en printed
        //   return document.createTextNode(stringifyRawValue(x as RawMatrix));
        // }
        return x
          .tableData("Value")
          .stringify(
            options?.zero,
            [options?.decimals ?? NR_DECIMALS],
            options?.ignoredecimals ?? false
          )
          .dom(options?.totals ?? false);
      }
      case "string": {
        return document.createTextNode(x.value);
      }
      case "coordinates": {
        return document.createTextNode(x.shortText());
        // case "ref":
        //     return Pacioli.DOM(x.value[0])
      }
      case "list": {
        const list = document.createElement("ol");
        const items = x;
        for (let i = 0; i < items.length; i++) {
          const item = document.createElement("li");
          item.appendChild(DOM(items[i], options));
          list.appendChild(item);
        }
        return list;
      }
      case "tuple": {
        const tup = document.createElement("ul");
        const items = x;
        for (let i = 0; i < items.length; i++) {
          const item = document.createElement("li");
          item.appendChild(DOM(items[i], options));
          tup.appendChild(item);
        }
        return tup;
      }
      case "array": {
        const list = document.createElement("ol");
        const items = x;
        for (let i = 0; i < items.length; i++) {
          const item = document.createElement("li");
          item.appendChild(DOM(items[i], options));
          list.appendChild(item);
        }
        return list;
      }
      case "maybe": {
        return x.value !== undefined
          ? DOM(x.value, options)
          : document.createTextNode("Nothing");
      }
      //   PacioliRef | PacioliBoole | PacioliFunction | PacioliMap | PacioliVoid
      default:
        return document.createTextNode(x.toString());
    }
  }
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
    title: string;
    value: PacioliMatrix;
    decimals?: number;
    showTotal?: boolean;
    total?: PacioliMatrix;
  }[],
  options: Partial<{
    decimals: number;
    ignoredecimals: boolean;
    zero: string;
    nozerorows: boolean;
    totals: boolean;
  }>
) {
  const decs = columns.map((column) => {
    return column.decimals ?? options.decimals ?? NR_DECIMALS;
  });

  return mergeTableDatas(
    columns.map((column) =>
      TableData.from(
        column.value,
        column.title,
        column.showTotal === undefined ? true : column.showTotal,
        column.total
      )
    )
  )
    .stringify(options.zero, decs, options.ignoredecimals ?? false)
    .dom(options.totals ?? false);
}
