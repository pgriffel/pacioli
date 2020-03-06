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
import java.util.HashSet;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Set;

import pacioli.ConstraintSet;
import pacioli.PacioliException;
import pacioli.Substitution;
import pacioli.Utils;
import pacioli.types.AbstractType;
import pacioli.types.PacioliType;
import pacioli.types.TypeBase;
import pacioli.types.TypeVar;
import uom.Fraction;
import uom.Unit;
import uom.UnitFold;
import uom.UnitMap;

public class MatrixType extends AbstractType {

    public final Unit<TypeBase> factor;
    public final IndexType rowDimension;
    public final IndexType columnDimension;
    public final Unit<TypeBase> rowUnit;
    public final Unit<TypeBase> columnUnit;

    private MatrixType(Unit<TypeBase> factor, IndexType rowDimension, Unit<TypeBase> rowUnit, IndexType columnDimension, Unit<TypeBase> columnUnit) {
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
        return String.format("%s{%s, %s, %s, %s, %s}", super.toString(), factor, rowDimension, rowUnit, columnDimension,
                columnUnit);
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
        return columnUnit.equals(other.rowUnit);
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
                    rowUnit.multiply(BangBase.shiftUnit(other.rowUnit, offset)), new IndexType(), TypeBase.ONE);
        } else {
            throw new PacioliException("Kronecker product is not allowed for index variables: %s %% %s (%s)", toText(),
                    other.toText(), rowDimension.getClass());
        }
    }

    public MatrixType project(final List<Integer> columns) throws PacioliException {
        if (rowDimension instanceof IndexType) {

            assert (((IndexType) columnDimension).width() == 0);

            IndexType rowType = (IndexType) rowDimension;

            Unit<TypeBase> unit = TypeBase.ONE;
            for (int i = 0; i < columns.size(); i++) {
                final int tmp = i;
                unit = unit.map(new UnitMap<TypeBase>() {
                    public Unit<TypeBase> map(TypeBase base) {
                        assert (base instanceof BangBase);
                        BangBase bangBase = (BangBase) base;
                        return (Unit<TypeBase>) ((bangBase.position == columns.get(tmp)) ? bangBase.move(tmp) : TypeBase.ONE);
                    }
                });
            }

            // THE REMAINING UNITS MUST MULTIPLY TO 1 because they are summed at
            // runtime!!!!!

            return new MatrixType(factor, rowType.project(columns), unit, new IndexType(), TypeBase.ONE);

        } else {
            throw new PacioliException("Projection is not allowed for open type: %s", toText());
        }
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

    @Override
    public Set<TypeVar> typeVars() {
        Set<TypeVar> all = new LinkedHashSet<TypeVar>();
        all.addAll(unitVars(factor));
        if (rowDimension.isVar() || rowDimension.width() > 0) {
            all.addAll(unitVars(rowUnit));
        }
        if (columnDimension.isVar() || columnDimension.width() > 0) {
            all.addAll(unitVars(columnUnit));
        }
        all.addAll(rowDimension.typeVars());
        all.addAll(columnDimension.typeVars());
        return all;
    }

    public static Set<TypeVar> unitVars(Unit<TypeBase> unit) {
        Set<TypeVar> all = new LinkedHashSet<TypeVar>();
        for (TypeBase base : unit.bases()) {
            if (base instanceof TypeVar) {
                all.add((TypeVar) base);
            }
        }
        return all;
    }

    @Override
    public Set<String> unitVecVarCompoundNames() {
        Set<String> names = new LinkedHashSet<String>();
        names.addAll(dimensionUnitVecVarCompoundNames(rowDimension, rowUnit));
        names.addAll(dimensionUnitVecVarCompoundNames(columnDimension, columnUnit));
        return names;
    }

    public Set<String> dimensionUnitVecVarCompoundNames(IndexType dimension, Unit<TypeBase> unit) {
        Set<String> names = new HashSet<String>();
        if (dimension.isVar()) {
            for (TypeBase base : unit.bases()) {
                assert (base instanceof TypeVar);
                names.add(dimension.varName() + "!" + base.toText());
            }
        }
        return names;
    }

    // These hacks are for MatrixTypeNode and for printing below

    public List<Unit<TypeBase>> rowBangUnitList() {
        return dimensionBangUnitList(rowDimension, rowUnit);
    }

    public List<Unit<TypeBase>> columnBangUnitList() {
        return dimensionBangUnitList(columnDimension, columnUnit);
    }

    private List<Unit<TypeBase>> dimensionBangUnitList(final IndexType dimension, Unit<TypeBase> unit) {
        List<Unit<TypeBase>> units = new ArrayList<Unit<TypeBase>>();
        if (dimension.isVar()) {
            Unit<TypeBase> candidate = unit.map(new UnitMap<TypeBase>() {
                public Unit<TypeBase> map(TypeBase base) {
                    assert (base instanceof TypeVar);
                    // return new BangBase(dimension.toText(), base.toText(), 0);
                    // return new StringBase(dimension.varName() + "!" + base.toText());
                    // return new BangBase(dimension.varName(), base.toText(), 0);
                    return base;
                }
            });
            if (candidate.equals(TypeBase.ONE)) {
                // units.add(new BangBase(dimension.toText(), "", 0));
                // units.add(new StringBase(dimension.varName()));
                units.add(new BangBase(dimension.varName(), "", 0));
            } else {
                units.add(candidate);
            }
        } else {
            final IndexType dimType = (IndexType) dimension;

            if (dimType.width() == 1) {
                final String dimName = dimType.nthIndexSet(0).name;
                final String dimHome = dimType.nthIndexSet(0).home;
                Unit<TypeBase> candidate = unit.map(new UnitMap<TypeBase>() {
                    public Unit<TypeBase> map(TypeBase base) {
                        assert ((base instanceof TypeVar) || (base instanceof BangBase));
                        if (base instanceof BangBase) {
                            // return base;
                            BangBase bangBase = (BangBase) base;
                            assert (dimName.equals(bangBase.indexSetName()));
                            // return new StringBase(bangBase.indexSetName() + "!" + bangBase.unitName());
                            BangBase newBase = new BangBase(dimHome, bangBase.indexSetName(), bangBase.unitName(), 0);
                            return newBase;
                        } else {
                            // return new BangBase(dimType.nthIndexSet(0).name, base.toText(), 0);
                            // return new StringBase(dimName + "!" + base.toText());
                            return new BangBase(dimHome, dimName, base.toText(), 0);
                        }
                    }
                });
                if (candidate.equals(TypeBase.ONE)) {
                    // units.add(new BangBase(dimType.nthIndexSet(0).name, "", 0));
                    // units.add(new StringBase(dimName + "!"));
                    units.add(new BangBase(dimHome, dimName, "", 0));
                } else {
                    units.add(candidate);
                }
            } else {
                for (int i = 0; i < dimType.width(); i++) {
                    final int index = i;
                    Unit<TypeBase> candidate = unit.map(new UnitMap<TypeBase>() {
                        public Unit<TypeBase> map(TypeBase base) {
                            assert ((base instanceof TypeVar) || (base instanceof BangBase));
                            if (base instanceof BangBase) {
                                if (((BangBase) base).position == index) {
                                    return base;
                                } else {
                                    return TypeBase.ONE;
                                }
                            } else {
                                return new BangBase(dimType.nthIndexSet(index).home,
                                        dimType.nthIndexSet(index).name,
                                        String.format("%s(%s)", base.toText(), index), index);
                            }
                        }
                    });
                    if (candidate.equals(TypeBase.ONE)) {
                        // units.add(new BangBase(dimType.nthIndexSet(index).name, "", i));
                        // units.add(new StringBase(dimType.nthIndexSet(index).name));
                        units.add(new BangBase(dimType.nthIndexSet(index).home, dimType.nthIndexSet(index).name, "", i));
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

        List<Unit<TypeBase>> rowUnitList = dimensionBangUnitList(rowDimension, rowUnit);
        List<Unit<TypeBase>> columnUnitList = dimensionBangUnitList(columnDimension, columnUnit);

        int rowWidth = rowUnitList.size();
        int columnWidth = columnUnitList.size();

        Unit<TypeBase> pos = factor.map(new UnitMap<TypeBase>() {
            public Unit<TypeBase> map(TypeBase base) {
                return factor.power(base).signum() < 0 ? TypeBase.ONE : base;
            }
        });
        Unit<TypeBase> neg = factor.map(new UnitMap<TypeBase>() {
            public Unit<TypeBase> map(TypeBase base) {
                return factor.power(base).signum() > 0 ? TypeBase.ONE : base;
            }
        });

        List<String> rowStringList = new ArrayList<String>();
        Unit<TypeBase> factorUnit = columnWidth == 0 ? factor : pos;
        if (rowWidth == 0) {
            rowStringList.add(factorUnit.toText());
        } else {
            for (int i = 0; i < rowWidth; i++) {
                Unit<TypeBase> ithUnit = rowUnitList.get(i);
                if (i == 0) {
                    ithUnit = factorUnit.multiply(ithUnit);
                }
                rowStringList.add(ithUnit.toText());
            }
        }

        List<String> columnStringList = new ArrayList<String>();
        for (int j = 0; j < columnWidth; j++) {
            Unit<TypeBase> jthUnit = columnUnitList.get(j);
            if (j == 0) {
                jthUnit = neg.reciprocal().multiply(jthUnit);
            }
            columnStringList.add(jthUnit.toText());
        }
        if (false) {
            out.print("<");
            out.print(factor.toText());
            out.print(", ");
            out.print(rowDimension.toText());
            out.print(", ");
            out.print(rowUnit.toText());
            out.print(", ");
            out.print(columnDimension.toText());
            out.print(", ");
            out.print(columnUnit.toText());
            out.print(">");
        } else {
            if (columnWidth == 0) {
                out.format("%s", Utils.intercalate(" % ", rowStringList));
            } else {
                out.format("%s per %s", Utils.intercalate(" % ", rowStringList),
                        Utils.intercalate(" % ", columnStringList));
            }
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
    public List<Unit<TypeBase>> simplificationParts() {
        List<Unit<TypeBase>> parts = new ArrayList<Unit<TypeBase>>();
        parts.add(factor);
        if (rowDimension.isVar() || rowDimension.width() > 0) {
            parts.add(rowUnit);
        }
        if (columnDimension.isVar() || columnDimension.width() > 0) {
            parts.add(columnUnit);
        }
        return parts;
    }

    @Override
    public PacioliType applySubstitution(Substitution subs) {
        return new MatrixType(subs.apply(factor), (IndexType) rowDimension.applySubstitution(subs), subs.apply(rowUnit),
                (IndexType) columnDimension.applySubstitution(subs), subs.apply(columnUnit));

    }

    @Override
    public String compileToJS() {

        StringBuilder out = new StringBuilder();

        out.append("Pacioli.createMatrixType(");
        out.append(Utils.compileUnitToJS(factor));
        out.append(", ");
        out.append(rowDimension.compileToJS());
        if (!rowDimension.isVar())
            out.append(".param");
        out.append(", ");
        if (rowDimension.isVar() || rowDimension.width() > 0) {
            out.append(Utils.compileUnitToJS(rowUnit));
        } else {
            out.append("Pacioli.ONE");
        }
        out.append(", ");
        out.append(columnDimension.compileToJS());
        if (!columnDimension.isVar())
            out.append(".param");
        out.append(", ");
        if (columnDimension.isVar() || columnDimension.width() > 0) {
            out.append(Utils.compileUnitToJS(columnUnit));
        } else {
            out.append("Pacioli.ONE");
        }
        out.append(")");

        return out.toString();
    }

    @Override
    public PacioliType reduce() {
        return this;
    }

    @Override
    public String compileToMVM() {
        UnitMVMCompiler unitCompiler = new UnitMVMCompiler();
        DimMVMCompiler dimCompiler = new DimMVMCompiler();
        
        //String factorCode = factor.fold(unitCompiler);
        //String rowDimCode = rowUnit.fold(dimCompiler);
        String rowDimCode = compileDimension(rowDimension, rowUnit);
        String columnDimCode = compileDimension(columnDimension, columnUnit);
        //String columnDimCode = columnUnit.fold(dimCompiler);
        
        String factorCode = factor.fold(new UnitFold<TypeBase, String> () {

            @Override
            public String map(TypeBase base) {                
                return base.compileToMVM();
            }

            @Override
            public String mult(String x, String y) {
                return String.format("unit_mult(%s, %s)", x, y);
            }

            @Override
            public String expt(String x, Fraction n) {
                return String.format("unit_expt(%s, %s)", x, n);
            }

            @Override
            public String one() {
                //return "scalar_shape(unit(\"\"))";
                return "unit(\"\")";
            }
            
        });
        
        return String.format("shape_binop(\"multiply\", scalar_shape(%s), shape_binop(\"per\", %s, %s))", 
                factorCode, rowDimCode, columnDimCode);
    }
 
    private String compileDimension(final IndexType dimension, Unit<TypeBase> unit) {
        DimMVMCompiler unitCompiler = new DimMVMCompiler();
        
        List<Unit<TypeBase>> units = dimensionBangUnitList(dimension, unit);
        if (units.isEmpty()) {
            return "scalar_shape(unit(\"\"))";
        } else {
            String code = "";
            for (Unit<TypeBase> dimUnit: units) {
                String unitCode = dimUnit.fold(unitCompiler);
                if (code.isEmpty()) {
                    code = unitCode;
                } else {
                    code = String.format("shape_binop(\"kronecker\", %s, %s)", code, unitCode);
                }
            }
            return code;
        }
    }
    
    class UnitMVMCompiler implements UnitFold<TypeBase, String> {

        @Override
        public String map(TypeBase base) {    
            return base.compileToMVM();
        }

        @Override
        public String mult(String x, String y) {
            return String.format("shape_binop(\"multiply\", %s, %s)", x, y);
        }

        @Override
        public String expt(String x, Fraction n) {
            return String.format("shape_expt(%s, %s)", x, n);
        }

        @Override
        public String one() {
            return "scalar_shape(unit(\"\"))";
        }
    }
    
    class DimMVMCompiler implements UnitFold<TypeBase, String> {

        @Override
        public String map(TypeBase base) {
            if (true || base instanceof BangBase) {
                return base.compileToMVM();
            } else {
                return "scalar_shape(" + base.compileToMVM() + ")";
            }
        }

        @Override
        public String mult(String x, String y) {
            return String.format("shape_binop(\"multiply\", %s, %s)", x, y);
        }

        @Override
        public String expt(String x, Fraction n) {
            return String.format("shape_expt(%s, %s)", x, n);
        }

        @Override
        public String one() {
            return "scalar_shape(unit(\"\"))";
        }
    }
}