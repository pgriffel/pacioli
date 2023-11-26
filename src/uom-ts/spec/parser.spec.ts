import { expect } from "chai";
import { testContext } from "./base.spec";

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
