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

import { siDef, si } from "../src/si";
import * as fc from "fast-check";
import { Context } from "../src/context";
import { SIBase } from "../src/si-base";
import BigNumber from "bignumber.js";
import { Prefix } from "../src/prefix";
import { UOMTerm } from "../src/uom-term";

export const testDefs = {
  prefixes: [],
  bases: [
    { name: "stuk", symbol: "st" },
    { name: "euro", symbol: "€" },
    { name: "cent", symbol: "¢" },
    { name: "millicent", symbol: "m¢" },
    { name: "earthmass", symbol: "earth" },
  ],
  equations: [
    {
      lhs: "cent",
      rhs: {
        factor: new BigNumber(0.01),
        powers: [{ base: { name: "euro" } }],
      },
    },
    {
      lhs: "millicent",
      rhs: { powers: [{ prefix: "milli", base: { name: "cent" } }] },
    },
    {
      lhs: "earthmass",
      rhs: {
        factor: new BigNumber(5972),
        powers: [{ base: { prefix: "yotta", name: "gram" } }],
      },
    },
  ],
};

export const testContext = Context.fromDef(siDef).loadDef(testDefs);

export function arbitraryPrimitiveSIBase(): fc.Arbitrary<SIBase> {
  return fc
    .subarray(testContext.getBases(), { minLength: 1, maxLength: 1 })
    .map((x) => x[0]);
}

export function arbitrarySIBase(): fc.Arbitrary<SIBase> {
  return arbitraryPrimitiveSIBase().chain((base) =>
    arbitraryPrefix().map((prefix) => base.withPrefix(prefix)),
  );
}

/**
 * A fast check Arbitrary for the {@link Line} class.
 *
 * @param place when provided the Line uses this place, otherwise an arbitary one
 * @returns an arbitray Line instance
 * @see arbitraryPlace
 */
export function arbitraryPrefix(): fc.Arbitrary<Prefix> {
  return fc
    .subarray(si.getPrefixes(), { minLength: 1, maxLength: 1 })
    .map((x) => x[0]);
}

export function arbitrarySITerm(): fc.Arbitrary<UOMTerm<SIBase>> {
  return arbitrarySIBase().chain((base) =>
    fc
      .integer({ min: -10, max: 10 })
      .map((power) => UOMTerm.fromBase(base).withPower(power)),
  );
}
