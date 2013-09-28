/*
 * Copyright (c) 2013 Paul Griffioen
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
import java.math.BigDecimal;
import java.math.BigInteger;
import java.util.ArrayList;
import java.util.List;
import mvm.MVMException;
import mvm.values.AbstractPacioliValue;
import mvm.values.PacioliList;
import mvm.values.PacioliTuple;
import mvm.values.PacioliValue;
import org.apache.commons.math3.linear.Array2DRowRealMatrix;
import org.apache.commons.math3.linear.LUDecomposition;
import org.apache.commons.math3.linear.RealMatrix;
import org.apache.commons.math3.linear.SingularMatrixException;
import org.apache.commons.math3.linear.SingularValueDecomposition;
import uom.Base;
import uom.Unit;
import uom.UnitMap;

public class Matrix extends AbstractPacioliValue {

    public MatrixShape shape;
    private RealMatrix numbers;

    ////////////////////////////////////////////////////////////////////////////
    // Constructors
    public Matrix(int num) {
        shape = new MatrixShape();
        numbers = new Array2DRowRealMatrix(rowDimension().size(), columnDimension().size());
        numbers.setEntry(0, 0, num);
    }

    public Matrix(double num) {
        shape = new MatrixShape();
        numbers = new Array2DRowRealMatrix(rowDimension().size(), columnDimension().size());
        numbers.setEntry(0, 0, num);
    }

    public Matrix(Unit unit) {
        shape = new MatrixShape(unit);
        numbers = new Array2DRowRealMatrix(rowDimension().size(), columnDimension().size());
        numbers.setEntry(0, 0, 1);
    }

    public Matrix(MatrixShape shape) {
        this.shape = shape;
        numbers = new Array2DRowRealMatrix(rowDimension().size(), columnDimension().size());
    }

    ////////////////////////////////////////////////////////////////////////////
    // Printing
    @Override
    public void printText(PrintWriter out) {

        if (rowDimension().width() == 0 && columnDimension().width() == 0) {
            if (unitAt(0, 0).equals(Unit.ONE)) {
                out.format("%f", numbers.getEntry(0, 0));
                return;
            } else {
                out.format("%f %s", numbers.getEntry(0, 0), unitAt(0, 0).toText());
                return;
            }
        }

        List<String> idxList = new ArrayList<String>();
        List<String> numList = new ArrayList<String>();
        List<String> unitList = new ArrayList<String>();

        int idxWidth = 10;
        int numWidth = 10;
        int unitWidth = 0;


        for (int i = 0; i < rowDimension().size(); i++) {
            for (int j = 0; j < columnDimension().size(); j++) {
                double num = numbers.getEntry(i, j);
                if (num < -0.0000000001 || 0.0000000001 < num) {
                //if (num != 0) {

                    String numString = String.format("%f", num);
                    numList.add(numString);
                    numWidth = Math.max(numWidth, numString.length());

                    String idxString = "";
                    String sep = "";
                    for (String idx : rowDimension().ElementAt(i)) {
                        idxString += sep + idx;
                        sep = ", ";
                    }
                    for (String idx : columnDimension().ElementAt(j)) {
                        idxString += sep + idx;
                        sep = ", ";
                    }
                    idxWidth = Math.max(idxWidth, idxString.length());
                    idxList.add(idxString);

                    Unit unit = unitAt(i, j);
                    String unitString = unit.equals(Unit.ONE) ? "" : unit.toText();
                    unitList.add(unitString);
                    unitWidth = Math.max(unitWidth, unitString.length());
                }
            }
        }

        out.print("\nIndex");
        for (int i = 0; i < idxWidth - 4; i++) {
            out.print(" ");
        }
        out.print(" ");
        for (int i = 0; i < numWidth - 4; i++) {
            out.print(" ");
        }
        out.print("Value");
        out.print("\n");
        for (int i = 0; i < idxWidth + 1; i++) {
            out.print("-");
        }
        out.print("-");
        for (int i = 0; i < numWidth + unitWidth + 1; i++) {
            out.print("-");
        }
        if (unitWidth != 0) {
            out.print("-");
        }
        for (int i = 0; i < idxList.size(); i++) {
            String formatter = "\n%-" + idxWidth + "s   %" + numWidth + "s %s";
            out.format(formatter, idxList.get(i), numList.get(i), unitList.get(i));
        }
    }

    ////////////////////////////////////////////////////////////////////////////
    // Equality
    @Override
    public int hashCode() {
        return numbers.hashCode();
    }

    @Override
    public boolean equals(Object other) {
        if (other == this) {
            return true;
        }
        if (!(other instanceof Matrix)) {
            return false;
        }
        Matrix otherMatrix = (Matrix) other;
        return this.numbers.equals(otherMatrix.numbers);
    }

    ////////////////////////////////////////////////////////////////////////////
    // Utilities
    public List<Key> rowKeys() {
        List<Key> keys = new ArrayList<Key>();
        for (int i = 0; i < rowDimension().size(); i++) {
            keys.add(new Key(rowDimension().ElementAt(i), shape.rowDimension()));
        }
        return keys;
    }

    public List<Key> columnKeys() {
        List<Key> keys = new ArrayList<Key>();
        for (int i = 0; i < columnDimension().size(); i++) {
            keys.add(new Key(columnDimension().ElementAt(i), shape.columnDimension()));
        }
        return keys;
    }

    private Unit unitAt(int i, int j) {
        return shape.getFactor()
                .multiply(getUnit(rowDimension(), shape.rowUnit, i)
                .multiply(getUnit(columnDimension(), shape.columnUnit, j).reciprocal()));
    }

    private Unit getUnit(MatrixDimension dimension, final Unit matrixUnit, int position) {
        final int[] positions = dimension.individualPositions(position);
        return matrixUnit.map(new UnitMap() {
            public Unit map(Base base) {
                MatrixBase indexBase = (MatrixBase) base;
                return indexBase.get(positions[indexBase.position]);
            }
        });
    }

    public boolean isZero() {
        for (int i = 0; i < nrRows(); i++) {
            for (int j = 0; j < nrColumns(); j++) {
                if (numbers.getEntry(i, j) != 0) {
                    return false;
                }
            }
        }
        return true;
    }

    public PacioliValue setMut(Key row, Key column, Matrix value) {
        int i = row.dimension().ElementPos(row.names);
        int j = column.dimension().ElementPos(column.names);
        numbers.setEntry(i, j, value.numbers.getEntry(0, 0));
        return this;
    }

    ////////////////////////////////////////////////////////////////////////////
    // Matrix manipulation
    public PacioliValue leftIdentity() {
        Matrix matrix = new Matrix(shape.leftIdentity());
        for (int i = 0; i < nrRows(); i++) {
            matrix.numbers.setEntry(i, i, 1);
        }
        return matrix;
    }

    public PacioliValue rightIdentity() {
        Matrix matrix = new Matrix(shape.rightIdentity());
        for (int i = 0; i < nrColumns(); i++) {
            matrix.numbers.setEntry(i, i, 1);
        }
        return matrix;
    }

    public Matrix rowUnitVector() {
        return new Matrix(shape.rowUnits()).ones();
    }

    public Matrix columnUnitVector() {
        return new Matrix(shape.columnUnits()).ones();
    }

    private MatrixDimension rowDimension() {
        return shape.rowDimension();
    }

    private MatrixDimension columnDimension() {
        return shape.columnDimension();
    }

    private int nrRows() {
        return numbers.getRowDimension();
    }

    private int nrColumns() {
        return numbers.getColumnDimension();
    }

    public PacioliList rowDomain() {
        List<PacioliValue> keys = new ArrayList<PacioliValue>();
        for (Key key : rowKeys()) {
            keys.add(key);
        }
        return new PacioliList(keys);
    }

    public PacioliList columnDomain() {
        List<PacioliValue> keys = new ArrayList<PacioliValue>();
        for (Key key : columnKeys()) {
            keys.add(key);
        }
        return new PacioliList(keys);
    }

    public PacioliValue get(Key row, Key column) {
        Matrix matrix = new Matrix(shape.extractRow().extractColumn());
        matrix.numbers.setEntry(0, 0, numbers.getEntry(rowDimension().ElementPos(row.names), columnDimension().ElementPos(column.names)));
        return matrix;
    }

    public PacioliValue magnitude() {
        Matrix matrix = new Matrix(shape.dimensionless());
        matrix.numbers = numbers.copy();
        return matrix;
    }

    public double SingletonNumber() {
        return numbers.getEntry(0, 0);
    }

    public PacioliValue put(Key row, Key column, Matrix value) {
        int i = row.dimension().ElementPos(row.names);
        int j = column.dimension().ElementPos(column.names);
        Matrix matrix = new Matrix(shape);
        matrix.numbers = numbers.copy();
        matrix.numbers.setEntry(i, j, value.numbers.getEntry(0, 0));
        return matrix;
    }

    public PacioliValue isolate(Key row, Key column) {
        int i = row.dimension().ElementPos(row.names);
        int j = column.dimension().ElementPos(column.names);
        Matrix matrix = new Matrix(shape);
        matrix.numbers.setEntry(i, j, numbers.getEntry(i, j));
        return matrix;
    }

    public PacioliValue column(Key key) {
        Matrix matrix = new Matrix(shape.extractColumn());
        matrix.numbers = numbers.getColumnMatrix(columnDimension().ElementPos(key.names));
        return matrix;
    }

    public PacioliValue row(Key key) {
        Matrix matrix = new Matrix(shape.extractRow());
        matrix.numbers = numbers.getRowMatrix(rowDimension().ElementPos(key.names));
        return matrix;
    }

    public Matrix ones() {
        Matrix matrix = new Matrix(shape);
        for (int i = 0; i < rowDimension().size(); i++) {
            for (int j = 0; j < columnDimension().size(); j++) {
                matrix.numbers.setEntry(i, j, 1);
            }
        }
        return matrix;
    }

    public PacioliValue support() {
        Matrix matrix = new Matrix(shape.multiply(shape.reciprocal()));
        for (int i = 0; i < nrRows(); i++) {
            for (int j = 0; j < nrColumns(); j++) {
                if (numbers.getEntry(i, j) != 0) {
                    matrix.numbers.setEntry(i, j, 1);
                }
            }
        }
        return matrix;
    }

    ////////////////////////////////////////////////////////////////////////////
    // Projections and Conversions
    public void createProjection() throws MVMException {

        int nrRows = rowDimension().size();
        int nrColumns = columnDimension().size();

        List<String> dst;
        Unit srcUnit;
        Unit dstUnit;
        Unit unit;

        for (int i = 0; i < nrRows; i++) {

            List<String> src = rowDimension().ElementAt(i);

            for (int j = 0; j < nrColumns; j++) {
                dst = columnDimension().ElementAt(j);

                if (src.containsAll(dst) || dst.containsAll(src)) {

                    srcUnit = getUnit(rowDimension(), shape.rowUnit, i);
                    dstUnit = getUnit(columnDimension(), shape.columnUnit, j);
                    unit = (dstUnit.multiply(srcUnit.reciprocal())).flat();

                    if (!unit.bases().isEmpty()) {
                        throw new MVMException("Cannot project '%s' to '%s'",
                                srcUnit.toText(), dstUnit.toText());
                    }

                    numbers.setEntry(i, j, 1);
                }
            }
        }
    }

    public void createConversion() throws MVMException {

        int nrRows = rowDimension().size();
        int nrColumns = columnDimension().size();

        if (nrRows != nrColumns) {
            throw new MVMException("Conversion not square");
        }

        for (int i = 0; i < nrRows; i++) {
            Unit unit = unitAt(i, i).reciprocal().flat();
            if (!unit.bases().isEmpty()) {
                throw new MVMException("Cannot convert '%s'  (%s)",
                        unit.toText(), unit.bases());
            } else {
                Double num = unit.factor().doubleValue();
                if (num == 0) {
                	throw new MVMException("Zero conversion factor for '%s' '%s'  (%s)",
                			unitAt(i, i).flat().reciprocal().toText(), unit.toText(), unit.bases());
                }
                numbers.setEntry(i, i, num);
            }
        }
    }

    public String JSConverted() throws MVMException {

        int nrRows = rowDimension().size();
        int nrColumns = columnDimension().size();

        if (nrRows != nrColumns) {
            throw new MVMException("Conversion not square");
        }

        String matrix = "[";
        String sep = "";

        for (int i = 0; i < nrRows; i++) {

            matrix += sep + "[";

            String sep2 = "";
            for (int j = 0; j < nrColumns; j++) {

                String num = "0";

                if (i == j) {
                    Unit unit = unitAt(i, j).reciprocal().flat();
                    if (!unit.bases().isEmpty()) {
                        throw new MVMException("Cannot convert '%s'  (%s)",
                                unit.toText(), unit.bases());
                    } else {
//                        Double num = unit.factor().doubleValue();
//                        numbers.setEntry(i, i, num);
                        num = unit.factor().toPlainString();
                    }


                }

                matrix += sep2 + num;
                sep2 = ",";
            }
            matrix += "]";
            sep = ",";

        }
        matrix += "]";
        return matrix;
    }

    public String MATLABConverted() throws MVMException {

        int nrRows = rowDimension().size();
        int nrColumns = columnDimension().size();

        if (nrRows != nrColumns) {
            throw new MVMException("Conversion not square");
        }

        String matrix = "[";
        String sep = "";

        for (int i = 0; i < nrRows; i++) {

            matrix += sep + "";

            String sep2 = "";
            for (int j = 0; j < nrColumns; j++) {

                String num = "0";

                if (i == j) {
                    Unit unit = unitAt(i, j).reciprocal().flat();
                    if (!unit.bases().isEmpty()) {
                        throw new MVMException("Cannot convert '%s'  (%s)",
                                unit.toText(), unit.bases());
                    } else {
//                        Double num = unit.factor().doubleValue();
//                        numbers.setEntry(i, i, num);
                        num = unit.factor().toPlainString();
                    }


                }

                matrix += sep2 + num;
                sep2 = ",";
            }
            matrix += "";
            sep = ";";
        }
        matrix += "]";
        return matrix;
    }

    public String JSliteral() {

        int nrRows = rowDimension().size();
        int nrColumns = columnDimension().size();

        String matrix = "[";
        String sep = "";
        for (int i = 0; i < nrRows; i++) {

            matrix += sep + "[";

            String sep2 = "";
            for (int j = 0; j < nrColumns; j++) {
                Double num = numbers.getEntry(i, j);
                matrix += sep2 + new BigDecimal(num);
                sep2 = ",";
            }
            matrix += "]";
            sep = ",";
        }
        return matrix;
    }

    ////////////////////////////////////////////////////////////////////////////
    // Predicates
    public boolean less(Matrix other) {
        for (int i = 0; i < nrRows(); i++) {
            for (int j = 0; j < nrColumns(); j++) {
                if (numbers.getEntry(i, j) >= other.numbers.getEntry(i, j)) {
                    return false;
                }
            }
        }
        return true;
    }

    public boolean lessEq(Matrix other) {
        for (int i = 0; i < nrRows(); i++) {
            for (int j = 0; j < nrColumns(); j++) {
                if (numbers.getEntry(i, j) > other.numbers.getEntry(i, j)) {
                    return false;
                }
            }
        }
        return true;
    }

    ////////////////////////////////////////////////////////////////////////////
    // Mathematical Operations
    public Matrix transpose() {
        Matrix matrix = new Matrix(shape.transpose());
        matrix.numbers = numbers.transpose();
        return matrix;
    }

    public Matrix sum(Matrix other) throws MVMException {
        if (shape.equals(other.shape)) {
            Matrix matrix = new Matrix(shape);
            matrix.numbers = numbers.add(other.numbers);
            return matrix;
        } else {
            throw new MVMException("types '" + shape.toText() + "' and '" + other.shape.toText() + "' not equal in sum");
        }
    }

    public Matrix multiply(Matrix other) throws MVMException {
        if (shape.multiplyable(other.shape)) {
            Matrix matrix = new Matrix(shape.multiply(other.shape));
            for (int i = 0; i < nrRows(); i++) {
                for (int j = 0; j < nrColumns(); j++) {
                    matrix.numbers.setEntry(i, j, numbers.getEntry(i, j) * other.numbers.getEntry(i, j));
                }
            }
            return matrix;


        } else {
            throw new MVMException("Shapes %s and %s not compatible for multiplication",
                    shape.toText(),
                    other.shape.toText());
        }
    }

    public Matrix negative() {
        Matrix matrix = new Matrix(shape);
        matrix.numbers = numbers.scalarMultiply(-1);
        return matrix;
    }

    public Matrix reciprocal() {
        Matrix matrix = new Matrix(shape.reciprocal());

        double numerator;
        for (int i = 0; i < nrRows(); i++) {
            for (int j = 0; j < nrColumns(); j++) {
                numerator = numbers.getEntry(i, j);
                if (numerator != 0) {
                    matrix.numbers.setEntry(i, j, 1 / numerator);
                }
            }
        }
        return matrix;
    }

    public Matrix join(Matrix other) throws MVMException {
        if (shape.joinable(other.shape)) {
            Matrix matrix = new Matrix(shape.join(other.shape));
            matrix.numbers = numbers.multiply(other.numbers);
            return matrix;
        } else {
            throw new MVMException("types '" + shape.toText() + "' and '" + other.shape.toText() + "' not compatible for joining");
        }
    }

    public PacioliValue kronecker(Matrix other) {
        Matrix matrix = new Matrix(shape.kronecker(other.shape));
        int nrRows = numbers.getRowDimension();
        int nrColumns = numbers.getColumnDimension();
        int otherNrRows = other.numbers.getRowDimension();
        int otherNrColumns = other.numbers.getColumnDimension();
        for (int i = 0; i < nrRows; i++) {
            for (int j = 0; j < nrColumns; j++) {
                for (int k = 0; k < otherNrRows; k++) {
                    for (int l = 0; l < otherNrColumns; l++) {
                        matrix.numbers.setEntry(i * otherNrRows + k, j * otherNrColumns + l, numbers.getEntry(i, j) * other.numbers.getEntry(k, l));
                    }
                }
            }
        }
        return matrix;
    }

    public PacioliValue scale(Matrix other) throws MVMException {
        if (shape.singleton()) {
            Matrix matrix = new Matrix(shape.scale(other.shape));
            matrix.numbers = other.numbers.scalarMultiply(numbers.getEntry(0, 0));
            return matrix;
        } else {
            throw new MVMException("types '" + shape.toText() + "' and '" + other.shape.toText() + "' not compatible for scaling");
        }
    }

    public Matrix total() {
        Matrix matrix = new Matrix(shape.getFactor());
        double sum = 0;
        for (int i = 0; i < nrRows(); i++) {
            for (int j = 0; j < nrColumns(); j++) {
                sum = sum + numbers.getEntry(i, j);
            }
        }
        matrix.numbers.setEntry(0, 0, sum);
        return matrix;
    }

    public PacioliValue sqrt() throws MVMException {
        Matrix matrix = new Matrix(shape.sqrt());
        for (int i = 0; i < nrRows(); i++) {
            for (int j = 0; j < nrColumns(); j++) {
                double num2 = numbers.getEntry(i, j);
                if (num2 < 0) {
                    throw new MVMException("Cannot take root of negative number %s", num2);
                }
                if (Double.isNaN(num2)) {
                    throw new MVMException("Cannot take root of number %s", num2);
                }
                double num3 = Math.sqrt(num2);
                matrix.numbers.setEntry(i, j, num3);
            }
        }
        return matrix;
    }

    public PacioliValue expt(Matrix y) {
        Matrix matrix = new Matrix(shape);
        for (int i = 0; i < nrRows(); i++) {
            for (int j = 0; j < nrColumns(); j++) {
                matrix.numbers.setEntry(i, j, Math.pow(numbers.getEntry(i, j), y.SingletonNumber()));
            }
        }
        return matrix;
    }
    
    public PacioliValue log(Matrix y) {
        Matrix matrix = new Matrix(shape);
        for (int i = 0; i < nrRows(); i++) {
            for (int j = 0; j < nrColumns(); j++) {
                matrix.numbers.setEntry(i, j, Math.log(numbers.getEntry(i, j)) / Math.log(y.SingletonNumber()));
            }
        }
        return matrix;
    }

    public PacioliValue ln() {
        Matrix matrix = new Matrix(shape);
        for (int i = 0; i < nrRows(); i++) {
            for (int j = 0; j < nrColumns(); j++) {
                matrix.numbers.setEntry(i, j, Math.log(numbers.getEntry(i, j)));
            }
        }
        return matrix;
    }

    public PacioliValue exp() {
        Matrix matrix = new Matrix(shape);
        for (int i = 0; i < nrRows(); i++) {
            for (int j = 0; j < nrColumns(); j++) {
                matrix.numbers.setEntry(i, j, Math.exp(numbers.getEntry(i, j)));
            }
        }
        return matrix;
    }

    public PacioliValue gcd(Matrix other) {
        Matrix matrix = new Matrix(shape.dimensionless());
        for (int i = 0; i < nrRows(); i++) {
            for (int j = 0; j < nrColumns(); j++) {
                int a = (int) numbers.getEntry(i, j);
                int b = (int) other.numbers.getEntry(i, j);
                int gcd = BigInteger.valueOf(a).gcd(BigInteger.valueOf(b)).intValue();
                matrix.numbers.setEntry(i, j, gcd);
            }
        }
        return matrix;
    }

    public PacioliValue abs() {
        Matrix matrix = new Matrix(shape);
        for (int i = 0; i < nrRows(); i++) {
            for (int j = 0; j < nrColumns(); j++) {
                double num = numbers.getEntry(i, j);
                if (num < 0) {
                    matrix.numbers.setEntry(i, j, -num);
                } else {
                    matrix.numbers.setEntry(i, j, num);
                }
            }
        }
        return matrix;
    }

    public Matrix div(Matrix other) {
        Matrix matrix = new Matrix(shape.multiply(other.shape.reciprocal()));
        for (int i = 0; i < nrRows(); i++) {
            for (int j = 0; j < nrColumns(); j++) {
                double div = other.numbers.getEntry(i, j);
                if (div == 0) {
                    matrix.numbers.setEntry(i, j, 0);
                } else {
                    matrix.numbers.setEntry(i, j, (int) (numbers.getEntry(i, j) / div));
                }
            }
        }
        return matrix;
    }

    public Matrix mod(Matrix other) {
        Matrix matrix = new Matrix(shape);
        for (int i = 0; i < nrRows(); i++) {
            for (int j = 0; j < nrColumns(); j++) {
                matrix.numbers.setEntry(i, j, numbers.getEntry(i, j) % other.numbers.getEntry(i, j));
            }
        }
        return matrix;
    }

    public PacioliValue sin() {
        Matrix matrix = new Matrix(shape.dimensionless());
        for (int i = 0; i < nrRows(); i++) {
            for (int j = 0; j < nrColumns(); j++) {
                matrix.numbers.setEntry(i, j, Math.sin(numbers.getEntry(i, j)));
            }
        }
        return matrix;
    }

    public PacioliValue cos() {
        Matrix matrix = new Matrix(shape.dimensionless());
        for (int i = 0; i < nrRows(); i++) {
            for (int j = 0; j < nrColumns(); j++) {
                matrix.numbers.setEntry(i, j, Math.cos(numbers.getEntry(i, j)));
            }
        }
        return matrix;
    }
    
    public PacioliValue tan() {
        Matrix matrix = new Matrix(shape.dimensionless());
        for (int i = 0; i < nrRows(); i++) {
            for (int j = 0; j < nrColumns(); j++) {
                matrix.numbers.setEntry(i, j, Math.tan(numbers.getEntry(i, j)));
            }
        }
        return matrix;
    }
    
    public PacioliValue asin() {
        Matrix matrix = new Matrix(shape.dimensionless());
        for (int i = 0; i < nrRows(); i++) {
            for (int j = 0; j < nrColumns(); j++) {
                matrix.numbers.setEntry(i, j, Math.asin(numbers.getEntry(i, j)));
            }
        }
        return matrix;
    }
    
    public PacioliValue acos() {
        Matrix matrix = new Matrix(shape.dimensionless());
        for (int i = 0; i < nrRows(); i++) {
            for (int j = 0; j < nrColumns(); j++) {
                matrix.numbers.setEntry(i, j, Math.acos(numbers.getEntry(i, j)));
            }
        }
        return matrix;
    }
    public PacioliValue atan() {
        Matrix matrix = new Matrix(shape.dimensionless());
        for (int i = 0; i < nrRows(); i++) {
            for (int j = 0; j < nrColumns(); j++) {
                matrix.numbers.setEntry(i, j, Math.atan(numbers.getEntry(i, j)));
            }
        }
        return matrix;
    }
    
    public Matrix atan2(Matrix other) {
        Matrix matrix = new Matrix(shape);
        for (int i = 0; i < nrRows(); i++) {
            for (int j = 0; j < nrColumns(); j++) {
                matrix.numbers.setEntry(i, j, Math.atan2(numbers.getEntry(i, j), other.numbers.getEntry(i, j)));
            }
        }
        return matrix;
    }
    ////////////////////////////////////////////////////////////////////////////
    // Factorizations

    public Matrix solve(Matrix other) throws MVMException {
        Matrix matrix = new Matrix(shape.reciprocal().transpose().join(other.shape));
        try {
            SingularValueDecomposition decomposition = new SingularValueDecomposition(numbers);
            matrix.numbers = decomposition.getSolver().solve(other.numbers);
        } catch (SingularMatrixException e) {
            throw new MVMException("cannot solve \n\n%s * x = %s\n\n: %s",
                    this.toText(),
                    other.toText(),
                    e.getLocalizedMessage());
        }
        return matrix;
    }

    public PacioliTuple svd() throws MVMException {
        try {
            Matrix matrixU = new Matrix(shape.leftIdentity());
            Matrix matrixS = new Matrix(shape);
            Matrix matrixV = new Matrix(shape.rightIdentity().transpose());

            SingularValueDecomposition decomposition = new SingularValueDecomposition(numbers);

            matrixU.numbers = decomposition.getU();
            matrixS.numbers = decomposition.getS();
            matrixV.numbers = decomposition.getV();

            List<PacioliValue> items = new ArrayList<PacioliValue>();
            items.add(matrixU);
            items.add(matrixS);
            items.add(matrixV);

            return new PacioliTuple(items);

        } catch (SingularMatrixException e) {
            throw new MVMException("No singular value decomposition for \n\n%s\n\n %s",
                    toText(),
                    e.getLocalizedMessage());
        }
    }

    public PacioliTuple plu() throws MVMException {

        Matrix matrixP = new Matrix(shape.leftIdentity());
        Matrix matrixL = new Matrix(shape.leftIdentity());
        Matrix matrixU = new Matrix(shape);

        LUDecomposition decomposition = new LUDecomposition(numbers);


        matrixP.numbers = decomposition.getP();
        matrixL.numbers = decomposition.getL();
        matrixU.numbers = decomposition.getU();

        if (matrixP.numbers == null || matrixL.numbers == null || matrixU.numbers == null) {
            throw new MVMException("No PLU decomposition for \n\n%s\n\n %s",
                    toText(),
                    "the matrix is singular");
        }

        List<PacioliValue> items = new ArrayList<PacioliValue>();
        items.add(matrixP);
        items.add(matrixL);
        items.add(matrixU);

        return new PacioliTuple(items);
    }
}