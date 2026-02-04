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

import type { DimNum } from "uom-ts";

export function stringifyCell(
  cell: DimNum,
  options: {
    zeroString: string | undefined;
    omitDecimals: boolean;
    nrDecimals: number;
    exponential: boolean;
  },
): string {
  if (cell.magnitude.isZero() && options.zeroString !== undefined) {
    return options.zeroString;
  } else if (options.exponential) {
    return options.omitDecimals
      ? cell.magnitude.toExponential()
      : cell.magnitude.toExponential(options.nrDecimals);
  } else {
    return options.omitDecimals
      ? cell.magnitude.toFixed()
      : cell.magnitude.toFixed(options.nrDecimals);
  }
}
