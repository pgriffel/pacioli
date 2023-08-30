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
import { Coordinates } from "./coordinates";
import { MatrixDimension } from "./matrix-dimension";
import { VectorBase } from "./vector-base";

export type SIVector = UOM<VectorBase>;

export class MatrixShape {
  readonly kind = "matrixshape";
  public static scalar(unit: SIUnit) {
    return new MatrixShape(
      unit,
      MatrixDimension.empty(),
      UOM.ONE,
      MatrixDimension.empty(),
      UOM.ONE
    );
  }

  constructor(
    public multiplier: SIUnit,
    public rowDimension: MatrixDimension,
    public rowUnit: SIVector,
    public columnDimension: MatrixDimension,
    public columnUnit: SIVector
  ) {}

  public toText() {
    var text = "(" + this.multiplier.toText() + "|";
    text += this.rowDimension + "|";
    text += this.columnDimension + "|";
    text += this.rowUnit.toText() + "|";
    text += this.columnUnit.toText() + "|";
    text += ")";
    return text;
  }

  public rowOrder() {
    return this.rowDimension.order();
  }

  public columnOrder() {
    return this.columnDimension.order();
  }

  public equals(other: MatrixShape) {
    return (
      this.multiplier.equals(other.multiplier) &&
      this.rowDimension.equals(other.rowDimension) &&
      this.columnDimension.equals(other.columnDimension) &&
      this.rowUnit.equals(other.rowUnit) &&
      this.columnUnit.equals(other.columnUnit)
    );
  }

  public isScalar() {
    return this.rowDimension.order() == 0 && this.columnDimension.order() == 0;
  }

  public mult(other: MatrixShape) {
    if (other.isScalar()) {
      return this.scale(other);
    }

    if (this.isScalar()) {
      return other.scale(this);
    }

    return new MatrixShape(
      this.multiplier.mult(other.multiplier),
      this.rowDimension,
      this.rowUnit.mult(other.rowUnit),
      this.columnDimension,
      this.columnUnit.mult(other.columnUnit)
    );
  }

  public dot(other: MatrixShape) {
    if (
      !this.columnDimension.equals(other.rowDimension) &&
      this.columnUnit.equals(other.rowUnit)
    ) {
      throw (
        "Shape " +
        this.toText() +
        " is not compatible for dot product with shape " +
        other.toText()
      );
    }
    return new MatrixShape(
      this.multiplier.mult(other.multiplier),
      this.rowDimension,
      this.rowUnit,
      other.columnDimension,
      other.columnUnit
    );
  }

  public scale(factor: MatrixShape) {
    return new MatrixShape(
      this.multiplier.mult(factor.multiplier),
      this.rowDimension,
      this.rowUnit,
      this.columnDimension,
      this.columnUnit
    );
  }

  /**
   * The transpose operator from linear algebra.
   *
   * Swaps the row and column dimensions and units. Note that it also
   * takes the reciprocal of the units.
   *
   * @returns The transposed shape
   */
  public transpose() {
    return new MatrixShape(
      this.multiplier,
      this.columnDimension,
      this.columnUnit.reciprocal(),
      this.rowDimension,
      this.rowUnit.reciprocal()
    );
  }

  public reciprocal() {
    return new MatrixShape(
      this.multiplier.reciprocal(),
      this.rowDimension,
      this.rowUnit.reciprocal(),
      this.columnDimension,
      this.columnUnit.reciprocal()
    );
  }

  public kron(other: MatrixShape) {
    const mapper = function (order: number) {
      return function (base: VectorBase) {
        return UOM.fromBase(base.shift(order));
      };
    };
    return new MatrixShape(
      this.multiplier.mult(other.multiplier),
      this.rowDimension.kronecker(other.rowDimension),
      this.rowUnit.mult(other.rowUnit.map(mapper(this.rowOrder()))),
      this.columnDimension.kronecker(other.columnDimension),
      this.columnUnit.mult(other.columnUnit.map(mapper(this.columnOrder())))
    );
  }

  //   public project(cols) {
  //     var mapper = function (from, to) {
  //       return function (base) {
  //         var parts = base.split('$')
  //         var offset = parseInt(parts[1])
  //         return offset === from ? parts[0] + '$' + to : 1

