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

import { Context as UOMContext, siDef } from "uom-ts";
import { PacioliContext } from "../src/context";
import { IndexSet } from "../src/values/index-set";

export const testDefs = {
  prefixes: [],
  bases: [
    { name: "stuk", symbol: "st" },
    { name: "euro", symbol: "€" },
    { name: "cent", symbol: "¢" },
    { name: "millicent", symbol: "m¢" },
  ],
  equations: [
    {
      lhs: "cent",
      rhs: { factor: 0.01, powers: [{ base: { name: "euro" } }] },
    },
    {
      lhs: "millicent",
      rhs: { powers: [{ prefix: "milli", base: { name: "cent" } }] },
    },
  ],
};

export const testContext = PacioliContext.fromUOMContext(
  UOMContext.fromDef(siDef).loadDef(testDefs)
);

export const metreJSON = {
  powers: [{ base: { name: "metre" } }],
};

export const nanometreJSON = {
  powers: [{ base: { prefix: "nano", name: "metre" } }],
};

testContext
  .addIndexSet(IndexSet.fromItems("Geom3", "Geom3", ["x", "y", "z"]))
  .addIndexSet(IndexSet.fromItems("Uno", "Uno", ["the one"]))
  .addIndexSet(
    IndexSet.fromItems("Person", "Person", [
      "Jack",
      "Jill",
      "Jane",
      "John",
      "Jennifer",
    ])
  );

testContext.addUnitVectorFromJSON("standard", "Geom3", [
  { name: "x", unit: metreJSON },
  { name: "y", unit: metreJSON },
  { name: "z", unit: metreJSON },
]);

testContext.addUnitVectorFromJSON("small", "Geom3", [
  { name: "x", unit: nanometreJSON },
  { name: "y", unit: nanometreJSON },
  { name: "z", unit: nanometreJSON },
]);
