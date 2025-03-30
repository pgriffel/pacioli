/* Units of measurement for the Pacioli language
 *
 * Copyright (c) 2023-2025 Paul Griffioen
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
 * A term in a unit of measurement. Is a base raised to a power.
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
   * @param base The term's base
   * @param power The term's power
   */
  private constructor(public readonly base: T, public readonly power: number) {}

  /**
   * The term's name is the name of the base.
   *
   * @returns Name of the term's base
   */
  getName(): string {
    return this.base.name;
  }

  /**
   * Human readable form of a term. Used in the UOM toText method.
   *
   * @returns A text form of the unit.
   */
  toText() {
    return this.base.toText() + (this.power === 1 ? "" : "^" + this.power);
  }
}
