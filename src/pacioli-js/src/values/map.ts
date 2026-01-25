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

import type { PacioliContext } from "../context";
import { DOM } from "../dom/dom";
import type { RawMap } from "../raw-values/raw-value";
import type { PacioliType } from "../types/pacioli-type";
import { boxRawValue } from "./pacioli-value";

export class PacioliMap {
  readonly kind = "map";

  // The context is necessary because boxRawValue is delayed.
  constructor(
    public srcType: PacioliType,
    public dstType: PacioliType,
    public rawMap: RawMap,
    private context: PacioliContext,
  ) {}

  /**
   * Currently the only use for PacioliMap
   */
  dom(): HTMLElement {
    return mapAsDOM(this, this.srcType, this.dstType, this.context);
  }
}

function mapAsDOM(
  map: PacioliMap,
  srcType: PacioliType,
  dstType: PacioliType,
  context: PacioliContext,
): HTMLElement {
  const keyMap = map.rawMap.keyMap;
  const valueMap = map.rawMap.valueMap;

  const element = document.createElement("ul");

  for (const key of keyMap.keys()) {
    const k = keyMap.get(key);
    const v = valueMap.get(key);

    if (k !== undefined && v !== undefined) {
      const item = document.createElement("li");

      item.appendChild(DOM(boxRawValue(k, srcType, context)));
      item.appendChild(document.createTextNode("→"));
      item.appendChild(DOM(boxRawValue(v, dstType, context)));

      element.appendChild(item);
    }
  }

  return element;
}
