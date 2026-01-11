/* Units of measurement for the Pacioli language
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

import { UOM } from "./uom";
import { UOMBase } from "./uom-base";

export function unitFromJSON<T extends UOMBase>(
  json: {
    powers: {
      base: {
        prefix?: string;
        name: string;
      };
      power?: number;
    }[];
  },
  baseCallback: (prefix: string, name: string) => UOM<T> | undefined
): UOM<T> {
  // Check that the powers field is present
  if (!json.powers) {
    throw new Error("expected powers in unit json " + json);
  }

  // Create a unit for each individual term in the powers field
  const unit: UOM<T>[] = json.powers.map((term: any) => {
    // Check that a base field exists
    if (!term.base) {
      throw new Error("expected base in the powers of unit json " + json);
    }
    if (!term.base.name) {
      throw new Error(
        "expected name in the base of the powers of unit json " + json
      );
    }

    // Call the callbacks to get the prefix and base
    const unit = baseCallback(term.base.prefix || "", term.base.name);

    // Check the callback results
    if (!unit) {
      throw new Error(
        "Cannot create unit from json. Base callback returned invalid base for " +
          term.base.name
      );
    }

    // Create a unit from the prefix and the base and raise it to the proper power
    return unit.expt(term.power || 1);
  });

  // Multiply the units of the individual terms
  return unit.reduce((x, y) => x.mult(y), UOM.ONE as UOM<T>);
}
