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
import java.util.ArrayList;
import java.util.HashMap;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;
import pacioli.ConstraintSet;
import pacioli.PacioliException;
import pacioli.Substitution;
import pacioli.Utils;
import pacioli.ast.expression.ConstNode;
import pacioli.types.AbstractType;
import pacioli.types.PacioliType;
import pacioli.types.TypeBase;
import pacioli.types.TypeVar;
import uom.Base;
import uom.Fraction;
import uom.Unit;
import uom.UnitMap;

public class MatrixType extends AbstractType {

    public final Unit factor;
    public final PacioliType rowDimension;
    public final PacioliType columnDimension;
    public final Unit rowUnit;
    public final Unit columnUnit;

    private MatrixType(Unit factor,
            PacioliType rowDimension,
            Unit rowUnit,
            PacioliType columnDimension,
            Unit columnUnit) {
        this.factor = factor;
        this.rowDimension = rowDimension;
        this.rowUnit = rowUnit;
        this.columnDimension = columnDimension;
        this.columnUnit = columnUnit;
    }

    public MatrixType(Unit factor) {
        this.factor = factor;
        this.rowDimension = new DimensionType();
        this.rowUnit = Unit.ONE;
        this.columnDimension = new DimensionType();
        this.columnUnit = Unit.ONE;
    }

    public MatrixType() {
        this.factor = Unit.ONE;
        this.rowDimension = new DimensionType();
        this.rowUnit = Unit.ONE;
        this.columnDimension = new DimensionType();
        this.columnUnit = Unit.ONE;
    }

    public MatrixType(DimensionType rowDimension, Unit rowUnit) {
        this.factor = Unit.ONE;
        this.rowDimension = rowDimension;
        this.rowUnit = rowUnit;
        this.columnDimension = new DimensionType();
        this.columnUnit = Unit.ONE;
    }

    public MatrixType(TypeVar rowDimension, Unit rowUnit) {
        this.factor = Unit.ONE;
        this.rowDimension = rowDimension;
        this.rowUnit = rowUnit;
        this.columnDimension = new DimensionType();
        this.columnUnit = Unit.ONE;
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
        return factor.equals(otherType.factor)
                && rowDimension.equals(otherType.rowDimension)
                && rowUnit.equals(otherType.rowUnit)
                && columnDimension.equals(otherType.columnDimension)
                && columnUnit.equals(otherType.columnUnit);
    }

    @Override
    public String toString() {
        return String.format("%s{%s, %s, %s, %s, %s}",
                super.toString(),
                factor,
                rowDimension,
                rowUnit,
                columnDimension,
                columnUnit);
    }

    public Unit getFactor() {
        return factor;
    }

    public boolean unitSquare() {
        return rowUnit.equals(columnUnit);
    }

    public MatrixType dimensionless() {
        return new MatrixType(Unit.ONE, rowDimension, Unit.ONE, columnDimension, Unit.ONE);
    }

    public MatrixType transpose() {
        return new MatrixType(factor, columnDimension, columnUnit.reciprocal(), rowDimension, rowUnit.reciprocal());
    }

    public boolean multiplyable(MatrixType other) {
        return (rowDimension.equals(other.rowDimension) && columnDimension.equals(other.columnDimension));
    }

    public MatrixType multiply(MatrixType other) {
        return new MatrixType(factor.multiply(other.factor), rowDimension, rowUnit.multiply(other.rowUnit), columnDimension, columnUnit.multiply(other.columnUnit));
    }

    public MatrixType reciprocal() {
        return new MatrixType(factor.reciprocal(), rowDimension, rowUnit.reciprocal(), columnDimension, columnUnit.reciprocal());
    }

    public MatrixType sqrt() {
        Fraction half = new Fraction(1, 2);
        return new MatrixType(factor.raise(half), rowDimension, rowUnit.raise(half), columnDimension, columnUnit.raise(half));
    }

    public boolean joinable(MatrixType other) {
        return columnUnit.equals(other.rowUnit);
    }

    public MatrixType join(MatrixType other) {
        return new MatrixType(factor.multiply(other.factor), rowDimension, rowUnit, other.columnDimension, other.columnUnit);
    }

    public MatrixType kronecker(MatrixType other) throws PacioliException {
        if (rowDimension instanceof DimensionType
                && columnDimension instanceof DimensionType
                && other.rowDimension instanceof DimensionType
                && other.columnDimension instanceof DimensionType) {

            assert (((DimensionType) columnDimension).width() == 0);
            assert (((DimensionType) other.columnDimension).width() == 0);

            DimensionType rowType = (DimensionType) rowDimension;
            int offset = rowType.width();

            return new MatrixType(
                    factor.multiply(other.factor),
                    rowType.kronecker((DimensionType) other.rowDimension),
                    rowUnit.multiply(BangBase.shiftUnit(other.rowUnit, offset)),
                    new DimensionType(),
                    Unit.ONE);
        } else {
            throw new PacioliException("Kronecker product is not allowed for index variables: %s % %s",
                    toText(), other.toText());
        }
    }

