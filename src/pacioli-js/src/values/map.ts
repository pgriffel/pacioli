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

import type { RawValue, RawList, RawCoordinates } from "../value";
import { tagList, tagTuple } from "../value";
import { RawMaybe } from "./maybe";
import type { PacioliVoid } from "./void";
import { VOID } from "./void";

export class PacioliMap {
  readonly kind = "map";

  valueMap = new Map<string, RawValue>();
  keyMap = new Map<string, RawValue>();

  constructor() {}

  public store(key: RawValue, value: RawValue): PacioliVoid {
    const effKey = uniqueMapKey(key);
    this.valueMap.set(effKey, value);
    this.keyMap.set(effKey, key);
    return VOID;
  }

  public lookup(key: RawValue): RawMaybe {
    const effKey = uniqueMapKey(key);
    if (this.keyMap.has(effKey)) {
      return new RawMaybe(this.valueMap.get(effKey));
    } else {
      return new RawMaybe();
    }
  }

  public keys(): RawList {
    const keys: RawValue[] = [];
    for (const key of this.keyMap.values()) {
      keys.push(key);
    }
    return tagList(keys);
  }

  toString(): string {
    return (
      "[" +
      this.keys()
        .map((key) => tagTuple([key, this.lookup(key).value!]))
        .join(", ") +
      "]"
    );
  }
}

function uniqueMapKey(value: RawValue): string {
  if ((value as RawCoordinates).kind === "coordinates") {
    return (value as RawCoordinates).position.toString();
  } else {
    return value.toString();
  }
}
