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

package pacioli.types.matrix;

import java.io.PrintWriter;
import java.util.Arrays;
import java.util.HashSet;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Set;

import pacioli.ConstraintSet;
import pacioli.PacioliException;
import pacioli.Substitution;
import pacioli.types.AbstractType;
import pacioli.types.TypeObject;
import pacioli.types.TypeBase;
import pacioli.types.TypeVisitor;
import pacioli.types.VectorUnitVar;
import pacioli.types.ast.TypeKroneckerNode;
import pacioli.types.ast.TypeNode;
import uom.Fraction;
import uom.Unit;
import uom.UnitMap;

public class MatrixType extends AbstractType {

    public final Unit<TypeBase> factor;
    public final IndexType rowDimension;
    public final IndexType columnDimension;
    public final Unit<TypeBase> rowUnit;
    public final Unit<TypeBase> columnUnit;

    public MatrixType(Unit<TypeBase> factor, IndexType rowDimension, Unit<TypeBase> rowUnit, IndexType columnDimension,
            Unit<TypeBase> columnUnit) {
        this.factor = factor;
        this.rowDimension = rowDimension;
        this.rowUnit = rowUnit;
        this.columnDimension = columnDimension;
        this.columnUnit = columnUnit;
    }

    public MatrixType(Unit<TypeBase> factor) {
        this.factor = factor;
        this.rowDimension = new IndexType();
        this.rowUnit = TypeBase.ONE;
        this.columnDimension = new IndexType();
        this.columnUnit = TypeBase.ONE;
    }

    public MatrixType() {
        this.factor = TypeBase.ONE;
        this.rowDimension = new IndexType();
        this.rowUnit = TypeBase.ONE;
        this.columnDimension = new IndexType();
        this.columnUnit = TypeBase.ONE;
    }

    public MatrixType(IndexType rowDimension, Unit<TypeBase> rowUnit) {
        this.factor = TypeBase.ONE;
        this.rowDimension = rowDimension;
        this.rowUnit = rowUnit;
        this.columnDimension = new IndexType();
        this.columnUnit = TypeBase.ONE;
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
        if (!(other instanceof MatrixType)) {
            return false;
        }
        MatrixType otherType = (MatrixType) other;
        return factor.equals(otherType.factor) && rowDimension.equals(otherType.rowDimension)
                && rowUnit.equals(otherType.rowUnit) && columnDimension.equals(otherType.columnDimension)
                && columnUnit.equals(otherType.columnUnit);
    }

    @Override
    public String toString() {
        return String.format("<%s, %s, %s, %s, %s>", // super.toString(),
                factor, rowDimension, rowUnit, columnDimension,
                columnUnit);
    }

    @Override
    public void printPretty(PrintWriter out) {
        deval().printPretty(out);
    }

    public Unit<TypeBase> getFactor() {
        return factor;
    }

    public boolean unitSquare() {
        return rowUnit.equals(columnUnit);
    }

    public MatrixType dimensionless() {
        return new MatrixType(TypeBase.ONE, rowDimension, TypeBase.ONE, columnDimension, TypeBase.ONE);
    }

    public MatrixType factorless() {
        return new MatrixType(TypeBase.ONE, rowDimension, rowUnit, columnDimension, columnUnit);
    }

    public MatrixType transpose() {
        return new MatrixType(factor, columnDimension, columnUnit.reciprocal(), rowDimension, rowUnit.reciprocal());
    }

    public boolean multiplyable(MatrixType other) {
        return (rowDimension.equals(other.rowDimension) && columnDimension.equals(other.columnDimension));
    }

    public MatrixType multiply(MatrixType other) {
        return new MatrixType(factor.multiply(other.factor), rowDimension, rowUnit.multiply(other.rowUnit),
                columnDimension, columnUnit.multiply(other.columnUnit));
    }

    public MatrixType reciprocal() {
        return new MatrixType(factor.reciprocal(), rowDimension, rowUnit.reciprocal(), columnDimension,
                columnUnit.reciprocal());
    }

