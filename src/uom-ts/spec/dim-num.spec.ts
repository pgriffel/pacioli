/* Units of measurement for the Pacioli language
 *
 * Copyright (c) 2023 - 2025 Paul Griffioen
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

import { expect } from "chai";
import * as fc from "fast-check";
import { UOM } from "../src/uom";
import { DimNum } from "../src/dim-num";
import { arbitraryUOM } from "./uom.spec";
import BigNumber from "bignumber.js";
import { testContext } from "./arbitraries";
import { describe, it } from "vitest";
import { SIUnit } from "../src/context";

// fc.configureGlobal({
//   numRuns: 100000,
//   verbose: true,
//   maxSkipsPerRun: 100000,
//   interruptAfterTimeLimit: 60000,
//   skipAllAfterTimeLimit: 60000,
// });

/**
 * A fast check Arbitrary for the {@link DimNum} class.
 *
 * @returns an arbitray DimNum instance
 * @see arbitraryBase
 */
export function arbitraryDimNum(): fc.Arbitrary<DimNum> {
  return arbitraryUOM().chain((uom) =>
    arbitraryBigNum().map((factor) => new DimNum(factor, uom))
  );
}

export function arbitraryNum(): fc.Arbitrary<number> {
  return fc.oneof(
    { arbitrary: fc.constantFrom(-2, -1, 0, 1, 2), weight: 1 },
    { arbitrary: fc.integer(), weight: 2 },
    { arbitrary: fc.float(), weight: 2 }
  );
}

export function arbitraryBigNum(): fc.Arbitrary<BigNumber> {
  return arbitraryNum().map((x) => new BigNumber(x));
}

