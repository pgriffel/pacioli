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
import * as fc from "fast-check";
import { DimNum } from "../src/dim-num";
import { si } from "../src/si";
import { UOM } from "../src/uom";
import { Context, Definition } from "../src/context";
import { arbitraryPrimitiveSIBase, testContext } from "./arbitraries";
import { arbitraryDimNum } from "./dim-num.spec";
import { arbitraryUOM } from "./uom.spec";
import BigNumber from "bignumber.js";
import { describe, it } from "vitest";
import { SIBase } from "../src/si-base";

// fc.configureGlobal({
//   numRuns: 100000,
//   verbose: true,
//   // maxSkipsPerRun: 100000,
//   // interruptAfterTimeLimit: 60000,
//   // skipAllAfterTimeLimit: 60000
// });

describe("context", () => {
  describe("flatten", () => {
    it("should do nothing for a simple unit and no equation", () => {
      fc.assert(
        fc.property(arbitraryPrimitiveSIBase(), (base) => {
          // Given a definition
          const def: Definition = {
            prefixes: [],
            bases: [{ name: base.name, symbol: base.symbol }],
            equations: [],
          };

          // When a context is created from the definition
          const context = Context.empty().loadDef(def);

          // When the unit for the base is created
          const unit = context.getUnit(base.name);

          const flat = context.flatten(unit);

          // Then
          expect(flat.equals(DimNum.fromUnit(unit))).to.equal(true);
        })
      );
    });

    it("should make a substitution for a simple unit and an equation", () => {
      fc.assert(
        fc.property(arbitraryDimNum(), fc.string(), (dimNum, name) => {
          fc.pre(name.split(":").length === 1);
          fc.pre(dimNum.magnitude.isFinite());

          const base = SIBase.from(name, name);

          // When a context is created from the definition
          const context = new Context([], [base], [[name, dimNum]]).loadDef(
            testContext.genDef()
          );

          // When the unit for the base is created
          const unit = context.getUnit(base.name);

          const flat = context.flatten(unit);

          if (!flat.equals(testContext.flattenDimNum(dimNum))) {
            console.log(
              base,
              dimNum.toText(),
              testContext.flattenDimNum(dimNum).toText(),
              unit.toText(),
              " = ",
              flat.toText()
            );
          }

          // Then
          expect(flat.equals(testContext.flattenDimNum(dimNum))).to.equal(true);
        })
      );
    });

    it("should equal (for some precision) the product of the flattend terms", () => {
      fc.assert(
        fc.property(arbitraryUOM(), arbitraryDimNum(), (unit, dimNum) => {
          // When a unit is flattened
          const flat = testContext.flatten(unit);

          // And when the unit's terms are flattened and multiplied
          const alt = unit
            .terms()
            .map((term) => testContext.flatten(UOM.fromTerm(term)))
            .reduce((x, y) => x.mult(y), DimNum.ONE);

          // Then these should be the same, except for precision
          const precision = 14;
          if (flat.toPrecision(precision) !== alt.toPrecision(precision)) {
            console.log(
              dimNum.toText(),
              flat.toText(),
              "not equal",
              alt.toText()
            );
            console.log(
              dimNum.toPrecision(precision),
              flat.toPrecision(precision),
              "not equal",
              alt.toPrecision(precision)
            );
          }

          expect(
            flat.toPrecision(precision) === alt.toPrecision(precision)
          ).to.equal(true);
        })
      );
    });
  });

  describe("loadDef", () => {
    it("should load testContext.genDef", () => {
      expect(Context.fromDef(testContext.genDef()).toText()).to.equal(
        testContext.toText()
      );
    });
  });

  describe("conversionFactor", () => {
    it("should give 1/1000 for milli to no prefix", () => {
      expect(
        si
          .conversionFactor(si.getUnit("milli:gram"), si.getUnit("gram"))
          .comparedTo(new BigNumber("0.001"))
      ).to.equal(0);
    });

    it("should give 1/1000 for milli to no prefix alt", () => {
      expect(
        si
          .conversionFactor(
            si.getUnit("milli:gram"),
            si.getScaledUnit("", "gram")
          )
          .comparedTo(new BigNumber("0.001"))
      ).to.equal(0);
    });

    it("should give 1/100000 for milli:cent to euro", () => {
      const context = Context.fromDef({
        prefixes: [{ name: "milli", power: -3, symbol: "m" }],
        bases: [
          { name: "stuk", symbol: "st" },
          { name: "euro", symbol: "â‚¬" },
          { name: "cent", symbol: "Â¢" },
          { name: "millicent", symbol: "mÂ¢" },
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
            rhs: { powers: [{ base: { prefix: "milli", name: "cent" } }] },
          },
        ],
      });

      expect(
        context
          .conversionFactor(
            context.getUnit("millicent"),
            context.getScaledUnit("", "euro")
          )
          .comparedTo(new BigNumber("0.00001"))
      ).to.equal(0);
    });
  });
});
