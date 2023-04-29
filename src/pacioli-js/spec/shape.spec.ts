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
import { arbitraryShape } from "./context.arbitraries";
import { testContext } from "./test-context";

/**
 * A fast check Arbitrary for the {@link Shape} class.
 *
 * @returns an arbitray Shape instance
 */
// export function arbitraryShape(): fc.Arbitrary<Shape> {
//   return arbitraryUOM().map((unit) => new Shape(unit));
// }

describe("Shape", () => {
  describe("rowOrder", () => {
    it("should create a shape that is compatible with the coordinates", () => {
      fc.assert(
        fc.property(arbitraryShape(testContext), (shape) => {
          expect(shape).toEqual(shape);
          // console.log(shape)
        })
      );
    });
  });

  describe("kron", () => {
    it("should create a shape that is the kronecker product", () => {
      fc.assert(
        fc.property(
          arbitraryShape(testContext),
          arbitraryShape(testContext),
          (shape, other) => {
            // Given two arbitrary shapes called shape and other

            // When the kronecker product is taken
            const kronecker = shape.kron(other);

            // Then the row dimensions should be concatenated correctly
            expect(kronecker.rowOrder()).toEqual(
              shape.rowOrder() + other.rowOrder()
            );
            for (let i = 0; i < kronecker.rowOrder(); i++) {
              const order = shape.rowOrder();
              const picked = i < order ? shape : other;
              const set =
                picked.rowDimension.indexSets[i < order ? i : i - order];
              expect(kronecker.rowDimension.indexSets[i].name === set.name);
              // TODO: units
            }

            // Then the column dimensions should be concatenated correctly
            expect(kronecker.columnOrder()).toEqual(
              shape.columnOrder() + other.columnOrder()
            );
            for (let i = 0; i < kronecker.columnOrder(); i++) {
              const order = shape.columnOrder();
              const picked = i < order ? shape : other;
              const set =
                picked.columnDimension.indexSets[i < order ? i : i - order];
              expect(kronecker.columnDimension.indexSets[i].name === set.name);
            }
          }
        )
      );
    });
  });
});
