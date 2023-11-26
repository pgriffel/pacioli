/* Units of measurement for the Pacioli language
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

import BigNumber from "bignumber.js";
import { SIUnit } from "./context";
import { UOM } from "./uom";

/**
 * A dimensioned number pairs a magnitude with a unit of measurement. It provides
 * a safe sum operator that throws an error when numbers with different units
 * are summed.
 */
export class DimNum {
  /**
   * The multiplicative unit
   */
  public static ONE = new DimNum(new BigNumber(1), UOM.ONE);

  /**
   * Constructs a dimensionless number.
   *
   * @param factor The number
   * @returns A dimensioned number with unit UOM.ONE
   */
  static dimless(factor: BigNumber): DimNum {
    return new DimNum(factor, UOM.ONE);
  }

  /**
   * Constructs a dimensioned number with factor 1.
   *
   * @param unit The number's unit
   * @returns The dimensioned number
   */
  static fromUnit(unit: SIUnit): DimNum {
    return new DimNum(new BigNumber(1), unit);
  }

  static fromNumber(magnitude: number, unit: SIUnit = UOM.ONE): DimNum {
    return new DimNum(new BigNumber(magnitude), unit);
  }

  static fromString(magnitude: string, unit: SIUnit = UOM.ONE): DimNum {
    return new DimNum(new BigNumber(magnitude), unit);
  }

  public withUnit(unit: SIUnit): DimNum {
    return new DimNum(this.magnitude, unit);
  }

  public withMagnitude(magnitude: BigNumber): DimNum {
    return new DimNum(magnitude, this.unit);
  }

  constructor(public magnitude: BigNumber, public unit: SIUnit) {}

  /**
   * Are two dimensioned numbers equal? Compares the factors and the units.
   *
   * @param other The dimensioned number to compare with
   * @returns True iff the factors and the numbers are equal
   */
  equals(other: DimNum): boolean {
    return (
      this.magnitude.comparedTo(other.magnitude) === 0 &&
      this.unit.equals(other.unit)
    );
  }

  /**
   * Sums two dimensioned numbers. Throws an error if the units are not equal.
   *
   * Does NOT do automatic conversion.
   *
   * @param other The dimensioned number to add
   * @returns The sum of the two numbers.
   */
  public sum(other: DimNum): DimNum {
    if (!this.unit.equals(other.unit)) {
      throw new Error(
        "Cannot sum " +
          this.toText() +
          " and " +
          other.toText() +
          " because the units differ"
      );
    }
    return new DimNum(this.magnitude.plus(other.magnitude), this.unit);
  }

  /**
   * Scales a dimensioned number. Multiplies the magnitude with
   * a factor and leaves the unit unchanged.
   *
   * @param factor The number to scale with
   * @returns The scaled dimensioned number
   */
  scale(factor: BigNumber): DimNum {
    return new DimNum(this.magnitude.multipliedBy(factor), this.unit);
  }

  /**
   * Multiplies two dimensioned numbers.
   *
   * @param other The dimensioned number to multiply
   * @returns The product of the two numbers
   */
  mult(other: DimNum): DimNum {
    return new DimNum(
      this.magnitude.multipliedBy(other.magnitude),
      this.unit.mult(other.unit)
    );
  }

  /**
   * Raises a dimensioned number to a power.
   *
   * @param power The power
   * @returns The new dimensioned number.
   */
  expt(power: number): DimNum {
    return new DimNum(
      this.magnitude.exponentiatedBy(power),
      this.unit.expt(power)
    );
  }

  /**
   * The multiplicative inverse of a dimensioned number.
   *
   * Shorthand for expt(-1)
   *
   * @returns The reciprocal
   */
  reciprocal(): DimNum {
    return this.expt(-1);
  }

  /**
   * Divides two dimensioned numbers.
   *
   * @param other The dimensioned number to divide by
   * @returns The division of the two numbers
   */
  div(other: DimNum): DimNum {
    return this.mult(other.reciprocal());
  }

  /**
   * The multiplicative inverse of a dimensioned number.
   *
   * Shorthand for expt(-1)
   *
   * @returns The reciprocal
   */
  round(): DimNum {
    return new DimNum(
      this.magnitude.integerValue(BigNumber.ROUND_HALF_CEIL),
      this.unit
    );
  }

  /**
   * Does the dimensioned number have a unit that is not equal to the
   * identity unit?
   *
   * @returns True iff the number has the identity unit
   */
  isDimensionless(): boolean {
    return this.unit.isDimensionless();
  }

  /**
   * A parsable form of the dimensioned number.
   *
   * @returns The text form
   */
  print(): string {
    const magnitudeText = this.magnitude.toFixed();
    const unitText = this.unit.fold(
      (base, power) => (power === 1 ? base.name : `${base.name}^${power}`),
      (x, y) => x + "*" + y,
      ""
    );

    if (unitText.length === 0) {
      return magnitudeText;
    }
    if (magnitudeText === "1") {
      return unitText;
    }

    return magnitudeText + "*" + unitText;
  }

  /**
   * A human readable form of the dimensioned number.
   *
   * This form cannot be parsed
   *
   * @returns The text form
   */
  toText(): string {
    const magnitudeText = this.magnitude.toString();
    const unitText = this.unit.toText();
    return unitText.length === 0
      ? magnitudeText
      : magnitudeText + (unitText[0] === "/" ? "" : "*") + unitText;
  }

  /**
   * A human readable form of the dimensioned number.
   *
   * This form cannot be parsed
   *
   * @returns The text form
   */
  toFixed(n?: number): string {
    const unitText = this.unit.toText();
    // Why does the @types/bignumber.js type for toFixed not
    // have significantDigits?: number as first argument?
    return unitText.length === 0
      ? this.magnitude.toFixed(n!)
      : this.magnitude.toFixed(n!) +
          (unitText[0] === "/" ? "" : " ") +
          unitText;
  }

  /**
   * A human readable form of the dimensioned number.
   *
   * This form cannot be parsed
   *
   * @returns The text form
   */
  toLocale(decimals: number, locales: Intl.LocalesArgument): string {
    // Hack to get decimal separator
    const num = 1.1;
    const separator = num.toLocaleString(locales)[1];
    const unitText = this.unit.toText();

    return (
      this.magnitude.toFixed(decimals).replace(".", separator) +
      (unitText === "" ? "" : " " + unitText)
    );
  }

  /**
   * A human readable form of the dimensioned number.
   *
   * This form cannot be parsed
   *
   * @returns The text form
   */
  toPrecision(n?: number): string {
    const unitText = this.unit.toText();
    // Why does the @types/bignumber.js type for toPrecision not
    // have significantDigits?: number as first argument?
    return unitText.length === 0
      ? this.magnitude.toPrecision(n!)
      : this.magnitude.toPrecision(n!) +
          (unitText[0] === "/" ? "" : "*") +
          this.unit.toText();
  }
}
