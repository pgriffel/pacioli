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

  /**
   * Constructs an SIBase instance.
   * 
   * @param prefix 
   * @param base 
   * @returns 
   */
  static fromParts(prefix: Prefix, name: string, symbol: string) {
    return new SIBase(prefix, name, symbol, prefix.name.length === 0 ? name : prefix.name + ":" + name);
  }

  static fromBase(name: string, symbol: string): SIBase {
    return new SIBase(Prefix.empty, name, symbol, name);
  }

  public withPrefix(prefix: Prefix): SIBase {
    return SIBase.fromParts(prefix, this.name, this.symbol);
  }

  /**
   * General constructor. Use SIBase.fromParts instead.
   * 
   * @param prefix A prefix
   * @param base A base
   * @param name A unique name for the base
   */
  private constructor(
    public prefix: Prefix,
    private name: string,
    private symbol: string,
    private fullName: string
  ) { }

  getName(): string {
    return this.fullName;
  }

  /**
   * Same as getName() but omits the prefix.
   * 
   * @returns 
   */
  getBaseName(): string {
    return this.name;
  }

  getSymbol(): string {
    return this.prefix.symbol + this.symbol;
  }

  /**
   * Human readable form of a term. Used in the UOM toText method. 
   * 
   * @returns A text form of the unit.
   */
  toText() {
    return this.getSymbol();
  }
}
