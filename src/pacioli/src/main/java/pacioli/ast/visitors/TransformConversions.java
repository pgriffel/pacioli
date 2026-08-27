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

package pacioli.ast.visitors;

import java.util.ArrayList;
import java.util.List;

import pacioli.ast.IdentityTransformation;
import pacioli.ast.expression.ConversionNode;
import pacioli.ast.expression.IdentifierNode;
import pacioli.ast.expression.MatrixLiteralNode;
import pacioli.ast.expression.MatrixLiteralNode.ValueDecl;
import pacioli.compiler.Location;
import pacioli.compiler.PacioliException;
import pacioli.types.type.matrix.MatrixType;
import pacioli.types.type.matrix.ScalarBase;
import pacioli.types.type.matrix.VectorBase;
import pacioli.types.type.matrix.VectorBaseUnit;
import uom.DimensionedNumber;
import uom.Fraction;
import uom.Unit;

/**
 * Transforms all conversion nodes into matrix literal nodes with the proper
 * conversion factors.
 * 
 * This is more generic than what is needed because currently conversions are
 * toplevels and cannot occur everywhere in an expression as is handled here.
 */
public class TransformConversions extends IdentityTransformation {

    public TransformConversions() {
    }

    public void visit(ConversionNode node) {

        Location location = node.location();

        MatrixType type = (MatrixType) node.typeNode.evalType();

        DimensionedNumber<ScalarBase> typeFactor = type.factor().reduce(ScalarBase::flat);

        if (!type.rowDimension().equals(type.columnDimension())) {
            throw new RuntimeException("Invalid conversion",
                    new PacioliException(node.location(), "Row and column dimension not the same"));
        }

        Boolean closedType = true;

        if (closedType) {

            // Compute the conversion factors
            List<ValueDecl> conversionFactors = new ArrayList<ValueDecl>();

            int nrItems = node.rowDim.size();
            int width = node.rowDim.width();

            for (int i = 0; i < nrItems; i++) {
                final List<String> items = node.rowDim.ElementAt(i);
                assert (items.size() == width);
                Unit.Fold<VectorBase, DimensionedNumber<ScalarBase>> folder = new Unit.Fold<VectorBase, DimensionedNumber<ScalarBase>>() {

                    @Override
                    public DimensionedNumber<ScalarBase> map(VectorBase base) {
                        if (base instanceof VectorBaseUnit vbase) {
                            String itemName = items.get(vbase.position());
                            DimensionedNumber<ScalarBase> dimNum = vbase.vectorUnitInfo().lookupUnit(itemName);
                            return dimNum;
                        } else {
                            throw new RuntimeException("Expected a VectorBaseUnit");
                        }
                    }

                    @Override
                    public DimensionedNumber<ScalarBase> mult(
                            DimensionedNumber<ScalarBase> x,
                            DimensionedNumber<ScalarBase> y) {
                        return x.multiply(y);
                    }

                    @Override
                    public DimensionedNumber<ScalarBase> expt(DimensionedNumber<ScalarBase> x, Fraction n) {
                        return x.raise(n);
                    }

                    @Override
                    public DimensionedNumber<ScalarBase> one() {
                        return new DimensionedNumber<ScalarBase>();
                    }

                };

                DimensionedNumber<ScalarBase> rowUnit = type.rowUnit().fold(folder);
                DimensionedNumber<ScalarBase> columnsUnit = type.columnUnit().fold(folder);

                DimensionedNumber<ScalarBase> div = typeFactor.multiply(rowUnit.multiply(columnsUnit.reciprocal()));
                DimensionedNumber<ScalarBase> flat = div.reduce(ScalarBase::flat);

                if (!flat.unit().equals(ScalarBase.ONE)) {
                    Unit<ScalarBase> pos = flat.unit()
                            .flatMap(
                                    x -> flat.unit().power(x).signum() > 0 ? Unit.from(x) : ScalarBase.ONE);
                    Unit<ScalarBase> neg = flat.unit()
                            .flatMap(x -> flat.unit().power(x).signum() < 0 ? Unit.from(x) : ScalarBase.ONE);

                    throw new PacioliException(node.location(),
                            String.format(
                                    "Cannot convert automatically unit %s to unit %s for entry %s. Make sure the units are compatible, or create a custom conversion matrix.",
                                    pos.pretty(),
                                    neg.reciprocal().pretty(),
                                    items.size() == 0 ? "_" : String.join(", ", items)));

                    // throw new PacioliException(node.location(),
                    // String.format("Cannot create conversion factor for entry %s. Residual is %s
                    // %s -> %s",
                    // items.size() == 0 ? "_" : String.join(", ", items), flat.unit().pretty(),
                    // pos.pretty(), neg.reciprocal().pretty()));
                }
                // todo: how to handle empty dimension?

                List<IdentifierNode> key = new ArrayList<IdentifierNode>();
                for (String item : items) {
                    key.add(new IdentifierNode(item, node.location()));
                }
                for (String item : items) {
                    key.add(new IdentifierNode(item, node.location()));
                }

                String value = flat.reciprocal().factor().toPlainString();

                conversionFactors.add(new ValueDecl(key, value));
            }

            // Create a literal node of the same type with the conversion factors.
            MatrixLiteralNode literal = new MatrixLiteralNode(location, node.typeNode, conversionFactors);
            literal.rowDim = node.rowDim;
            literal.columnDim = node.columnDim;
            returnNode(literal);
        } else {
            returnNode(node);
        }
    }
}
