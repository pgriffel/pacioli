/*
 * Copyright (c) 2013 - 2025 Paul Griffioen
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
import java.text.DecimalFormat;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.PriorityQueue;
import mvm.MVMException;
import mvm.values.PacioliList;
import mvm.values.PacioliTuple;
import mvm.values.PacioliValue;

import org.apache.commons.math3.linear.Array2DRowRealMatrix;
import org.apache.commons.math3.linear.CholeskyDecomposition;
import org.apache.commons.math3.linear.LUDecomposition;
import org.apache.commons.math3.linear.NonPositiveDefiniteMatrixException;
import org.apache.commons.math3.linear.NonSymmetricMatrixException;
import org.apache.commons.math3.linear.QRDecomposition;
import org.apache.commons.math3.linear.RealMatrix;
import org.apache.commons.math3.linear.SingularValueDecomposition;
import org.apache.commons.math3.linear.EigenDecomposition;

// import pacioli.Pacioli;
import uom.DimensionedNumber;
import uom.Fraction;
import uom.Unit;
import uom.UnitMap;

public class Matrix implements PacioliValue {

    public final MatrixShape shape;
    private RealMatrix numbers;

    static public int nrDecimals = 2;

    static public int precision = 14;

    static public boolean showZeros = true;

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

    public Matrix(Unit<MatrixBase> unit) {
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

        // Params
        String valueLabel = "Value";

        // The treshold below which numbers are not shown
        double treshold = Math.pow(10, -Matrix.precision);

        DecimalFormat format = new DecimalFormat();
        format.setMinimumIntegerDigits(1);
        format.setMaximumFractionDigits(nrDecimals);
        format.setMinimumFractionDigits(nrDecimals);
        format.setGroupingUsed(false);

        // If its a scalar just print the number and not a table
        if (rowDimension().width() == 0 && columnDimension().width() == 0) {
            String decString = format.format(numbers.getEntry(0, 0));

            if (unitAt(0, 0).equals(MatrixBase.ONE)) {
                out.format("%s", decString);
            } else {
                out.format("%s %s", decString, unitAt(0, 0).pretty());
            }

            return;
        }

        out.println();

        // The header text for the index column
        String sep = rowDimension().width() == 0 || columnDimension().width() == 0 ? "" : ", ";
        String indexText = rowDimension().indexText() + sep + columnDimension().indexText();

        // The strings per row
        List<String> idxList = new ArrayList<String>();
        List<String> numList = new ArrayList<String>();
        List<String> unitList = new ArrayList<String>();

        // The maximum string lengths over the rows. Start with the header widths
        // to make sure the header texts fit.
        int maxIdxWidth = indexText.length();
        int maxNumWidth = valueLabel.length();
        int maxUnitWidth = 0;

        for (int i = 0; i < rowDimension().size(); i++) {
            for (int j = 0; j < columnDimension().size(); j++) {

                double num = numbers.getEntry(i, j);

                if (showZeros || Math.abs(num) >= treshold) {

                    // The index string
                    List<String> items = new ArrayList<>();
                    items.addAll(rowDimension().ElementAt(i));
                    items.addAll(columnDimension().ElementAt(j));
                    String idxString = String.join(", ", items);

                    // The number string
                    String numString = num == 0 ? "-" : format.format(num);

                    // The unit string
                    Unit<MatrixBase> unit = unitAt(i, j);
                    String unitString = unit.equals(MatrixBase.ONE) ? "" : unit.pretty();

                    // Add the string to the lists we are building
                    idxList.add(idxString);
                    numList.add(numString);
                    unitList.add(unitString);

                    // Update the maximum widths
                    maxNumWidth = Math.max(maxNumWidth, numString.length());
                    maxIdxWidth = Math.max(maxIdxWidth, idxString.length());
                    maxUnitWidth = Math.max(maxUnitWidth, unitString.length());
                }
            }
        }

        // Formatter with five entries properly aligned
        // 1. Index (left aligned, is the - in the format string)
        // 2. Separator
        // 3. Number (right aligned)
        // 4. Seprator
        // 5. Unit
        String formatter = "%-" + maxIdxWidth + "s%s%" + maxNumWidth + "s%s%s";

        // The header row
        out.format(formatter, indexText, " | ", valueLabel, "", "");

        out.println();

        // The separator row
        out.format(formatter, "-".repeat(maxIdxWidth), "-+-", "-".repeat(maxNumWidth), "-", "-".repeat(maxUnitWidth));

        // The table body rows
        for (int i = 0; i < idxList.size(); i++) {
            out.println();
            out.format(formatter, idxList.get(i), " | ", numList.get(i), " ", unitList.get(i));
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
            keys.add(new Key(i, shape.rowDimension()));
        }
        return keys;
    }

    public List<Key> columnKeys() {
        List<Key> keys = new ArrayList<Key>();
        for (int i = 0; i < columnDimension().size(); i++) {
            keys.add(new Key(i, shape.columnDimension()));
        }
        return keys;
    }

    public Unit<MatrixBase> unitAt(int i, int j) {
        return shape.factor().multiply(getUnit(rowDimension(), shape.rowUnit, i)
                .multiply(getUnit(columnDimension(), shape.columnUnit, j).reciprocal()));
    }

    private static Unit<MatrixBase> getUnit(MatrixDimension dimension, final Unit<MatrixBase> matrixUnit,
            int position) {
        final int[] positions = dimension.individualPositions(position);
        return matrixUnit.map(new UnitMap<MatrixBase>() {
            public Unit<MatrixBase> map(MatrixBase base) {
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
        numbers.setEntry(row.position(), column.position(), value.numbers.getEntry(0, 0));
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
        matrix.numbers.setEntry(0, 0, numbers.getEntry(row.position(), column.position()));
        return matrix;
    }

    public PacioliValue get_num(Key row, Key column) {
        Matrix matrix = new Matrix(1);
        matrix.numbers.setEntry(0, 0, numbers.getEntry(row.position(), column.position()));
        return matrix;
    }

    public Unit<MatrixBase> get_unit(Key row, Key column) {
        return unitAt(row.position(), column.position());
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
        int i = row.position();
        int j = column.position();
        Matrix matrix = new Matrix(shape);
        matrix.numbers = numbers.copy();
        matrix.numbers.setEntry(i, j, value.numbers.getEntry(0, 0));
        return matrix;
    }

    public PacioliValue isolate(Key row, Key column) {
        int i = row.position();
        int j = column.position();
        Matrix matrix = new Matrix(shape);
        matrix.numbers.setEntry(i, j, numbers.getEntry(i, j));
        return matrix;
    }

    public PacioliValue column(Key key) {
        Matrix matrix = new Matrix(shape.extractColumn());
        matrix.numbers = numbers.getColumnMatrix(key.position());
        return matrix;
    }

    public PacioliValue row(Key key) {
        Matrix matrix = new Matrix(shape.extractRow());
        matrix.numbers = numbers.getRowMatrix(key.position());
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

    public Matrix posSupport() {
        Matrix matrix = new Matrix(shape.dimensionless());
        for (int i = 0; i < nrRows(); i++) {
            for (int j = 0; j < nrColumns(); j++) {
                if (0 < numbers.getEntry(i, j)) {
                    matrix.numbers.setEntry(i, j, 1);
                }
            }
        }
        return matrix;
    }

    public Matrix negSupport() {
        Matrix matrix = new Matrix(shape.dimensionless());
        for (int i = 0; i < nrRows(); i++) {
            for (int j = 0; j < nrColumns(); j++) {
                if (numbers.getEntry(i, j) < 0) {
                    matrix.numbers.setEntry(i, j, 1);
                }
            }
        }
        return matrix;
    }

    private class Triple implements Comparable<Object> {
        final int i;
        final int j;
        final Double value;

        Triple(int i, int j, Double value) {
            this.i = i;
            this.j = j;
            this.value = value;
        }

        public int compareTo(Object other) {
            Triple otherTriple = (Triple) other;
            return Double.compare(this.value, otherTriple.value);
        }

        public boolean equals(Object other) {
            return compareTo(other) == 0;
        }
    }

    public Matrix top(int n) {

        Matrix matrix = new Matrix(shape);

        if (0 < n) {
            PriorityQueue<Triple> queue = new PriorityQueue<Triple>(n);
            int count = 0;

            for (int i = 0; i < nrRows(); i++) {
                for (int j = 0; j < nrColumns(); j++) {
                    Double value = numbers.getEntry(i, j);
                    if (value != 0.0) {
                        if (count < n) {
                            queue.add(new Triple(i, j, value));
                            count++;
                        } else {
                            if (queue.peek().value < value) {
                                queue.poll();
                                queue.add(new Triple(i, j, value));
                            }
                        }
                    }
                }
            }
            while (!queue.isEmpty()) {
                Triple triple = queue.poll();
                matrix.numbers.setEntry(triple.i, triple.j, triple.value);
            }
        }

        return matrix;
    }

    public Matrix bottom(int n) {

        Matrix matrix = new Matrix(shape);

        if (0 < n) {

            PriorityQueue<Triple> queue = new PriorityQueue<Triple>(n);
            int count = 0;

            for (int i = 0; i < nrRows(); i++) {
                for (int j = 0; j < nrColumns(); j++) {
                    Double value = -numbers.getEntry(i, j);
                    if (value != 0.0) {
                        if (count < n) {
                            queue.add(new Triple(i, j, value));
                            count++;
                        } else {
                            if (queue.peek().value < value) {
                                queue.poll();
                                queue.add(new Triple(i, j, value));
                            }
                        }
                    }
                }
            }
            while (!queue.isEmpty()) {
                Triple triple = queue.poll();
                matrix.numbers.setEntry(triple.i, triple.j, -triple.value);
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
        Unit<MatrixBase> srcUnit;
        Unit<MatrixBase> dstUnit;
        DimensionedNumber<MatrixBase> number;

        for (int i = 0; i < nrRows; i++) {

            List<String> src = rowDimension().ElementAt(i);

            for (int j = 0; j < nrColumns; j++) {
                dst = columnDimension().ElementAt(j);

                if (src.containsAll(dst) || dst.containsAll(src)) {

                    srcUnit = getUnit(rowDimension(), shape.rowUnit, i);
                    dstUnit = getUnit(columnDimension(), shape.columnUnit, j);
                    number = (dstUnit.multiply(srcUnit.reciprocal())).flat();

                    if (!number.unit().bases().isEmpty()) {
                        throw new MVMException("Cannot project '%s' to '%s'", srcUnit.pretty(), dstUnit.pretty());
                    }

                    if (!number.factor().equals(BigDecimal.ONE)) {
                        throw new MVMException("Cannot project '%s' to '%s'", srcUnit.pretty(), dstUnit.pretty());
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
            DimensionedNumber<MatrixBase> number = unitAt(i, i).reciprocal().flat();
            if (!number.unit().bases().isEmpty()) {
                throw new MVMException("Cannot convert '%s'  (%s)", number.toText(), number.unit().bases());
            } else {
                Double num = number.factor().doubleValue();
                if (num == 0) {
                    throw new MVMException("Zero conversion factor for '%s' '%s'  (%s)",
                            unitAt(i, i).flat().reciprocal().toText(), number.toText(), number.unit().bases());
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
                    DimensionedNumber<MatrixBase> number = unitAt(i, j).reciprocal().flat();
                    if (!number.unit().bases().isEmpty()) {
                        throw new MVMException("Cannot convert '%s'  (%s)", number.toText(), number.unit().bases());
                    } else {
                        // Double num = unit.factor().doubleValue();
                        // numbers.setEntry(i, i, num);
                        num = number.factor().toPlainString();
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
                    DimensionedNumber<MatrixBase> number = unitAt(i, j).reciprocal().flat();
                    if (!number.unit().bases().isEmpty()) {
                        throw new MVMException("Cannot convert '%s'  (%s)", number.toText(), number.unit().bases());
                    } else {
                        // Double num = unit.factor().doubleValue();
                        // numbers.setEntry(i, i, num);
                        num = number.factor().toPlainString();
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
            throw new MVMException(
                    "types '" + shape.toText() + "' and '" + other.shape.toText() + "' not equal in sum");
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
            throw new MVMException("Shapes %s and %s not compatible for multiplication", shape.toText(),
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
            throw new MVMException(
                    "types '" + shape.toText() + "' and '" + other.shape.toText() + "' not compatible for joining");
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
                        matrix.numbers.setEntry(i * otherNrRows + k, j * otherNrColumns + l,
                                numbers.getEntry(i, j) * other.numbers.getEntry(k, l));
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
            throw new MVMException(
                    "types '" + shape.toText() + "' and '" + other.shape.toText() + "' not compatible for scaling");
        }
    }

    public Matrix total() {
        Matrix matrix = new Matrix(shape.factor());
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

    public PacioliValue cbrt() throws MVMException {
        Matrix matrix = new Matrix(shape.sqrt());
        for (int i = 0; i < nrRows(); i++) {
            for (int j = 0; j < nrColumns(); j++) {
                double num2 = numbers.getEntry(i, j);
                if (num2 < 0) {
                    throw new MVMException("Cannot take cube root of negative number %s", num2);
                }
                if (Double.isNaN(num2)) {
                    throw new MVMException("Cannot take cube root of number %s", num2);
                }
                double num3 = Math.cbrt(num2);
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

    public PacioliValue power(Matrix y) {
        Matrix matrix = new Matrix(shape);
        matrix.numbers = numbers.power((int) y.numbers.getEntry(0, 0));
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

    public Matrix min(Matrix other) {
        Matrix matrix = new Matrix(shape);
        for (int i = 0; i < nrRows(); i++) {
            for (int j = 0; j < nrColumns(); j++) {
                matrix.numbers.setEntry(i, j, Math.min(numbers.getEntry(i, j), other.numbers.getEntry(i, j)));
            }
        }
        return matrix;
    }

    public Matrix max(Matrix other) {
        Matrix matrix = new Matrix(shape);
        for (int i = 0; i < nrRows(); i++) {
            for (int j = 0; j < nrColumns(); j++) {
                matrix.numbers.setEntry(i, j, Math.max(numbers.getEntry(i, j), other.numbers.getEntry(i, j)));
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

    public Matrix rem(Matrix other) {
        Matrix matrix = new Matrix(shape);
        for (int i = 0; i < nrRows(); i++) {
            for (int j = 0; j < nrColumns(); j++) {
                var div = other.numbers.getEntry(i, j);
                var val = numbers.getEntry(i, j);
                matrix.numbers.setEntry(i, j, div == 0 ? val : val % div);
            }
        }
        return matrix;
    }

    public Matrix mod(Matrix other) {
        Matrix matrix = new Matrix(shape);
        for (int i = 0; i < nrRows(); i++) {
            for (int j = 0; j < nrColumns(); j++) {
                var div = other.numbers.getEntry(i, j);
                var val = numbers.getEntry(i, j);
                if (div == 0) {
                    matrix.numbers.setEntry(i, j, val);
                } else {
                    var rem = val % div;
                    matrix.numbers.setEntry(i, j, rem < 0 ? rem + Math.abs(div) : rem);
                }
            }
        }
        return matrix;
    }

    public Matrix absMin(Matrix other) {
        Matrix matrix = new Matrix(shape);
        for (int i = 0; i < nrRows(); i++) {
            for (int j = 0; j < nrColumns(); j++) {
                var div = other.numbers.getEntry(i, j);
                var val = numbers.getEntry(i, j);
                if (div == 0) {
                    matrix.numbers.setEntry(i, j, val);
                } else {
                    matrix.numbers.setEntry(i, j, val - div * Math.round(val / div));
                }
            }
        }
        return matrix;
    }

    public PacioliValue floor() {
        Matrix matrix = new Matrix(shape.dimensionless());
        for (int i = 0; i < nrRows(); i++) {
            for (int j = 0; j < nrColumns(); j++) {
                matrix.numbers.setEntry(i, j, Math.floor(numbers.getEntry(i, j)));
            }
        }
        return matrix;
    }

    public PacioliValue ceiling() {
        Matrix matrix = new Matrix(shape.dimensionless());
        for (int i = 0; i < nrRows(); i++) {
            for (int j = 0; j < nrColumns(); j++) {
                matrix.numbers.setEntry(i, j, Math.ceil(numbers.getEntry(i, j)));
            }
        }
        return matrix;
    }

    public PacioliValue truncate() {
        Matrix matrix = new Matrix(shape.dimensionless());
        for (int i = 0; i < nrRows(); i++) {
            for (int j = 0; j < nrColumns(); j++) {
                double val = numbers.getEntry(i, j);
                matrix.numbers.setEntry(i, j, val > 0 ? Math.floor(val) : Math.ceil(val));
            }
        }
        return matrix;
    }

    public PacioliValue round() {
        Matrix matrix = new Matrix(shape.dimensionless());
        for (int i = 0; i < nrRows(); i++) {
            for (int j = 0; j < nrColumns(); j++) {
                matrix.numbers.setEntry(i, j, Math.round(numbers.getEntry(i, j)));
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
        SingularValueDecomposition decomposition = new SingularValueDecomposition(numbers);
        matrix.numbers = decomposition.getSolver().solve(other.numbers);
        return matrix;
    }

    public PacioliList svdNonZero() throws MVMException {

        NonZeroSubMatrix sub = new NonZeroSubMatrix(numbers);

        int m = sub.numbers.getRowDimension();
        int n = sub.numbers.getColumnDimension();
        int p = Math.min(m, n);

        SingularValueDecomposition decomposition = new SingularValueDecomposition(sub.numbers);

        RealMatrix numbersU = decomposition.getU();
        RealMatrix numbersS = decomposition.getS();
        RealMatrix numbersV = decomposition.getV();

        List<PacioliValue> svs = new ArrayList<PacioliValue>();
        for (int i = 0; i < p; i++) {

            List<PacioliValue> items = new ArrayList<PacioliValue>();

            Matrix matrixS = new Matrix(shape.factor());
            Matrix matrixU = new Matrix(shape.rowUnits());
            Matrix matrixV = new Matrix(shape.columnUnits().reciprocal());

            matrixS.numbers.setEntry(0, 0, numbersS.getEntry(i, i));
            for (int j = 0; j < m; j++) {
                matrixU.numbers.setEntry(sub.originalRow(j), 0, numbersU.getEntry(j, i));
            }
            for (int j = 0; j < n; j++) {
                matrixV.numbers.setEntry(sub.originalColumn(j), 0, numbersV.getEntry(j, i));
            }

            items.add(matrixS);
            items.add(matrixU);
            items.add(matrixV);

            svs.add(new PacioliTuple(items));
        }

        return new PacioliList(svs);
    }

    public PacioliList svd() throws MVMException {

        int m = shape.rowDimension().size();
        int n = shape.columnDimension().size();
        int p = Math.min(m, n);

        SingularValueDecomposition decomposition = new SingularValueDecomposition(numbers);

        RealMatrix numbersU = decomposition.getU();
        RealMatrix numbersS = decomposition.getS();
        RealMatrix numbersV = decomposition.getV();

        List<PacioliValue> svs = new ArrayList<PacioliValue>();
        for (int i = 0; i < p; i++) {

            List<PacioliValue> items = new ArrayList<PacioliValue>();

            Matrix matrixS = new Matrix(shape.factor());
            Matrix matrixU = new Matrix(shape.rowUnits());
            Matrix matrixV = new Matrix(shape.columnUnits().reciprocal());

            matrixS.numbers.setEntry(0, 0, numbersS.getEntry(i, i));
            for (int j = 0; j < m; j++) {
                matrixU.numbers.setEntry(j, 0, numbersU.getEntry(j, i));
            }
            for (int j = 0; j < n; j++) {
                matrixV.numbers.setEntry(j, 0, numbersV.getEntry(j, i));
            }

            items.add(matrixS);
            items.add(matrixU);
            items.add(matrixV);

            svs.add(new PacioliTuple(items));
        }

        return new PacioliList(svs);
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
            throw new MVMException("No PLU decomposition for \n\n%s\n\n %s", toText(), "the matrix is singular");
        }

        List<PacioliValue> items = new ArrayList<PacioliValue>();
        items.add(matrixP);
        items.add(matrixL);
        items.add(matrixU);

        return new PacioliTuple(items);
    }

    public PacioliTuple eigenvalueDecomposition() throws MVMException {

        Matrix matrixD = new Matrix(shape);
        Matrix matrixV = new Matrix(shape);

        EigenDecomposition decomposition = new EigenDecomposition(numbers);

        matrixD.numbers = decomposition.getD();
        matrixV.numbers = decomposition.getV();

        List<PacioliValue> items = new ArrayList<PacioliValue>();
        items.add(matrixD);
        items.add(matrixV);

        return new PacioliTuple(items);
    }

    public PacioliList eigenvalueList() throws MVMException {

        int m = shape.rowDimension().size();
        int n = shape.columnDimension().size();

        // m should equal n

        EigenDecomposition decomposition = new EigenDecomposition(numbers);

        RealMatrix matrixV = decomposition.getV();

        List<PacioliValue> svs = new ArrayList<PacioliValue>();
        for (int i = 0; i < n; i++) {

            List<PacioliValue> items = new ArrayList<PacioliValue>();

            Matrix readlEv = new Matrix(shape.factor());
            Matrix imgEv = new Matrix(shape.factor());
            Matrix vec = new Matrix(shape.rowUnits());

            // ev.numbers.setEntry(0, 0, matrixD.getEntry(i, i));
            readlEv.numbers.setEntry(0, 0, decomposition.getRealEigenvalue(i));
            imgEv.numbers.setEntry(0, 0, decomposition.getImagEigenvalue(i));

            for (int j = 0; j < n; j++) {
                vec.numbers.setEntry(j, 0, matrixV.getEntry(j, i));
            }

            items.add(readlEv);
            items.add(imgEv);
            items.add(vec);

            svs.add(new PacioliTuple(items));
        }

        return new PacioliList(svs);
    }

    public PacioliTuple qrZeroSub() throws MVMException {

        // Collect the non-zero numbers
        NonZeroSubMatrix sub = new NonZeroSubMatrix(numbers);

        // Do the QR decomposition on the non-zero numbers.
        QRDecomposition decomposition = new QRDecomposition(sub.numbers);
        RealMatrix numbersQ = decomposition.getQ();
        RealMatrix numbersR = decomposition.getR();

        // Pacioli.logln("mat=%s", sub.numbers.toString());

        // Create the full result matrices
        Matrix matrixQ = new Matrix(shape.leftIdentity());
        Matrix matrixR = new Matrix(shape);

        // Fill the result matrices from the decomposition result
        for (int i = 0; i < sub.numbers.getRowDimension(); i++) {
            for (int j = 0; j < sub.numbers.getRowDimension(); j++) {
                matrixQ.numbers.setEntry(sub.originalRow(i), sub.originalRow(j), numbersQ.getEntry(i, j));
            }
        }
        for (int i = 0; i < sub.numbers.getRowDimension(); i++) {
            for (int j = 0; j < sub.numbers.getColumnDimension(); j++) {
                matrixR.numbers.setEntry(sub.originalRow(i), sub.originalColumn(j), numbersR.getEntry(i, j));
            }
        }

        // Return a tuple with the result matrices
        List<PacioliValue> items = new ArrayList<PacioliValue>();
        items.add(matrixQ);
        items.add(matrixR);
        return new PacioliTuple(items);
    }

    public PacioliTuple qr() throws MVMException {

        Matrix matrixQ = new Matrix(shape.leftIdentity());
        Matrix matrixR = new Matrix(shape);

        QRDecomposition decomposition = new QRDecomposition(numbers);

        matrixQ.numbers = decomposition.getQ();
        matrixR.numbers = decomposition.getR();

        List<PacioliValue> items = new ArrayList<PacioliValue>();
        items.add(matrixQ);
        items.add(matrixR);

        return new PacioliTuple(items);
    }

    public Matrix cholesky() throws MVMException {

        Fraction half = new Fraction(1, 2);
        MatrixShape resultShape = new MatrixShape(shape.factor().raise(half),
                rowDimension(),
                shape.rowUnit,
                columnDimension(),
                MatrixBase.ONE);
        Matrix matrix = new Matrix(resultShape);

        try {
            CholeskyDecomposition decomposition = new CholeskyDecomposition(numbers);

            matrix.numbers = decomposition.getL();

            return matrix;

        } catch (NonPositiveDefiniteMatrixException ex) {
            throw new MVMException("matrix not positive definite in Cholesky decomposition");
        } catch (NonSymmetricMatrixException ex) {
            throw new MVMException("matrix not symmetric in Cholesky decomposition");
        }

    }

    public void set(Integer i, Integer j, Double value) {
        numbers.setEntry(i, j, value);
    }

    public PacioliValue project(List<Integer> cols) {
        Matrix matrix = new Matrix(shape.project(cols));
        List<Key> keys = rowKeys();
        for (int i = 0; i < keys.size(); i++) {
            double value = numbers.getEntry(i, 0);
            if (value != 0) {
                int pos = matrix.rowDimension().ElementPos(keys.get(i).projectNames(cols));
                matrix.numbers.setEntry(pos, 0, matrix.numbers.getEntry(pos, 0) + value);
            }
        }
        return matrix;
    }

    private class NonZeroSubMatrix {

        public RealMatrix numbers;

        private List<Integer> rowMap = new ArrayList<Integer>();
        private List<Integer> columnMap = new ArrayList<Integer>();

        public NonZeroSubMatrix(RealMatrix matrix) {

            // Temporary data structure for the non-zero entries
            List<Integer> rowCoordinates = new ArrayList<Integer>();
            List<Integer> columnCoordinates = new ArrayList<Integer>();
            List<Double> values = new ArrayList<Double>();

            // The dimensions of the non-zero submatrix
            int m = 0;
            int n = 0;

            Map<Integer, Integer> revRowMap = new HashMap<Integer, Integer>();
            Map<Integer, Integer> revColumnMap = new HashMap<Integer, Integer>();

            for (int i = 0; i < nrRows(); i++) {
                for (int j = 0; j < nrColumns(); j++) {
                    Double value = matrix.getEntry(i, j);
                    if (value != 0) {

                        if (!revRowMap.containsKey(i)) {
                            revRowMap.put(i, m++);
                            rowMap.add(i);
                        }
                        if (!revColumnMap.containsKey(j)) {
                            revColumnMap.put(j, n++);
                            columnMap.add(j);
                        }

                        // Remember the value for submatrix coordinates
                        rowCoordinates.add(revRowMap.get(i));
                        columnCoordinates.add(revColumnMap.get(j));
                        values.add(value);
                    }
                }
            }

            // Create a submatrix for just the non-zero items
            numbers = matrix.createMatrix(m, n);
            // RealMatrix subMatrix = numbers.createMatrix(rowMap.size(), columnMap.size());
            for (int k = 0; k < values.size(); k++) {
                numbers.setEntry(rowCoordinates.get(k), columnCoordinates.get(k), values.get(k));
            }
        }

        public int originalRow(int row) {
            return rowMap.get(row);
        }

        public int originalColumn(int column) {
            return columnMap.get(column);
        }

    }
}