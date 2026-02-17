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

import * as fc from "fast-check";
import "jasmine";
import { arbitraryShape } from "./context.arbitraries";
import { testContext } from "./test-context";
import { MatrixShape, SIVector } from "../src/values/matrix-shape";
import { SIUnit, UOM } from "uom-ts";
import { MatrixDimension } from "../src/values/matrix-dimension";
import { VectorBase } from "../src/values/vector-base";

describe("Shape", () => {
  describe("rowOrder", () => {
    it("should create a shape that is compatible with the coordinates", () => {
      fc.assert(
        fc.property(arbitraryShape(testContext), (shape) => {
          expect(shape).toEqual(shape);
        }),
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
              shape.rowOrder() + other.rowOrder(),
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
              shape.columnOrder() + other.columnOrder(),
            );
            for (let i = 0; i < kronecker.columnOrder(); i++) {
              const order = shape.columnOrder();
              const picked = i < order ? shape : other;
              const set =
                picked.columnDimension.indexSets[i < order ? i : i - order];
              expect(kronecker.columnDimension.indexSets[i].name === set.name);
            }
          },
        ),
      );
    });
  });

  describe("reorder", () => {
    it("should should change a (1,1) matix into a (2,0) vector", () => {
      const Geom3 = testContext.findIndexSet("Geom3");
      const Geom3Standard = testContext.findUnitVector("Geom3!standard");
      const Person = testContext.findIndexSet("Person");

      if (
        Geom3 === undefined ||
        Geom3Standard === undefined ||
        Person === undefined
      ) {
        console.log(Geom3, Geom3Standard, Person);
        throw new Error("Incorrect test setup!!!");
      }

      const base = new VectorBase(Geom3Standard, 0, "Geom3!standard");

      const shapeA = new MatrixShape(
        SIUnit.ONE,
        new MatrixDimension([Person]),
        SIVector.ONE,
        new MatrixDimension([Geom3, Geom3]),
        UOM.fromBase(base).mult(UOM.fromBase(base.shift(1))),
      );

      const shapeB = new MatrixShape(
        SIUnit.ONE,
        new MatrixDimension([Person, Geom3]),
        UOM.fromBase(base.shift(1)).reciprocal(),
        new MatrixDimension([Geom3]),
        UOM.fromBase(base),
      );

      expect(shapeA.toText()).toEqual(
        "(|Person||Geom3 % Geom3|Geom3!standard:0*Geom3!standard:1|)",
      );

      expect(shapeB.toText()).toEqual(
        "(|Person % Geom3|/Geom3!standard:1|Geom3|Geom3!standard:0|)",
      );

      expect(shapeA.reorder(2, 1).toText()).toEqual(
        "(|Person % Geom3|/Geom3!standard:1|Geom3|Geom3!standard:0|)",
      );

      expect(shapeA.reorder(2, 1).equals(shapeB)).toEqual(true);
    });
  });
});