  //       }
  //     }
  //     var result = new Pacioli.Shape();
  //     result.multiplier = this.multiplier
  //     for (var i = 0; i < cols.length; i++) {
  //       result.rowSets.push(this.rowSets[cols[i]])
  //       result.rowUnit = result.rowUnit.mult(this.rowUnit.map(mapper(cols[i], i)))
  //     }
  //     return result;
  //   }

  // Pacioli.Shape.prototype.expt = function (power) {
  //     var result = new Pacioli.Shape();
  //     result.multiplier = this.multiplier.expt(power)
  //     result.rowSets = this.rowSets
  //     result.columnSets = this.columnSets
  //     result.rowUnit = this.rowUnit.expt(power)
  //     result.columnUnit = this.columnUnit.expt(power)
  //     return result;
  //   }

  // Pacioli.Shape.prototype.scale = function (factor) {
  //     var result = new Pacioli.Shape();
  //     result.multiplier = this.multiplier.mult(factor.multiplier)
  //     result.rowSets = this.rowSets
  //     result.columnSets = this.columnSets
  //     result.rowUnit = this.rowUnit
  //     result.columnUnit = this.columnUnit
  //     return result;
  //   }

  // Pacioli.Shape.prototype.div = function (other) {
  //     return this.mult(other.reciprocal())
  //   }

  // Pacioli.Shape.prototype.dim_inv = function () {
  //     return this.transpose().reciprocal()
  //   }

  // Pacioli.Shape.prototype.per = function (other) {
  //     return this.dot(other.dim_inv())
  //   }

  // Pacioli.Shape.prototype.leftIdentity = function () {
  //     var row = this.row()
  //     return row.per(row)
  //   }

  // Pacioli.Shape.prototype.rightIdentity = function () {
  //     var column = this.column()
  //     return column.per(column)
  //   }

  public dimensionless() {
    return new MatrixShape(
      UOM.ONE,
      this.rowDimension,
      UOM.ONE,
      this.columnDimension,
      UOM.ONE
    );
  }

  // Pacioli.Shape.prototype.factor = function () {
  //     var result = new Pacioli.Shape();
  //     result.multiplier = this.multiplier
  //     return result;
  //   }

  // Pacioli.Shape.prototype.row = function () {
  //     var result = new Pacioli.Shape();
  //     result.rowSets = this.rowSets
  //     result.rowUnit = this.rowUnit
  //     return result;
  //   }

  // Pacioli.Shape.prototype.column = function () {
  //     var result = new Pacioli.Shape();
  //     result.columnSets = this.columnSets
  //     result.columnUnit = this.columnUnit
  //     return result;
  //   }

  public nrRows() {
    var count = 1;
    for (var i = 0; i < this.rowOrder(); i++) {
      count *= this.rowDimension.indexSets[i].items.length;
    }
    return count;
  }

  public nrColumns() {
    var count = 1;
    for (var i = 0; i < this.columnOrder(); i++) {
      count *= this.columnDimension.indexSets[i].items.length;
    }
    return count;
  }

  public rowCoordinates(position: number) {
    return Coordinates.fromIndex(this.rowDimension.indexSets, position);
  }

  public columnCoordinates(position: number) {
    return Coordinates.fromIndex(this.columnDimension.indexSets, position);
  }

  public rowNames(): string[] {
    return this.rowDimension.indexSets.map(function (x) {
      return x.name;
    });
  }

  public rowName(): string {
    return this.rowNames().reduce(function (x, y) {
      return x + "%" + y;
    });
  }

  public columnNames(): string[] {
    return this.columnDimension.indexSets.map(function (x) {
      return x.name;
    });
  }

  public columnName(): string {
    return this.columnNames().reduce(function (x, y) {
      return x + "%" + y;
    });
  }

  // Pacioli.Shape.prototype.columnCoordinates = function (position) {
  //     return new Pacioli.Coordinates(position, this.columnSets);
  //   }

  public findRowUnit(row: number) {
    return this.rowCoordinates(row).findIndividualUnit(this.rowUnit);
  }

  public findColumnUnit(column: number) {
    return this.columnCoordinates(column).findIndividualUnit(this.columnUnit);
  }

  public unitAt(row: number, column: number) {
    return this.multiplier
      .mult(this.findRowUnit(row))
      .div(this.findColumnUnit(column));
  }
}
