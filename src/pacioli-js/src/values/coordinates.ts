/* Runtime Support for the Pacioli language
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

import type { VectorBase } from "./vector-base";
import { SIUnit } from "uom-ts";
import type { IndexSet } from "./index-set";
import { MatrixDimension } from "./matrix-dimension";
import { SIVector } from "./matrix-shape";
import { MatrixShape } from "./matrix-shape";

export class PacioliCoordinates {
  readonly kind = "coordinates";

  public static fromIndex(indexSets: IndexSet[], n: number) {
    const names: string[] = [];
    let pos = n;
    for (let i = indexSets.length - 1; 0 <= i; i--) {
      const l = indexSets[i].items.length;
      names[i] = indexSets[i].items[pos % l];
      pos = Math.floor(pos / l);
    }
    return new PacioliCoordinates(names, indexSets);
  }

  constructor(public names: string[], public indexSets: IndexSet[]) {}

  public position() {
    let position = 0;
    for (let i = 0; i < this.order(); i++) {
      const set = this.indexSets[i];
      position = position * set.items.length + set.position(this.names[i]);
    }
    return position;
  }

  public project(cols: number[]): PacioliCoordinates {
    const names = [];
    const indexSets = [];
    for (let i = 0; i < cols.length; i++) {
      names.push(this.names[cols[i]]);
      indexSets.push(this.indexSets[cols[i]]);
    }
    return new PacioliCoordinates(names, indexSets);
  }

  public toText(): string {
    const n = this.order();
    if (n === 0) {
      return "_";
    } else {
      const names = new Array(n) as string[];
      for (let i = 0; i < n; i++) {
        names[i] = this.indexSets[i].name + "@" + this.names[i];
      }
      return names.reduce(function (x, y) {
        return x + "%" + y;
      });
    }
  }

  public shortText(): string {
    const n = this.order();
    if (n === 0) {
      return "_";
    } else {
      return this.names.reduce(function (x, y) {
        return x + "%" + y;
      });
    }
  }

  public order(): number {
    return this.indexSets.length;
  }

  public equals(other: PacioliCoordinates): boolean {
    const n = this.order();
    if (other.order() !== n) {
      return false;
    }
    for (let i = 0; i < n; i++) {
      if (this.indexSets[i] !== other.indexSets[i]) {
        return false;
      }
      if (this.names[i] !== other.names[i]) {
        return false;
      }
    }
    return true;
  }

  public size() {
    let size = 1;
    for (let i = 0; i < this.order(); i++) {
      const set = this.indexSets[i];
      size = size * set.items.length;
    }
    return size;
  }

  public shape() {
    return new MatrixShape(
      SIUnit.ONE,
      new MatrixDimension(this.indexSets),
      SIVector.ONE,
      MatrixDimension.empty(),
      SIVector.ONE
    );
  }

  public findIndividualUnit(unit: SIVector): SIUnit {
    const names = this.names;

    const vecBaseItem = (base: VectorBase, order: number) => {
      if (base.position === order) {
        const vec = base.vector;
        const pos = names[order];
        return vec.get(base.vector.indexSet.position(pos));
      } else {
        return SIUnit.ONE;
      }
    };

    let newUnit = SIUnit.ONE;
    for (let i = 0; i < this.order(); i++) {
      newUnit = newUnit.mult(
        unit.map((base) => {
          return vecBaseItem(base, i);
        })
      );
    }
    return newUnit;
  }
}
