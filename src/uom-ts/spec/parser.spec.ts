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

import { expect } from "chai";
import { testContext } from "./arbitraries";
import { describe, it } from "vitest";

describe("parser", () => {
  describe("context.parseDimNum", () => {
    it("should parse a unit ", () => {
      const output = testContext
        .parseDimNum(
          "12.3 * second * 10 ^ 1  *  kilo:gram ^ 2 / (kelvin)  * 14 ^5 "
        )
        .toText();

      expect(output).to.equal("66152352*s*kg^2/K");
    });

    it("should parse a unit with negative power", () => {
      const output = testContext.parseDimNum("12.3 * second ^ -2").toText();

      expect(output).to.equal("12.3/s^2");
    });
  });
});