    public MatrixType sqrt() {
        Fraction half = new Fraction(1, 2);
        return new MatrixType(factor.raise(half), rowDimension, rowUnit.raise(half), columnDimension,
                columnUnit.raise(half));
    }

    public boolean joinable(MatrixType other) {
        return columnDimension.equals(other.rowDimension) &&
                columnUnit.equals(other.rowUnit);
    }

    public MatrixType join(MatrixType other) {
        return new MatrixType(factor.multiply(other.factor), rowDimension, rowUnit, other.columnDimension,
                other.columnUnit);
    }

    public MatrixType kronecker(MatrixType other) throws PacioliException {
        if (rowDimension instanceof IndexType && columnDimension instanceof IndexType
                && other.rowDimension instanceof IndexType && other.columnDimension instanceof IndexType) {

            assert (((IndexType) columnDimension).width() == 0);
            assert (((IndexType) other.columnDimension).width() == 0);

            IndexType rowType = (IndexType) rowDimension;
            int offset = rowType.width();

            return new MatrixType(factor.multiply(other.factor), rowType.kronecker(other.rowDimension),
                    rowUnit.multiply(VectorBase.shiftUnit(other.rowUnit, offset)), new IndexType(), TypeBase.ONE);
        } else {
            throw new PacioliException("Kronecker product is not allowed for index variables: %s %% %s (%s)", pretty(),
                    other.pretty(), rowDimension.getClass());
        }
    }

    public MatrixType project(final List<Integer> columns) throws PacioliException {
        if (rowDimension instanceof IndexType) {

            assert (((IndexType) columnDimension).width() == 0);

            IndexType rowType = (IndexType) rowDimension;

            // Can kroneckerNth from MatrixBase or VectorBase be used here?
            Unit<TypeBase> unit = TypeBase.ONE;
            for (int i = 0; i < columns.size(); i++) {
                final int tmp = i;
                unit = rowUnit.map(new UnitMap<TypeBase>() {
                    public Unit<TypeBase> map(TypeBase base) {
                        assert (base instanceof VectorBase);
                        VectorBase bangBase = (VectorBase) base;
                        return (Unit<TypeBase>) ((bangBase.position == columns.get(tmp)) ? bangBase.move(tmp)
                                : TypeBase.ONE);
                    }
                });
            }

            // THE REMAINING UNITS MUST MULTIPLY TO 1 because they are summed at
            // runtime!!!!!

            return new MatrixType(factor, rowType.project(columns), unit, new IndexType(), TypeBase.ONE);

        } else {
            throw new PacioliException("Projection is not allowed for open type: %s", pretty());
        }
    }

    public MatrixType nmode(Integer n, MatrixType transform) throws PacioliException {

        // Start with an empty matrix type
        MatrixType newType = new MatrixType(factor);

        MatrixType tmp = factorless();

        // Add the dimension below n unchanged
        for (int i = 0; i < n; i++) {
            newType = newType.kronecker(tmp.project(Arrays.asList(i)));
        }

        // Transform the n-th dimension and add it
        MatrixType projected = tmp.project(Arrays.asList(n));
        if (!transform.joinable(projected)) {
            throw new RuntimeException(
                    String.format("Invalid transformation in nmode product: cannot multiply %s and %s",
                            transform.pretty(),
                            tmp.project(Arrays.asList(n)).pretty()));
        }
        ;
        newType = newType.kronecker(transform.join(projected));

        // Add the dimension above n unchanged
        for (int i = n + 1; i < rowDimension.width(); i++) {
            newType = newType.kronecker(tmp.project(Arrays.asList(i)));
        }

        return newType;
    }

    public boolean singleton() {
        if (rowDimension.isVar() || columnDimension.isVar()) {
            return false;
        }
        return rowDimension.width() == 0 && columnDimension.width() == 0;
    }

