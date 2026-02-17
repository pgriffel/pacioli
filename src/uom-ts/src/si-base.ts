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

import { Prefix } from "./prefix";
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
export class SIBase implements UOMBase {
  readonly name: string;

  static from(base: string, symbol: string): SIBase {
    return new SIBase(Prefix.empty, base, symbol);
  }

  public withPrefix(prefix: Prefix): SIBase {
    return new SIBase(prefix, this.base, this.symbol);
  }

  /**
   * General constructor. Use SIBase.fromParts instead.
   *
   * @param name A unique name for the base
   * @param symbol A unique symbol for the base
   */
  constructor(
    public readonly prefix: Prefix,
    public readonly base: string,
    public readonly symbol: string
  ) {
    this.name = this.prefix.isEmpty() ? base : this.prefix.name + ":" + base;
  }

  public isPrimitive(): boolean {
    return this.prefix.isEmpty();
  }

  /**
   * Human readable form of a term. Used in the UOM toText method.
   *
   * @returns A text form of the unit.
   */
  toText() {
    return this.prefix.symbol + this.symbol;
  }
}
