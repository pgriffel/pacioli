/* Runtime Support for the Pacioli language
 *
 * Copyright (c) 2023 Paul Griffioen
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

import * as fc from "fast-check";

/**
 * Global test configuration
 */
fc.configureGlobal({
  numRuns: 100,
  verbose: true,
  // maxSkipsPerRun: 100000,
  // interruptAfterTimeLimit: 60000,
  // skipAllAfterTimeLimit: 60000
});

/**
 * Do two arrays contain the same elements? Elements are compared
 * wit ===.
 *
 * @param x An array
 * @param y An array
 * @returns True iff the arrays contain the same elements.
 */
export function arrayEqual(x: any[], y: any[]): boolean {
  const n = x.length;
  if (n !== y.length) {
    return false;
  } else {
    for (let i = 0; i < n; i++) {
      if (x[i] !== y[i]) {
        return false;
      }
    }
  }
  return true;
}

export function pickOne<T>(array: fc.Arbitrary<T[]>): fc.Arbitrary<T> {
  //  return fc.subarray(context.getBases(), { minLength: 1, maxLength: 1 }).map(x => x[0]);
  return array.chain((array) =>
    fc.integer({ min: 0, max: array.length - 1 }).map((n) => array[n])
  );
}