    public MatrixType scale(MatrixType other) {
        return new MatrixType(factor.multiply(other.factor), other.rowDimension, other.rowUnit, other.columnDimension,
                other.columnUnit);
    }

    public MatrixType extractColumn() {
        return new MatrixType(factor, rowDimension, rowUnit, new IndexType(), TypeBase.ONE);
    }

    public MatrixType extractRow() {
        return new MatrixType(factor, new IndexType(), TypeBase.ONE, columnDimension, columnUnit);
    }

    public MatrixType leftIdentity() {
        return new MatrixType(TypeBase.ONE, rowDimension, rowUnit, rowDimension, rowUnit);
    }

    public MatrixType rightIdentity() {
        return new MatrixType(TypeBase.ONE, columnDimension, columnUnit, columnDimension, columnUnit);
    }

    public MatrixType raise(Fraction power) {
        return new MatrixType(factor.raise(power), rowDimension, rowUnit.raise(power), columnDimension,
                columnUnit.raise(power));
    }

    // @Override
    // public Set<String> unitVecVarCompoundNames() {
    // Set<String> names = new LinkedHashSet<String>();
    // names.addAll(dimensionUnitVecVarCompoundNames(rowDimension, rowUnit));
    // names.addAll(dimensionUnitVecVarCompoundNames(columnDimension, columnUnit));
    // return names;
    // }

    // public Set<String> dimensionUnitVecVarCompoundNames(IndexType dimension,
    // Unit<TypeBase> unit) {
    // Set<String> names = new HashSet<String>();
    // if (dimension.isVar()) {
    // for (TypeBase base : unit.bases()) {
    // assert (base instanceof VectorUnitVar);
    // VectorUnitVar vbase = (VectorUnitVar) base;
    // // Pacioli.logln("Adding %s ! %s", dimension.varName(), vbase.unitPart());
    // names.add(dimension.varName() + "!" + vbase.unitPart());
    // // names.add(base.pretty());
    // }
    // }
    // return names;
    // }

    @Override
    public ConstraintSet unificationConstraints(TypeObject other) throws PacioliException {
        MatrixType otherType = (MatrixType) other;
        ConstraintSet constraints = new ConstraintSet();
        constraints.addUnitConstraint(factor, otherType.factor, "Matrix factors must match");
        constraints.addConstraint(rowDimension, otherType.rowDimension, "Matrix row dimensions must match");
        constraints.addConstraint(columnDimension, otherType.columnDimension, "Matrix column dimensions must match");
        constraints.addUnitConstraint(rowUnit, otherType.rowUnit, "Matrix row units must match");
        constraints.addUnitConstraint(columnUnit, otherType.columnUnit, "Matrix column units must match");
        return constraints;
    }

    @Override
    public String description() {
        return "matrix type";
    }

    public TypeNode devalDimensionUnitPair(final IndexType dimension, Unit<TypeBase> unit) {
        if (dimension.isVar()) {
            VectorUnitDeval unitDevaluator = new VectorUnitDeval(dimension, 0);
            return unit.fold(unitDevaluator);
        } else {
            final IndexType dimType = (IndexType) dimension;
            TypeNode node = null;
            for (int i = 0; i < dimType.width(); i++) {
                IndexType ty = dimType.project(Arrays.asList(i));
                VectorUnitDeval unitDevaluator = new VectorUnitDeval(dimType, i);
                Unit<TypeBase> filtered = unit;
                // Unit<TypeBase> filtered = VectorBase.kroneckerNth((Unit<TypeBase>) unit, i);

                TypeNode devaluated = filtered.fold(unitDevaluator);
                if (i == 0) {
                    node = devaluated;
                } else {
                    node = new TypeKroneckerNode(node.getLocation().join(devaluated.getLocation()), node, devaluated);
                }
            }
            return node;
        }
    }

    @Override
    public void accept(TypeVisitor visitor) {
        visitor.visit(this);
    }
}