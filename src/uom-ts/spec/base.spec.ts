import { siDef } from "../src/si";
import * as fc from "fast-check";
import { Context } from "../src/context";
import { SIBase } from "../src/si-base";
import BigNumber from "bignumber.js";
import { arbitraryPrefix } from "./prefix.spec";

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
      rhs: {
        factor: new BigNumber(0.01),
        powers: [{ base: { name: "euro" } }],
      },
    },
    {
      lhs: "millicent",
      rhs: { powers: [{ prefix: "milli", base: { name: "cent" } }] },
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
    arbitraryPrefix().map((prefix) => base.withPrefix(prefix))
  );
}
