import { expect } from "chai";
import * as fc from "fast-check";
import { SIBase } from "../src/si-base";
import { UOM } from "../src/uom";
import { arbitraryBase } from "./base.spec";
import { arbitrarySIBase } from "./term.spec";
import { Prefix } from "../src/prefix";

/**
 * A fast check Arbitrary for the {@link UOM} class.
 *
 * @returns an arbitray UOM instance
 * @see arbitraryBase
 */
// export function arbitraryUOM(): fc.Arbitrary<UOM<SIBase>> {
//   return fc.array(arbitraryTerm())
//     .map((terms => terms.map(UOM.fromTerm).reduce((x, y) => x.mult(y), UOM.ONE)));
// }
export function arbitraryUOM(): fc.Arbitrary<UOM<SIBase>> {
  return fc
    .array(arbitrarySIBase())
    .map((terms) =>
      terms.map(UOM.fromBase).reduce((x, y) => x.mult(y), UOM.ONE)
    );
}

describe("UOM", () => {
  describe("fromBase", () => {
    it("should create a unit with correct prefix, base and power", () => {
      fc.assert(
        fc.property(arbitraryBase(), (bas) => {
          const base = bas.withPrefix(new Prefix(1, "foo", "foo"));
          // when a unit is created with fromBase
          const uom = UOM.fromBase(
            SIBase.fromParts(base.prefix, base.getBaseName(), base.getSymbol())
          );

          // then the unit should have one term
          const terms = uom.bases();
          expect(terms.length).to.equal(1);

          // and the base, prefix and power should be correct
          const term = terms[0];
          expect(term.getName()).to.equal(base.getName());
          expect(term.getSymbol()).to.equal(base.getSymbol());
          expect(term.prefix).to.equal(base.prefix);

          expect(uom.power(term)).to.equal(1);
        })
      );
    });
  });

  describe("mult", () => {
    it("should correctly multiply two units", () => {
      fc.assert(
        fc.property(arbitraryUOM(), arbitraryUOM(), (uomA, uomB) => {
          // When two units are multipled
          const uom = uomA.mult(uomB);

          // Then the power, base and prefix should be correct for all names from the FIRST unit
          for (const term of uomA.bases()) {
            expect(uom.power(term)).to.equal(
              uomA.power(term) + uomB.power(term)
            );
          }

          // Then the power, base and prefix should be correct for all names from the SECOND unit
          for (const term of uomB.bases()) {
            expect(uom.power(term)).to.equal(
              uomA.power(term) + uomB.power(term)
            );
          }

          // Then the power, base and prefix should be correct for all names from the PRODUCT
          for (const term of uom.bases()) {
            expect(uom.power(term)).to.equal(
              uomA.power(term) + uomB.power(term)
            );
          }
        })
      );
    });
  });

  describe("expt", () => {
    it("should correctly compute a power", () => {
      fc.assert(
        fc.property(arbitraryUOM(), fc.integer(), (uom, power) => {
          // When the exponent of a unit is taken
          const exp = uom.expt(power);

          // Then the power should be multiplied I.
          for (const term of uom.bases()) {
            expect(exp.power(term)).to.equal(power * uom.power(term));
          }

          // Then the power should be multiplied II.
          for (const term of exp.bases()) {
            expect(exp.power(term)).to.equal(power * uom.power(term));
          }

          // From I and II follows that the bases names are the same
          // for uom and exp
        })
      );
    });
  });

  describe("reciprocal", () => {
    it("should correctly take the reciprocal of a unit", () => {
      fc.assert(
        fc.property(arbitraryUOM(), (uom) => {
          // When the exponent of a unit is taken
          const reci = uom.reciprocal();

          // Then the result is the same as an exponent with power -1
          expect(reci.equals(uom.expt(-1))).to.equal(true);
        })
      );
    });
  });

  describe("div", () => {
    it("should correctly divide two units", () => {
      fc.assert(
        fc.property(arbitraryUOM(), arbitraryUOM(), (uomA, uomB) => {
          // When the exponent of a unit is taken
          const div = uomA.div(uomB);

          // Then the result is the same as multiplying with the reciprocal
          expect(div.equals(uomA.mult(uomB.reciprocal()))).to.equal(true);
        })
      );
    });
  });

  describe("equals", () => {
    it("should correctly test equality of two units", () => {
      fc.assert(
        fc.property(arbitraryUOM(), arbitraryUOM(), (uomA, uomB) => {
          let powersEqual = true;

          // const isEqual = uomA.equals(uomB);

          // When equality of powers, prefixes and bases is tested for names from the FIRST unit
          for (const term of uomA.bases()) {
            powersEqual = powersEqual && uomA.power(term) === uomB.power(term);
          }

          // When equality of powers, prefixes and bases is tested for names from the SECOND unit
          for (const term of uomB.bases()) {
            powersEqual = powersEqual && uomA.power(term) === uomB.power(term);
          }

          // Then the power, base and prefix should be correct for all names from the SECOND unit
          expect(uomA.equals(uomB)).to.equal(powersEqual);
        })
      );
    });
  });

  describe("isDimensionless", () => {
    it("should only be true for an empty unit", () => {
      fc.assert(
        fc.property(arbitraryUOM(), (uom) => {
          let allZero = true;
          uom.bases().forEach((term) => {
            allZero = allZero && uom.power(term) === 0;
          });
          expect(uom.isDimensionless()).to.equal(allZero);

          // This stronger condition holds for the current implementation
          expect(uom.isDimensionless()).to.equal(uom.bases().length === 0);
        })
      );
    });
  });
});
