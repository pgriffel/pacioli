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


/**
 * A scale for a unit of measurement. Typical prefixes are kilo, mega, milli, etc.
 * 
 * The scale factors are powers of ten.
 */
export class Prefix {

  constructor(
    public power: number,
    public name: string,
    public symbol: string
  ) {
  }

  /**
   * Are two prefixes equal? Compares the prefix name.
   * 
   * @param other The prefix to compare with 
   * @returns True iff the prefixes are equal
   */
  public equals(other: Prefix) {
    return this.power === other.power;
  }

  /**
   * The identity prefix. Scaling a unit with this prefix does not 
   * change the unit.
   */
  static empty: Prefix = new Prefix(0, "", "");
}

//export const idPrefix: Prefix = new Prefix(0, "", "");
