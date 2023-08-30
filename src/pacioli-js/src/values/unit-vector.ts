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

import { SIUnit, UOM } from "uom-ts";
import { IndexSet } from "./index-set";
import { ToText } from "../value";

export class UnitVector implements ToText {
  constructor(
    public name: string,
    public indexSet: IndexSet,
    public elements: SIUnit[]
  ) {}

  static fromMap(
    name: string,
    indexSet: IndexSet,
    elements: Map<string, SIUnit>
  ) {
    const units: SIUnit[] = [];
    indexSet.items.forEach((element) => {
      units.push(elements.get(element) || UOM.ONE);
    });
    return new UnitVector(name, indexSet, units);
  }

  public toText(): string {
    return this.name;
  }

  public get(position: number): SIUnit {
    return this.elements[position];
  }
}
