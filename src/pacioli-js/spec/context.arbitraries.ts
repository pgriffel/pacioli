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

import * as fc from "fast-check";
import { SIBase, Prefix, Context as UOMContext, UOM } from "uom-ts";
import { MatrixDimension } from "../src/values/matrix-dimension";
import { PacioliContext } from "./../src/context";
import { pickOne } from "./util";
import { MatrixShape } from "../src/values/matrix-shape";

export function arbitraryUOM(
  context: PacioliContext
): fc.Arbitrary<UOM<SIBase>> {
  return fc
    .array(arbitraryBase(context.unitContext))
    .map((terms) =>
      terms.map(UOM.fromBase).reduce((x, y) => x.mult(y), UOM.ONE)
    );
}

export function arbitraryPrefix(context: UOMContext): fc.Arbitrary<Prefix> {
  return pickOne(fc.constant(context.getPrefixes()));
}

export function arbitraryBase(context: UOMContext): fc.Arbitrary<SIBase> {
  return pickOne(fc.constant(context.getBases()));
}

export function arbitraryScalarShape(
  context: PacioliContext
): fc.Arbitrary<MatrixShape> {
  return arbitraryUOM(context).map((unit) => MatrixShape.scalar(unit));
}

export function arbitraryShape(
  context: PacioliContext
): fc.Arbitrary<MatrixShape> {
  return fc
    .record({
      row: fc.array(pickOne(fc.constant(context.getIndexSets()))),
      column: fc.array(pickOne(fc.constant(context.getIndexSets()))),
    })
    .chain((indexSets) => {
      return fc
        .record({
          multiplier: arbitraryUOM(context),
          base: arbitraryBase(context.unitContext),
        })
        .map(
          (record) =>
            new MatrixShape(
              record.multiplier,
              new MatrixDimension(indexSets.row),
              UOM.ONE,
              new MatrixDimension(indexSets.column),
              UOM.ONE
            )
        );
    });
}
