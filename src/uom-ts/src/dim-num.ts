/* Runtime Support for the Pacioli language
 *
 * Copyright (c) 2022 Paul Griffioen
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
  public static ONE = new DimNum(1, UOM.ONE);


  /**
   * Constructs a dimensionless number. 
   * 
   * @param factor The number
   * @returns A dimensioned number with unit UOM.ONE
   */
  static dimless(factor: number): DimNum {
    return new DimNum(factor, UOM.ONE);
  }


  /**
   * Constructs a dimensioned number with factor 1.
   * 
   * @param unit The number's unit 
   * @returns The dimensioned number
   */
  static fromUnit(unit: SIUnit): DimNum {
    return new DimNum(1, unit);
  }


  constructor(public factor: number, public unit: SIUnit) {
  }


  /**
   * Are two dimensioned numbers equal? Compares the factors and the units.
   * 
   * @param other The dimensioned number to compare with 
   * @returns True iff the factors and the numbers are equal
   */
  equals(other: DimNum): boolean {
    return this.factor === other.factor && this.unit.equals(other.unit);
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
      throw new Error("Cannot sum " + this.toText() + " and " + other.toText() + " because the units differ")
    }
    return new DimNum(this.factor + other.factor, this.unit);
  }

  /**
   * Scales a dimensioned number. Multiplies the magnitude with
   * a factor and leaves the unit unchanged.
   * 
   * @param factor The number to scale with
   * @returns The scaled dimensioned number
   */
  scale(factor: number): DimNum {
    return new DimNum(this.factor * factor, this.unit);
  }

  /**
   * Multiplies two dimensioned numbers.
   * 
   * @param other The dimensioned number to multiply
   * @returns The product of the two numbers
   */
  mult(other: DimNum): DimNum {
    return new DimNum(this.factor * other.factor, this.unit.mult(other.unit));
  }


  /**
   * Raises a dimensioned number to a power.
   * 
   * @param power The power
   * @returns The new dimensioned number.
   */
  expt(power: number): DimNum {
    return new DimNum(this.factor ** power, this.unit.expt(power));
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
    return new DimNum(Math.round(this.factor), this.unit);
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
   * A human readable form of the dimensioned number.
   * 
   * This form cannot be parsed
   * 
   * @returns The text form
   */
  toText(): string {
    const unitText = this.unit.toText();
    return unitText.length === 0 ? this.factor.toString() : (this.factor.toString() + (unitText[0] === "/" ? "" : "*") + this.unit.toText());
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
    return unitText.length === 0 ? this.factor.toFixed(n) : (this.factor.toFixed(n) + (unitText[0] === "/" ? "" : "*") + this.unit.toText());
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
    return unitText.length === 0 ? this.factor.toPrecision(n) : (this.factor.toPrecision(n) + (unitText[0] === "/" ? "" : "*") + this.unit.toText());
  }
}