	public MatrixType project(final List<Integer> columns) throws PacioliException {
		if (rowDimension instanceof DimensionType) {

            assert (((DimensionType) columnDimension).width() == 0);
            
            DimensionType rowType = (DimensionType) rowDimension;
            
            Unit unit = Unit.ONE;
            for (int i = 0; i < columns.size(); i++) {
            	final int tmp = i;
            	unit = unit.map(new UnitMap() {
					public Unit map(Base base) {
						assert(base instanceof BangBase);
						BangBase bangBase = (BangBase) base;
						return (bangBase.position == columns.get(tmp)) ? bangBase.move(tmp) : Unit.ONE;
					}
				});
            }
            
            // THE REMAINING UNITS MUST MULTIPLY TO 1 because they are summed at runtime!!!!!
            
    		return new MatrixType(
                    factor,
                    rowType.project(columns),
                    unit,
                    new DimensionType(),
                    Unit.ONE);

        } else {
            throw new PacioliException("Projection is not allowed for open type: %s", toText());
        }
	}
	
    public boolean singleton() {
        if (rowDimension instanceof TypeVar || columnDimension instanceof TypeVar) {
            return false;
        }
        return ((DimensionType) rowDimension).width() == 0 && ((DimensionType) columnDimension).width() == 0;
    }

    public MatrixType scale(MatrixType other) {
        return new MatrixType(factor.multiply(other.factor), other.rowDimension, other.rowUnit, other.columnDimension, other.columnUnit);
    }

    public MatrixType extractColumn() {
        return new MatrixType(factor, rowDimension, rowUnit, new DimensionType(), Unit.ONE);
    }

    public MatrixType extractRow() {
        return new MatrixType(factor, new DimensionType(), Unit.ONE, columnDimension, columnUnit);
    }

    public MatrixType leftIdentity() {
        return new MatrixType(Unit.ONE, rowDimension, rowUnit, rowDimension, rowUnit);
    }

    public MatrixType rightIdentity() {
        return new MatrixType(Unit.ONE, columnDimension, columnUnit, columnDimension, columnUnit);
    }

    public MatrixType raise(Fraction power) {
        return new MatrixType(factor.raise(power), rowDimension, rowUnit.raise(power), columnDimension, columnUnit.raise(power));
    }

    @Override
    public Set<TypeVar> typeVars() {
        Set<TypeVar> all = new LinkedHashSet<TypeVar>();
        all.addAll(unitVars(factor));
        if (rowDimension instanceof TypeVar || !((DimensionType) rowDimension).getIndexSets().isEmpty()) {
            all.addAll(unitVars(rowUnit));
        }
        if (columnDimension instanceof TypeVar || !((DimensionType) columnDimension).getIndexSets().isEmpty()) {
            all.addAll(unitVars(columnUnit));
        }
        all.addAll(rowDimension.typeVars());
        all.addAll(columnDimension.typeVars());
        return all;
    }

    public static Set<TypeVar> unitVars(Unit unit) {
        Set<TypeVar> all = new LinkedHashSet<TypeVar>();
        for (Base base : unit.bases()) {
            if (base instanceof TypeVar) {
                all.add((TypeVar) base);
            }
        }
        return all;
    }

    // These hacks are for MatrixTypeNode and for printing below 
    
    public List<Unit> rowBangUnitList() {
        return dimensionBangUnitList(rowDimension, rowUnit);
    }
    
    public List<Unit> columnBangUnitList() {
        return dimensionBangUnitList(columnDimension, columnUnit);
    }

    private List<Unit> dimensionBangUnitList(final PacioliType dimension, Unit unit) {
        List<Unit> units = new ArrayList<Unit>();
        if (dimension instanceof TypeVar) {
            Unit candidate = unit.map(new UnitMap() {
                public Unit map(Base base) {
                    assert (base instanceof TypeVar);
                    return new BangBase(dimension.toText(), base.toText(), 0);
                }
            });
            if (candidate.equals(Unit.ONE)) {
                units.add(new BangBase(dimension.toText(), "", 0));
            } else {
                units.add(candidate);
            }
        } else {
            final DimensionType dimType = (DimensionType) dimension;

            if (dimType.width() == 1) {
                Unit candidate = unit.map(new UnitMap() {
                    public Unit map(Base base) {
                        assert ((base instanceof TypeVar) || (base instanceof BangBase));
                        if (base instanceof BangBase) {
                            return base;
                        } else {
                            return new BangBase(dimType.nthIndexSet(0).name, base.toText(), 0);
                        }
                    }
                });
                if (candidate.equals(Unit.ONE)) {
                    units.add(new BangBase(dimType.nthIndexSet(0).name, "", 0));
                } else {
                    units.add(candidate);
                }
            } else {
                for (int i = 0; i < dimType.width(); i++) {
                    final int index = i;
                    Unit candidate = unit.map(new UnitMap() {
                        public Unit map(Base base) {
                            assert ((base instanceof TypeVar) || (base instanceof BangBase));
                            if (base instanceof BangBase) {
                                if (((BangBase) base).position == index) {
                                    return base;
                                } else {
                                    return Unit.ONE;
                                }
                            } else {
                                return new BangBase(dimType.nthIndexSet(index).name, String.format("%s(%s)", base.toText(), index), index);
                            }
                        }
                    });
                    if (candidate.equals(Unit.ONE)) {
                        units.add(new BangBase(dimType.nthIndexSet(index).name, "", i));
                    } else {
                        units.add(candidate);
                    }
                }
            }
        }
        return units;
    }

