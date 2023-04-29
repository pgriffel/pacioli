import { expect } from "chai";
import * as fc from "fast-check";
import { DimNum } from "../src/dim-num";
import { si } from "../src/si";
import { UOM } from "../src/uom";
import { Context, Definition } from "./../src/context";
import { arbitraryBase, testContext } from "./base.spec";
import { arbitraryDimNum } from "./dim-num.spec";
import { arbitraryUOM } from "./uom.spec";
import { SIBase } from "../src/si-base";
import { Prefix } from "../src/prefix";

/**
 * Notes:
 * - The test script in package.json contains the mocha timeout: mocha --timeout 60000
 * - Run 1 test with it.only (chai feature)
 * - To rerun:
 *   1) Use it.only to single out the test
 *   2) Paste the { seed: 1442240156, path: "149448", endOnFailure: true } as second
 *      arg of the fc.assert of the failing test.
 *   3) call npm run test as always
 * - Where to put the following settings
 */
fc.configureGlobal({
  numRuns: 10000,
  verbose: true,
  // maxSkipsPerRun: 100000,
  // interruptAfterTimeLimit: 60000,
  // skipAllAfterTimeLimit: 60000
});

describe("context", () => {
  describe("flatten", () => {
    it("should do nothing for a simple unit and no equation", () => {
      fc.assert(
        fc.property(arbitraryBase(), (base) => {
          // Given a definition
          const def: Definition = {
            prefixes: [],
            bases: [{ name: base.getName(), symbol: base.getSymbol() }],
            equations: [],
          };

          // When a context is created from the definition
          const context = Context.empty().loadDef(def);

          // When the unit for the base is created
          const unit = context.getUnit(base.getName());

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

          const base = SIBase.fromParts(Prefix.empty, name, name);

          // let bases = testContext.getBases();
          // bases.push(base);

          // When a context is created from the definition
          // const context = new Context(testContext.getPrefixes(), bases, [[name, dimNum]])
          const context = new Context([], [base], [[name, dimNum]]).loadDef(
            testContext.genDef()
          );

          // When the unit for the base is created
          const unit = context.getUnit(base.getName());

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
            .bases()
            .map((term) =>
              testContext.flatten(UOM.fromBase(term).expt(unit.power(term)))
            )
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
        si.conversionFactor(si.getUnit("milli:gram"), si.getUnit("gram"))
      ).to.equal(1 / 1000);
    });

    it("should give 1/1000 for milli to no prefix alt", () => {
      expect(
        si.conversionFactor(
          si.getUnit("milli:gram"),
          si.getScaledUnit("", "gram")
        )
      ).to.equal(1 / 1000);
    });

    it("should give 1/1000 for milli:cent to euro", () => {
      const context = Context.fromDef({
        prefixes: [{ name: "milli", power: -3, symbol: "m" }],
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
            rhs: { powers: [{ base: { prefix: "milli", name: "cent" } }] },
          },
        ],
      });

      expect(
        context.conversionFactor(
          context.getUnit("milli:cent"),
          context.getScaledUnit("", "milli:cent")
        )
      ).to.equal(1 / 1000);
    });
  });
});
