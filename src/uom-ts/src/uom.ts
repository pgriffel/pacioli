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

import { UOMBase } from "./uom-base";


/**
 * Class UOM<T> implements a unit of measurement over bases of type T.
 * 
 * Uses the convention to name scaled units with a prefix and a 
 * unit name separated by a colon. So unit 'kilo:metre' is a scaled 
 * variant of unit 'metre'
 */
export class UOM<T extends UOMBase> {

  /**
   * A unit of measurement is the product of a number of terms. A term
   * is a base with a prefix raised to some power.
   * 
   * Terms are stored in a map indexed by the term's name for efficient lookup.
   */
  termMap: Map<string, { base: T, power: number }>;


  /**
   * The identity unit
   */
  public static ONE: UOM<any> = new UOM(new Map());


  /**
   * Constructs a unit from a base. The unit has only one term, which
   * has the given base and power 1.
   * 
   * @param base A base
   * @returns A unit with the single term
   */
  static fromBase<T extends UOMBase>(base: T): UOM<T> {
    return new UOM(new Map([[base.getName(), { base: base, power: 1 }]]));
  }


  /**
   * Constructor for units of measurement. For internal use. Use one
   * of the static constructors instead of this one.
   * 
   * @param terms A term map
   */
  constructor(terms: Map<string, { base: T, power: number }>) {
    // Ensure that UOM instances never contain a zero power. This
    // makes the implementation of some other functions easier.
    this.termMap = new Map();
    for (const term of terms.values()) {
      if (term.power !== 0) {
        this.termMap.set(term.base.getName(), term);
      }
    }
  }


  /**
   * Finds the power for the given term.
   * 
   * @param term A term. Does not have to be member of terms().
   * @returns The power for the given term
   */
  public power(term: T): number {
    return this.termMap.get(term.getName())?.power || 0;
  }


  /**
   * The bases with non-zero power in this unit.
   * 
   * @returns An array of terms 
   */
  public bases(): T[] {
    return Array.from(this.termMap.values()).map(x => x.base);
  }


  /**
   * Are two units equal?
   * 
   * @param other The unit to compare with 
   * @returns True iff the units are equal
   */
  equals(other: UOM<T>): boolean {
    for (const term of this.termMap.values()) {
      if (term.power !== other.power(term.base)) {
        return false
      }
    }
    for (const term of other.termMap.values()) {
      if (term.power !== this.power(term.base)) {
        return false
      }
    }
    return true;
  }


  /**
   * Multiply this unit with another unit.
   * 
   * @param other The unit to multiply with
   * @returns The product of the two units
   */
  mult(other: UOM<T>): UOM<T> {
    var result = new Map<string, { base: T, power: number }>();
    for (const term of this.termMap.values()) {
      result.set(term.base.getName(), term);
    }
    for (const term of other.termMap.values()) {
      result.set(term.base.getName(), { base: term.base, power: term.power + this.power(term.base) });
    }
    return new UOM(result);
  }


  /**
   * Raises a unit to a power.
   * 
   * @param power The power
   * @returns The new unit.
   */
  expt(power: number): UOM<T> {
    var result = new Map<string, { base: T, power: number }>();
    for (const term of this.termMap.values()) {
      result.set(term.base.getName(), { base: term.base, power: term.power * power });
    }
    return new UOM(result);
  }


  /**
   * The multiplicative inverse of a unit. 
   * 
   * Shorthand for expt(-1)
   * 
   * @returns The reciprocal
   */
  reciprocal(): UOM<T> {
    return this.expt(-1);
  }


  /**
   * Divides two units.
   * 
   * @param other The unit to divide by
   * @returns The division of the two units
   */
  div(other: UOM<T>): UOM<T> {
    return this.mult(other.reciprocal());
  }


  /**
   * Is the unit equal to the identity unit?
   * 
   * @returns True iff the unit is the identity unit
   */
  isDimensionless(): boolean {
    // This assumes no zero powers exist.
    return this.termMap.size === 0;
  }


  /**
   * A human readable form of the unit.
   * 
   * This form cannot be parsed.
   * 
   * @returns The text form
   */
  toText(): string {
    let text = "";
    let sep = "";
    for (const term of this.termMap.values()) {
      if (term.power > 0) {
        text += sep + term.base.toText() + (term.power === 1 ? "" : "^" + term.power);
        sep = "*"
      }
    }
    sep = "/"
    for (const term of this.termMap.values()) {
      if (term.power < 0) {
        text += sep + term.base.toText() + (term.power === -1 ? "" : "^" + -term.power)
      }
    }
    return text;
  }

  map<U extends UOMBase>(fun: (x: T) => UOM<U>): UOM<U> {
    var result = UOM.ONE;
    for (const term of this.termMap.values()) {
      var base = fun(term.base)
      var powerBase = base; // base instanceof Pacioli.PowerProduct ? base : new Pacioli.PowerProduct(base)
      result = result.mult(powerBase.expt(term.power))
    }
    return result;
  }
}

