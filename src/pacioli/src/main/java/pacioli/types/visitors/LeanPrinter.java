/*
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

package pacioli.types.visitors;

import java.util.stream.Collectors;

import pacioli.compiler.Printer;
import pacioli.types.TypeContext;
import pacioli.types.TypeVisitor;
import pacioli.types.type.FunctionType;
import pacioli.types.type.IndexSetVar;
import pacioli.types.type.OperatorConst;
import pacioli.types.type.OperatorVar;
import pacioli.types.type.ParametricType;
import pacioli.types.type.Quant;
import pacioli.types.type.Schema;
import pacioli.types.type.TypeIdentifier;
import pacioli.types.type.TypeObject;
import pacioli.types.type.TypePredicate;
import pacioli.types.type.TypeVar;
import pacioli.types.type.matrix.IndexList;
import pacioli.types.type.matrix.IndexType;
import pacioli.types.type.matrix.MatrixBase;
import pacioli.types.type.matrix.MatrixType;
import pacioli.types.type.matrix.ScalarUnitVar;
import pacioli.types.type.matrix.VectorBaseUnit;
import pacioli.types.type.matrix.VectorUnitVar;
import uom.Fraction;
import uom.Unit;

/**
 * WIP. Alternative for pretty printing via the devaluator.
 */
public class LeanPrinter implements TypeVisitor {

    Printer out;

    public LeanPrinter(Printer printer) {
        this.out = printer;
    }

    @Override
    public void visit(FunctionType type) {
        if (type.domain() instanceof ParametricType p && p.op().name().equals("Tuple")) {
            out.write("(");
            // out.writeCommaSeparated(p.args(), x -> x.accept(this));
            out.write(p.args().stream().map(x -> x.printAsLean()).collect(Collectors.joining(" × ")));
            out.write(")");
        } else {
            type.domain().accept(this);
        }
        out.write(" -> ");
        type.range().accept(this);
    }

    @Override
    public void visit(Schema type) {
        TypeContext tc = new TypeContext(type.variables());
        // out.print(tc.asLean(out));
        tc.asLean(out.out);
        out.print(": ");
        type.type().accept(this);
        if (type.conditions().size() > 0) {
            out.print(" where ");
            String sep = "";
            for (TypePredicate cond : type.conditions()) {
                out.print(sep);
                sep = " and ";
                cond.accept(this);
            }
        }
    }

    @Override
    public void visit(IndexList type) {

        // This must be an parameric "Index" type, otherwise it would be handled
        // by the matrix type.

        // out.print("Index(");
        if (type.indexSets().size() == 0) {
            out.print("One");
        }

        String sep = "";
        for (TypeIdentifier id : type.indexSets()) {
            out.print(sep);
            out.print(id.name());
            sep = " % ";
        }
        // out.print(")");
    }

    @Override
    public void visit(IndexType type) {

        // // This must be an parameric "Index" type, otherwise it would be handled
        // // by the matrix type.

        // Update. This seems to no longer be used outside a matrix type

        // out.print("Index(");
        type.indexSet().accept(this);
        // out.print(")");
    }

    static String prettyDimensionUnitPair(IndexType dimension) {
        if (dimension.isVar()) {
            return dimension.getVar().pretty();
        } else {
            final IndexType dimType = (IndexType) dimension;

            String node = "1";

            for (int i = 0; i < dimType.width(); i++) {

                String idx = dimType.nthIndexSet(i).name();

                if (i == 0) {
                    node = idx;
                } else {
                    node = node + " % " + idx;
                }
            }

            return node;
        }

    }

    @Override
    public void visit(MatrixType type) {

        String left = prettyDimensionUnitPair(type.rowDimension());
        String right = prettyDimensionUnitPair(type.columnDimension());

        out.format("(Mat %s %s)", left, right);
    }

    @Override
    public void visit(ParametricType type) {
        type.op().accept(this);
        if (!type.args().isEmpty()) {
            out.write("(");
        }
        out.writeCommaSeparated(type.args(), arg -> arg.accept(this));
        if (!type.args().isEmpty()) {
            out.write(")");
        }
    }

    @Override
    public void visit(IndexSetVar type) {
        out.write(type.name());
    }

    @Override
    public void visit(ScalarUnitVar type) {
        out.write(type.name());
    }

    @Override
    public void visit(TypeVar type) {
        out.write(type.name());
    }

    @Override
    public void visit(VectorUnitVar type) {
        out.write(type.name());
    }

    @Override
    public void visit(OperatorConst type) {
        out.print(type.name());
    }

    @Override
    public void visit(OperatorVar type) {
        out.write(type.name());
    }

    // UNITTODO Not used. Replace pretty printing in UoM with this?
    static public class UnitPrinter implements Unit.Fold<MatrixBase, String> {

        @Override
        public String map(MatrixBase base) {
            return base.pretty();
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
            return "unit(\"\")";
        }
    }

    @Override
    public void visit(TypePredicate type) {
        out.print(type.id());
        out.print("(");
        String sep = "";
        for (TypeObject id : type.arguments()) {
            out.print(sep);
            id.accept(this);
            sep = ", ";
        }
        out.print(")");
    }

    @Override
    public void visit(Quant quant) {
        // TODO Auto-generated method stub
        throw new UnsupportedOperationException("Unimplemented method 'visit'");
    }

}