describe("DimNum", () => {
  describe("dimless", () => {
    it("should create a dimensioned number with the identity unit and the given factor", () => {
      fc.assert(
        fc.property(arbitraryBigNum(), (factor) => {
          fc.pre(factor.isFinite());

          // when a dimensioned number is created with dimless
          const dimNum = DimNum.dimless(factor);

          // then the number should have the empty unit
          expect(dimNum.unit.equals(SIUnit.ONE)).to.equal(true);

          // and the factor should be the given factor
          expect(dimNum.magnitude.comparedTo(factor)).to.equal(0);
        })
      );
    });
  });

  describe("fromUnit", () => {
    it("should create a dimensioned number with the given unit and factor 1", () => {
      fc.assert(
        fc.property(arbitraryUOM(), (unit) => {
          // when a dimensioned number is created with fromUnit
          const dimNum = DimNum.fromUnit(unit);

          // then the number should have the given unit
          expect(dimNum.unit.equals(unit)).to.equal(true);

          // and the factor should be 1
          expect(dimNum.magnitude.comparedTo(new BigNumber(1))).to.equal(0);
        })
      );
    });
  });

  describe("mult", () => {
    it("should correctly multiply two dimensioned numbers", () => {
      fc.assert(
        fc.property(arbitraryDimNum(), arbitraryDimNum(), (numA, numB) => {
          fc.pre(numA.magnitude.isFinite());
          fc.pre(numB.magnitude.isFinite());

          // When two units are multipled
          const mult = numA.mult(numB);

          // Then the factor is the product of the factors
          expect(
            mult.magnitude.comparedTo(
              numA.magnitude.multipliedBy(numB.magnitude)
            )
          ).to.equal(0);

          // And the unit is the product of the units
          expect(mult.unit.equals(numA.unit.mult(numB.unit))).to.equal(true);
        })
      );
    });
  });

  describe("expt", () => {
    it("should correctly compute a power", () => {
      fc.assert(
        fc.property(
          arbitraryDimNum(),
          fc.integer({ min: -10, max: 10 }),
          (num, power) => {
            fc.pre(num.magnitude.isFinite());

            // When the exponent of a unit is computed
            const exp = num.expt(power);

            // Then the factor is the exponent of the factor
            expect(
              exp.magnitude.comparedTo(num.magnitude.exponentiatedBy(power))
            ).to.equal(0);

            // And the unit is the exponent of the unit
            expect(exp.unit.equals(num.unit.expt(power))).to.equal(true);
          }
        )
      );
    });
  });

  describe("reciprocal", () => {
    it("should correctly take the reciprocal", () => {
      fc.assert(
        fc.property(arbitraryDimNum(), (num) => {
          fc.pre(num.magnitude.isFinite());

          // When the reciprocal of a unit is taken
          const reci = num.reciprocal();

          // Then the result is the same as an exponent with power -1
          expect(reci.equals(num.expt(-1))).to.equal(true);
        })
      );
    });
  });

  describe("div", () => {
    it("should correctly divide two dimensioned numbers", () => {
      fc.assert(
        fc.property(arbitraryDimNum(), arbitraryDimNum(), (numA, numB) => {
          fc.pre(numA.magnitude.isFinite());
          fc.pre(numB.magnitude.isFinite());

          // When two units are divided
          const div = numA.div(numB);

          // Then the result is the same as multiplying with the reciprocal
          //
          // If numA.factor === 0 && numB.factor === 0 then the outcome is NaN (result of 0/0)
          // and NaN === NaN is false. For just numB.factor === 0 the outcome is Infinity
          // (result of e.g. 1/0) and Infinity === Infinity is true.
          expect(div.equals(numA.mult(numB.reciprocal()))).to.equal(
            numA.magnitude.comparedTo(new BigNumber(0)) !== 0 ||
              numB.magnitude.comparedTo(new BigNumber(0)) !== 0
          );
        })
      );
    });
  });

  describe("equals", () => {
    it("should correctly test equality of two dimensioned numbers", () => {
      fc.assert(
        fc.property(arbitraryDimNum(), arbitraryDimNum(), (numA, numB) => {
          expect(numA.equals(numB)).to.equal(
            numA.magnitude.comparedTo(numB.magnitude) === 0 &&
              numA.unit.equals(numB.unit)
          );
        })
      );
    });
  });

  describe("isDimensionless", () => {
    it("should only be true for an empty unit", () => {
      fc.assert(
        fc.property(arbitraryDimNum(), (num) => {
          expect(num.isDimensionless()).to.equal(num.unit.isDimensionless());
        })
      );
    });
  });

  describe("toFixed", () => {
    it("should print with dot for en-US", () => {
      expect(DimNum.dimless(new BigNumber("12.345")).toFixed()).to.equal(
        "12.345"
      );
    });

    it("should print dimensioned number correctly", () => {
      expect(
        testContext.parseDimNum("12.345 * euro^2 / stuk").toFixed()
      ).to.equal("12.345 €^2/st");
    });

    it("should print unit with negative power correctly", () => {
      expect(
        testContext.parseDimNum("12.345 * euro^-2 / stuk").toFixed()
      ).to.equal("12.345/€^2/st");
    });
  });

  describe("toLocale", () => {
    it("should print with comma for nl-NL", () => {
      expect(
        DimNum.dimless(new BigNumber("12.345")).toLocale(2, "nl-NL")
      ).to.equal("12,35");
    });

    it("should print dimensioned number correctly for nl-NL", () => {
      expect(
        testContext.parseDimNum("12.345 * euro^2 / stuk").toLocale(2, "nl-NL")
      ).to.equal("12,35 €^2/st");
    });
  });

  describe("print", () => {
    it("should print a dimensionless number", () => {
      expect(DimNum.dimless(new BigNumber("12.345")).print()).to.equal(
        "12.345"
      );
    });

    it("should print a simple dimensioned number", () => {
      expect(DimNum.fromUnit(testContext.getUnit("euro")).print()).to.equal(
        "euro"
      );
    });

    it("should print a complex dimensioned number", () => {
      expect(
        new DimNum(
          new BigNumber("12.345"),
          testContext.getUnit("euro").expt(2).mult(testContext.getUnit("stuk"))
        ).print()
      ).to.equal("12.345*euro^2*stuk");
    });

    it("should print an arbitrary dimensioned number", () => {
      fc.assert(
        fc.property(arbitraryDimNum(), (num) => {
          fc.pre(num.magnitude.isFinite());

          if (!num.equals(testContext.parseDimNum(num.print()))) {
            console.log("huh");
          }
          expect(num.equals(testContext.parseDimNum(num.print()))).to.be.true;
        })
      );
    });
  });
});
