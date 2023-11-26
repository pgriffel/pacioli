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
 * Implementation of an UOMBase for the SI system.
 *
 * The identity prefix handles a unit without a prefix.
 *
 * Uses the convention to name scaled units with a prefix and a
 * unit name separated by a colon. So unit 'kilo:metre' is a scaled
 * variant of unit 'metre'
 */
export class UOMTerm<T extends UOMBase> {
  /**
   * Constructs an SITerm instance.
   *
   * @param prefix
   * @param base
   * @returns
   */
  static fromBase<T extends UOMBase>(base: T): UOMTerm<T> {
    return new UOMTerm(base, 1);
  }

  public withPower(power: number): UOMTerm<T> {
    return new UOMTerm(this.base, power);
  }

  /**
   * General constructor.
   *
   * @param prefix A prefix
   * @param base A base
   */
  private constructor(
    // public readonly prefix: Prefix,
    public readonly base: T,
    public readonly power: number
  ) {}

  getName(): string {
    return this.base.name;
    // return this.prefix.name.length === 0
    //   ? this.base.name
    //   : this.prefix.name + ":" + this.base.name;
  }

  /**
   * Same as getName() but omits the prefix.
   *
   * @returns
   */
  // getBaseName(): string {
  //   return this.base.name;
  // }

  // getSymbol(): string {
  //   return this.prefix.symbol + this.base.symbol;
  // }

  /**
   * Human readable form of a term. Used in the UOM toText method.
   *
   * @returns A text form of the unit.
   */
  toText() {
    return this.base.toText() + (this.power === 1 ? "" : "^" + this.power);
  }
}
