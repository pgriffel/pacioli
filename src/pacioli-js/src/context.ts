/* Runtime Support for the Pacioli language
 *
 * Copyright (c) 2023 Paul Griffioen
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

import { Context, Context as UOMContext, siDef, SIUnit, DimNum } from "uom-ts";
import { IndexSet } from "./values/index-set";
import { UnitVector } from "./values/unit-vector";

/**
 * Static information for the matrix shape.
 *
 * Contains base units, base unit vectors and index sets.
 *
 */
export class PacioliContext {
  public static si() {
    return new PacioliContext(Context.fromDef(siDef), new Map(), new Map());
  }

  public static empty() {
    return new PacioliContext(UOMContext.empty(), new Map(), new Map());
  }

  public static fromUOMContext(context: UOMContext) {
    return new PacioliContext(context, new Map(), new Map());
  }

  constructor(
    public unitContext: UOMContext,
    public unitVectors: Map<string, UnitVector> = new Map(),
    public indexSets: Map<string, IndexSet> = new Map()
  ) {}

  public addBase(name: string, symbol: string, definition?: DimNum) {
    this.unitContext.addBase(name, symbol, definition);
  }

  public getUnit(prefix: string, name: string): SIUnit | undefined {
    return this.unitContext.lookupScaledUnit(prefix, name);
  }

  public addIndexSet(indexSet: IndexSet): PacioliContext {
    this.indexSets.set(indexSet.id, indexSet);
    return this;
  }

  public findIndexSet(id: string): IndexSet | undefined {
    return this.indexSets.get(id);
  }

  public getIndexSets(): IndexSet[] {
    return Array.from(this.indexSets.values());
  }

  public addUnitVectorFromJSON(
    name: string,
    index: string,
    units: any[]
  ): UnitVector {
    const indexSet = this.findIndexSet(index);
    if (indexSet) {
      const unitMap = new Map<string, SIUnit>();
      units.forEach((item) => {
        unitMap.set(item.name, this.unitContext.parseSIUnit(item.unit));
      });
      const vector = UnitVector.fromMap(name, indexSet, unitMap);
      this.addUnitVector(vector);
      return vector;
    } else {
      throw new Error(
        "Index set " + index + " unknown when creating unit vector " + name
      );
    }
  }

  public addUnitVector(vector: UnitVector): PacioliContext {
    this.unitVectors.set(vector.name, vector);
    return this;
  }

  public findUnitVector(name: string): UnitVector | undefined {
    return this.unitVectors.get(name);
  }
}