    @Override
    public void printText(PrintWriter out) {

        List<Unit> rowUnitList = dimensionBangUnitList(rowDimension, rowUnit);
        List<Unit> columnUnitList = dimensionBangUnitList(columnDimension, columnUnit);

        int rowWidth = rowUnitList.size();
        int columnWidth = columnUnitList.size();

        Unit pos = factor.map(new UnitMap() {
            public Unit map(Base base) {
                return factor.power(base).signum() < 0 ? Unit.ONE : base;
            }
        });
        Unit neg = factor.map(new UnitMap() {
            public Unit map(Base base) {
                return factor.power(base).signum() > 0 ? Unit.ONE : base;
            }
        });

        List<String> rowStringList = new ArrayList<String>();
        Unit factorUnit = columnWidth == 0 ? factor : pos;
        if (rowWidth == 0) {
            rowStringList.add(factorUnit.toText());
        } else {
            for (int i = 0; i < rowWidth; i++) {
                Unit ithUnit = rowUnitList.get(i);
                if (i == 0) {
                    ithUnit = factorUnit.multiply(ithUnit);
                }
                rowStringList.add(ithUnit.toText());
            }
        }

        List<String> columnStringList = new ArrayList<String>();
        for (int j = 0; j < columnWidth; j++) {
            Unit jthUnit = columnUnitList.get(j);
            if (j == 0) {
                jthUnit = neg.reciprocal().multiply(jthUnit);
            }
            columnStringList.add(jthUnit.toText());
        }

        if (columnWidth == 0) {
            out.format("%s", Utils.intercalate(" % ", rowStringList));
        } else {
            out.format("%s per %s",
                    Utils.intercalate(" % ", rowStringList),
                    Utils.intercalate(" % ", columnStringList));
        }
    }

    @Override
    public ConstraintSet unificationConstraints(PacioliType other) throws PacioliException {
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

    @Override
    public List<Unit> simplificationParts() {
        List<Unit> parts = new ArrayList<Unit>();
        parts.add(factor);
        parts.add(rowUnit);
        parts.add(columnUnit);
        return parts;
    }

    @Override
    public PacioliType applySubstitution(Substitution subs) {
        return new MatrixType(
                subs.apply(factor),
                rowDimension.applySubstitution(subs),
                subs.apply(rowUnit),
                columnDimension.applySubstitution(subs),
                subs.apply(columnUnit));

    }
	
	@Override
	public String compileToJS() {
		
		StringBuilder out = new StringBuilder();
		
		out.append("Pacioli.createMatrixType(");
        out.append(compileTypeUnitToJS(factor));
        out.append(", ");
        out.append(rowDimension.compileToJS());
    	if (!(rowDimension instanceof TypeVar)) out.append(".param");
        out.append(", ");
        if (rowDimension instanceof TypeVar || ((DimensionType) rowDimension).width() > 0) {
        	out.append(compileTypeUnitToJS(rowUnit)); 
        } else {
        	out.append("new Pacioli.PowerProduct(1)");
        }
        out.append(", ");
        out.append(columnDimension.compileToJS());
    	if (!(columnDimension instanceof TypeVar)) out.append(".param");
        out.append(", ");
        if (columnDimension instanceof TypeVar || ((DimensionType) columnDimension).width() > 0) {
        	out.append(compileTypeUnitToJS(columnUnit));
        } else {
        	out.append("new Pacioli.PowerProduct(1)");
        }
        out.append(")");
        
        return out.toString();
	}
	
	private String compileTypeUnitToJS(Unit unit) {
		String product = "";
		int n = 0;
		for (Base base: unit.bases()) {
			TypeBase typeBase = (TypeBase) base;
			String baseText = typeBase.compileToJS() + ".expt(" + unit.power(base) + ")";
			product = n == 0 ? baseText : baseText + ".mult(" + product + ")";
			n++;
		}
		if (n == 0) {
			return "Pacioli.unit(1)";
		} else {
			return product;
		}

	}
}