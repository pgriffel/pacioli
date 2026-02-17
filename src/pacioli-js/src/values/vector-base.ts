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

import type { SIUnit, UOMBase } from "uom-ts";
import type { UnitVector } from "./unit-vector";
import type { ToText } from "./pacioli-value";

export class VectorBase implements UOMBase, ToText {
  public readonly name;

  constructor(
    public readonly vector: UnitVector,
    public readonly position: number,
    public readonly baseName: string,
  ) {
    this.name = baseName + ":" + position.toString();
  }

  getName(): string {
    return this.name;
  }

  public toText(): string {
    return this.name;
  }

  public get(position: number): SIUnit {
    return this.vector.get(position);
  }

  public shift(delta: number): VectorBase {
    return new VectorBase(this.vector, this.position + delta, this.baseName);
  }
}
