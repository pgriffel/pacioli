/*
 * Copyright (c) 2013 - 2014 Paul Griffioen
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

package mvm.values.matrix;

import java.io.PrintWriter;
import java.util.List;

import mvm.AbstractPrintable;
import uom.Fraction;
import uom.Unit;

public class MatrixShape extends AbstractPrintable {

    private final Unit<MatrixBase> factor;
    private final MatrixDimension rowDimension;
    private final MatrixDimension columnDimension;
    public final Unit<MatrixBase> rowUnit;
    public final Unit<MatrixBase> columnUnit;

    public MatrixShape(Unit<MatrixBase> factor, MatrixDimension rowDimension, Unit<MatrixBase> rowUnit, MatrixDimension columnDimension,
            Unit<MatrixBase> columnUnit) {
        this.factor = factor;
        this.rowDimension = rowDimension;
        this.rowUnit = rowUnit;
        this.columnDimension = columnDimension;
        this.columnUnit = columnUnit;
    }

    public MatrixShape(Unit<MatrixBase> factor, MatrixDimension rowDimension, MatrixDimension columnDimension) {
        this.factor = factor;
        this.rowDimension = rowDimension;
        this.rowUnit = MatrixBase.ONE;
        this.columnDimension = columnDimension;
        this.columnUnit = MatrixBase.ONE;
    }

    public MatrixShape(Unit<MatrixBase> factor) {
        this.factor = factor;
        this.rowDimension = new MatrixDimension();
        this.rowUnit = MatrixBase.ONE;
        this.columnDimension = new MatrixDimension();
        this.columnUnit = MatrixBase.ONE;
    }

    public MatrixShape() {
        this.factor = MatrixBase.ONE;
        this.rowDimension = new MatrixDimension();
        this.rowUnit = MatrixBase.ONE;
        this.columnDimension = new MatrixDimension();
        this.columnUnit = MatrixBase.ONE;
    }

    public Unit<MatrixBase> getFactor() {
        return factor;
    }

    public int rowOrder() {
        return rowDimension().width();
    }

    public int columnOrder() {
        return columnDimension().width();
    }

    @Override
    public int hashCode() {
        return factor.hashCode();
    }

    @Override
    public boolean equals(Object other) {
        if (other == this) {
            return true;
        }
        if (!(other instanceof MatrixShape)) {
            return false;
        }
        MatrixShape otherType = (MatrixShape) other;
        return factor.equals(otherType.factor) && rowDimension.equals(otherType.rowDimension)
                && rowUnit.equals(otherType.rowUnit) && columnDimension.equals(otherType.columnDimension)
                && columnUnit.equals(otherType.columnUnit);
    }

    public MatrixDimension rowDimension() {
        return rowDimension;
    }

    public MatrixDimension columnDimension() {
        return columnDimension;
    }

    public MatrixShape rowUnits() {
        return new MatrixShape(MatrixBase.ONE, rowDimension(), rowUnit, new MatrixDimension(), MatrixBase.ONE);
    }

    public MatrixShape columnUnits() {
        return new MatrixShape(MatrixBase.ONE, columnDimension(), columnUnit, new MatrixDimension(), MatrixBase.ONE);
    }

    public IndexSet nthRowIndexSet(int n) {
        return rowDimension().nthIndexSet(n);
    }

    public IndexSet nthColumnIndexSet(int n) {
        return columnDimension().nthIndexSet(n);
    }

    public Unit<MatrixBase> nthRowUnit(int n) {
        assert (n < rowOrder());
        return MatrixBase.kroneckerNth(rowUnit, n);
    }

    public Unit<MatrixBase> nthColumnUnit(int n) {
        assert (n < columnOrder());
        return MatrixBase.kroneckerNth(columnUnit, n);
    }

    public boolean unitSquare() {
        return rowUnit.equals(columnUnit);
    }

    public MatrixShape dimensionless() {
        return new MatrixShape(MatrixBase.ONE, rowDimension(), MatrixBase.ONE, columnDimension(), MatrixBase.ONE);
    }

    public MatrixShape transpose() {
        return new MatrixShape(factor, columnDimension(), columnUnit.reciprocal(), rowDimension(),
                rowUnit.reciprocal());
    }

    public boolean multiplyable(MatrixShape other) {
        return (rowDimension.equals(other.rowDimension) && columnDimension.equals(other.columnDimension));
    }

    public MatrixShape multiply(MatrixShape other) {
        return new MatrixShape(factor.multiply(other.factor), rowDimension(), rowUnit.multiply(other.rowUnit),
                columnDimension(), columnUnit.multiply(other.columnUnit));
    }

    public MatrixShape reciprocal() {
        return new MatrixShape(factor.reciprocal(), rowDimension(), rowUnit.reciprocal(), columnDimension(),
                columnUnit.reciprocal());
    }

    public MatrixShape sqrt() {
        Fraction half = new Fraction(1, 2);
        return new MatrixShape(factor.raise(half), rowDimension(), rowUnit.raise(half), columnDimension(),
                columnUnit.raise(half));
    }

    public boolean joinable(MatrixShape other) {
        return columnUnit.equals(other.rowUnit);
    }

    public MatrixShape join(MatrixShape other) {
        return new MatrixShape(factor.multiply(other.factor), rowDimension(), rowUnit, other.columnDimension(),
                other.columnUnit);
    }

    public MatrixShape kronecker(MatrixShape other) {
        return new MatrixShape(factor.multiply(other.factor), rowDimension.kronecker(other.rowDimension),
                rowUnit.multiply(MatrixBase.shiftUnit(other.rowUnit, rowDimension.width())),
                columnDimension.kronecker(other.columnDimension),
                columnUnit.multiply(MatrixBase.shiftUnit(other.columnUnit, columnDimension.width())));
    }

    public MatrixShape project(List<Integer> cols) {
        Unit<MatrixBase> projectedUnit = MatrixBase.ONE;
        for (int i = 0; i < cols.size(); i++) {
            projectedUnit = projectedUnit
                    .multiply(MatrixBase.shiftUnit(MatrixBase.kroneckerNth(rowUnit, cols.get(i)), i - cols.get(i)));
        }
        return new MatrixShape(factor, rowDimension.project(cols), projectedUnit, columnDimension, columnUnit);
    }

    public boolean singleton() {
        return rowOrder() == 0 && columnOrder() == 0;
    }

    public MatrixShape scale(MatrixShape other) {
        return new MatrixShape(factor.multiply(other.factor), other.rowDimension(), other.rowUnit,
                other.columnDimension(), other.columnUnit);
    }

    public MatrixShape extractColumn() {
        return new MatrixShape(factor, rowDimension(), rowUnit, new MatrixDimension(), MatrixBase.ONE);
    }

    public MatrixShape extractRow() {
        return new MatrixShape(factor, new MatrixDimension(), MatrixBase.ONE, columnDimension(), columnUnit);
    }

    public MatrixShape leftIdentity() {
        return new MatrixShape(MatrixBase.ONE, rowDimension(), rowUnit, rowDimension(), rowUnit);
    }

    public MatrixShape rightIdentity() {
        return new MatrixShape(MatrixBase.ONE, columnDimension(), columnUnit, columnDimension(), columnUnit);
    }

    public MatrixShape raise(Fraction power) {
        return new MatrixShape(factor.raise(power), rowDimension, rowUnit.raise(power), columnDimension,
                columnUnit.raise(power));
    }

    @Override
    public void printText(PrintWriter out) {
        out.print("shape(");
        out.print(factor.toText());
        out.print(", ");
        out.print(rowDimension.toText());
        out.print(", ");
        out.print(rowUnit.toText());
        out.print(", ");
        out.print(columnDimension.toText());
        out.print(", ");
        out.print(columnUnit.toText());
        out.print(")");
    }

}