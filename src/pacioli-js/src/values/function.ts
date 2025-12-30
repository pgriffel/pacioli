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

import { typeFromValue, rawValueFromValue, boxRawValue } from "../boxing";
import type { FunctionType } from "../types/function";
import type { PacioliValue } from "../boxing";
import type { PacioliContext } from "../context";
import type { GenericType } from "../types/generic";
import type { RawValue } from "../value";

export class PacioliFunction {
  readonly kind = "function";
  constructor(
    public fun: (...args: RawValue[]) => RawValue,
    public type: FunctionType,
    private context: PacioliContext
  ) {}

  apply(args: PacioliValue[]): PacioliValue {
    const types = args.map(typeFromValue);
    const values: RawValue[] = args.map(rawValueFromValue);
    const expectedNrArgs = (this.type.from as GenericType).items.length;
    if (args.length === expectedNrArgs) {
      const type = this.type.apply(types);
      return boxRawValue(this.fun(...values), type, this.context);
    } else {
      throw Error(
        `Number of arguments do not match. Expected ${expectedNrArgs}, but got ${args.length}`
      );
    }
  }

  call(...args: PacioliValue[]): PacioliValue {
    return this.apply(args);
  }
}
