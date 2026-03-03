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

import type { UOMBase } from "uom-ts";

export interface PacioliBase extends UOMBase {
  readonly isVar: boolean;
}

export class SIBaseType implements PacioliBase {
  readonly kind = "sibasetype";
  readonly isVar = false;
  readonly name: string;

  constructor(
    public readonly prefix: string,
    public readonly base: string,
  ) {
    if (typeof prefix !== "string") {
      throw new Error("prefix error");
    }
    if (base.includes(":")) {
      throw new Error(`Double colon: prefix=${prefix} name=${base}`);
    }
    this.name = prefix.length === 0 ? base : prefix + ":" + base;
  }

  public toText(): string {
    return this.prefix === "" ? this.name : this.prefix + ":" + this.name;
  }
}

export class VectorBaseType implements PacioliBase {
  readonly kind = "vectorbasetype";
  readonly isVar = false;

  constructor(
    public readonly name: string,
    public readonly position: number,
  ) {}

  public toText(): string {
    return this.name + "$" + this.position.toString();
  }

  public shift(delta: number): VectorBaseType {
    return new VectorBaseType(this.name, this.position + delta);
  }
}
