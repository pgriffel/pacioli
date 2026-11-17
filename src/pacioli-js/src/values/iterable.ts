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

import type { PacioliValue } from "./pacioli-value";

export abstract class PacioliIterable implements Iterable<PacioliValue> {
  public abstract readonly kind: string;
  public abstract readonly items: PacioliValue[];

  [Symbol.iterator](): Iterator<PacioliValue> {
    return this.items[Symbol.iterator]();
  }

  // Lightweight getter (no function parentheses needed when reading)
  get length(): number {
    return this.items.length;
  }

  // // Ergonomic element access (supports negative indices like -1)
  // at(index: number): PacioliValue {
  //   return this.items.at(index);
  // }

  // Fast direct index access
  get(index: number): PacioliValue {
    return this.items[index];
  }

  // Generic helper when converting to arbitrary JS types (numbers, booleans, etc.)
  map<T>(fn: (item: PacioliValue, index: number) => T): T[] {
    return this.items.map((item, i) => fn(item, i));
  }
}
