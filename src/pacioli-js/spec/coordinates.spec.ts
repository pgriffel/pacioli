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
import {
  arbitraryIndexSet,
  arbitraryIndexSetElement,
} from "./index-set.spec.js";
import { arrayEqual } from "./util";
import { UOM } from "uom-ts";
import { Coordinates } from "../src/values/coordinates.js";
import { IndexSet } from "../src/values/index-set.js";

/**
 * A fast check Arbitrary for the {@link Coordinates} class.
 *
 * @returns An arbitray Coordinates instance
 */
export function arbitraryCoordinates(): fc.Arbitrary<Coordinates> {
  return fc
    .array(arbitraryIndexSet())
    .chain((indexSets) =>
      fc
        .integer({
          min: 0,
          max:
            indexSets.map((set) => set.size()).reduce((x, y) => x * y, 1) - 1,
        })
        .map((n) => Coordinates.fromIndex(indexSets, n))
    );
}

function arbitraryCoordinatesParams(): fc.Arbitrary<[IndexSet[], string[]]> {
  return fc
    .array(
      arbitraryIndexSet().chain((set) =>
        fc.tuple(fc.constant(set), arbitraryIndexSetElement(set))
      )
    )
    .map((pairs) => [pairs.map(([x, _]) => x), pairs.map(([_, y]) => y)]);
}

describe("Coordinates", () => {
  describe("equals", () => {
    it("should be true for Coordinates constructed with the same arguments", () => {
      fc.assert(
        fc.property(arbitraryCoordinatesParams(), ([indexSets, elements]) => {
          // when a dimensioned number is created with dimless
          const coordinatesA = new Coordinates(elements, indexSets);
          const coordinatesB = new Coordinates(elements, indexSets);

          // then
          expect(coordinatesA.equals(coordinatesB)).toEqual(true);
        })
      );
    });

    it("should be true iff the names and the index set arrays are equal", () => {
      fc.assert(
        fc.property(
          fc.tuple(arbitraryCoordinates(), arbitraryCoordinates()),
          ([coordinatesA, coordinatesB]) => {
            // then
            if (coordinatesA.equals(coordinatesB)) {
              expect(coordinatesA.names).toEqual(coordinatesB.names);
              expect(coordinatesA.indexSets).toEqual(coordinatesB.indexSets);
            } else {
              expect(
                arrayEqual(coordinatesA.names, coordinatesB.names) &&
                  arrayEqual(coordinatesA.indexSets, coordinatesB.indexSets)
              ).toBeFalse;
              // expect(coordinatesA.indexSets).not.to.deep.equal(coordinatesB.indexSets)
            }
          }
        )
      );
    });
  });

  describe("position", () => {
    it("should give the same coordinates when passed to Coordinates.fromIndex", () => {
      fc.assert(
        fc.property(arbitraryCoordinatesParams(), ([indexSets, elements]) => {
          // when a dimensioned number is created with dimless
          const coordinates = new Coordinates(elements, indexSets);

          const fromPostion = Coordinates.fromIndex(
            indexSets,
            coordinates.position()
          );

          // console.log('yo', coordinates, fromPostion)

          // and the factor should be the given factor
          expect(coordinates.equals(fromPostion)).toEqual(true);
        })
      );
    });
  });

  describe("order", () => {
    it("should equal the length of the coordinates names", () => {
      fc.assert(
        fc.property(arbitraryCoordinatesParams(), ([indexSets, elements]) => {
          // when a dimensioned number is created with dimless
          const coordinates = new Coordinates(elements, indexSets);

          // and the factor should be the given factor
          expect(coordinates.order()).toEqual(elements.length);
        })
      );
    });
  });

  describe("project", () => {
    it("should create coordinates with correctly projected dimensions", () => {
      fc.assert(
        fc.property(
          arbitraryCoordinatesParams().chain(([indexSets, elements]) =>
            fc.tuple(
              fc.constant(indexSets),
              fc.constant(elements),
              fc.array(fc.integer({ min: 0, max: indexSets.length }))
            )
          ),
          ([indexSets, elements, indices]) => {
            // Given some coordinates from some index sets and some elements
            const coordinates = new Coordinates(elements, indexSets);

            // When the coordinates is project for some indices
            const projected = coordinates.project(indices);

            // Then the names and index sets equal the projected names and index sets
            for (let i = 0; i < indices.length; i++) {
              expect(projected.names[i]).toEqual(elements[indices[i]]);
              expect(projected.indexSets[i]).toEqual(indexSets[indices[i]]);
            }
          }
        )
      );
    });
  });

  describe("toText", () => {
    it("should create the correct printed representation", () => {
      fc.assert(
        fc.property(arbitraryCoordinatesParams(), ([indexSets, elements]) => {
          // Given some coordinates from some index sets and some elements
          const coordinates = new Coordinates(elements, indexSets);

          const text = coordinates.toText();

          if (elements.length === 0) {
            expect(text).toEqual("_");
          } else {
            const parts: string[] = [];
            for (let i = 0; i < elements.length; i++) {
              parts.push(indexSets[i].name + "@" + elements[i]);
            }

            expect(parts.reduce((x, y) => x + "%" + y)).toEqual(text);
          }
        })
      );
    });
  });

  describe("shortText", () => {
    it("should create the correct short printed representation", () => {
      fc.assert(
        fc.property(arbitraryCoordinatesParams(), ([indexSets, elements]) => {
          // Given some coordinates from some index sets and some elements
          const coordinates = new Coordinates(elements, indexSets);

          const text = coordinates.shortText();

          if (elements.length === 0) {
            expect(text).toEqual("_");
          } else {
            expect(elements.reduce((x, y) => x + "%" + y)).toEqual(text);
          }
        })
      );
    });
  });

  describe("size", () => {
    it("should equal the product of the index set sizes", () => {
      fc.assert(
        fc.property(arbitraryCoordinatesParams(), ([indexSets, elements]) => {
          // Given some coordinates from some index sets and some elements
          const coordinates = new Coordinates(elements, indexSets);

          expect(
            indexSets.map((set) => set.size()).reduce((x, y) => x * y, 1)
          ).toEqual(coordinates.size());
        })
      );
    });
  });

  describe("shape", () => {
    it("should create a shape that is compatible with the coordinates", () => {
      fc.assert(
        fc.property(arbitraryCoordinatesParams(), ([indexSets, elements]) => {
          // Given some coordinates from some index sets and some elements
          const coordinates = new Coordinates(elements, indexSets);

          // When a shape is contructed from the coordinates
          const shape = coordinates.shape();

          // Then the shape elements should be correct
          expect(shape.multiplier).toEqual(UOM.ONE);
          expect(
            arrayEqual(shape.rowDimension.indexSets, indexSets)
          ).toBeTrue();
          expect(shape.rowUnit).toEqual(UOM.ONE);
          expect(arrayEqual(shape.columnDimension.indexSets, [])).toBeTrue();
          expect(shape.columnUnit).toEqual(UOM.ONE);
        })
      );
    });
  });
});
